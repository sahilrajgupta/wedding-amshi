import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from '../lib/reducedMotion';
import './ScratchReveal.css';

interface ScratchRevealProps {
  children: ReactNode;
  scratchLabel?: string;
  brushRadius?: number;
  clearThreshold?: number;
  /** Fixed pixel height (e.g. the hero date box). Omit to use aspectRatio instead. */
  height?: number;
  /** CSS aspect-ratio (e.g. '4/5') for image-shaped reveals that should fill their width. */
  aspectRatio?: string;
  onRevealed?: () => void;
  colors?: [string, string, string];
}

export default function ScratchReveal({
  children,
  scratchLabel = '✦  swipe to reveal  ✦',
  brushRadius = 26,
  clearThreshold = 0.5,
  height,
  aspectRatio,
  onRevealed,
  colors = ['#f2acc6', '#f7c6a6', '#cba7e2'],
}: ScratchRevealProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paintingRef = useRef(false);
  const doneRef = useRef(false);
  const reduced = useReducedMotion();
  const [done, setDone] = useState(reduced);

  useEffect(() => {
    if (reduced) {
      setDone(true);
      onRevealed?.();
      return;
    }

    const box = boxRef.current;
    const cv = canvasRef.current;
    if (!box || !cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    function size() {
      if (!box || !cv || !ctx) return;
      const r = box.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      cv.width = r.width * dpr;
      cv.height = r.height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      const g = ctx.createLinearGradient(0, 0, r.width, r.height);
      g.addColorStop(0, colors[0]);
      g.addColorStop(0.5, colors[1]);
      g.addColorStop(1, colors[2]);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, r.width, r.height);
      ctx.fillStyle = 'rgba(74,63,77,.55)';
      ctx.font = 'italic 18px Corm, serif';
      ctx.textAlign = 'center';
      ctx.fillText(scratchLabel, r.width / 2, r.height / 2 + 6);
    }

    function pos(e: MouseEvent | TouchEvent) {
      const r = cv!.getBoundingClientRect();
      const p = 'touches' in e ? e.touches[0] : e;
      return { x: p.clientX - r.left, y: p.clientY - r.top };
    }

    function check() {
      if (!cv || !ctx) return;
      const img = ctx.getImageData(0, 0, cv.width, cv.height).data;
      let clear = 0;
      let total = 0;
      for (let i = 3; i < img.length; i += 64) {
        total++;
        if (img[i] === 0) clear++;
      }
      if (clear / total > clearThreshold && !doneRef.current) {
        doneRef.current = true;
        setDone(true);
        onRevealed?.();
      }
    }

    function scratch(e: MouseEvent | TouchEvent) {
      if (!paintingRef.current || doneRef.current || !ctx) return;
      const { x, y } = pos(e);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
      ctx.fill();
      check();
    }

    const start = (e: MouseEvent | TouchEvent) => {
      paintingRef.current = true;
      scratch(e);
    };
    const end = () => {
      paintingRef.current = false;
    };
    const onResize = () => {
      if (!doneRef.current) size();
    };
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      start(e);
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      scratch(e);
    };

    size();
    window.addEventListener('resize', onResize);
    cv.addEventListener('mousedown', start);
    cv.addEventListener('mousemove', scratch);
    window.addEventListener('mouseup', end);
    cv.addEventListener('touchstart', onTouchStart, { passive: false });
    cv.addEventListener('touchmove', onTouchMove, { passive: false });
    cv.addEventListener('touchend', end);

    return () => {
      window.removeEventListener('resize', onResize);
      cv.removeEventListener('mousedown', start);
      cv.removeEventListener('mousemove', scratch);
      window.removeEventListener('mouseup', end);
      cv.removeEventListener('touchstart', onTouchStart);
      cv.removeEventListener('touchmove', onTouchMove);
      cv.removeEventListener('touchend', end);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return (
    <div
      className={`scratch-reveal${done ? ' done' : ''}`}
      style={{ height, aspectRatio }}
      ref={boxRef}
    >
      <div className="scratch-under">{children}</div>
      <canvas ref={canvasRef} />
    </div>
  );
}
