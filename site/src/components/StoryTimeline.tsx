import { Link } from 'react-router-dom';
import { storyStops, storyIntro, storyConstant } from '../data/story';
import Reveal from './Reveal';
import './StoryTimeline.css';

export default function StoryTimeline() {
  return (
    <section id="story" className="section-cream">
      <div className="wrap">
        <Reveal className="section-title">
          <span className="eyebrow">{storyIntro.eyebrow}</span>
          <h2>{storyIntro.title}</h2>
          <p>{storyIntro.sub}</p>
        </Reveal>

        <div className="timeline">
          {storyStops.map((stop) => (
            <Reveal key={stop.slug} className={`stop${stop.final ? ' final' : ''}`}>
              <span className="dot" />
              <Link to={`/story/${stop.slug}`} className="stop-link">
                <div className="yr">{stop.year}</div>
                <div className="city">
                  {stop.icon} {stop.city}
                </div>
                <div className="note">{stop.note}</div>
                <span className="stop-cta">Read the story →</span>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="constant">{storyConstant}</p>
        </Reveal>
      </div>
    </section>
  );
}
