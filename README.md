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

Tamil/English switching, directions, per-event Google Calendar and Apple/Outlook downloads, WhatsApp sharing, countdown, static FAQ and a private deterministic question assistant. Unknown questions return an explicit unconfirmed-information response. No API credentials, backend or guest-question storage. The engineering section explains the actual technology and privacy choices.

## Preserve engagement

`engagement/` contains all six original files, unchanged, from commit `98f6c54`. The original root `.ics` also remains in place. The original repository omitted its referenced image; a labelled replacement illustration makes the archived page usable. Original Git history is retained.

## Preview and test

No build step is required. With Node installed, `npm run serve` opens a local server at `http://127.0.0.1:8765/`.

For browser tests, install the development dependency (`npm install`) and Microsoft Edge. Run `npm test`. In a bundled Codex runtime, `PLAYWRIGHT_MODULE` may point to its existing Playwright module. Tests exercise English/Tamil phone, tablet and desktop layouts, calendars, safe FAQ fallback, sharing, archive and no-JavaScript content. Screenshots are written to ignored `test-results/`. The test also renders the social preview and labelled archive illustration from the site's own vector artwork.

## Deployment and future edits

The existing GitHub Pages configuration publishes the root site from `main`. Publish using normal commits; never force-push over historical commits.

Final facts live in `config.js`; accessible static event text lives in `index.html`, answer text in `app.js`, and calendar downloads in the two `.ics` files. Keep all representations synchronized and verify in the browser after edits. Calendar lines use CRLF and RFC 5545 folding. `node tests/finalize.cjs` folds the calendar files and supplies the static FAQ on first assembly.

The root service worker migrates the old engagement cache and does not intercept wedding requests. Google Fonts is optional; system fonts are the fallback. No invitation PDF is publicly distributed because the printed timing differs from the owner's final confirmation.
