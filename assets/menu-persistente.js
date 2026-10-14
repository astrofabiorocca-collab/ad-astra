(() => {
  const menu = document.querySelector('.main-navigation') || document.querySelector('header:has(.navbar)');
  if (!menu) return;
  const measure = () => document.documentElement.style.setProperty('--site-menu-height', `${Math.ceil(menu.getBoundingClientRect().height)}px`);
  measure();
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(menu);
  else window.addEventListener('resize', measure);
  if (document.fonts) document.fonts.ready.then(measure);
})();
