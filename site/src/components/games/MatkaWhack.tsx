import { useState, type CSSProperties } from 'react';
import { useReducedMotion } from '../../lib/reducedMotion';
import './MatkaWhack.css';

const HITS_NEEDED = 3;

export default function MatkaWhack({ onUnlock }: { onUnlock: () => void }) {
  const [hits, setHits] = useState(0);
  const [broken, setBroken] = useState(false);
  const [shake, setShake] = useState(false);
  const reduced = useReducedMotion();

  function handleWhack() {
    if (broken) return;
    const next = hits + 1;
    setHits(next);

    if (!reduced) {
      setShake(true);
      window.setTimeout(() => setShake(false), 220);
    }

    if (next >= HITS_NEEDED) {
      setBroken(true);
      window.setTimeout(onUnlock, reduced ? 0 : 750);
    }
  }

  return (
    <div className="matka-whack">
      <button
        type="button"
        className={`matka-btn${shake ? ' shake' : ''}${broken ? ' broken' : ''}`}
        onClick={handleWhack}
        disabled={broken}
        aria-label="Whack the matka"
      >
        <svg viewBox="0 0 120 140" className="matka-svg" aria-hidden="true">
          <ellipse cx="60" cy="128" rx="26" ry="5" fill="rgba(84,55,79,.15)" />
          <path
            className="matka-pot"
            d="M60 10 C40 10 34 26 34 36 C22 42 16 60 16 76 C16 104 34 126 60 126 C86 126 104 104 104 76 C104 60 98 42 86 36 C86 26 80 10 60 10 Z"
            fill="#e0703a"
          />
          <path d="M40 34 C40 24 48 16 60 16 C72 16 80 24 80 34" fill="none" stroke="#b5502a" strokeWidth="4" />
          <ellipse cx="60" cy="34" rx="20" ry="6" fill="#f0895a" />
          {hits >= 1 && (
            <path className="crack" d="M60 40 L52 60 L58 78" fill="none" stroke="#5c2f1a" strokeWidth="1.6" />
          )}
          {hits >= 2 && (
            <path className="crack" d="M60 40 L70 58 L64 82" fill="none" stroke="#5c2f1a" strokeWidth="1.6" />
          )}
          {hits >= 3 && (
            <path
              className="crack"
              d="M40 70 L80 70 M45 92 L75 92"
              fill="none"
              stroke="#5c2f1a"
              strokeWidth="1.6"
            />
          )}
        </svg>

        {broken &&
          !reduced &&
          Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="turmeric-burst"
              style={
                {
                  '--bx': `${Math.random() * 160 - 80}px`,
                  '--by': `${Math.random() * -130 - 20}px`,
                  animationDelay: `${Math.random() * 0.1}s`,
                } as CSSProperties
              }
            />
          ))}
      </button>
      <div className="matka-label">
        {broken ? 'Turmeric everywhere! 💛' : `Whack the matka — ${HITS_NEEDED - hits} more to go`}
      </div>
    </div>
  );
}
