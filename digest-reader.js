/* Browser-native narration: no API key, microphone, recording or autoplay. */
(function (root) {
  'use strict';
  function chunkText(text, limit = 220) {
    let rest = text.replace(/\s+/g, ' ').trim();
    const chunks = [];
    while (rest.length > limit) {
      const sample = rest.slice(0, limit + 1);
      const endings = [...sample.matchAll(/[.!?](?=\s)/g)].map(m => m.index + 1);
      let cut = endings.filter(n => n >= 70).pop() || sample.lastIndexOf(' ');
      if (cut < 1) cut = limit;
      chunks.push(rest.slice(0, cut).trim()); rest = rest.slice(cut).trim();
    }
    if (rest) chunks.push(rest);
    return chunks;
  }
  function chooseVoice(voices, selected) {
    const exact = voices.find(v => v.voiceURI === selected);
    if (exact) return exact;
    const english = voices.filter(v => /^en(?:[-_]|$)/i.test(v.lang));
    // These names are hints, not a guarantee of vocal depth on every device.
    const score = v => (/Daniel|George|David|Oliver|Arthur|James|Alex|Guy/i.test(v.name) ? 20 : 0)
      + (v.localService ? 5 : 0) + (/^en-GB/i.test(v.lang) ? 2 : 0) + (v.default ? 1 : 0);
    return english.sort((a,b) => score(b) - score(a))[0] || null;
  }
  function createPlayer({synth, Utterance, onChange, timeout = 12000}) {
    let state = 'idle', chunks = [], index = 0, generation = 0, current = null, timer = null, settings = {};
    function emit(message) { onChange({state, index, total: chunks.length, message}); }
    function clear() { clearTimeout(timer); timer = null; }
    function cancel() { generation++; clear(); synth.cancel(); current = null; }
    function say() {
      if (index >= chunks.length) { state = 'ended'; current = null; emit('Finished reading.'); return; }
      const token = ++generation;
      state = 'starting'; emit('Starting voice…');
      try {
        const utterance = new Utterance(chunks[index]); current = utterance;
        utterance.lang = settings.voice?.lang || 'en-GB';
        if (settings.voice) utterance.voice = settings.voice;
        utterance.rate = settings.rate || 0.95; utterance.pitch = settings.pitch || 0.88;
        utterance.onstart = () => { if (token !== generation) return; clear(); state = 'speaking'; emit(`Reading passage ${index + 1} of ${chunks.length}.`); };
        utterance.onend = () => { if (token !== generation) return; clear(); index++; say(); };
        utterance.onerror = () => {
          if (token !== generation) return;
          cancel(); state = 'error'; emit('The voice could not play. Try another voice or open this page in Safari, Chrome or Edge.');
        };
        timer = setTimeout(() => {
          if (token !== generation || state !== 'starting') return;
          cancel(); state = 'error'; emit('The voice did not start. Try another voice or your phone’s main browser.');
        }, timeout);
        // Called directly from a user click initially, including after a pause.
        synth.resume(); synth.speak(utterance);
      } catch (_) { cancel(); state = 'error'; emit('Speech is unavailable. Try your phone’s main browser.'); }
    }
    return {
      start(texts, options = {}) {
        cancel(); chunks = texts.flatMap(t => chunkText(t)); index = 0; settings = options;
        if (!chunks.length) { state = 'error'; emit('No readable digest text was found.'); return; }
        say();
      },
      pause() {
        if (!['starting','speaking'].includes(state)) return;
        // Mobile engines vary in native pause support. Resume the same short
        // passage, never skip its unread tail, and invalidate canceled callbacks.
        cancel(); state = 'paused'; emit('Paused. Resume repeats the current short passage.');
      },
      resume() { if (state === 'paused') say(); },
      stop() { cancel(); index = 0; state = 'idle'; emit('Stopped. Listen again to start from the beginning.'); },
      getState() { return state; }
    };
  }
  function collectText(doc, includeNotes) {
    const selectors = 'h1,h2,h3,p,li,.eyebrow,.chapter,.source,.level b,figcaption,summary,th,td';
    const container = doc.querySelector('main');
    if (!container) return [];
    return [...container.querySelectorAll(selectors)].filter(el => {
      if (el.closest('#digest-reader,nav,footer,[data-no-narration]')) return false;
      if (!includeNotes && el.closest('details,#sources,#methods-notes')) return false;
      if (el.parentElement?.closest(selectors)) return false;
      return true;
    }).map(el => {
      const copy = el.cloneNode(true);
      copy.querySelectorAll('br').forEach(br => br.replaceWith(' '));
      return copy.textContent.replace(/\s+/g,' ').trim();
    }).filter(Boolean);
  }
  const api = {chunkText, chooseVoice, createPlayer, collectText};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (!root.document) return;
  const doc = root.document, panel = doc.getElementById('digest-reader');
  if (!panel) return;
  const play = doc.getElementById('digest-listen'), stop = doc.getElementById('digest-stop');
  const status = doc.getElementById('digest-speech-status'), voiceMenu = doc.getElementById('digest-voice');
  const rate = doc.getElementById('digest-rate'), pitch = doc.getElementById('digest-pitch'), notes = doc.getElementById('digest-notes');
  if (!root.speechSynthesis || !root.SpeechSynthesisUtterance) {
    play.disabled = true; status.textContent = 'Reading aloud is unavailable here. Open this page in your phone’s Safari or Chrome browser.'; return;
  }
  const synth = root.speechSynthesis;
  let voices = [];
  function loadVoices() {
    const selected = voiceMenu.value;
    voices = synth.getVoices();
    voiceMenu.replaceChildren(new Option('Automatic · prefer a lower English voice', ''));
    voices.filter(v => /^en(?:[-_]|$)/i.test(v.lang)).forEach(v => voiceMenu.add(new Option(`${v.name} (${v.lang})`, v.voiceURI)));
    if ([...voiceMenu.options].some(o => o.value === selected)) voiceMenu.value = selected;
  }
  loadVoices(); synth.addEventListener('voiceschanged', loadVoices);
  const player = createPlayer({synth, Utterance: root.SpeechSynthesisUtterance, onChange(info) {
    const running = ['speaking','starting'].includes(info.state), active = running || info.state === 'paused';
    play.textContent = running ? 'Pause reading' : info.state === 'paused' ? 'Resume reading' : 'Listen to episode';
    stop.disabled = !active;
    [voiceMenu,rate,pitch,notes].forEach(el => { el.disabled = active; });
    status.textContent = info.message;
  }});
  play.disabled = false;
  status.textContent = 'Ready. Reads the digest aloud using a voice provided by your browser.';
  play.addEventListener('click', () => {
    const state = player.getState();
    if (['speaking','starting'].includes(state)) { player.pause(); return; }
    if (state === 'paused') { player.resume(); return; }
    loadVoices();
    player.start(collectText(doc,notes.checked), {voice:chooseVoice(voices,voiceMenu.value),rate:Number(rate.value),pitch:Number(pitch.value)});
  });
  stop.addEventListener('click', () => player.stop());
  root.addEventListener('pagehide', () => player.stop());
})(typeof window !== 'undefined' ? window : globalThis);
