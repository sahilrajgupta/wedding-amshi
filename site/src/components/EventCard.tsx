import { useState } from 'react';
import type { WeddingEvent } from '../data/events';
import TeamPick from './games/TeamPick';
import MatkaWhack from './games/MatkaWhack';
import MiniDholTap from './games/MiniDholTap';
import GarlandTie from './games/GarlandTie';
import Modal from './Modal';
import { downloadIcs, googleCalendarUrl } from '../lib/calendar';
import { CELEBRATION_LABEL } from '../lib/whatsapp';
import Reveal from './Reveal';
import './EventCard.css';

const ROW_STAGGER = 0.1;

export default function EventCard({ event }: { event: WeddingEvent }) {
  const [unlocked, setUnlocked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const calendarInput = {
    title: event.title,
    description: event.lede,
    location: event.location,
    start: event.start,
    end: event.end,
  };

  return (
    <Reveal className={`event event-${event.id}`}>
      <div className="tag">{event.tag}</div>
      <h3>{CELEBRATION_LABEL[event.id] ?? event.title}</h3>
      <div className="when">{event.when}</div>

      <div className="event-mechanic">
        {/* Kept mounted (not conditionally removed) once unlocked, so the
            broken/tied/done illustration stays visible alongside the open
            button — matches the reference, don't gate this on !unlocked. */}
        {event.id === 'haldi' && <MatkaWhack onUnlock={() => setUnlocked(true)} />}
        {event.id === 'mehendi-sangeet' && <MiniDholTap onUnlock={() => setUnlocked(true)} />}
        {event.id === 'wedding' && <GarlandTie onUnlock={() => setUnlocked(true)} />}

        {unlocked && (
          <button type="button" className="btn-open-event" onClick={() => setModalOpen(true)}>
            Open the {CELEBRATION_LABEL[event.id] ?? event.title} →
          </button>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={event.title}>
        <Reveal variant="soft" className="ev-img">
          <img src={event.image} alt={event.imageAlt} />
        </Reveal>
        <Reveal variant="soft">
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

        <Reveal delay={event.details.length * ROW_STAGGER}>
          <div className="quirk">{event.quirk}</div>
        </Reveal>

        <Reveal delay={event.details.length * ROW_STAGGER + 0.1}>
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
            <a className="dhol-teaser" href="#dhol" onClick={() => setModalOpen(false)}>
              🥁 Keep the beat going — the full dhol game is below ↓
            </a>
          )}
        </Reveal>
      </Modal>
    </Reveal>
  );
}
