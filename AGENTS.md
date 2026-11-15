# Working on this repository

Read this file first, then only the relevant documentation. Start with `docs/HANDOFF.md` for current state; use `docs/project-map.json` to locate ownership without reading the whole tree.

## User requirements

- This is the user's local Next.js repository. **Do not start a dev/preview server or deploy unless the user asks.** The user runs the server themselves.
- Use `npm`, not `npm.cmd`. Use the normal PowerShell environment if the sandbox's separate policy blocks npm.
- Three main pages: `/`, `/about`, `/contact`. No business location on the site.
- The root `.site-layout` fills the viewport. “Wrapper” means max-width content with consistent internal padding via `.container`; never add an outside shaded frame, root border/radius/shadow, or root overflow clipping. The product showcase follows `refereneces/about my website.pdf`: five floating tabs (Dashboard, Customers, Records, Users, Plans) change preview **images** with Motion transitions.
- Use the user's supplied theme values in `src/styles/theme.css`: Inter, primary #004DFE / #0039C2, light background #F2F8FF, text #18181B / #52525B, gray border #D4D4D8 and 6px base control radius. These are CSS/Tailwind tokens; preserve the server-rendered root layout.
- “Relay” and the logo/photos are temporary. Company identity, public contacts, image paths, and private SMTP settings come from `.env.local`; document keys in `.env.example`. Never commit `.env.local` or SMTP secrets.
- Keep the site about solving ISP workflow/relationship problems. Read `docs/PRODUCT.md` before adding product claims. Do not invent customers, testimonials, performance statistics, or unsupported automation.

## Architecture rules

- Pages and layouts remain Server Components and statically prerendered where possible. Keep browser code confined to small interaction components. Pass server-rendered children into client wrappers.
- Reuse `src/styles/theme.css` tokens and semantic component classes. Tailwind is available through PostCSS; do not scatter repeated utility strings, arbitrary colors, or inline CSS through the app. Generated Open Graph images may use inline styles as required by ImageResponse.
- Public configuration lives in `src/config/site.ts` (server only). Marketing data lives in `src/content/marketing.ts`. Pass the minimum serializable props to client components. Use explicit TypeScript interfaces for component boundaries.
- Use native fetch for these small form requests. Add Axios only when a concrete integration needs it.
- Zod validates submissions on the server. Nodemailer and SMTP settings are server-only, Node runtime. Never return a successful send until SMTP accepts both configured recipients.
- Motion belongs in `components/motion`. FAQ answers animate height and opacity; avoid native instant disclosure toggles. Three.js is an interactive, deferred desktop sculpture: respect reduced motion, pause offscreen/hidden, cap pixel ratio/frame rate, dispose resources, and preserve a static fallback.
- Forms need consent, readable failure states, keyboard access, and duplicate-submit prevention. No live email tests without explicit authorization; mock SMTP locally.

## Checks and handoff

- Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` for substantive changes. `npm run test:static` checks the built SSG pages in a browser without starting a server. Do not install browsers if the environment already has Chrome.
- Run checks once after meaningful edits, then repeat only affected checks for failures or changes.
- Keep `docs/HANDOFF.md`, `docs/ARCHITECTURE.md`, `docs/architecture.mmd`, and `docs/project-map.json` in sync when boundaries, configuration, or flows change.
- Preserve `refereneces/` and user-provided files. Do not connect to or mutate the live CRM API as part of this marketing site.
