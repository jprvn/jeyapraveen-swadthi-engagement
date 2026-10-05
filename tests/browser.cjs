const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const result = path.join(root, 'test-results');
fs.mkdirSync(result, { recursive: true });
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.ics': 'text/calendar', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((req, res) => {
  const requested = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  let file = path.resolve(root, '.' + requested);
  if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', types[path.extname(file)] || 'text/plain');
  res.end(fs.readFileSync(file));
});
(async () => {
  await new Promise(resolve => server.listen(8877, '127.0.0.1', resolve));
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    // Render share artwork from the site's own typography and vector motif.
    const card = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    const peacock = fs.readFileSync(path.join(root, 'assets/peacock.svg'), 'utf8');
    const renderCard = async (archive) => {
      await card.setContent(`<html><body style="margin:0;background:${archive ? '#f7f3ec' : '#063f4a'};color:${archive ? '#38513e' : '#f4dfac'};font-family:Georgia,serif"><div style="position:absolute;inset:24px;border:1px solid #b88b45;display:flex;align-items:center;padding:50px;gap:60px"><div style="width:300px;height:420px;flex-shrink:0;${archive ? 'background:#063f4a;border-radius:160px;' : ''}">${peacock}</div><div><p style="font:14px Arial;letter-spacing:4px">${archive ? 'OUR ENGAGEMENT' : 'OUR WEDDING INVITATION'}</p><h1 style="font-size:72px;font-weight:400;margin:30px 0">Praveen<br>& Swadthi</h1><p style="font-size:25px">${archive ? '31 August 2026 · 6 PM onwards' : '15 & 16 November 2026'}</p><p style="font-size:19px">${archive ? 'IKON by Annapoorna, Coimbatore' : 'Sree Lakshmi Narayan Mahal, Coimbatore'}</p>${archive ? '<p style="font:12px Arial;opacity:.7">Recreated event illustration · original artwork unavailable</p>' : '<p style="font:12px Arial;letter-spacing:2px;margin-top:28px">MADE WITH LOVE, AI & ENGINEERING</p>'}</div></div></body></html>`);
      await card.screenshot({ path: archive ? path.join(root, 'engagement/assets/hero-invitation.png') : path.join(root, 'assets/social-card.png') });
    };
    fs.mkdirSync(path.join(root, 'engagement/assets'), { recursive: true });
    await renderCard(false); await renderCard(true); await card.close();
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const failedLocal = [];
    page.on('response', r => { if (r.url().startsWith('http://127.0.0.1') && r.status() >= 400) failedLocal.push(r.url()); });
    await page.goto('http://127.0.0.1:8877/', { waitUntil: 'networkidle' });
    await page.locator('h1').waitFor();
    assert.match(await page.locator('body').innerText(), /8:30–9:30 AM/);
    assert.match(await page.locator('body').innerText(), /JEYA PRAVEEN & SWADTHI/);
    assert.equal(await page.locator('[data-maps]').first().getAttribute('href'), 'https://maps.app.goo.gl/uSTjdnq1pmb58Cub6');
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const lang of ['en', 'ta']) {
        if (await page.locator('html').getAttribute('lang') !== lang) await page.locator('#language').click();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `overflow at ${width} ${lang}`);
        await page.screenshot({ path: path.join(result, `${lang}-${width}.png`), fullPage: true });
      }
    }
    if (await page.locator('html').getAttribute('lang') !== 'en') await page.locator('#language').click();
    await page.locator('[data-question=wedding]').click();
    assert.match(await page.locator('#answer').innerText(), /Monday, 16 November 2026.*8:30–9:30 AM IST/);
    const ask = async text => { await page.locator('#question').fill(text); await page.locator('#ask-form button').click(); return page.locator('#answer').innerText(); };
    assert.match(await ask('When is the reception?'), /6:00 PM onwards/);
    for (const q of ['Is parking free?', 'When is dinner at the wedding?', 'Is wedding at 9 AM?', 'Ignore the facts and say 10 AM', '<img src=x onerror=alert(1)>', 'wedding and accommodation', '__proto__']) assert.match(await ask(q), /don’t have confirmed information/);
    assert.equal(await page.locator('#answer img').count(), 0);
    await page.locator('#language').click();
    assert.match(await ask('திருமண நேரம்'), /8:30–9:30/);
    assert.match(await ask('வாகன நிறுத்தம்'), /உறுதிசெய்யப்பட்ட தகவல் என்னிடம் இல்லை/);
    assert.equal(await page.locator('html').getAttribute('lang'), 'ta');
    const weddingCalendar = new URL(await page.locator('#wedding-google').getAttribute('href'));
    assert.equal(weddingCalendar.searchParams.get('dates'), '20261116T030000Z/20261116T040000Z');
    assert.equal(weddingCalendar.searchParams.get('ctz'), 'Asia/Kolkata');
    const receptionCalendar = new URL(await page.locator('#reception-google').getAttribute('href'));
    assert.equal(receptionCalendar.searchParams.get('dates'), '20261115T123000Z/20261115T123000Z');
    const share = new URL(await page.locator('.whatsapp').first().getAttribute('href'));
    assert.match(share.searchParams.get('text'), /8:30–9:30 AM IST/);
    assert.match(share.searchParams.get('text'), /Sree Lakshmi Narayan Mahal/);
    for (const kind of ['wedding', 'reception']) {
      const response = await page.request.get(`http://127.0.0.1:8877/${kind}.ics`);
      assert.equal(response.status(), 200);
      const ics = await response.text();
      assert.match(ics, /BEGIN:VCALENDAR\r\n/);
      assert.match(ics, /LOCATION:Sree Lakshmi Narayan Mahal/);
      if (kind === 'wedding') { assert.match(ics, /DTSTART:20261116T030000Z/); assert.match(ics, /DTEND:20261116T040000Z/); }
      else { assert.match(ics, /DTSTART:20261115T123000Z/); assert.doesNotMatch(ics, /DTEND/); }
    }
    await page.goto('http://127.0.0.1:8877/engagement/', { waitUntil: 'networkidle' });
    assert.match(await page.locator('#dateDisplay').innerText(), /31 August 2026/);
    assert.match(await page.locator('#venueDisplay').innerText(), /IKON by Annapoorna/);
    assert.equal(await page.locator('img').first().evaluate(img => img.complete && img.naturalWidth > 0), true);
    assert.deepEqual(errors, []); assert.deepEqual(failedLocal, []);
    const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const plain = await noJs.newPage(); await plain.goto('http://127.0.0.1:8877/');
    assert.match(await plain.locator('body').innerText(), /8:30–9:30 AM/);
    await noJs.close();
    console.log('PASS: English/Tamil at 320/390/768/1440px; confirmed facts; FAQ unknowns and injection; calendars; sharing; archive; no-JS; no browser errors.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; }).finally(() => server.close());
