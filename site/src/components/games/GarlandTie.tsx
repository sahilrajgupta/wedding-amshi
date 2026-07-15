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

export default function GarlandTie({ onUnlock }: { onUnlock: () => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragX, setDragX] = useState<number | null>(null); // null = home position (right side)
  const [dragging, setDragging] = useState(false);
  const [tied, setTied] = useState(false);
  const reduced = useReducedMotion();

  function bounds() {
    const track = trackRef.current;
    const width = track ? track.clientWidth : 280;
    return { min: EDGE_GAP, max: width - END_WIDTH - EDGE_GAP };
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (tied) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    setDragging(true);
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging || tied) return;
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const { min, max } = bounds();
    let x = e.clientX - rect.left - END_WIDTH / 2;
    x = Math.max(min, Math.min(max, x));
    setDragX(x);
  }

  function handlePointerUp() {
    if (!dragging || tied) return;
    setDragging(false);
    const { min } = bounds();
    if (dragX !== null && dragX - min < SNAP_THRESHOLD) {
      setTied(true);
      setDragX(min);
      window.setTimeout(onUnlock, reduced ? 0 : 750);
    } else {
      setDragX(null); // springs back to the home position via CSS
    }
  }

  // Home position (undragged) is handled by CSS (`right: 10px`) so it's
  // correct on first paint regardless of viewport width — only switch to
  // explicit `left` positioning once we actually have a measured drag/tied
  // position, rather than guessing the track's width before it's mounted.
  const rightStyle: CSSProperties =
    tied ? { left: EDGE_GAP, right: 'auto' } : dragX !== null ? { left: dragX, right: 'auto' } : {};

  return (
    <div className="garland-tie">
      <div className="garland-track" ref={trackRef}>
        <svg className="garland-guide" viewBox="0 0 280 64" preserveAspectRatio="none" aria-hidden="true">
          <path d="M38,42 Q140,4 242,42" fill="none" stroke="#c76b8f" strokeWidth="2" strokeDasharray="4 6" opacity="0.5" />
        </svg>
        <div className="garland-string" />
        <div className="garland-end garland-end-left">
          <RopeEnd color="#c76b8f" tailToRight={true} />
        </div>
        <div
          className={`garland-end garland-end-right${dragging ? ' dragging' : ''}${tied ? ' tied' : ''}`}
          style={rightStyle}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <RopeEnd color="#a3872c" tailToRight={false} />
        </div>
        {tied && <span className="garland-knot">🪢</span>}
      </div>
      <div className="garland-label">{tied ? 'Gathbandhan complete. 🌸' : 'Drag the ends together'}</div>
    </div>
  );
}
