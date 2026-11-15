import assert from "node:assert/strict";
import { test, mock } from "node:test";
import { registerHooks, createRequire } from "node:module";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import nodemailer from "nodemailer";

// Resolve the same @/ aliases used by Next.js while Node strips TS types.
const require = createRequire(import.meta.url);
const nextServerURL = pathToFileURL(require.resolve("next/server")).href;
const source = new URL("../src/", import.meta.url);
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "next/server") return nextResolve(nextServerURL, context);
    const candidate = specifier.startsWith("@/")
      ? new URL(specifier.slice(2), source)
      : specifier.startsWith(".") && context.parentURL?.startsWith(source.href)
        ? new URL(specifier, context.parentURL)
        : null;
    if (candidate) {
      for (const extension of ["", ".ts"]) {
        const path = fileURLToPath(candidate) + extension;
        if (existsSync(path))
          return nextResolve(pathToFileURL(path).href, context);
      }
    }
    return nextResolve(specifier, context);
  },
});

const { contactSchema, newsletterSchema } =
  await import("../src/lib/validation.ts");
const sent = [];
let delivery = "success";
mock.method(nodemailer, "createTransport", () => ({
  async sendMail(message) {
    sent.push(message);
    if (delivery === "failure") throw new Error("Simulated SMTP failure");
    return {
      accepted: ["partial", "incomplete"].includes(delivery)
        ? ["one@example.test"]
        : ["one@example.test", "two@example.test"],
      rejected: delivery === "partial" ? ["two@example.test"] : [],
    };
  },
}));
const { handleForm } = await import("../src/lib/server/form-handler.ts");

const contact = {
  name: "Test Visitor",
  email: "visitor@example.test",
  company: "Example ISP",
  phone: "03172033917",
  networkSize: "Under 500 customers",
  message: "We want a clearer way to organize our customer records.",
  consent: true,
  website: "",
};
const newsletter = {
  email: "subscriber@example.test",
  consent: true,
  website: "",
};
const request = (body, options = {}) =>
  new Request("http://example.test/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "http://example.test",
      ...options.headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

test("form and notification safety", async (t) => {
  const keys = [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_SECURE",
    "SMTP_USER",
    "SMTP_PASSWORD",
    "SMTP_FROM",
    "MAIL_TO",
    "TRUSTED_IP_HEADER",
  ];
  const previous = Object.fromEntries(
    keys.map((key) => [key, process.env[key]]),
  );
  delete process.env.TRUSTED_IP_HEADER;
  try {
    await t.test(
      "requires valid email, consent and useful enquiry text",
      () => {
        assert.equal(contactSchema.safeParse(contact).success, true);
        assert.equal(newsletterSchema.safeParse(newsletter).success, true);
        assert.equal(
          newsletterSchema.safeParse({ ...newsletter, consent: false }).success,
          false,
        );
        assert.equal(
          newsletterSchema.safeParse({ ...newsletter, email: "not-an-email" })
            .success,
          false,
        );
        assert.equal(
          contactSchema.safeParse({
            ...contact,
            name: "Name\r\nBcc: attacker@example.test",
          }).success,
          false,
        );
        assert.equal(
          contactSchema.safeParse({ ...contact, message: "Hi" }).success,
          false,
        );
        assert.equal(
          contactSchema.safeParse({ ...contact, unexpected: "field" }).success,
          false,
        );
      },
    );
    await t.test(
      "rejects cross-origin, non-JSON, malformed and oversized submissions",
      async () => {
        assert.equal(
          (
            await handleForm(
              request(contact, {
                headers: { Origin: "https://other.example" },
              }),
              "contact",
            )
          ).status,
          403,
        );
        assert.equal(
          (
            await handleForm(
              request(contact, { headers: { "Content-Type": "text/plain" } }),
              "contact",
            )
          ).status,
          415,
        );
        assert.equal((await handleForm(request("{"), "contact")).status, 400);
        assert.equal(
          (await handleForm(request("x".repeat(17_000)), "contact")).status,
          413,
        );
        assert.equal(
          (
            await handleForm(
              request({ ...newsletter, consent: false }),
              "newsletter",
            )
          ).status,
          400,
        );
      },
    );
    await t.test("ignores the honeypot without contacting SMTP", async () => {
      const before = sent.length;
      assert.equal(
        (
          await handleForm(
            request({ ...newsletter, website: "spam.example" }),
            "newsletter",
          )
        ).status,
        200,
      );
      assert.equal(sent.length, before);
    });
    await t.test("missing mail credentials return a truthful 503", async () => {
      delete process.env.SMTP_PASSWORD;
      const response = await handleForm(request(newsletter), "newsletter");
      assert.equal(response.status, 503);
      assert.equal((await response.json()).ok, false);
    });
    Object.assign(process.env, {
      SMTP_HOST: "smtp.invalid",
      SMTP_PORT: "465",
      SMTP_SECURE: "true",
      SMTP_USER: "sender@example.test",
      SMTP_PASSWORD: "test-only-not-a-real-password",
      SMTP_FROM: "sender@example.test",
      MAIL_TO: "one@example.test,two@example.test",
    });
    await t.test(
      "both recipients receive a text notification; visitor is only replyTo",
      async () => {
        const response = await handleForm(request(contact), "contact");
        assert.equal(response.status, 200);
        assert.equal((await response.json()).ok, true);
        const message = sent.at(-1);
        assert.deepEqual(message.to, ["one@example.test", "two@example.test"]);
        assert.equal(message.replyTo, contact.email);
        assert.equal(message.from.address, "sender@example.test");
        assert.ok(message.text.includes(contact.message));
        assert.equal(message.html, undefined);
      },
    );
    await t.test(
      "newsletter notification includes explicit opt-in",
      async () => {
        assert.equal(
          (await handleForm(request(newsletter), "newsletter")).status,
          200,
        );
        assert.ok(sent.at(-1).text.includes("opted in"));
      },
    );
    await t.test(
      "SMTP rejection or partial acceptance never reports success",
      async () => {
        const suppress = mock.method(console, "error", () => {});
        for (const mode of ["failure", "partial", "incomplete"]) {
          delivery = mode;
          const response = await handleForm(request(contact), "contact");
          assert.equal(response.status, 502);
          assert.equal((await response.json()).ok, false);
        }
        suppress.mock.restore();
        delivery = "success";
      },
    );
    await t.test(
      "trusted-IP throttling limits repeated submissions",
      async () => {
        process.env.TRUSTED_IP_HEADER = "x-test-client-ip";
        for (let i = 0; i < 5; i++)
          assert.equal(
            (
              await handleForm(
                request(newsletter, {
                  headers: { "x-test-client-ip": "198.51.100.9" },
                }),
                "newsletter",
              )
            ).status,
            200,
          );
        const response = await handleForm(
          request(newsletter, {
            headers: { "x-test-client-ip": "198.51.100.9" },
          }),
          "newsletter",
        );
        assert.equal(response.status, 429);
        assert.equal(response.headers.get("retry-after"), "900");
      },
    );
  } finally {
    for (const key of keys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
    mock.restoreAll();
  }
});
