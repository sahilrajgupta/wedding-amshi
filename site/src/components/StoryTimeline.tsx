import { useRef, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { storyStops, storyIntro, storyConstant, type StoryStop } from '../data/story';
import Reveal from './Reveal';
import { useReducedMotion } from '../lib/reducedMotion';
import './StoryTimeline.css';

function TimelineStop({
  stop,
  index,
  total,
  progress,
  reduced,
}: {
  stop: StoryStop;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  // Each stop gets its own slice of the section's overall scroll progress,
  // with a little overlap so consecutive stops don't feel strictly sequential.
  const start = index / total;
  const end = (index + 0.6) / total;
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [22, 0]);

  return (
    <motion.div className={`stop${stop.final ? ' final' : ''}`} style={reduced ? undefined : { opacity, y }}>
      <span className="dot" />
      <Link to={`/story/${stop.slug}`} className="stop-link">
        <div className="yr">{stop.year}</div>
        <div className="city">
          {stop.icon} {stop.city}
        </div>
        <div className="note">{stop.note}</div>
        <span className="stop-cta">Read the story →</span>
      </Link>
    </motion.div>
  );
}

export default function StoryTimeline() {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start 0.85', 'end 0.4'] });

  return (
    <section id="story" className="section-cream section-lilac">
      <div className="wrap">
        <Reveal className="section-title">
          <span className="eyebrow">{storyIntro.eyebrow}</span>
          <h2>{storyIntro.title}</h2>
          <p>{storyIntro.sub}</p>
        </Reveal>

        <div className="timeline" ref={trackRef}>
          <div className="timeline-track">
            <div className="timeline-line-track" />
            <motion.div
              className="timeline-line-fill"
              style={reduced ? { transform: 'none' } : ({ '--progress': scrollYProgress } as CSSProperties)}
            />
            {storyStops.map((stop, i) => (
              <TimelineStop
                key={stop.slug}
                stop={stop}
                index={i}
                total={storyStops.length}
                progress={scrollYProgress}
                reduced={reduced}
              />
            ))}
          </div>
        </div>
        <Reveal>
          <p className="constant">{storyConstant}</p>
        </Reveal>
      </div>
    </section>
  );
}
