let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext })
    .webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

// A handful of pitch/decay presets so consecutive taps don't sound identical
// — like hitting different spots on the dhol — without needing audio assets.
const VOICES = [
  { freqStart: 165, freqEnd: 55, duration: 0.22 },
  { freqStart: 145, freqEnd: 48, duration: 0.26 },
  { freqStart: 185, freqEnd: 62, duration: 0.19 },
  { freqStart: 130, freqEnd: 42, duration: 0.28 },
];
let lastVoice = -1;

export function playDholHit() {
  const audioCtx = getContext();
  if (!audioCtx) return;

  let idx = Math.floor(Math.random() * VOICES.length);
  if (idx === lastVoice) idx = (idx + 1) % VOICES.length;
  lastVoice = idx;
  const voice = VOICES[idx];

  const now = audioCtx.currentTime;

  // Body: an oscillator with a fast downward pitch sweep, classic synthesized-drum thump.
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(voice.freqStart, now);
  osc.frequency.exponentialRampToValueAtTime(voice.freqEnd, now + voice.duration * 0.85);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.55, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + voice.duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + voice.duration + 0.02);

  // Transient: a short burst of filtered noise for the "skin slap" attack.
  const bufferSize = Math.floor(audioCtx.sampleRate * 0.05);
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const noiseFilter = audioCtx.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.value = 1800;
  const noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(0.18, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(audioCtx.destination);
  noise.start(now);
}
