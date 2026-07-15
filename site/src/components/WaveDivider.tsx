import './WaveDivider.css';

export default function WaveDivider({
  from = 'var(--paper)',
  to = 'var(--cream)',
  flip = false,
}: {
  from?: string;
  to?: string;
  flip?: boolean;
}) {
  return (
    <div className="wave-divider" style={{ background: from }} aria-hidden="true">
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        style={flip ? { transform: 'scaleY(-1)' } : undefined}
      >
        <path
          d="M0,30 C240,60 480,0 720,20 C960,40 1200,10 1440,30 L1440,60 L0,60 Z"
          fill={to}
        />
      </svg>
    </div>
  );
}
