import { useEffect, useRef, useState } from 'react';
import { playDholHit } from '../../lib/dholSound';
import { triggerScreenShake } from '../../lib/screenShake';
import './TapTheDhol.css';

const MESSAGES = [
  'Warming up…',
  "Now we're talking 🥁",
  'The dance floor is shaking!',
  'Sangeet legend in the making',
  'Certified dhol royalty 👑',
];

const BEST_KEY = 'amishi-dhol-best';

// If this many taps land within this many ms of each other, the screen shakes.
const FRENZY_TAPS = 4;
const FRENZY_WINDOW_MS = 650;

interface Ring {
  id: number;
}

export default function TapTheDhol() {
  const [taps, setTaps] = useState(0);
  const [pulse, setPulse] = useState(false);
  const [rings, setRings] = useState<Ring[]>([]);
  const [best, setBest] = useState(0);
  const recentTaps = useRef<number[]>([]);

  useEffect(() => {
    const stored = Number(window.localStorage.getItem(BEST_KEY) || 0);
    if (stored > 0) setBest(stored);
  }, []);

  function handleTap() {
    const next = taps + 1;
    setTaps(next);
    setPulse(true);
    window.setTimeout(() => setPulse(false), 120);

    const id = Date.now() + Math.random();
    setRings((r) => [...r, { id }]);
    window.setTimeout(() => setRings((r) => r.filter((ring) => ring.id !== id)), 900);

    if (next > best) {
      setBest(next);
      window.localStorage.setItem(BEST_KEY, String(next));
    }

    playDholHit();

    const now = Date.now();
    const recent = [...recentTaps.current, now].slice(-FRENZY_TAPS);
    recentTaps.current = recent;
    if (recent.length === FRENZY_TAPS && now - recent[0] < FRENZY_WINDOW_MS) {
      triggerScreenShake();
    }
  }

  const level = Math.min(MESSAGES.length - 1, Math.floor(taps / 10));

  return (
    <div className="tap-dhol">
      <div className="tap-dhol-drum-wrap">
        {rings.map((r) => (
          <span key={r.id} className="tap-dhol-ring" />
        ))}
        <button
          type="button"
          className={`tap-dhol-drum${pulse ? ' pulse' : ''}`}
          onClick={handleTap}
          aria-label="Tap the dhol"
        >
          🥁
        </button>
      </div>
      <div className="tap-dhol-count">{taps} taps</div>
      {best > 0 && <div className="tap-dhol-best">Your best: {best} taps</div>}
      {taps > 0 && <div className="tap-dhol-msg">{MESSAGES[level]}</div>}
    </div>
  );
}
