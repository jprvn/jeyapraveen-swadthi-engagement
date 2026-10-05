(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let motionPaused = reduced.matches;
  const garden = document.querySelector('.petal-garden');
  for (let i = 0; i < 16; i++) {
    const petal = document.createElement('i'); petal.className = 'drifting-petal';
    petal.style.left = `${(i * 37 % 100)}%`;
    petal.style.setProperty('--duration', `${18 + i % 7 * 2}s`);
    petal.style.setProperty('--delay', `${-i * 2.7}s`); garden.append(petal);
  }
  const motionButton = document.querySelector('#motion-toggle');
  const musicButton = document.querySelector('#music-toggle');
  const tamil = () => document.documentElement.lang === 'ta';
  function updateMotion() {
    document.body.classList.toggle('motion-paused', motionPaused);
    motionButton.setAttribute('aria-pressed', String(motionPaused));
    const text = motionPaused ? (tamil() ? 'இயக்கம் தொடர' : 'Resume motion') : (tamil() ? 'இயக்கம் நிறுத்த' : 'Pause motion');
    document.querySelector('#motion-label').textContent = text; motionButton.setAttribute('aria-label', text);
  }
  motionButton.addEventListener('click', () => { motionPaused = !motionPaused; updateMotion(); });
  reduced.addEventListener('change', () => { motionPaused = reduced.matches; updateMotion(); });
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: .12 });
  document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) document.querySelectorAll('[data-tilt]').forEach(card => {
    let frame = 0;
    card.addEventListener('pointermove', event => {
      if (motionPaused || reduced.matches) return;
      cancelAnimationFrame(frame); frame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.transform = `perspective(1200px) rotateX(${-y * 5}deg) rotateY(${x * 7}deg) translateY(-3px)`;
      });
    });
    card.addEventListener('pointerleave', () => { cancelAnimationFrame(frame); card.style.transform = ''; });
  });
  // Original gentle instrumental: a slow pentatonic melody with soft pads and bell harmonics.
  // Synthesized entirely in-browser; no copyrighted recording, download or third-party request.
  let audio = null, master = null, timer = null, playing = false, nextAt = 0, noteIndex = 0;
  const melody = [74, 69, 67, 62, 65, 69, 72, 69, 67, 65, 62, 60, 62, 65, 67, 69];
  const hz = midi => 440 * 2 ** ((midi - 69) / 12);
  function tone(midi, at, duration, level, bell = false) {
    const gain = audio.createGain(); gain.connect(master);
    gain.gain.setValueAtTime(0, at); gain.gain.linearRampToValueAtTime(level, at + .45);
    gain.gain.exponentialRampToValueAtTime(.0001, at + duration);
    const oscillator = audio.createOscillator(); oscillator.type = 'sine';
    oscillator.frequency.value = hz(midi); oscillator.connect(gain); oscillator.start(at); oscillator.stop(at + duration + .1);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    if (bell) {
      const harmonic = audio.createOscillator(), overtone = audio.createGain();
      harmonic.frequency.value = hz(midi) * 2; overtone.gain.value = .16;
      harmonic.connect(overtone); overtone.connect(gain); harmonic.start(at); harmonic.stop(at + duration);
      harmonic.onended = () => { harmonic.disconnect(); overtone.disconnect(); };
    }
  }
  function schedule() {
    if (!playing || !audio || audio.state !== 'running') return;
    while (nextAt < audio.currentTime + 2) {
      tone(melody[noteIndex % melody.length], nextAt, 3.5, .10, true);
      if (noteIndex % 4 === 0) [50, 57, noteIndex % 8 === 0 ? 62 : 65].forEach(note => tone(note, nextAt, 8, .035));
      nextAt += 1.85; noteIndex++;
    }
  }
  function updateMusic() {
    musicButton.setAttribute('aria-pressed', String(playing));
    const label = playing ? (tamil() ? 'இசை நிறுத்த' : 'Mute music') : (tamil() ? 'இசை கேட்க' : 'Play music');
    document.querySelector('#music-label').textContent = label; musicButton.setAttribute('aria-label', label);
  }
  async function startMusic() {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) throw new Error('Audio unavailable');
    if (!audio) { audio = new Audio(); master = audio.createGain(); master.gain.value = 0; master.connect(audio.destination); }
    await audio.resume(); playing = true; nextAt = audio.currentTime + .1;
    master.gain.cancelScheduledValues(audio.currentTime); master.gain.setTargetAtTime(.28, audio.currentTime, .5);
    schedule(); timer = setInterval(schedule, 600); updateMusic();
  }
  musicButton.addEventListener('click', async () => {
    musicButton.disabled = true;
    try {
      if (playing) { playing = false; clearInterval(timer); await audio.suspend(); updateMusic(); }
      else await startMusic();
    } catch (_) { playing = false; updateMusic(); document.querySelector('#music-label').textContent = tamil() ? 'இசை கிடைக்கவில்லை' : 'Music unavailable'; }
    finally { musicButton.disabled = false; }
  });
  document.addEventListener('visibilitychange', async () => {
    if (!playing || !audio) return;
    if (document.hidden) await audio.suspend();
    else { await audio.resume(); nextAt = audio.currentTime + .1; schedule(); }
  });
  document.querySelector('#language').addEventListener('click', () => { updateMusic(); updateMotion(); });
  updateMusic(); updateMotion();
  const gate = document.querySelector('#envelope-gate');
  const siblings = [...document.body.children].filter(el => el !== gate && !['SCRIPT','NOSCRIPT'].includes(el.tagName));
  let opened = false, wheelDistance = 0, touchStart = 0;
  gate.hidden = false; document.body.classList.add('invitation-sealed');
  siblings.forEach(el => { el.inert = true; });
  document.querySelector('#gate-open').focus({ preventScroll: true });
  function openEnvelope() {
    if (opened) return; opened = true;
    gate.classList.add('opening');
    const finish = () => {
      gate.hidden = true; document.body.classList.remove('invitation-sealed');
      siblings.forEach(el => { el.inert = false; });
      let target = document.querySelector('#hero-title');
      if (location.hash) {
        try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))) || target; } catch (_) {}
      }
      target.setAttribute('tabindex','-1'); target.focus({ preventScroll: true });
      if (location.hash) target.scrollIntoView({behavior:'instant',block:'start'});
      else window.scrollTo({top:0,behavior:'instant'});
    };
    setTimeout(finish, reduced.matches || motionPaused ? 0 : 1700);
  }
  document.querySelector('#seal-open').addEventListener('click', openEnvelope);
  document.querySelector('#gate-open').addEventListener('click', openEnvelope);
  gate.addEventListener('wheel', event => { wheelDistance += Math.max(0,event.deltaY); if(wheelDistance > 45) openEnvelope(); }, {passive:true});
  gate.addEventListener('touchstart', event => { touchStart = event.changedTouches[0].clientY; }, {passive:true});
  gate.addEventListener('touchend', event => { if(touchStart - event.changedTouches[0].clientY > 25) openEnvelope(); }, {passive:true});
  gate.addEventListener('keydown', event => {
    if(['ArrowDown','PageDown','Escape'].includes(event.key)) {event.preventDefault();openEnvelope();}
  });
})();
