import { useReducedMotion } from '../../lib/reducedMotion';
import './DiyasLayer.css';

export default function DiyasLayer({ count = 6 }: { count?: number }) {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <div className="diyas-layer" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="diya"
          style={{
            left: `${(100 / count) * i + Math.random() * 6}%`,
            animationDelay: `${(i % 4) * 0.7}s`,
          }}
        >
          🪔
        </span>
      ))}
    </div>
  );
}
