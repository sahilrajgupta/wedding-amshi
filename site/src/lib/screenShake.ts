export function triggerScreenShake() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const el = document.getElementById('root');
  if (!el) return;
  el.classList.remove('screen-shake');
  void el.offsetWidth; // force reflow so the animation restarts if already mid-shake
  el.classList.add('screen-shake');
  // Must stay >= the screen-shake animation-duration in global.css (.55s).
  window.setTimeout(() => el.classList.remove('screen-shake'), 570);
}
