/* SpA Lab: local, progressively enhanced reading controls. */
(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  if (!body) return;
  const all = (selector, context = document) => Array.from(context.querySelectorAll(selector));
  const validAudience = value => value === 'public' || value === 'research';
  const readPreference = key => {
    try { return window.localStorage.getItem(key); } catch (_) { return null; }
  };
  const savePreference = (key, value) => {
    try { window.localStorage.setItem(key, value); } catch (_) { /* Storage is optional. */ }
  };
  const replaceURL = url => {
    try { window.history.replaceState(window.history.state, '', url.href); } catch (_) { /* file previews may restrict history. */ }
  };
  const hashTarget = () => {
    try { return document.getElementById(decodeURIComponent(window.location.hash.slice(1))); }
    catch (_) { return null; }
  };

  const media = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  const motionButton = document.getElementById('motion-toggle');
  let userPaused = readPreference('spa-lab-motion') === 'paused';
  const reducedMotion = () => Boolean(media && media.matches);
  const motionPaused = () => userPaused || reducedMotion() || document.hidden;
  const runningAnimations = new Set();
  const updateMotion = () => {
    const paused = motionPaused();
    root.classList.toggle('motion-paused', paused);
    if (paused) {
      runningAnimations.forEach(animation => animation.cancel());
      runningAnimations.clear();
    }
    if (motionButton) {
      motionButton.textContent = paused ? 'Play motion' : 'Pause motion';
      motionButton.setAttribute('aria-pressed', String(paused));
      motionButton.disabled = reducedMotion();
      motionButton.title = reducedMotion() ? 'Motion is paused by your reduced-motion preference.' : '';
    }
  };
  updateMotion();
  if (motionButton) motionButton.addEventListener('click', () => {
    if (reducedMotion()) return;
    userPaused = !userPaused;
    savePreference('spa-lab-motion', userPaused ? 'paused' : 'playing');
    updateMotion();
  });
  document.addEventListener('visibilitychange', updateMotion);

  const fadeIn = (panel, duration) => {
    if (!panel || motionPaused() || typeof panel.animate !== 'function') return;
    try {
      const animation = panel.animate([{ opacity: 0 }, { opacity: 1 }], { duration, easing: 'ease-out' });
      runningAnimations.add(animation);
      animation.onfinish = animation.oncancel = () => runningAnimations.delete(animation);
    } catch (_) { /* Content remains visible if animation is unavailable. */ }
  };

  // Automatic tab activation with roving tabindex, scoped to each tablist.
  const keyboardTabs = (tabs, activate) => tabs.forEach(tab => {
    tab.addEventListener('keydown', event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const index = tabs.indexOf(tab);
      let next;
      if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
      else if (event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
      else if (event.key === 'Home') next = tabs[0];
      else if (event.key === 'End') next = tabs[tabs.length - 1];
      else if (event.key === 'Enter' || event.key === ' ') next = tab;
      if (!next) return;
      event.preventDefault();
      next.focus({ preventScroll: true });
      activate(next);
    });
  });

  const audiencePanels = all('[data-audience-panel]').filter(panel => validAudience(panel.dataset.audiencePanel));
  const panelFor = value => audiencePanels.find(panel => panel.dataset.audiencePanel === value);
  const audienceActions = all('[data-audience-target]').filter(action => validAudience(action.dataset.audienceTarget));
  const audienceTabs = audienceActions.filter(action => action.getAttribute('role') === 'tab');
  let audience = 'public';

  const updateLinks = () => {
    all('[data-section-link]').forEach(link => {
      const section = link.dataset.sectionLink;
      if (section !== 'study' && section !== 'methods') return;
      const id = `${audience}-${section}`;
      if (document.getElementById(id)) link.setAttribute('href', `#${id}`);
      // On the study page these links may point back to the homepage.
    });
    all('a[data-audience-link]').forEach(link => {
      if (link.hasAttribute('download')) return;
      try {
        const url = new URL(link.getAttribute('href'), window.location.href);
        if (url.origin !== window.location.origin || !['http:', 'https:', 'file:'].includes(url.protocol)) return;
        if (!/\/(?:[^/]*\.html)?$/i.test(url.pathname)) return;
        url.searchParams.set('audience', audience);
        if (url.hash === '#public-study' || url.hash === '#research-study') url.hash = `#${audience}-study`;
        if (url.hash === '#public-methods' || url.hash === '#research-methods') url.hash = `#${audience}-methods`;
        // Preserve the author's relative path, including project-page deployment prefixes.
        const original = link.getAttribute('href').split(/[?#]/)[0];
        link.setAttribute('href', `${original}${url.search}${url.hash}`);
      } catch (_) { /* An invalid link is left untouched. */ }
    });
  };

  const selectAudience = (value, { persist = false, focusPanel = false, animate = false, remapHash = false } = {}) => {
    if (!validAudience(value) || !panelFor(value)) return;
    const previous = audience;
    const previousHashTarget = hashTarget();
    const previousHashPanel = previousHashTarget && previousHashTarget.closest('[data-audience-panel]');
    audience = value;
    root.dataset.audience = value;
    audiencePanels.forEach(panel => { panel.hidden = panel.dataset.audiencePanel !== value; });
    audienceTabs.forEach(tab => {
      const selected = tab.dataset.audienceTarget === value;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    updateLinks();
    const url = new URL(window.location.href);
    url.searchParams.set('audience', value);
    if (remapHash && previousHashPanel && previousHashPanel !== panelFor(value)) {
      const correspondingID = previousHashTarget.id.replace(new RegExp(`^${previous}-`), `${value}-`);
      const corresponding = document.getElementById(correspondingID);
      url.hash = corresponding && panelFor(value).contains(corresponding) ? correspondingID : panelFor(value).id;
    }
    replaceURL(url);
    if (persist) savePreference('spa-lab-audience', value);
    if (animate && previous !== value) fadeIn(panelFor(value), 180);
    if (focusPanel) {
      const panel = panelFor(value);
      const heading = panel.querySelector('h1, h2') || panel;
      if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
      heading.scrollIntoView({ block: 'start', behavior: 'auto' });
    }
  };

  const requestedAudience = () => {
    const target = hashTarget();
    const owner = target && target.closest('[data-audience-panel]');
    if (owner && validAudience(owner.dataset.audiencePanel)) return owner.dataset.audiencePanel;
    const query = new URL(window.location.href).searchParams.get('audience');
    if (validAudience(query)) return query;
    const saved = readPreference('spa-lab-audience');
    return validAudience(saved) ? saved : 'public';
  };
  if (audiencePanels.length) {
    selectAudience(requestedAudience());
    const activate = action => selectAudience(action.dataset.audienceTarget, {
      persist: true,
      focusPanel: action.getAttribute('role') !== 'tab' && action.dataset.focusPanel === 'true',
      animate: true,
      remapHash: true
    });
    audienceActions.forEach(action => action.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      activate(action);
    }));
    all('[role="tablist"]').forEach(list => {
      const tabs = audienceTabs.filter(tab => tab.closest('[role="tablist"]') === list);
      if (tabs.length) keyboardTabs(tabs, activate);
    });
    const restoreNavigation = () => {
      selectAudience(requestedAudience());
      const target = hashTarget();
      if (target) target.scrollIntoView({ block: 'start', behavior: 'auto' });
    };
    window.addEventListener('popstate', restoreNavigation);
    window.addEventListener('hashchange', restoreNavigation);
    // A hash may initially have pointed into the panel that default CSS showed later.
    if (hashTarget()) window.requestAnimationFrame(() => {
      const target = hashTarget();
      if (target) target.scrollIntoView({ block: 'start', behavior: 'auto' });
    });
  }

  if (!audiencePanels.length) {
    audience = requestedAudience();
    root.dataset.audience = audience;
    updateLinks();
  }

  const outcomePanels = all('[data-outcome-panel]');
  const outcomeTabs = all('[role="tab"][data-outcome-target]');
  const outcomeValues = ['inflammation', 'progression', 'repair'];
  const selectOutcome = (value, animate = true) => {
    const selected = outcomePanels.find(panel => panel.dataset.outcomePanel === value);
    if (!outcomeValues.includes(value) || !selected) return;
    const changed = selected.hidden;
    outcomePanels.forEach(panel => { panel.hidden = panel !== selected; });
    outcomeTabs.forEach(tab => {
      const active = tab.dataset.outcomeTarget === value;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    all('.outcome-art').forEach(art => { art.dataset.outcome = value; });
    if (animate && changed) fadeIn(selected, 220);
  };
  if (outcomePanels.length && outcomeTabs.length) {
    selectOutcome('inflammation', false);
    outcomeTabs.forEach(tab => tab.addEventListener('click', () => selectOutcome(tab.dataset.outcomeTarget)));
    all('[role="tablist"]').forEach(list => {
      const tabs = outcomeTabs.filter(tab => tab.closest('[role="tablist"]') === list);
      if (tabs.length) keyboardTabs(tabs, tab => selectOutcome(tab.dataset.outcomeTarget));
    });
  }

  let revealObserver;
  const revealTargets = all('[data-reveal]');
  const showAllReveals = () => {
    if (revealObserver) revealObserver.disconnect();
    revealTargets.forEach(target => {
      target.classList.remove('js-reveal');
      target.classList.add('is-visible');
    });
  };
  if (!reducedMotion() && typeof window.IntersectionObserver === 'function') {
    try {
      revealObserver = new window.IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      }, { threshold: 0, rootMargin: '0px 0px 0px 0px' });
      revealTargets.forEach(target => {
        revealObserver.observe(target);
        target.classList.add('js-reveal');
      });
    } catch (_) { showAllReveals(); }
  } else showAllReveals();
  const onMotionPreferenceChange = () => {
    updateMotion();
    if (reducedMotion()) showAllReveals();
  };
  if (media) {
    if (typeof media.addEventListener === 'function') media.addEventListener('change', onMotionPreferenceChange);
    else if (typeof media.addListener === 'function') media.addListener(onMotionPreferenceChange);
  }

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
  body.classList.replace('no-js', 'js');
  body.classList.add('js');
})();
