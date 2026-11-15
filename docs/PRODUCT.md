# Product facts and design sources

## Sources already inspected

- `refereneces/header and hero.pdf`: one image page. White navigation, centered oversized heading, translucent pill, pale blue diagonal light, two CTAs, software preview below. This directs the navbar and hero composition.
- `refereneces/about my website.pdf`: floating segmented tabs above a glass browser frame on a soft gradient. User specifically requests five image-changing tabs: Dashboard, Customers, Records, Users, Plans.
- `C:/Users/aliro/Downloads/ISP-CRM-API.pdf`: API reference, extracted locally for inspection. Multi-organization ISP customer management. The original stays in Downloads; no personal sample records were copied into the website.
- https://modal-crm.framer.website/: inspected live HTML. Used for the progression from workspace preview to connected records, team clarity, process, FAQ, closing CTA, and newsletter. Its product claims and customer proof are not facts about this product.
- Additional design references inspected during refinement: https://attio.com/ for product-led visual storytelling and https://linear.app/ for interface presentation. Motion's official accordion example (https://motion.dev/examples/react-accordion) informed the accessible eased height/opacity transitions. Their product features are not claims about this product.

## Supported by the supplied API

| Domain                     | Verified capabilities                                                                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Customers                  | Contact/identity details, connection identifiers, active/inactive/closed status, area/package/dealer links, monthly price, discounts and balance fields |
| Documents                  | Customer CNIC uploads and short-lived protected viewing URLs                                                                                            |
| Areas / packages / dealers | Organization-scoped listing and record management                                                                                                       |
| People and roles           | Organization membership, per-organization roles and permission lists                                                                                    |
| Organizations              | One user can belong to multiple organizations; each organization's records are isolated                                                                 |
| Lists                      | Search, pagination, sorting and domain-specific filters                                                                                                 |

No documented invoice, payment processing, ticketing, inbox sync, AI assistant, network provisioning, or marketing automation endpoints. Do not advertise these as available. Public claims about certifications, uptime, customers, ROI, or conversion statistics require supplied evidence.

## Demo decisions

- Temporary name: Relay. Brand mark is a custom SVG placeholder, not an external trademark.
- Main story: less time chasing customer information; stronger customer relationships and clearer teamwork.
- All workspace records, people and counts are fictional and labeled as such.
- No invented customer logos, quotes, subscription prices, or trial promises.
- Temporary photos: Unsplash team and workspace images, stored locally. `public/ASSETS.md` contains attribution and replacement instructions.
- Phone numbers supplied by user: 03172033917 and 03022124302. No physical business location. WhatsApp uses the first number with Pakistan's dialing prefix.
- Enquiries and newsletter notifications go to both user-supplied recipients through `MAIL_TO`. The newsletter currently collects explicit opt-in and emails the team; it is not connected to a mailing-list database/provider.
- User will provide the real company name and photos later. Public configuration changes require restart/rebuild because the pages are prerendered.
