import { useState } from 'react';
import { playDholHit } from '../../lib/dholSound';
import './MiniDholTap.css';

const TAPS_NEEDED = 5;
const FIGURE_COLORS = ['#f2acc6', '#f5c184', '#9fdcd2'];

export default function MiniDholTap({ onUnlock }: { onUnlock: () => void }) {
  const [taps, setTaps] = useState(0);
  const [pulse, setPulse] = useState(false);
  const [done, setDone] = useState(false);

  function handleTap() {
    if (done) return;
    const next = taps + 1;
    setTaps(next);
    setPulse(true);
    window.setTimeout(() => setPulse(false), 120);
    playDholHit();
    if (next >= TAPS_NEEDED) {
      setDone(true);
      window.setTimeout(onUnlock, 500);
    }
  }

  return (
    <div className="mini-dhol">
      <button
        type="button"
        className={`mini-dhol-btn${pulse ? ' pulse' : ''}`}
        onClick={handleTap}
        disabled={done}
        aria-label="Tap the dhol"
      >
        <svg viewBox="0 0 140 110" className="mini-dhol-svg" aria-hidden="true">
          <ellipse cx="70" cy="98" rx="46" ry="6" fill="rgba(84,55,79,.15)" />
          <rect x="26" y="30" width="88" height="46" rx="6" fill="#8a5a34" />
          <path d="M26 30 L114 76 M26 76 L114 30" stroke="#e8d9c4" strokeWidth="2" opacity="0.85" />
          <path d="M26 42 L114 42 M26 64 L114 64" stroke="#6b4326" strokeWidth="2" />
          <ellipse cx="26" cy="53" rx="14" ry="26" fill="#f3e3c9" stroke="#c9a877" strokeWidth="3" />
          <ellipse cx="114" cy="53" rx="14" ry="26" fill="#f3e3c9" stroke="#c9a877" strokeWidth="3" />
          {[46, 70, 94].map((cx, i) => (
            <g key={i} transform={`translate(${cx},88)`}>
              <circle cy="-6" r="4" fill={FIGURE_COLORS[i]} />
              <path d="M0,-2 L0,8 M-5,3 L5,3 M-4,14 L0,8 L4,14" stroke={FIGURE_COLORS[i]} strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>
          ))}
        </svg>
      </button>

      <div className="mechanic-dots">
        {Array.from({ length: TAPS_NEEDED }).map((_, i) => (
          <span key={i} className={`mechanic-dot${i < taps ? ' filled' : ''}`} />
        ))}
      </div>

      <div className="mini-dhol-label">{done ? 'Dhol nagade baj gaye! 🎶' : 'Tap the dhol'}</div>
    </div>
  );
}
