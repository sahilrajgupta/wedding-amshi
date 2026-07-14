import type { WeddingEvent } from '../data/events';
import ScratchReveal from './ScratchReveal';
import TeamPick from './games/TeamPick';
import { downloadIcs, googleCalendarUrl } from '../lib/calendar';
import Reveal from './Reveal';
import './EventCard.css';

const REVEAL_COLORS: Record<string, [string, string, string]> = {
  haldi: ['#f0b184', '#f6c9a8', '#e6c584'],
  'mehendi-sangeet': ['#b8d4b0', '#f3b6c2', '#c9b6e0'],
  wedding: ['#c9b6e0', '#a9c8e0', '#f3b6c2'],
};

export default function EventCard({ event }: { event: WeddingEvent }) {
  const calendarInput = {
    title: event.title,
    description: event.lede,
    location: event.location,
    start: event.start,
    end: event.end,
  };

  return (
    <Reveal className="event">
      <div className="ev-img">
        <ScratchReveal
          scratchLabel="✦ scratch to reveal ✦"
          colors={REVEAL_COLORS[event.id] ?? ['#f6c9a8', '#f3b6c2', '#c9b6e0']}
          aspectRatio="4/5"
        >
          <img src={event.image} alt={event.imageAlt} />
        </ScratchReveal>
      </div>
      <div className="ev-body">
        <div className="tag">{event.tag}</div>
        <h3>{event.title}</h3>
        <div className="when">{event.when}</div>
        <div className="lede">{event.lede}</div>
        <dl>
          {event.details.map((d) => (
            <div className="dl-row" key={d.term}>
              <dt>{d.term}</dt>
              <dd>{d.desc}</dd>
            </div>
          ))}
        </dl>
        <div className="quirk">{event.quirk}</div>

        <div className="ev-actions">
          <button type="button" className="btn-cal" onClick={() => downloadIcs(calendarInput)}>
            ⬇ Add to Calendar (.ics)
          </button>
          <a className="btn-cal btn-cal-google" href={googleCalendarUrl(calendarInput)} target="_blank" rel="noopener noreferrer">
            + Google Calendar
          </a>
        </div>

        {event.id === 'haldi' && <TeamPick />}
        {event.id === 'mehendi-sangeet' && (
          <a className="dhol-teaser" href="#dhol">
            🥁 Warm up for the Sangeet — tap the dhol below ↓
          </a>
        )}
      </div>
    </Reveal>
  );
}
