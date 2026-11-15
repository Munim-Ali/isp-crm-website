# Current handoff

Updated: 2026-11-15. Local development only. User runs the server; do not start it or deploy without a new request.

## Implemented

- Three pages: landing, about us, contact. Blue/white theme, reusable semantic CSS, locally hosted Inter font and the user's supplied color/typography tokens, responsive local WebP imagery.
- Header/hero based on the supplied PDF; section progression informed by Modal reference and verified ISP CRM capabilities.
- Server-rendered content with stronger isolated Motion reveals; floating five-tab image showcase matching the new PDF; full-width root layout with internally padded, centered content; animated FAQ accordion; mobile menu with an explicit Contact link.
- Deferred, lit Three.js sculpture with a rotating blue knot, orbital rings/spheres, pointer drag and keyboard rotation. Mobile/reduced-motion users get a static fallback.
- Contact page uses the same Zod schema for inline blur/submit field errors and independent server validation. Nodemailer remains server-only and uses Gmail/another SMTP relay directly.
- Problem-first messaging, setup timeline, closing CTA, footer newsletter, direct email/phone/WhatsApp links. No business location.
- Environment-backed company name, optional logo, tagline, contacts and image paths. Both supplied phone numbers and both email recipients are configured locally.
- Nodemailer contact/newsletter POST handlers, Zod validation, consent, body cap, origin guard, honeypot, optional trusted-IP throttle and honest delivery failures.
- Metadata, local favicon, generated Open Graph image, sitemap and robots.
- Architecture docs, Mermaid graph and compact machine-readable project map.

## Inputs still needed from the user

1. Final company name and logo. “Relay” is temporary.
2. Real team/product images. Current photos and product records are explicitly illustrative.
3. SMTP sender credentials and verified from address, added privately to `.env.local` or host secrets. Do not ask the user to paste a password in chat.
4. Production domain and hosting choice when publishing is requested.

## Deliberate scope

This is a marketing website, not an authenticated CRM client. No live customer data or live CRM API requests. No invented billing/AI/WhatsApp automation or customer success statistics. Newsletter signup currently emails the team; it does not create a durable marketing-list subscription.

## Verification

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: 9 tests passed, with a mocked SMTP transport; no real emails sent.
- `npm run build`: passed. All three marketing pages prerendered statically; only the two POST form routes are dynamic.
- Refinement browser checks passed at 1440, 768 and 390 px: all five tab image paths, full-width layouts and internal content padding, accordion open/close state and non-instant height animation, mobile menu, inline client Zod validation, form error/success/reset, and an actual lit Three.js canvas with keyboard interaction. Screenshots include each preview and the sculpture. No browser runtime/hydration errors. Form responses were mocked; no server was started or real messages sent.
- Production dependency audit (`npm audit --omit=dev --json`): no known vulnerabilities reported.
- Screenshots reviewed under ignored `.cache/qa/`. The static browser harness reads build output and mocks API responses; it starts no server. A live deployment/inbox-delivery check remains for when SMTP and hosting are configured.

Read `PRODUCT.md` for source facts, `DEVELOPMENT.md` for configuration, or `project-map.json` to find the file for a particular change.
