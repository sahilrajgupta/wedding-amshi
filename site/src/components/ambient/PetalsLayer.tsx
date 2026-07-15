import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../lib/reducedMotion';
import { useRsvp } from '../../context/RsvpContext';
import './PetalsLayer.css';

const PALETTES = {
  // Mixed pastel default draws from the full Orchid Cream ramp.
  default: ['#f2acc6', '#f7c6a6', '#cba7e2', '#b6d3a5', '#f5c184', '#aac1ec', '#9fdcd2', '#e79aa8'],
  ladki: ['#f2acc6', '#e79aa8', '#f7c6a6', '#e6839c'],
  ladke: ['#aac1ec', '#9fdcd2', '#b6d3a5', '#7ea6c9'],
} as const;

export default function PetalsLayer({ density = 34 }: { density?: number }) {
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
