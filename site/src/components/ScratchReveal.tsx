import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from '../lib/reducedMotion';
import { playRevealChime } from '../lib/scratchSound';
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
  brushRadius = 36,
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
  const startedRef = useRef(false);
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
      // Anti-aliased stroke edges leave a soft alpha fringe that never hits
      // exactly 0 — requiring exact-zero alpha under-counted a box that
      // already looked fully scratched, so guests had to over-scratch well
      // past the visual "done" point to trip the threshold. Treat mostly-
      // transparent pixels as cleared too.
      for (let i = 3; i < img.length; i += 64) {
        total++;
        if (img[i] < 40) clear++;
      }
      if (clear / total > clearThreshold && !doneRef.current) {
        doneRef.current = true;
        setDone(true);
        playRevealChime();
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
      startedRef.current = true;
      paintingRef.current = true;
      scratch(e);
    };
    const end = () => {
      paintingRef.current = false;
    };
    const onResize = () => {
      // Once the user has started scratching, a resize (e.g. a mobile
      // browser's address bar collapsing on scroll/touch) must not wipe
      // progress by redrawing the whole canvas from scratch.
      if (!doneRef.current && !startedRef.current) size();
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

    // The box this canvas fills can still be mid-transform right after
    // mount — Hero wraps it in a delayed scale-in entrance animation, and
    // getBoundingClientRect() at mount time can catch it at the pre-animate
    // (smaller) scale. That would size the canvas's pixel buffer to the
    // wrong dimensions, permanently desyncing scratch coordinates and the
    // clear-area math from the box's true rendered size. A CSS transform
    // doesn't fire 'resize' or ResizeObserver, so re-measure on every frame
    // for a few seconds after mount and repaint whenever the size actually
    // changed, until it settles (or the guest starts scratching).
    let rafId = 0;
    let lastW = -1;
    let lastH = -1;
    const correctionDeadline = performance.now() + 4000;
    const correctionTick = () => {
      if (doneRef.current || startedRef.current) return;
      const r = box.getBoundingClientRect();
      if (Math.abs(r.width - lastW) > 0.5 || Math.abs(r.height - lastH) > 0.5) {
        lastW = r.width;
        lastH = r.height;
        size();
      }
      if (performance.now() < correctionDeadline) {
        rafId = requestAnimationFrame(correctionTick);
      }
    };
    rafId = requestAnimationFrame(correctionTick);

    window.addEventListener('resize', onResize);
    cv.addEventListener('mousedown', start);
    cv.addEventListener('mousemove', scratch);
    window.addEventListener('mouseup', end);
    cv.addEventListener('touchstart', onTouchStart, { passive: false });
    cv.addEventListener('touchmove', onTouchMove, { passive: false });
    cv.addEventListener('touchend', end);

    return () => {
      cancelAnimationFrame(rafId);
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
