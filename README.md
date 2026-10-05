# Praveen & Swadthi — Wedding invitation

Mobile-first, English/Tamil wedding invitation in maroon, gold and peacock blue.

Guest website: https://jprvn.github.io/jeyapraveen-swadthi-engagement/

## Confirmed celebrations

- Reception: Sunday 15 November 2026, 6 PM onwards IST.
- Wedding: Monday 16 November 2026, 8:30–9:30 AM IST.
- Both: Sree Lakshmi Narayan Mahal, Coimbatore.
- Directions: https://maps.app.goo.gl/uSTjdnq1pmb58Cub6

See `VERIFICATION.md` for source conflicts and the final owner confirmation that supersedes the printed times.

## Guest features

Tamil/English switching, directions, per-event Google Calendar and Apple/Outlook downloads, WhatsApp sharing, countdown, static FAQ and a private deterministic question assistant. Unknown questions return an explicit unconfirmed-information response. No API credentials, backend or guest-question storage.

The new floral garden design includes a gold-sealed envelope that opens on scroll, swipe, tap or keyboard; layered original flower imagery; pastel peach and sage alongside dusty plum and teal; gold and silver trim; gently drifting petals; hover depth; scroll reveals; and a pause-motion control that respects reduced-motion settings. Every guest-facing technology credit has been removed, including the social sharing artwork.

An original gentle instrumental soundscape is synthesized locally with Web Audio. It starts only on the Play music button, can be muted, and suspends when the tab is hidden. No licensed recording or external audio request is used. `assets/ARTWORK.md` records the image prompts.

The Travel section links to redBus routes from Chennai, Madurai, Bengaluru and Hyderabad to Coimbatore and the official IRCTC booking portal. Dates, fares, schedules and seat availability must be checked with the booking provider. No transport or accommodation arrangements are implied.

## Preserve engagement

`engagement/` contains all six original files, unchanged, from commit `98f6c54`. The original root `.ics` also remains in place. The original repository omitted its referenced image; a labelled replacement illustration makes the archived page usable. Original Git history is retained.

## Preview and test

No build step is required. With Node installed, `npm run serve` opens a local server at `http://127.0.0.1:8765/`.

For browser tests, install the development dependency (`npm install`) and Microsoft Edge. Run `npm test`. In a bundled Codex runtime, `PLAYWRIGHT_MODULE` may point to its existing Playwright module. Tests exercise English/Tamil phone, tablet and desktop layouts, calendars, safe FAQ fallback, sharing, archive and no-JavaScript content. Screenshots are written to ignored `test-results/`. The test also renders the social preview and labelled archive illustration from the site's own vector artwork.

## Deployment and future edits

The existing GitHub Pages configuration publishes the root site from `main`. Publish using normal commits; never force-push over historical commits.

Final facts live in `config.js`; accessible static event text lives in `index.html`, answer text in `app.js`, and calendar downloads in the two `.ics` files. Keep all representations synchronized and verify in the browser after edits. Calendar lines use CRLF and RFC 5545 folding. `node tests/finalize.cjs` folds the calendar files and supplies the static FAQ on first assembly.

The root service worker migrates the old engagement cache and does not intercept wedding requests. Google Fonts is optional; system fonts are the fallback. No invitation PDF is publicly distributed because the printed timing differs from the owner's final confirmation.
