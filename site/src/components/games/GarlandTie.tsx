import { useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { useReducedMotion } from '../../lib/reducedMotion';
import './GarlandTie.css';

const END_WIDTH = 56;
const EDGE_GAP = 10;
const SNAP_THRESHOLD = 46;

function RopeEnd({ color, tailToRight }: { color: string; tailToRight: boolean }) {
  const tail = tailToRight ? 'M28,28 C40,28 48,24 54,18' : 'M28,28 C16,28 8,24 2,18';
  return (
    <svg viewBox="0 0 56 56" aria-hidden="true">
      <path d={tail} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <circle cx="28" cy="28" r="15" fill="none" stroke={color} strokeWidth="6" />
      <circle cx="28" cy="28" r="6" fill={color} opacity="0.35" />
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
  const knotLeft = leftX !== null ? leftX + END_WIDTH / 2 - 11 : 0;

  return (
    <div className="garland-tie">
      <div className="garland-track" ref={trackRef}>
        <svg className="garland-guide" viewBox="0 0 280 64" preserveAspectRatio="none" aria-hidden="true">
          <path d="M38,42 Q140,4 242,42" fill="none" stroke="#c76b8f" strokeWidth="2" strokeDasharray="4 6" opacity="0.5" />
        </svg>
        <div className="garland-string" />
        <div
          className={`garland-end garland-end-left${dragging === 'left' ? ' dragging' : ''}${tied ? ' tied' : ''}`}
          style={leftStyle}
          onPointerDown={handlePointerDown('left')}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <RopeEnd color="#c76b8f" tailToRight={true} />
        </div>
        <div
          className={`garland-end garland-end-right${dragging === 'right' ? ' dragging' : ''}${tied ? ' tied' : ''}`}
          style={rightStyle}
          onPointerDown={handlePointerDown('right')}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <RopeEnd color="#a3872c" tailToRight={false} />
        </div>
        {tied && <span className="garland-knot" style={{ left: knotLeft }}>🪢</span>}
      </div>
      <div className="garland-label">{tied ? 'Gathbandhan complete. 🌸' : 'Drag either end to tie the knot'}</div>
    </div>
  );
}
