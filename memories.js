(() => {
  'use strict';
  // No gallery is shown until genuine, approved engagement images are configured.
  const enTa = (en,ta) => document.documentElement.lang === 'ta' ? ta : en;
  async function prepare() {
    let config;
    try { const response = await fetch('memories.json'); if (!response.ok) return; config = await response.json(); } catch (_) { return; }
    const photos = Array.isArray(config.photos) ? config.photos.filter(photo => typeof photo.src === 'string' && /^assets\/memories\/[a-zA-Z0-9_-]+\.webp$/.test(photo.src) && typeof photo.alt === 'string' && photo.alt.trim()) : [];
    if (!photos.length) return;
    const section = document.createElement('section'); section.id = 'memories'; section.className = 'section memory-section';
    const tracking = config.trackingEnabled === true && typeof config.interestEndpoint === 'string' && /^https:\/\//.test(config.interestEndpoint);
    section.innerHTML = `<div class="section-head"><div class="eyebrow" data-en="A LITTLE OF OUR STORY" data-ta="எங்கள் கதையின் சில தருணங்கள்">A LITTLE OF OUR STORY</div><h2 data-en="You were always part of our joy." data-ta="எங்கள் மகிழ்ச்சியில் நீங்கள் என்றும் ஒரு பங்கு.">You were always part of our joy.</h2><p data-en="Step into our engagement memories. Swipe through the moments, then tap each photograph to reveal it." data-ta="எங்கள் நிச்சயதார்த்த நினைவுகளில் இணைந்திடுங்கள். தருணங்களைப் பார்க்க நகர்த்தி, ஒவ்வொரு படத்தையும் தொட்டு வெளிப்படுத்துங்கள்.">Step into our engagement memories. Swipe through the moments, then tap each photograph to reveal it.</p></div><div class="memory-pass"><span aria-hidden="true">♡</span><div><strong data-en="Our engagement · 31 August 2026" data-ta="எங்கள் நிச்சயதார்த்தம் · 31 ஆகஸ்ட் 2026">Our engagement · 31 August 2026</strong><p data-en="From this little beginning, to celebrating with you." data-ta="இந்த இனிய தொடக்கத்திலிருந்து, உங்களுடன் கொண்டாடும் நாளை நோக்கி.">From this little beginning, to celebrating with you.</p></div></div><div class="memory-track" role="region" aria-label="Engagement memories" tabindex="0"></div><p class="memory-hint" data-en="Swipe or use the arrow keys · Tap a photograph to reveal" data-ta="நகர்த்துங்கள் அல்லது அம்பு விசைகளைப் பயன்படுத்துங்கள் · படத்தைத் தொட்டு வெளிப்படுத்துங்கள்">Swipe or use the arrow keys · Tap a photograph to reveal</p>`;
    const track = section.querySelector('.memory-track');
    photos.forEach((photo,index) => {
      const figure = document.createElement('figure'); figure.className = 'memory-card';
      const button = document.createElement('button'); button.type = 'button'; button.className = 'memory-reveal'; button.setAttribute('aria-pressed','false');
      button.setAttribute('aria-label', `Reveal engagement photograph ${index+1}`);
      const image = document.createElement('img'); image.src = photo.src; image.alt = photo.alt; image.loading = 'lazy'; image.draggable = false;
      const veil = document.createElement('span'); veil.className = 'memory-veil'; veil.textContent = enTa('Tap to reveal this moment ♡','இந்தத் தருணத்தை வெளிப்படுத்த தொட்டிடுங்கள் ♡');
      const watermark = document.createElement('span'); watermark.className = 'memory-watermark'; watermark.textContent = 'Praveen & Swadthi · With love'; watermark.setAttribute('aria-hidden','true');
      button.append(image,veil,watermark);
      button.addEventListener('click', () => { const revealed = button.getAttribute('aria-pressed') === 'true'; button.setAttribute('aria-pressed',String(!revealed)); figure.classList.toggle('revealed',!revealed); });
      const caption = document.createElement('figcaption'); caption.dataset.en = photo.caption || 'A moment to treasure.'; caption.dataset.ta = photo.captionTa || 'நினைவில் நிற்கும் ஒரு தருணம்.'; caption.textContent = enTa(caption.dataset.en,caption.dataset.ta);
      figure.append(button,caption); track.append(figure);
    });
    track.addEventListener('keydown',event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {event.preventDefault();track.scrollBy({left:(event.key==='ArrowRight'?1:-1)*track.clientWidth*.8,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});} });
    if (tracking) {
      const form = document.createElement('form'); form.className = 'memory-interest';
      form.innerHTML = `<h3 data-en="Leave a little hello" data-ta="ஒரு இனிய வணக்கம் தெரிவியுங்கள்">Leave a little hello</h3><p data-en="Optional: tell Praveen & Swadthi you enjoyed these memories. You can view every photo without entering a name." data-ta="விரும்பினால், இந்த நினைவுகளை ரசித்ததை பிரவீன் மற்றும் சுவாதியிடம் தெரிவியுங்கள். பெயர் அளிக்காமலும் அனைத்துப் படங்களையும் பார்க்கலாம்.">Optional: tell Praveen & Swadthi you enjoyed these memories. You can view every photo without entering a name.</p><label for="memory-name" data-en="Your first name" data-ta="உங்கள் பெயர்">Your first name</label><input id="memory-name" name="firstName" maxlength="60" autocomplete="given-name" required><label class="memory-consent"><input name="consent" type="checkbox" required><span data-en="Share my first name and this visit with the couple." data-ta="என் பெயரையும் இந்த வருகையையும் மணமக்களுடன் பகிர்கிறேன்.">Share my first name and this visit with the couple.</span></label><button type="submit" class="btn" data-en="Send a little hello ♡" data-ta="வணக்கம் அனுப்புங்கள் ♡">Send a little hello ♡</button><p class="memory-status" role="status" aria-live="polite"></p>`;
      form.addEventListener('submit',async event => {
        event.preventDefault(); const name = form.elements.firstName.value.trim(); if (!name || !form.elements.consent.checked) return;
        const button = form.querySelector('button'); button.disabled = true;
        const status = form.querySelector('.memory-status');
        try {
          const response = await fetch(config.interestEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},credentials:'omit',body:JSON.stringify({firstName:name.slice(0,60),consent:true,event:'engagement_memories_visit',at:new Date().toISOString()})});
          const result = response.ok ? await response.json() : null;
          if (!result || result.saved !== true) throw new Error('Not confirmed saved');
          status.textContent = enTa('Your hello was saved. Thank you for being part of our joy!','உங்கள் வணக்கம் சேமிக்கப்பட்டது. எங்கள் மகிழ்ச்சியில் இணைந்ததற்கு நன்றி!');
          form.querySelectorAll('input').forEach(input => {input.disabled=true;});
        } catch (_) {status.textContent=enTa('We couldn’t save your hello. Please try again later; you can still enjoy every memory.','உங்கள் வணக்கத்தைச் சேமிக்க இயலவில்லை. பின்னர் முயற்சிக்கவும்; அனைத்து நினைவுகளையும் தொடர்ந்து ரசிக்கலாம்.');button.disabled=false;}
      });
      section.append(form);
    }
    document.querySelector('#celebrations').before(section);
    document.querySelector('#language').addEventListener('click', () => {section.querySelectorAll('.memory-veil').forEach(veil=>{veil.textContent=enTa('Tap to reveal this moment ♡','இந்தத் தருணத்தை வெளிப்படுத்த தொட்டிடுங்கள் ♡');});});
    // Respect the envelope entrance even when the local config fetch finishes later.
    const gate = document.querySelector('#envelope-gate');
    if (gate && !gate.hidden) {
      section.inert = true;
      const observer = new MutationObserver(() => {if(gate.hidden){section.inert=false;observer.disconnect();}});
      observer.observe(gate,{attributes:true,attributeFilter:['hidden']});
    }
  }
  prepare();
})();
