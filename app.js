(() => {
  'use strict';
  const facts = window.WEDDING_FACTS;
  let language = 'en';
  let lastAnswer = null;
  const knowledge = {
    wedding: {
      q: ['When is the wedding?', 'திருமணம் எப்போது?'],
      a: ['The wedding is on Monday, 16 November 2026. Muhurtham is 8:30–9:30 AM IST at Sree Lakshmi Narayan Mahal, Coimbatore.', 'திருமணம் திங்கள், 16 நவம்பர் 2026 அன்று நடைபெறும். முகூர்த்தம் காலை 8:30–9:30, இந்திய நேரப்படி. இடம்: Sree Lakshmi Narayan Mahal, கோயம்புத்தூர்.']
    },
    reception: {
      q: ['When is the reception?', 'வரவேற்பு எப்போது?'],
      a: ['The reception is on Sunday, 15 November 2026, from 6:00 PM onwards IST at Sree Lakshmi Narayan Mahal, Coimbatore. A finish time has not been confirmed.', 'வரவேற்பு ஞாயிறு, 15 நவம்பர் 2026 அன்று மாலை 6:00 மணி முதல், இந்திய நேரப்படி நடைபெறும். இடம்: Sree Lakshmi Narayan Mahal, கோயம்புத்தூர். முடிவு நேரம் உறுதிசெய்யப்படவில்லை.']
    },
    venue: {
      q: ['Are both events at the same venue?', 'இரு விழாக்களும் ஒரே இடத்திலா?'],
      a: ['Yes. Both the reception and wedding are at Sree Lakshmi Narayan Mahal, Coimbatore. Use the directions buttons to open the family-shared Google Maps pin.', 'ஆம். வரவேற்பும் திருமணமும் Sree Lakshmi Narayan Mahal, கோயம்புத்தூரில் நடைபெறும். குடும்பத்தினர் பகிர்ந்த Google Maps இணைப்பைத் திறக்க வழிகாட்டி பொத்தானைப் பயன்படுத்துங்கள்.']
    },
    calendar: {
      q: ['How do I save the dates?', 'தேதிகளை எப்படிச் சேமிப்பது?'],
      a: ['Each event card has a Google Calendar link and an Apple / Outlook calendar download. All times use IST (UTC+05:30). The reception reminder marks the 6 PM start only; no finish time is announced.', 'ஒவ்வொரு நிகழ்ச்சி அட்டையிலும் Google Calendar இணைப்பும் Apple / Outlook நாள்காட்டி பதிவிறக்கமும் உள்ளன. அனைத்தும் இந்திய நேரப்படி (UTC+05:30). வரவேற்பு நினைவூட்டல் மாலை 6 மணி தொடக்கத்தை மட்டும் குறிக்கும்; முடிவு நேரம் அறிவிக்கப்படவில்லை.']
    },
    travel: {
      q: ['Where can I book travel tickets?', 'பயணச் சீட்டுகளை எங்கே முன்பதிவு செய்வது?'],
      a: ['The Travel section has redBus links from Chennai, Madurai, Bengaluru and Hyderabad to Coimbatore, plus the official IRCTC booking portal. Choose your stations and journey date on the provider’s site. Check live schedules, fares and availability there, and allow time to reach the mahal. Guest transport and accommodation have not been confirmed.', 'பயணப் பகுதியில் சென்னை, மதுரை, பெங்களூரு மற்றும் ஹைதராபாதிலிருந்து கோயம்புத்தூருக்கு redBus இணைப்புகளும் அதிகாரப்பூர்வ IRCTC முன்பதிவு இணைப்பும் உள்ளன. முன்பதிவு தளத்தில் நிலையங்களையும் பயணத் தேதியையும் தேர்ந்தெடுத்து கட்டணம், நேரம் மற்றும் இருக்கை விவரங்களைச் சரிபார்க்கவும். மண்டபத்திற்கு வர நேரம் ஒதுக்குங்கள். விருந்தினர் போக்குவரத்து மற்றும் தங்குமிடம் உறுதிசெய்யப்படவில்லை.']
    },
    unknown: {
      q: ['What about parking, food or accommodation?', 'வாகன நிறுத்தம், உணவு அல்லது தங்குமிடம் பற்றி?'],
      a: ['I don’t have confirmed information about that. Please check directly with the couple or their families. I can help with the wedding time, reception, venue, directions and calendar.', 'அது பற்றிய உறுதிசெய்யப்பட்ட தகவல் என்னிடம் இல்லை. மணமக்கள் அல்லது அவர்களின் குடும்பத்தினரிடம் நேரடியாகக் கேளுங்கள். திருமண நேரம், வரவேற்பு, மண்டபம், வழிகாட்டி மற்றும் நாள்காட்டி பற்றி உதவ முடியும்.']
    }
  };
  const dictionary = {
    wedding: 'wedding', muhurtham: 'wedding', marriage: 'wedding', 'wedding time': 'wedding', 'wedding date': 'wedding', 'when is the wedding': 'wedding', 'what time is the wedding': 'wedding', 'when is the muhurtham': 'wedding', 'what is the wedding date': 'wedding', 'திருமணம்': 'wedding', 'திருமண நேரம்': 'wedding', 'திருமணம் எப்போது': 'wedding', 'முகூர்த்தம்': 'wedding', 'முகூர்த்த நேரம்': 'wedding',
    reception: 'reception', 'reception time': 'reception', 'reception date': 'reception', 'when is the reception': 'reception', 'what time is the reception': 'reception', 'வரவேற்பு': 'reception', 'வரவேற்பு எப்போது': 'reception', 'வரவேற்பு நேரம்': 'reception',
    venue: 'venue', location: 'venue', directions: 'venue', maps: 'venue', 'where is the wedding': 'venue', 'where is the reception': 'venue', 'how do i get there': 'venue', 'are both events at the same venue': 'venue', 'மண்டபம்': 'venue', 'இடம்': 'venue', 'வழிகாட்டி': 'venue', 'திருமணம் எங்கே': 'venue', 'வரவேற்பு எங்கே': 'venue',
    calendar: 'calendar', 'save the date': 'calendar', 'save dates': 'calendar', 'how do i save the dates': 'calendar', 'add to calendar': 'calendar', 'நாள்காட்டி': 'calendar', 'தேதிகளை எப்படிச் சேமிப்பது': 'calendar',
    travel: 'travel', 'travel tickets': 'travel', 'bus tickets': 'travel', 'train tickets': 'travel', 'where can i book travel tickets': 'travel', redbus: 'travel', irctc: 'travel', 'பயணம்': 'travel', 'பயணச் சீட்டுகள்': 'travel'
  };
  function classify(question) {
    // Exact approved phrases only. Mixed questions and unsupported claims fall back.
    const normalized = question.normalize('NFC').toLowerCase().trim().replace(/[?!.,؟]+$/u, '').replace(/\s+/g, ' ');
    return Object.hasOwn(dictionary, normalized) ? dictionary[normalized] : 'unknown';
  }
  function showAnswer(key) {
    lastAnswer = key;
    document.querySelector('#answer').textContent = knowledge[key].a[language === 'ta' ? 1 : 0];
  }
  function renderFaq() {
    const container = document.querySelector('#faq-list');
    const open = [...container.querySelectorAll('details')].map(el => el.open);
    container.replaceChildren();
    Object.values(knowledge).forEach((item, index) => {
      const details = document.createElement('details');
      details.open = Boolean(open[index]);
      const summary = document.createElement('summary');
      summary.textContent = item.q[language === 'ta' ? 1 : 0];
      const answer = document.createElement('p');
      answer.textContent = item.a[language === 'ta' ? 1 : 0];
      details.append(summary, answer); container.append(details);
    });
  }
  function setLanguage(next) {
    language = next;
    document.documentElement.lang = next; document.body.lang = next;
    document.querySelectorAll('[data-en][data-ta]').forEach(el => { el.textContent = el.dataset[next]; });
    const button = document.querySelector('#language');
    button.textContent = next === 'en' ? 'தமிழ்' : 'English';
    button.lang = next === 'en' ? 'ta' : 'en';
    button.setAttribute('aria-label', next === 'en' ? 'Switch to Tamil' : 'ஆங்கிலத்திற்கு மாற்றவும்');
    document.querySelector('#question').placeholder = next === 'en' ? 'When is the wedding?' : 'திருமணம் எப்போது?';
    renderFaq(); if (lastAnswer) showAnswer(lastAnswer); updateCountdown();
  }
  const calendarUrl = (kind) => {
    const event = facts[kind];
    const params = new URLSearchParams({ action: 'TEMPLATE', text: `${facts.names.display} — ${kind === 'wedding' ? 'Wedding' : 'Reception (start reminder)'}`, dates: `${event.utc}/${event.end || event.utc}`, location: `${facts.venue}, ${facts.city}`, details: `${kind === 'reception' ? '6 PM onwards IST. This reminder marks the start only; finish time is not confirmed.' : 'Muhurtham: 8:30–9:30 AM IST.'}\nDirections: ${facts.maps}\nInvitation: ${facts.url}`, ctz: 'Asia/Kolkata' });
    return `https://calendar.google.com/calendar/render?${params}`;
  };
  document.querySelector('#reception-google').href = calendarUrl('reception');
  document.querySelector('#wedding-google').href = calendarUrl('wedding');
  document.querySelectorAll('[data-maps]').forEach(link => { link.href = facts.maps; });
  const shareText = `You are warmly invited to celebrate Praveen & Swadthi! Reception: Sunday, 15 November 2026, 6 PM onwards. Wedding: Monday, 16 November 2026, 8:30–9:30 AM IST. Both at Sree Lakshmi Narayan Mahal, Coimbatore. ${facts.url}`;
  document.querySelectorAll('.whatsapp').forEach(link => { link.href = `https://wa.me/?text=${encodeURIComponent(shareText)}`; });
  document.querySelector('#language').addEventListener('click', () => setLanguage(language === 'en' ? 'ta' : 'en'));
  document.querySelectorAll('[data-question]').forEach(button => button.addEventListener('click', () => showAnswer(button.dataset.question)));
  document.querySelector('#ask-form').addEventListener('submit', event => {
    event.preventDefault(); showAnswer(classify(document.querySelector('#question').value));
  });
  function updateCountdown() {
    const diff = Math.max(0, new Date(facts.wedding.start).getTime() - Date.now());
    document.querySelector('#days').textContent = Math.floor(diff / 86400000);
    document.querySelector('#hours').textContent = String(Math.floor(diff % 86400000 / 3600000)).padStart(2, '0');
    document.querySelector('#minutes').textContent = String(Math.floor(diff % 3600000 / 60000)).padStart(2, '0');
    if (!diff) document.querySelector('#count-label').textContent = language === 'ta' ? 'எங்கள் இனிய தொடக்கம் · 16 நவம்பர் 2026' : 'Our beautiful beginning · 16 November 2026';
  }
  renderFaq(); updateCountdown(); setInterval(updateCountdown, 60000);
  // Replace the old engagement worker so returning guests receive the wedding.
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js').catch(() => {});
})();
