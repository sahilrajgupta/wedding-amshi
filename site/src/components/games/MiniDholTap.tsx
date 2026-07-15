import { useState } from 'react';
import { playDholHit } from '../../lib/dholSound';
import './MiniDholTap.css';

const TAPS_NEEDED = 5;

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
        🥁
      </button>
      <div className="mini-dhol-label">
        {done ? 'The Sangeet is officially live! 🎶' : `Tap the dhol — ${TAPS_NEEDED - taps} more`}
      </div>
    </div>
  );
}
