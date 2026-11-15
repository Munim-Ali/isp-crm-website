# Architecture

## Rendering and boundaries

Next.js App Router + React + strict TypeScript. `/`, `/about`, `/contact`, metadata, sitemap and robots are generated on the server and prerendered at build time. Only the two form POST routes require a Node runtime. Do not use static export: SMTP routes need a Next.js server or a compatible Node/serverless host.

`src/config/site.ts` reads and validates public configuration server-side. `server-only` prevents it entering browser bundles. No SMTP variable is prefixed with `NEXT_PUBLIC_`. Shared form schemas live in `src/lib/validation.ts`. The contact page deliberately imports its Zod schema into its small client boundary for inline validation; the server validates again independently. Newsletter browser code still uses native validation and type-only imports.

Small client boundaries:

| Component                         | Reason                                                                                                               |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `layout/mobile-menu.tsx`          | Menu state, outside/Escape dismissal                                                                                 |
| `product/product-showcase.tsx`    | Five accessible image tabs, shared animated selection, fixed-aspect crossfades; config arrives as serializable props |
| `motion/reveal.tsx`               | Framer Motion reveal; server children stay server-owned and visible without JS                                       |
| `motion/connection-sculpture.tsx` | Real lit 3D knot, orbiting spheres and rings; drag/keyboard rotation; lazy offscreen loading and GPU disposal        |
| `motion/faq-accordion.tsx`        | Accessible button/region accordion with eased height, opacity and icon transitions                                   |
| `forms/*`                         | Browser validation, fetch, pending/error/success state                                                               |

Navigation/CTA links use CSS hover/focus transitions and need no additional client runtime. FAQ content arrives from the server as data for a small Motion island. No root client provider turns the site into a client-rendered tree. The server root layout owns full-width `.site-layout`. Shared `.container` elements provide max-width alignment and internal content padding; section backgrounds fill the viewport. No shaded outer frame, root border/radius/shadow, or root overflow clipping.

## Theme and content

`src/styles/theme.css` owns the user's supplied palette, Inter typography, 6px base control radius and content gutter tokens. `base.css` owns typography/layout primitives. `components.css` owns reusable UI and header/footer/CTA. `showcase.css` owns the image showcase; `interactions.css` owns the animated FAQ and sculpture; `forms.css` owns the enhanced form states. `pages.css` owns page sections and responsive layouts. `app/globals.css` imports these once. Semantic class names keep JSX readable; shared button primitives consume the same theme.

Marketing arrays and FAQs: `src/content/marketing.ts`. Public identity/contact/image values: `.env.local` → `src/config/site.ts` → server components → minimal props where needed. Assets are local WebP/font files, with Next Image responsive optimization. Brand mark can be replaced with `COMPANY_LOGO`; tab icon is `src/app/icon.svg`.

## Form request lifecycle

1. Contact form: shared Zod schema validates on blur and submit, displays field errors with ARIA associations, and focuses the first invalid field. Newsletter: native browser constraints. Both require explicit consent.
2. Native fetch JSON POST with a timeout and duplicate-submit guard.
3. `handleForm` checks origin, JSON content type and 16 KB body limit.
4. Optional per-IP in-memory throttle, enabled only with a hosting-trusted IP header.
5. Zod validates/normalizes fields, rejects unknown keys and checks consent. Honeypot submissions are quietly ignored.
6. `mail.ts` validates private SMTP configuration and sends text-only notifications to every configured recipient. User email is `replyTo`; it is never the `from` address. No attachments, arbitrary URLs, or submitted HTML are loaded.
7. Report success only when SMTP accepts delivery to all recipients. Missing configuration returns 503; transport failure returns 502. No SMTP secrets or submitted personal data in logs.

SMTP acceptance verifies handoff to the mail server, not inbox delivery. Partial acceptance can cause a duplicate at an already-accepted recipient if the visitor retries. Newsletter signups are email notifications; a durable subscriber service and automated unsubscribe flow are future work.

The optional throttle is per process, so serverless/multi-instance hosting should use a platform rate limit or shared durable store. Keep body limits and origin validation even with a platform limiter.

## Graph and tests

- `architecture.mmd`: editable Mermaid graph.
- `project-map.json`: compact lookup for future assistants.
- `tests/forms.test.mjs`: schema and mocked SMTP behavior without network delivery.
- `scripts/static-browser-check.mjs`: production HTML browser checks using request interception; no server starts. Not a substitute for a final production deployment smoke check.

See `DEVELOPMENT.md` for commands/configuration and `HANDOFF.md` for current state and next inputs.
