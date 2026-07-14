import { weddingEvents, weekendIntro } from '../data/events';
import EventCard from './EventCard';
import Reveal from './Reveal';
import DiyasLayer from './ambient/DiyasLayer';

export default function WeekendEvents() {
  return (
    <section id="weekend">
      <DiyasLayer count={5} />
      <div className="wrap">
        <Reveal className="section-title">
          <span className="eyebrow">{weekendIntro.eyebrow}</span>
          <h2>{weekendIntro.title}</h2>
          <p>{weekendIntro.sub}</p>
        </Reveal>

        {weddingEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
