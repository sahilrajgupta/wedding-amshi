import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { storyStops } from '../data/story';
import { config } from '../config';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import './StoryDetailPage.css';

export default function StoryDetailPage() {
  const { slug } = useParams();
  const index = storyStops.findIndex((s) => s.slug === slug);

  if (index === -1) return <Navigate to="/#story" replace />;

  const stop = storyStops[index];
  const prev = storyStops[index - 1];
  const next = storyStops[index + 1];

  return (
    <div className="story-detail">
      <div className="story-detail-nav wrap">
        <Link to="/" className="story-detail-mono">
          {config.monogram}
        </Link>
        <Link to="/#story" className="story-detail-back">
          ← Back to the story
        </Link>
      </div>

      <header className="story-detail-hero wrap">
        <motion.div
          className="story-detail-icon"
          initial={{ scale: 0.5, opacity: 0, rotate: -8 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 160, damping: 14 }}
        >
          {stop.icon}
        </motion.div>
        <div className="eyebrow">{stop.year}</div>
        <h1>{stop.city}</h1>
        <p className="story-detail-note">{stop.note}</p>
      </header>

      <div className="story-detail-body wrap">
        {stop.details.map((paragraph, i) => (
          <Reveal key={i} delay={i * 0.08} variant="soft">
            <p>{paragraph}</p>
          </Reveal>
        ))}
      </div>

      <nav className="story-detail-pager wrap">
        {prev ? (
          <Link to={`/story/${prev.slug}`} className="pager-link pager-prev">
            <span className="pager-label">← Previous</span>
            <span className="pager-title">{prev.city}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/story/${next.slug}`} className="pager-link pager-next">
            <span className="pager-label">Next →</span>
            <span className="pager-title">{next.city}</span>
          </Link>
        ) : (
          <Link to="/#weekend" className="pager-link pager-next">
            <span className="pager-label">Next →</span>
            <span className="pager-title">The Weekend</span>
          </Link>
        )}
      </nav>

      <Footer />
    </div>
  );
}
