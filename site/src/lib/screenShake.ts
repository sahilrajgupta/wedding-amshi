export function triggerScreenShake() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const el = document.getElementById('root');
  if (!el) return;
  el.classList.remove('screen-shake');
  void el.offsetWidth; // force reflow so the animation restarts if already mid-shake
  el.classList.add('screen-shake');
  window.setTimeout(() => el.classList.remove('screen-shake'), 420);
}
