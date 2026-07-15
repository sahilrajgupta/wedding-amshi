import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { config } from '../config';
import ScratchReveal from './ScratchReveal';
import FirefliesLayer from './ambient/FirefliesLayer';
import { useReducedMotion } from '../lib/reducedMotion';
import './Hero.css';

export default function Hero({ entered = true }: { entered?: boolean }) {
  const heroRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  // Same "capture once at mount" trick as HomePage's skipEnvelope: if the
  // page was already entered before this Hero instance existed (returning
  // from a story page), skip the delayed bloom-in entirely instead of
  // sitting invisible for ~2.3s waiting on a delay meant for the envelope.
  const [instantEntered] = useState(entered);

  const contentY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const hillsY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const hillsScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <header className="hero" id="home" ref={heroRef}>
      <FirefliesLayer className="hero-lights" count={16} />
      <motion.svg
        className="hero-hills"
        viewBox="0 0 1440 320"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
        style={reduced ? undefined : { y: hillsY, scale: hillsScale }}
      >
        <defs>
          <linearGradient id="hill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e6d6ea" />
            <stop offset="1" stopColor="#cfe0d6" />
          </linearGradient>
          <linearGradient id="river" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#eaf1ec" />
            <stop offset="1" stopColor="#cfe3e0" />
          </linearGradient>
        </defs>
        <path
          d="M0,190 C260,120 420,150 720,150 C1010,150 1180,110 1440,180 L1440,320 L0,320 Z"
          fill="url(#hill)"
          opacity="0.6"
        />
        <path d="M540,320 C620,230 820,230 900,320 Z" fill="url(#river)" opacity="0.85" />
        <g fill="#b8cdb0" opacity="0.9">
          <path d="M0,320 C60,250 90,250 120,220 C150,250 180,250 240,320 Z" />
          <path d="M120,320 C170,240 210,250 250,210 C290,250 330,255 380,320 Z" opacity="0.85" />
          <path d="M1440,320 C1380,250 1350,250 1320,220 C1290,250 1260,250 1200,320 Z" />
          <path d="M1320,320 C1270,240 1230,250 1190,210 C1150,250 1110,255 1060,320 Z" opacity="0.85" />
        </g>
      </motion.svg>

      <motion.div
        className="hero-entrance"
        initial={reduced || instantEntered ? false : { opacity: 0, scale: 0.94 }}
        animate={entered || reduced ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: reduced || instantEntered ? 0 : 2.3 }}
      >
        <motion.div
          className="hero-content"
          style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
        >
          <div className="blessing">॥ श्री गणेशाय नमः ॥</div>
          <div className="eyebrow">Save Our Forever</div>
          <h1 className="hero-names">{config.names}</h1>
          <div className="hero-sub">are getting married</div>
          <div className="hero-place">
            {config.venueName} · {config.venueRegion}
          </div>

          <ScratchReveal scratchLabel="✦ swipe the gold ✦" colors={['#f7c6a6', '#f2acc6', '#cba7e2']}>
            <div className="hero-date">17–18 January 2027</div>
            <div className="hero-verse">two days by the river · come as you are, leave as family</div>
          </ScratchReveal>
          <div className="reveal-hint">✦ swipe the gold to unveil ✦</div>

          <div className="scrollcue">⌄</div>
        </motion.div>
      </motion.div>
    </header>
  );
}
