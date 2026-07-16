import { useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { useReducedMotion } from '../../lib/reducedMotion';
import './GarlandTie.css';

const END_WIDTH = 40;
const EDGE_GAP = 10;
const SNAP_THRESHOLD = 46;
const ROSE = '#c76b8f';
const GOLD = '#a3872c';

// Small draggable grab-handle — the actual rope strand is drawn separately
// as a static decorative curve behind it (see the .garland-ropes <svg>),
// matching the reference's decoupled rope-path / end-cap structure.
function EndCap({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="11" fill="none" stroke={color} strokeWidth="5" />
      <circle cx="20" cy="20" r="4" fill={color} opacity="0.4" />
    </svg>
  );
}

function KnotGlyph() {
  return (
    <svg viewBox="0 0 40 30" aria-hidden="true">
      <path d="M4,15 Q14,2 20,15 Q26,28 36,15" fill="none" stroke={ROSE} strokeWidth="4" strokeLinecap="round" />
      <path d="M4,15 Q14,28 20,15 Q26,2 36,15" fill="none" stroke={GOLD} strokeWidth="4" strokeLinecap="round" opacity="0.85" />
      <circle cx="20" cy="15" r="3.5" fill="#fff" opacity="0.9" />
    </svg>
  );
}

type Side = 'left' | 'right';

export default function GarlandTie({ onUnlock }: { onUnlock: () => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  // null = still at that end's home position (left edge / right edge).
  const [leftX, setLeftX] = useState<number | null>(null);
  const [rightX, setRightX] = useState<number | null>(null);
  const [dragging, setDragging] = useState<Side | null>(null);
  const [tied, setTied] = useState(false);
  const reduced = useReducedMotion();

  function bounds() {
    const track = trackRef.current;
    const width = track ? track.clientWidth : 280;
    return { min: EDGE_GAP, max: width - END_WIDTH - EDGE_GAP };
  }

  function handlePointerDown(side: Side) {
    return (e: ReactPointerEvent<HTMLDivElement>) => {
      if (tied) return;
      (e.target as Element).setPointerCapture(e.pointerId);
      setDragging(side);
    };
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging || tied) return;
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const { min, max } = bounds();
    let x = e.clientX - rect.left - END_WIDTH / 2;
    x = Math.max(min, Math.min(max, x));
    if (dragging === 'left') setLeftX(x);
    else setRightX(x);
  }

  function handlePointerUp() {
    if (!dragging || tied) return;
    const { min, max } = bounds();
    const leftPos = leftX ?? min;
    const rightPos = rightX ?? max;
    if (rightPos - leftPos < SNAP_THRESHOLD) {
      // However far each end travelled, they meet in the middle — this
      // works whichever end (or both) the guest actually dragged.
      const mid = (leftPos + rightPos) / 2;
      setLeftX(mid);
      setRightX(mid);
      setTied(true);
      window.setTimeout(onUnlock, reduced ? 0 : 750);
    } else if (dragging === 'left') {
      setLeftX(null); // springs back to its home position via CSS
    } else {
      setRightX(null);
    }
    setDragging(null);
  }

  const leftStyle: CSSProperties = leftX !== null ? { left: leftX } : {};
  const rightStyle: CSSProperties = rightX !== null ? { left: rightX, right: 'auto' } : {};
  const knotLeft = leftX !== null ? leftX + END_WIDTH / 2 - 20 : 0;

  return (
    <div className="garland-tie">
      <div className="garland-track" ref={trackRef}>
        <svg className="garland-ropes" viewBox="0 0 280 64" preserveAspectRatio="none" aria-hidden="true">
          <path
            className="knot-hint"
            d="M120,20 Q140,8 160,20"
            fill="none"
            stroke={ROSE}
            strokeWidth="1.6"
            strokeDasharray="3 5"
            opacity="0.45"
          />
          <path d="M14,48 Q80,18 132,34" fill="none" stroke={ROSE} strokeWidth="7" strokeLinecap="round" opacity="0.9" />
          <path d="M266,48 Q200,18 148,34" fill="none" stroke={GOLD} strokeWidth="7" strokeLinecap="round" opacity="0.9" />
        </svg>
        <div
          className={`garland-end garland-end-left${dragging === 'left' ? ' dragging' : ''}${tied ? ' tied' : ''}`}
          style={leftStyle}
          onPointerDown={handlePointerDown('left')}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <EndCap color={ROSE} />
        </div>
        <div
          className={`garland-end garland-end-right${dragging === 'right' ? ' dragging' : ''}${tied ? ' tied' : ''}`}
          style={rightStyle}
          onPointerDown={handlePointerDown('right')}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <EndCap color={GOLD} />
        </div>
        {tied && (
          <span className="garland-knot" style={{ left: knotLeft }}>
            <KnotGlyph />
          </span>
        )}
      </div>
      <div className="garland-label">{tied ? 'Gathbandhan complete. 🌸' : 'Drag either end to tie the knot'}</div>
    </div>
  );
}
