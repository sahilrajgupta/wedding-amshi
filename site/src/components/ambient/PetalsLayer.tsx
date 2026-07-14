import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../lib/reducedMotion';
import { useRsvp } from '../../context/RsvpContext';
import './PetalsLayer.css';

const PALETTES = {
  default: ['#f3b6c2', '#f6c9a8', '#c9b6e0', '#f0b184'],
  ladki: ['#f3b6c2', '#e8a9b8', '#f6c9a8', '#f0899e'],
  ladke: ['#a9c8e0', '#9fd6ce', '#b8d4b0', '#7ea6c9'],
} as const;

export default function PetalsLayer({ density = 22 }: { density?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { teamPick } = useRsvp();
  const colors = PALETTES[teamPick ?? 'default'];

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    el.innerHTML = '';
    for (let i = 0; i < density; i++) {
      const p = document.createElement('div');
      p.className = 'petal';
      p.style.left = Math.random() * 100 + '%';
      p.style.background = colors[i % colors.length];
      p.style.setProperty('--drift', Math.random() * 120 - 60 + 'px');
      p.style.setProperty('--spin', Math.random() * 360 + 'deg');
      const duration = 10 + Math.random() * 10;
      p.style.animation = `petal-fall ${duration}s linear ${Math.random() * duration}s infinite`;
      const scale = 0.6 + Math.random() * 0.8;
      p.style.width = p.style.height = 10 * scale + 'px';
      el.appendChild(p);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [density, reduced, teamPick]);

  if (reduced) return null;
  return <div ref={ref} className="petals-layer" aria-hidden="true" />;
}
