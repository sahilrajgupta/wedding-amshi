import './Toran.css';

const FLOWERS = 11;
// Quadratic bezier matching the string path below, so flowers hang exactly on the curve.
const P0 = 6;
const P1 = 74;
const P2 = 6;

function curveY(t: number) {
  return (1 - t) * (1 - t) * P0 + 2 * (1 - t) * t * P1 + t * t * P2;
}

export default function Toran() {
  return (
    <svg className="toran" viewBox="0 0 900 96" preserveAspectRatio="none" aria-hidden="true">
      <path d={`M0,${P0} Q450,${P1} 900,${P2}`} fill="none" stroke="var(--line)" strokeWidth="2" />
      {Array.from({ length: FLOWERS }).map((_, i) => {
        const t = i / (FLOWERS - 1);
        const x = t * 900;
        const y = curveY(t);
        const drop = 14 + (i % 3) * 7;
        return (
          <g key={i}>
            <line x1={x} y1={y} x2={x} y2={y + drop} stroke="var(--line)" strokeWidth="1.5" />
            <circle cx={x} cy={y + drop + 8} r={8} fill={i % 2 ? '#f5c184' : '#e0703a'} />
            <circle cx={x} cy={y + drop + 8} r={3.4} fill="#fbe6c8" />
          </g>
        );
      })}
    </svg>
  );
}
