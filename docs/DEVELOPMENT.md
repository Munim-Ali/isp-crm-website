# Development and configuration

Use Node.js 24 LTS (the version used during setup) and npm. Install from the committed lockfile with `npm ci`. All commands use plain `npm`.

```sh
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
npm run test:static
```

The user starts `npm run dev` themselves. For production on a Node host, build then run `npm start`. No deployment has been requested or performed. Do not use `output: 'export'` because the forms need the Node API routes.

## Identity and visible details

`.env.local` is created locally and ignored by Git. On a fresh checkout, copy `.env.example` to `.env.local` and edit it. Never overwrite an existing environment file just to reset defaults.

| Key                                                                                                                         | Use                                                                                  |
| --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `COMPANY_NAME`                                                                                                              | Navbar, footer, metadata, preview label, mail sender label                           |
| `COMPANY_TAGLINE`                                                                                                           | Footer tagline                                                                       |
| `COMPANY_LOGO`                                                                                                              | Optional local path, e.g. `/images/logo.svg`; blank uses placeholder mark            |
| `SITE_URL`                                                                                                                  | Canonical deployment URL, sitemap and social metadata                                |
| `CONTACT_EMAIL`, `CONTACT_EMAIL_SECONDARY`                                                                                  | Visible email links                                                                  |
| `CONTACT_PHONE`, `CONTACT_PHONE_SECONDARY`                                                                                  | Visible click-to-call numbers; blank hides the number                                |
| `WHATSAPP_NUMBER`                                                                                                           | Digits with country code; blank hides WhatsApp                                       |
| `TEAM_IMAGE`, `STORY_IMAGE`                                                                                                 | Local paths under `public/`                                                          |
| `PREVIEW_DASHBOARD_IMAGE`, `PREVIEW_CUSTOMERS_IMAGE`, `PREVIEW_RECORDS_IMAGE`, `PREVIEW_USERS_IMAGE`, `PREVIEW_PLANS_IMAGE` | One local image path per product tab. Defaults are original vector demo screenshots. |

Restart development or rebuild/redeploy after editing public env values: the pages are statically generated. Do not use `NEXT_PUBLIC_` for SMTP values. Most public values are read only in Server Components and never require a global client environment object.

Brand replacement: edit `COMPANY_NAME` and `COMPANY_LOGO`; replace `src/app/icon.svg` for the browser icon. Rework the mark in `components/ui/brand.tsx` only if a real logo asset is not supplied. For colors and spacing, change `src/styles/theme.css`.

Product previews: replace any of the five `PREVIEW_*_IMAGE` values with a real product screenshot under `public/`. Keep a 16:10 aspect ratio for a close fit. `scripts/generate-product-previews.mjs` regenerates only the original demo SVGs; it never reads CRM data. The floating tab bar follows `refereneces/about my website.pdf`. Edit `--content-gutter` and `--container` for shared content padding/max width. The page itself fills the viewport; never add an outer frame or shade.

## Email delivery

Set these values in `.env.local` or hosting secrets:

```dotenv
MAIL_TO=alirohan500@gmail.com,munimali52@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-sender@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-sender@gmail.com
```

Use a Gmail app password with 2-step verification, or an SMTP provider's credentials and verified sender. The sending mailbox can differ from both recipient mailboxes. Do not use a normal Gmail password. Port 465 uses TLS immediately; port 587 with `SMTP_SECURE=false` requires STARTTLS. SMTP configuration is validated only when a form is sent, so the marketing pages can build without credentials.

The current local file intentionally has empty SMTP user/password/from fields. Forms return a clear 503 until they are configured; they do not silently pretend to send. Normal successful delivery sends to both `MAIL_TO` recipients. `CONTACT_EMAIL` controls visible links; it is separate from `MAIL_TO` so recipients and public contacts can change independently.

Newsletter behavior: collects consent and notifies the team. Add a real mailing-list provider or subscriber database before running an automated newsletter program; a visitor can request removal by email with the present design.

## Hosting and hardening

Use a Node-compatible Next.js host that permits outbound SMTP. Configure a platform rate limit on both form routes. `TRUSTED_IP_HEADER` optionally enables a five-attempt/15-minute in-memory limiter; set it only to a header your proxy overwrites with trusted client IPs. It is not a durable/global rate limiter. Verify `SITE_URL`, sender identity and real inbox receipt on the deployed host before launch.

## Browser checks without starting a server

`npm run test:static` uses Chrome and intercepts requests for `.next/server/app/*.html`, `.next/static`, and `public`. It checks prerendered layouts and hydrated local interactions with no listening server. API responses in this static harness are intentionally mocked; real validation and SMTP behavior are covered separately with unit tests. It does not claim to test a deployed server.

Preview screenshots are written under ignored `.cache/qa/`. Use a user-started server for any live HTTP integration check; never start one automatically.
