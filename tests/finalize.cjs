const fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '..');
const file = path.join(root, 'index.html');
const faq = `<div class="faq-list" id="faq-list"><details><summary>When is the wedding?</summary><p>Monday, 16 November 2026. Muhurtham: 8:30–9:30 AM IST at Sree Lakshmi Narayan Mahal, Coimbatore.</p></details><details><summary>When is the reception?</summary><p>Sunday, 15 November 2026, 6 PM onwards IST, at the same venue.</p></details><details><summary>Are both events at the same venue?</summary><p>Yes. Sree Lakshmi Narayan Mahal, Coimbatore. Use the Google Maps directions buttons above.</p></details><details><summary>How do I save the dates?</summary><p>Download the Apple / Outlook calendar file from each event card, or use Google Calendar.</p></details><details><summary>What about parking, food or accommodation?</summary><p>These details have not been confirmed. Please check with the couple or their families.</p></details></div>`;
fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('<div class="faq-list" id="faq-list"></div>', faq));
for (const kind of ['wedding', 'reception']) {
  const calendar = path.join(root, kind + '.ics');
  const unfolded = fs.readFileSync(calendar, 'utf8').replace(/\r?\n /g, '').trim();
  const folded = unfolded.split(/\r?\n/).map(line => {
    const parts = []; while (line.length > 75) { parts.push(line.slice(0, 75)); line = ' ' + line.slice(75); } parts.push(line); return parts.join('\r\n');
  }).join('\r\n');
  fs.writeFileSync(calendar, folded + '\r\n');
}
