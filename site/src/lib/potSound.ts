let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext })
    .webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function noiseBurst(
  audioCtx: AudioContext,
  now: number,
  { duration, freq, q, gain }: { duration: number; freq: number; q: number; gain: number }
) {
  const bufferSize = Math.floor(audioCtx.sampleRate * duration);
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = freq;
  filter.Q.value = q;
  const noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(gain, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(audioCtx.destination);
  noise.start(now);
}

/** A dry clay "knock" — for the first couple of matka whacks, before it breaks. */
export function playPotKnock() {
  const audioCtx = getContext();
  if (!audioCtx) return;
  const now = audioCtx.currentTime;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(310, now);
  osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.4, now + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + 0.14);

  noiseBurst(audioCtx, now, { duration: 0.06, freq: 2400, q: 1.2, gain: 0.15 });
}

/** A layered shatter/burst — for the final hit that breaks the matka open. */
export function playPotBreak() {
  const audioCtx = getContext();
  if (!audioCtx) return;
  const now = audioCtx.currentTime;

  // Low thud of the pot tipping.
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.exponentialRampToValueAtTime(60, now + 0.3);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.5, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + 0.36);

  // Shattering texture — a few staggered noise bursts across different bands.
  noiseBurst(audioCtx, now, { duration: 0.22, freq: 3200, q: 0.8, gain: 0.35 });
  noiseBurst(audioCtx, now + 0.02, { duration: 0.18, freq: 5200, q: 1.4, gain: 0.25 });
  noiseBurst(audioCtx, now + 0.05, { duration: 0.14, freq: 1800, q: 1, gain: 0.2 });
}
