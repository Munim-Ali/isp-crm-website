import "server-only";
import { NextResponse } from "next/server";
import { contactSchema, newsletterSchema } from "@/lib/validation";
import { deliverNotification, MailUnavailableError } from "./mail";

const MAX_BYTES = 16_384;
const WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; expires: number }>();

function reply(
  status: number,
  ok: boolean,
  message: string,
  headers?: HeadersInit,
  fieldErrors?: Record<string, string>,
) {
  return NextResponse.json(
    { ok, message, ...(fieldErrors ? { fieldErrors } : {}) },
    { status, headers: { "Cache-Control": "no-store", ...headers } },
  );
}

function limited(request: Request, kind: string) {
  const trustedHeader = process.env.TRUSTED_IP_HEADER;
  if (!trustedHeader) return false;
  const ip = request.headers.get(trustedHeader)?.split(",")[0]?.trim();
  if (!ip) return false;
  const now = Date.now();
  for (const [key, value] of attempts)
    if (value.expires <= now) attempts.delete(key);
  if (attempts.size > 10_000) attempts.clear();
  const key = `${kind}:${ip}`;
  const value = attempts.get(key) ?? { count: 0, expires: now + WINDOW_MS };
  value.count += 1;
  attempts.set(key, value);
  return value.count > 5;
}

async function readBody(request: Request) {
  if (Number(request.headers.get("content-length")) > MAX_BYTES)
    throw new RangeError();
  if (!request.body) throw new SyntaxError();
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let text = "";
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > MAX_BYTES) {
        await reader.cancel();
        throw new RangeError();
      }
      text += decoder.decode(chunk.value, { stream: true });
    }
    text += decoder.decode();
  } finally {
    reader.releaseLock();
  }
  return JSON.parse(text) as unknown;
}

export async function handleForm(
  request: Request,
  kind: "contact" | "newsletter",
) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return reply(403, false, "Please submit this form from our website.");
  if (!request.headers.get("content-type")?.includes("application/json"))
    return reply(415, false, "Please submit the form as JSON.");
  if (limited(request, kind))
    return reply(
      429,
      false,
      "You’ve sent a few requests. Please try again in 15 minutes.",
      { "Retry-After": "900" },
    );

  let body: unknown;
  try {
    body = await readBody(request);
  } catch (error) {
    return reply(
      error instanceof RangeError ? 413 : 400,
      false,
      error instanceof RangeError
        ? "Your message is too large."
        : "We couldn’t read that submission. Please try again.",
    );
  }

  const schema = kind === "contact" ? contactSchema : newsletterSchema;
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const name = String(issue.path[0] ?? "");
      if (name && !fieldErrors[name]) fieldErrors[name] = issue.message;
    }
    return reply(
      400,
      false,
      parsed.error.issues[0]?.message || "Please check the form fields.",
      undefined,
      fieldErrors,
    );
  }
  if (parsed.data.website)
    return reply(200, true, "Thank you for getting in touch.");
  try {
    await deliverNotification(kind, parsed.data);
    return reply(
      200,
      true,
      kind === "contact"
        ? "Message sent. Our team will be in touch soon."
        : "Thank you! Your signup has been sent to our team.",
    );
  } catch (error) {
    if (error instanceof MailUnavailableError)
      return reply(
        503,
        false,
        "Email delivery isn’t ready yet. Please use the email links to reach our team.",
      );
    // Avoid logging credentials, submitted personal data, or SMTP response bodies.
    console.error("Website notification delivery failed.");
    return reply(
      502,
      false,
      "We couldn’t send that just now. Please try again or email our team directly.",
    );
  }
}
