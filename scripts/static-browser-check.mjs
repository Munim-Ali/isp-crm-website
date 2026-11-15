import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { readFile, mkdir } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";

// This harness opens build output through intercepted requests. No HTTP server starts.
const root = resolve(".");
const base = "https://static-preview.test";
const output = resolve(".cache/qa");
await mkdir(output, { recursive: true });
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".woff2": "font/woff2",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".rsc": "text/x-component",
};
const browser = await chromium.launch({
  channel: process.env.QA_BROWSER_CHANNEL || "chrome",
  headless: true,
  args: ["--no-proxy-server"],
});
const errors = [];
let formResult = {
  status: 503,
  body: {
    ok: false,
    message:
      "Email delivery isn’t ready yet. Please use the email links to reach our team.",
  },
};

async function prepareScreenshot(page) {
  await page.locator("img").evaluateAll(async (images) => {
    await Promise.all(
      images.map(async (image) => {
        image.loading = "eager";
        await image.decode();
      }),
    );
  });
  await page.evaluate(async () => {
    await document.fonts.ready;
    window.scrollTo({ top: 0, behavior: "instant" });
  });
}

try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== base) return route.abort();
    if (process.env.QA_DEBUG) console.log("Static asset:", url.pathname);
    if (url.pathname.startsWith("/api/"))
      return route.fulfill({
        status: formResult.status,
        contentType: "application/json",
        body: JSON.stringify(formResult.body),
      });
    let file;
    let responseHeaders = {};
    if (url.pathname.startsWith("/_next/static/"))
      file = resolve(
        ".next/static",
        decodeURIComponent(url.pathname.slice(14)),
      );
    else if (url.pathname === "/_next/image")
      file = resolve(
        "public",
        (url.searchParams.get("url") || "").replace(/^\//, ""),
      );
    else if (["/", "/about", "/contact"].includes(url.pathname)) {
      const name = url.pathname === "/" ? "index" : url.pathname.slice(1);
      const segment = route.request().headers()["next-router-segment-prefetch"];
      file = segment
        ? resolve(
            ".next/server/app",
            `${name}.segments`,
            `${segment.replace(/^\//, "")}.segment.rsc`,
          )
        : resolve(
            ".next/server/app",
            `${name}.${url.searchParams.has("_rsc") ? "rsc" : "html"}`,
          );
      responseHeaders = {
        "x-nextjs-stale-time": "300",
        "x-nextjs-prerender": "1",
        ...(segment ? { "x-nextjs-postponed": "2" } : {}),
      };
    } else
      file = resolve(
        "public",
        decodeURIComponent(url.pathname).replace(/^\//, ""),
      );
    if (!file.startsWith(root + sep)) return route.abort();
    try {
      await route.fulfill({
        status: 200,
        contentType: types[extname(file)] || "application/octet-stream",
        headers: responseHeaders,
        body: await readFile(file),
      });
    } catch {
      await route.fulfill({ status: 404, body: "Not found" });
    }
  });
  const page = await context.newPage();
  if (process.env.QA_DEBUG)
    page.on("request", (request) =>
      console.log("Browser request:", request.url()),
    );
  page.on("pageerror", (error) => errors.push(error.message));
  for (const path of ["/", "/about", "/contact"]) {
    await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
    await page.locator("h1").waitFor();
    assert.equal(await page.locator("main").count(), 1);
    assert.equal(await page.locator("h1").count(), 1);
    const layout = await page.locator(".site-layout").boundingBox();
    assert.ok(
      layout && Math.abs(layout.x) < 1 && Math.abs(layout.width - 1440) < 1,
      `${path} should fill the viewport without an outer frame`,
    );
    const contentPadding = await page
      .locator(".container")
      .first()
      .evaluate((element) =>
        parseFloat(getComputedStyle(element).paddingInlineStart),
      );
    assert.ok(contentPadding >= 20, `${path} missing content padding`);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
      true,
      `${path} desktop overflow`,
    );
    await prepareScreenshot(page);
    assert.equal(
      await page
        .locator("img")
        .evaluateAll((images) =>
          images.every((image) => image.complete && image.naturalWidth > 0),
        ),
      true,
      `${path} broken image`,
    );
    await page.screenshot({
      path: resolve(output, `${path.slice(1) || "home"}-desktop.png`),
      fullPage: true,
    });
  }
  await page.goto(base, { waitUntil: "networkidle" });
  for (const label of ["Dashboard", "Customers", "Records", "Users", "Plans"]) {
    await page.getByRole("tab", { name: label, exact: true }).click();
    const panel = page.getByRole("tabpanel", { name: label, exact: true });
    await panel.waitFor();
    const image = panel.getByRole("img");
    await image.evaluate((element) => element.decode());
    assert.ok(
      (await image.getAttribute("src")).includes(`${label.toLowerCase()}.svg`),
      `${label} did not change the preview image`,
    );
    await page.locator(".product-showcase").screenshot({
      path: resolve(output, `preview-${label.toLowerCase()}.png`),
    });
  }
  await page.getByRole("tab", { name: "Plans", exact: true }).press("Home");
  assert.equal(
    await page
      .getByRole("tab", { name: "Dashboard", exact: true })
      .getAttribute("aria-selected"),
    "true",
  );
  const faq = page.locator(".faq-trigger").nth(1);
  await faq.click();
  assert.equal(await faq.getAttribute("aria-expanded"), "true");
  assert.equal(
    await page.locator(".faq-trigger").first().getAttribute("aria-expanded"),
    "false",
  );

  await page.goto(`${base}/contact`, { waitUntil: "networkidle" });
  await page
    .getByRole("button", { name: "Let’s start a conversation" })
    .click();
  await page
    .getByRole("status")
    .filter({ hasText: "Please check the highlighted fields." })
    .waitFor();
  assert.equal(
    await page.getByLabel("Your name").getAttribute("aria-invalid"),
    "true",
  );
  assert.equal(
    await page
      .getByLabel("Email address", { exact: false })
      .first()
      .getAttribute("aria-invalid"),
    "true",
  );
  await page.getByLabel("Your name").fill("Test Visitor");
  await page
    .getByLabel("Email address", { exact: false })
    .first()
    .fill("visitor@example.test");
  await page
    .getByLabel("How big is your network?")
    .selectOption("Under 500 customers");
  await page
    .getByLabel("What would you like to make simpler?")
    .fill("We want a clearer way to organize our customer records.");
  await page.getByLabel("I agree to be contacted").check();
  await page
    .getByRole("button", { name: "Let’s start a conversation" })
    .click();
  await page
    .getByRole("status")
    .filter({ hasText: "Email delivery isn’t ready yet" })
    .waitFor();
  assert.equal(await page.getByLabel("Your name").inputValue(), "Test Visitor");
  formResult = {
    status: 200,
    body: {
      ok: true,
      message: "Message sent. Our team will be in touch soon.",
    },
  };
  await page
    .getByRole("button", { name: "Let’s start a conversation" })
    .click();
  await page.getByRole("status").filter({ hasText: "Message sent." }).waitFor();
  assert.equal(await page.getByLabel("Your name").inputValue(), "");

  formResult = {
    status: 200,
    body: {
      ok: true,
      message: "Thank you! Your signup has been sent to our team.",
    },
  };
  await page
    .getByLabel("Your email address", { exact: true })
    .fill("subscriber@example.test");
  await page.getByLabel("I agree to receive product updates").check();
  await page.getByRole("button", { name: "Subscribe", exact: true }).click();
  await page
    .getByRole("status")
    .filter({ hasText: "Your signup has been sent" })
    .waitFor();
  assert.equal(
    await page.getByLabel("Your email address", { exact: true }).inputValue(),
    "",
  );

  for (const width of [390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    for (const path of ["/", "/about", "/contact"]) {
      await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
      await prepareScreenshot(page);
      const layout = await page.locator(".site-layout").boundingBox();
      assert.ok(
        layout && Math.abs(layout.x) < 1 && Math.abs(layout.width - width) < 1,
        `${path} ${width}px should have a full-width layout`,
      );
      const newsletter = await page.locator(".newsletter-form").boundingBox();
      const subscribe = await page
        .getByRole("button", { name: "Subscribe", exact: true })
        .boundingBox();
      assert.ok(
        newsletter &&
          subscribe &&
          subscribe.x + subscribe.width <= newsletter.x + newsletter.width + 1,
        `${path} newsletter button overflows its form`,
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1,
        ),
        true,
        `${path} ${width}px overflow`,
      );
      await page.screenshot({
        path: resolve(output, `${path.slice(1) || "home"}-${width}.png`),
        fullPage: true,
      });
    }
  }
  await page.getByRole("button", { name: "Open menu" }).click();
  assert.equal(
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .isVisible(),
    true,
  );
  await page.keyboard.press("Escape");
  assert.equal(
    await page
      .getByRole("button", { name: "Open menu" })
      .getAttribute("aria-expanded"),
    "false",
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.locator(".connection-sculpture").scrollIntoViewIfNeeded();
  await page
    .locator(".connection-sculpture canvas")
    .waitFor({ state: "attached", timeout: 15_000 });
  await page.waitForFunction(
    () => document.querySelector(".connection-sculpture canvas")?.width > 0,
  );
  await page
    .locator(".sculpture-stage")
    .screenshot({ path: resolve(output, "network-sculpture.png") });
  await page.locator(".connection-sculpture").focus();
  await page.keyboard.press("ArrowRight");
  const animatedFaq = page.locator(".faq-trigger").first();
  await animatedFaq.scrollIntoViewIfNeeded();
  const answerId = await animatedFaq.getAttribute("aria-controls");
  const answer = page.locator(`[id="${answerId}"]`);
  const expandedHeight = (await answer.boundingBox()).height;
  await animatedFaq.click();
  const intermediateHeight = (await answer.boundingBox()).height;
  assert.ok(
    intermediateHeight > 0 && intermediateHeight <= expandedHeight,
    "FAQ collapsed instantly instead of animating",
  );
  await page.waitForFunction(
    (id) => document.getElementById(id).getBoundingClientRect().height < 1,
    answerId,
  );
  await prepareScreenshot(page);
  await page.screenshot({ path: resolve(output, "home-hero-motion.png") });
  assert.deepEqual(errors, [], "Browser runtime/hydration errors");
  console.log(
    "Static browser checks passed: three pages at 1440/768/390px, images, tabs, FAQ, menu, contact/newsletter states, and desktop Three.js rendering. No server started; form responses were mocked.",
  );
} finally {
  await browser.close();
}
