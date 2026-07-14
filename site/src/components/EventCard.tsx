import type { WeddingEvent } from '../data/events';
import TeamPick from './games/TeamPick';
import { downloadIcs, googleCalendarUrl } from '../lib/calendar';
import Reveal from './Reveal';
import './EventCard.css';

const ROW_STAGGER = 0.12;

export default function EventCard({ event }: { event: WeddingEvent }) {
  const calendarInput = {
    title: event.title,
    description: event.lede,
    location: event.location,
    start: event.start,
    end: event.end,
  };

  const detailsDelay = event.details.length * ROW_STAGGER;

  return (
    <div className="event">
      <Reveal variant="soft">
        <div className="tag">{event.tag}</div>
        <h3>{event.title}</h3>
        <div className="when">{event.when}</div>
        <div className="lede">{event.lede}</div>
      </Reveal>

      <dl>
        {event.details.map((d, i) => (
          <Reveal key={d.term} delay={i * ROW_STAGGER} className="dl-row">
            <dt>{d.term}</dt>
            <dd>{d.desc}</dd>
          </Reveal>
        ))}
      </dl>

      <Reveal delay={detailsDelay}>
        <div className="quirk">{event.quirk}</div>
      </Reveal>

      <Reveal delay={detailsDelay + 0.12}>
        <div className="ev-actions">
          <button type="button" className="btn-cal" onClick={() => downloadIcs(calendarInput)}>
            ⬇ Add to Calendar (.ics)
          </button>
          <a
            className="btn-cal btn-cal-google"
            href={googleCalendarUrl(calendarInput)}
            target="_blank"
            rel="noopener noreferrer"
          >
            + Google Calendar
          </a>
        </div>

        {event.id === 'haldi' && <TeamPick />}
        {event.id === 'mehendi-sangeet' && (
          <a className="dhol-teaser" href="#dhol">
            🥁 Warm up for the Sangeet — tap the dhol below ↓
          </a>
        )}
      </Reveal>

      {/* The photo is deliberately last in both DOM order and reveal delay —
          it's the payoff once every detail has had its turn, not a
          side-by-side element that pops before you've scrolled to it. */}
      <Reveal delay={detailsDelay + 0.3} className="ev-img">
        <img src={event.image} alt={event.imageAlt} />
      </Reveal>
    </div>
  );
}
