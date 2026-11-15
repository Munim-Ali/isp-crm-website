# ISP CRM marketing website

A problem-first SaaS website with three pages: landing, about us, and contact. Built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, Three.js, Zod, and Nodemailer.

The site uses a full-width layout with padded content containers, five image-changing product tabs (Dashboard, Customers, Records, Users, Plans), animated FAQs, and a drag/keyboard-controlled 3D network sculpture. The contact form validates with Zod in the browser and again on the server.

## Run locally

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The user starts the server themselves. Use Node.js 24 LTS. A local `.env.local` is already prepared for this workspace; on a fresh checkout, copy `.env.example` and edit it.

## Customize

- Company name, logo, public emails, phone numbers, WhatsApp and photo paths: `.env.local`.
- Colors, typography and spacing: `src/styles/theme.css`.
- Reusable UI: `src/components/ui/` and `src/components/layout/`.
- Marketing text, FAQs and process timeline: `src/content/marketing.ts` and the page components.
- Real photos: add to `public/images/`, change the env image paths and rebuild.

“Relay,” the logo, photographs, and preview records are temporary. Both supplied phone numbers are configured. There is no business location on the site.

## Email forms

Contact enquiries and newsletter signups notify **both** recipients configured in `MAIL_TO`. Set `SMTP_USER`, `SMTP_PASSWORD`, and `SMTP_FROM` privately in `.env.local` or hosting secrets. Gmail requires an app password. Without credentials the forms show a clear delivery error and direct email links remain available. No email success is simulated.

Newsletter signup sends an opt-in notification to the team; a persistent mailing-list integration is a future step.

## Verify and build

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run test:static
```

The static browser check uses installed Chrome, reads production build output through request interception, and **does not start a server**. Email unit tests mock the SMTP transport. `npm run format` keeps the source readable.

Pages are statically prerendered; only form endpoints require Node. Public env changes need a restart/rebuild. Use a Next.js-compatible Node host for deployment; static export cannot support Nodemailer routes.

## Future development

Read [AGENTS.md](AGENTS.md) and [docs/HANDOFF.md](docs/HANDOFF.md) first. [docs/project-map.json](docs/project-map.json) locates files quickly; [docs/architecture.mmd](docs/architecture.mmd) describes the dependency graph. Full notes are in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), verified product claims in [docs/PRODUCT.md](docs/PRODUCT.md), and configuration instructions in [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).
