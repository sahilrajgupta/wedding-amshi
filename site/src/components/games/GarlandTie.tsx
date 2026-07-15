import { useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { useReducedMotion } from '../../lib/reducedMotion';
import './GarlandTie.css';

const END_WIDTH = 56;
const EDGE_GAP = 10;
const SNAP_THRESHOLD = 46;

function MarigoldCluster() {
  return (
    <svg viewBox="0 0 56 56" aria-hidden="true">
      {[
        [16, 18],
        [30, 14],
        [22, 30],
        [38, 28],
        [28, 42],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i === 2 ? 10 : 8} fill={i % 2 ? '#f5c184' : '#e0703a'} opacity={0.95} />
      ))}
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
        <div className="garland-string" />
        <div className="garland-end garland-end-left">
          <MarigoldCluster />
        </div>
        <div
          className={`garland-end garland-end-right${dragging ? ' dragging' : ''}${tied ? ' tied' : ''}`}
          style={rightStyle}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <MarigoldCluster />
        </div>
        {tied && <span className="garland-knot">🪢</span>}
      </div>
      <div className="garland-label">{tied ? 'Gathbandhan tied! 🪢' : 'Drag the garland ends together'}</div>
    </div>
  );
}
