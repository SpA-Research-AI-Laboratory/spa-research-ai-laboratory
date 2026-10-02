/* Completed-project directory. Content and links remain usable without JavaScript. */
(() => {
  'use strict';
  const projects = Array.from(document.querySelectorAll('[data-project][id]'));
  const links = Array.from(document.querySelectorAll('[data-project-target]'));
  const picker = document.querySelector('.project-picker');
  if (!projects.length) return;
  const narrow = typeof window.matchMedia === 'function' ? window.matchMedia('(max-width: 900px)') : null;
  const isNarrow = () => Boolean(narrow && narrow.matches);
  const requestedProject = () => {
    try {
      const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      return target && target.closest('[data-project]');
    } catch (_) { return null; }
  };
  const select = (project, focus = false) => {
    if (!project || !projects.includes(project)) return;
    projects.forEach(item => { item.hidden = item !== project; });
    links.forEach(link => {
      if (link.dataset.projectTarget === project.id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    if (picker && isNarrow() && projects.length > 1) picker.open = false;
    if (focus) {
      const title = document.getElementById(project.getAttribute('aria-labelledby')) || project;
      if (!title.hasAttribute('tabindex')) title.setAttribute('tabindex', '-1');
      title.focus({ preventScroll: true });
      project.scrollIntoView({ block: 'start', behavior: 'auto' });
    }
  };
  const updatePicker = () => { if (picker) picker.open = projects.length === 1 || !isNarrow(); };
  updatePicker();
  // Native details should stay expanded as the desktop directory, but stays a real mobile picker.
  if (picker) picker.addEventListener('toggle', () => {
    if (!isNarrow() && !picker.open) picker.open = true;
  });
  if (narrow) {
    if (typeof narrow.addEventListener === 'function') narrow.addEventListener('change', updatePicker);
    else if (typeof narrow.addListener === 'function') narrow.addListener(updatePicker);
  }
  select(requestedProject() || projects[0]);
  links.forEach(link => link.addEventListener('click', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) return;
    const project = projects.find(item => item.id === link.dataset.projectTarget);
    if (!project) return;
    event.preventDefault();
    if (window.location.hash !== `#${project.id}`) {
      const url = new URL(window.location.href);
      url.hash = project.id;
      try { window.history.pushState(window.history.state, '', url.href); }
      catch (_) { window.location.hash = project.id; }
    }
    select(project, true);
  }));
  const onHistory = () => select(requestedProject() || projects[0]);
  window.addEventListener('hashchange', onHistory);
  window.addEventListener('popstate', onHistory);
})();
