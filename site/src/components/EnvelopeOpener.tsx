import { useEffect, useState } from 'react';
import { config } from '../config';
import { useReducedMotion } from '../lib/reducedMotion';
import './EnvelopeOpener.css';

const PETAL_COLORS = ['#f3b6c2', '#f6c9a8', '#c9b6e0', '#b8d4b0', '#a9c8e0'];

export default function EnvelopeOpener({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  const [opened, setOpened] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (reduced) {
      onDone();
      setHidden(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  function handleOpen() {
    if (opened) return;
    setOpened(true);
    onDone();
    // Must stay in sync with the card-emerge/gate-fade timings in EnvelopeOpener.css.
    window.setTimeout(() => setHidden(true), 3150);
  }

  if (hidden) return null;

  return (
    <div className={`envelope-gate${opened ? ' opened' : ''}`} role="button" tabIndex={0}
      onClick={handleOpen}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleOpen()}
      aria-label="Tap to open your invitation">
      <div className="envelope-glow" />
      {opened &&
        Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="envelope-petal"
            style={{
              left: `${Math.random() * 100}%`,
              background: PETAL_COLORS[i % PETAL_COLORS.length],
              animationDelay: `${Math.random() * 0.4}s`,
            }}
          />
        ))}

      <div className="envelope">
        <div className="envelope-flap" />
        <div className="envelope-body">
          <div className="envelope-seal">{config.monogram}</div>
        </div>
        <div className="envelope-card">
          <div className="envelope-card-blessing">॥ श्री गणेशाय नमः ॥</div>
          <div className="envelope-card-eyebrow">Save Our Forever</div>
          <div className="envelope-card-names">{config.names}</div>
          <div className="envelope-card-sub">are getting married</div>
          <div className="envelope-card-venue">
            {config.venueName} · {config.venueRegion}
          </div>
        </div>

        {!opened && <div className="envelope-hint">tap to open</div>}
      </div>
    </div>
  );
}
