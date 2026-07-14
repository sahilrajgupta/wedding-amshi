import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../lib/reducedMotion';
import './FirefliesLayer.css';

export default function FirefliesLayer({
  count = 16,
  className = '',
}: {
  count?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    el.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const f = document.createElement('div');
      f.className = 'firefly';
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      f.style.left = x + '%';
      f.style.top = y + '%';
      f.style.setProperty('--dx', Math.random() * 80 - 40 + 'px');
      f.style.setProperty('--dy', Math.random() * 60 - 30 + 'px');
      f.style.animation = `fly ${6 + Math.random() * 6}s ease-in-out ${Math.random() * 5}s infinite`;
      el.appendChild(f);
    }
  }, [count, reduced]);

  if (reduced) return null;
  return <div ref={ref} className={`fireflies-layer ${className}`} aria-hidden="true" />;
}
