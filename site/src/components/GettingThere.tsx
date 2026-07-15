import { config, isPlaceholder } from '../config';
import { useRsvp, type TravelOption } from '../context/RsvpContext';
import Reveal from './Reveal';
import './GettingThere.css';

const OPTIONS: { id: TravelOption; title: string; body: string; tag: string; icon: string }[] = [
  {
    id: 'train-coach-patna',
    tag: 'Ride with us',
    icon: '🚂',
    title: 'The wedding train from Patna',
    body: "We've booked a full family coach from Patna, departing the afternoon of 16 January — hop on and arrive together.",
  },
  {
    id: 'train-moradabad',
    tag: 'By rail',
    icon: '🚆',
    title: 'Train to Moradabad',
    body: 'Take a train into Moradabad, then it\'s about a 2-hour drive to the resort — we can help arrange the last leg.',
  },
  {
    id: 'road-delhi',
    tag: 'By road',
    icon: '🚗',
    title: 'Road trip from Delhi',
    body: 'Drive straight from Delhi — roughly 6–7 hours through the hills, a scenic option if you\'re up for it.',
  },
];

export default function GettingThere() {
  const { travelOption, setTravelOption, wantsTrainCoach, setWantsTrainCoach } = useRsvp();

  return (
    <section id="getting-there" className="section-cream">
      <div className="wrap">
        <Reveal className="section-title">
          <span className="eyebrow">Three ways to reach the river</span>
          <h2>Getting There</h2>
          <p>However you arrive, we'll be waving from the riverbank.</p>
        </Reveal>

        <div className="travel-options">
          {OPTIONS.map((opt) => (
            <Reveal key={opt.id} className="travel-card-wrap">
              <button
                type="button"
                className={`travel-card${travelOption === opt.id ? ' active' : ''}`}
                onClick={() => setTravelOption(travelOption === opt.id ? null : opt.id)}
                aria-pressed={travelOption === opt.id}
              >
                <div className="travel-icon">{opt.icon}</div>
                <div className="travel-tag">{opt.tag}</div>
                <div className="travel-title">{opt.title}</div>
                <div className="travel-body">{opt.body}</div>
                {opt.id === 'train-coach-patna' && (
                  <label className="count-me-in" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={wantsTrainCoach}
                      onChange={(e) => setWantsTrainCoach(e.target.checked)}
                    />
                    Count me in for the coach
                  </label>
                )}
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal className="directions-wrap">
          <a
            className={`btn-directions${isPlaceholder.venueMapsLink ? ' is-placeholder' : ''}`}
            href={config.venueMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            title={
              isPlaceholder.venueMapsLink
                ? 'TODO: set VITE_VENUE_MAPS_LINK to a real Google Maps directions link'
                : undefined
            }
          >
            📍 Directions to {config.venueName}
            {isPlaceholder.venueMapsLink && <span className="todo-flag"> (link not set yet)</span>}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
