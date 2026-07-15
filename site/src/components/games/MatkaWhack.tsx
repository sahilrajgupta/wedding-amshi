import { useState, type CSSProperties } from 'react';
import { useReducedMotion } from '../../lib/reducedMotion';
import { playPotKnock, playPotBreak } from '../../lib/potSound';
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
      playPotBreak();
      setBroken(true);
      window.setTimeout(onUnlock, reduced ? 0 : 750);
    } else {
      playPotKnock();
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
          <ellipse cx="60" cy="128" rx="30" ry="6" fill="rgba(84,55,79,.15)" />
          <path
            className="matka-pot"
            d="M60 8 C42 8 36 22 36 32 C24 40 14 58 14 78 C14 106 33 128 60 128 C87 128 106 106 106 78 C106 58 96 40 84 32 C84 22 78 8 60 8 Z"
            fill="#c76b3c"
          />
          <path
            d="M60 8 C42 8 36 22 36 32 C24 40 14 58 14 78 C14 106 33 128 60 128 C87 128 106 106 106 78 C106 58 96 40 84 32 C84 22 78 8 60 8 Z"
            fill="url(#matka-shine)"
          />
          <defs>
            <radialGradient id="matka-shine" cx="38%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#f0895a" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#c76b3c" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path d="M38 32 C38 22 47 14 60 14 C73 14 82 22 82 32" fill="none" stroke="#a3542c" strokeWidth="4" />
          <ellipse cx="60" cy="32" rx="22" ry="6" fill="#e0794a" />
          {/* decorative beads around the widest part of the pot */}
          {[
            [24, 74],
            [96, 74],
            [30, 96],
            [90, 96],
            [60, 108],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={4.5} fill={i % 2 ? '#f0b184' : '#f2acc6'} opacity={0.85} />
          ))}
          {hits >= 1 && (
            <path className="crack" d="M60 38 L52 60 L58 80" fill="none" stroke="#4a2814" strokeWidth="1.8" />
          )}
          {hits >= 2 && (
            <path className="crack" d="M60 38 L70 58 L64 84" fill="none" stroke="#4a2814" strokeWidth="1.8" />
          )}
          {hits >= 3 && (
            <path
              className="crack"
              d="M38 72 L82 72 M44 94 L78 94"
              fill="none"
              stroke="#4a2814"
              strokeWidth="1.8"
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

      <div className="mechanic-dots">
        {Array.from({ length: HITS_NEEDED }).map((_, i) => (
          <span key={i} className={`mechanic-dot${i < hits ? ' filled' : ''}`} />
        ))}
      </div>

      <div className="matka-label">{broken ? 'Haldi everywhere. 💛' : 'Whack the matka'}</div>
    </div>
  );
}
