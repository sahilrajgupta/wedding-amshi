let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext })
    .webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

/** A soft ascending three-note chime — plays once the scratch box fully clears. */
export function playRevealChime() {
  const audioCtx = getContext();
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const notes = [660, 880, 1320]; // E5, A5, E6 — bright, not jarring

  notes.forEach((freq, i) => {
    const start = now + i * 0.09;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.22, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.5);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(start);
    osc.stop(start + 0.52);
  });

  // A faint high shimmer under the notes for sparkle.
  const shimmer = audioCtx.createOscillator();
  const shimmerGain = audioCtx.createGain();
  shimmer.type = 'triangle';
  shimmer.frequency.setValueAtTime(2200, now);
  shimmerGain.gain.setValueAtTime(0.0001, now);
  shimmerGain.gain.exponentialRampToValueAtTime(0.05, now + 0.03);
  shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
  shimmer.connect(shimmerGain);
  shimmerGain.connect(audioCtx.destination);
  shimmer.start(now);
  shimmer.stop(now + 0.62);
}
