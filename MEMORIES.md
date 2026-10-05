# Engagement memories: ready for real photographs

The gallery is intentionally hidden because no engagement photographs have been supplied. No stock or generated image is presented as an engagement photo. `memories.json` has an empty photo list and tracking disabled.

## Add approved photographs later

1. Use owner-approved engagement photographs. Export display-sized WebP copies under `assets/memories/`, strip EXIF/location metadata, and keep the original photographs outside this public repository.
2. Add objects to `photos` in `memories.json`: `src` (e.g. `assets/memories/moment-01.webp`), meaningful `alt`, optional verified `caption` and `captionTa`.
3. The site then shows a swipe/keyboard carousel with tap-to-reveal cards, soft dimensional transitions and a watermark. There are no raw-image links or download buttons. Browser display copies can still be saved or screenshotted; this is presentation, not access control or DRM. Confidential images must not be published to a public repository.

## Optional named visits

No names are currently collected or saved. Do not enable a fake client-only tracker. Viewing photos never requires a name.

To enable shared visit records, connect an owner-chosen, reviewed storage service through a verified HTTPS backend. Set `trackingEnabled: true` and `interestEndpoint` only after testing that backend. The optional form asks for a first name and explicit consent to share that name and this visit with the couple. It sends only `firstName`, `consent`, `event` and timestamp. It does not send IP-derived identity, phone numbers or emails, and stores nothing in browser persistence.

The backend must validate inputs, rate-limit, reject missing consent, escape spreadsheet/formula input if saving to a sheet, configure CORS, define retention, and keep access private to the couple. Return JSON `{ "saved": true }` only after successful durable storage. A failure must remain a failure; the UI cannot claim successful saving without that response. No secret belongs in the static site or URL.

When connecting storage, agree with the owner where records go and how long to keep them. Public GitHub Pages alone cannot collect or privately store shared visitor records.
