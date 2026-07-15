import { config, isPlaceholder } from '../config';
import { useRsvp, type TravelOption } from '../context/RsvpContext';
import Reveal from './Reveal';
import './GettingThere.css';

const OPTIONS: { id: TravelOption; title: string; body: string; tag: string; icon: string; accent: string }[] = [
  {
    id: 'train-coach-patna',
    tag: 'From Patna · 16 Jan, afternoon',
    icon: '🚂',
    accent: 'blue',
    title: 'Ride the wedding train',
    body: "We've booked an entire coach from Patna — antakshari, chai, and far too many snacks, all the way to Corbett. Come with the whole gang; it's already half the fun.",
  },
  {
    id: 'train-moradabad',
    tag: 'Via Moradabad · ~2 hr drive',
    icon: '🚆',
    accent: 'turquoise',
    title: 'Train, then a short drive',
    body: "Take any train to Moradabad, then an easy two-hour drive through the foothills to the resort. Tell us your arrival and we'll help sort a car.",
  },
  {
    id: 'road-delhi',
    tag: '~6–7 hours by road',
    icon: '🚗',
    accent: 'orange',
    title: 'Road trip from Delhi',
    body: 'Straight up from Delhi — a long, scenic drive that ends with the Kosi on one side and the forest on the other. Pack a playlist.',
  },
];

export default function GettingThere() {
  const { travelOption, setTravelOption, wantsTrainCoach, setWantsTrainCoach } = useRsvp();

  return (
    <section id="getting-there" className="section-cream">
      <div className="wrap">
        <Reveal className="section-title">
          <span className="eyebrow">Getting there</span>
          <h2>Three ways to the river</h2>
          <p>However you come, come early. The jungle is worth the journey.</p>
        </Reveal>

        <div className="travel-options">
          {OPTIONS.map((opt) => (
            <Reveal key={opt.id} className={`travel-card-wrap accent-${opt.accent}`}>
              <button
                type="button"
                className={`travel-card${travelOption === opt.id ? ' active' : ''}`}
                onClick={() => setTravelOption(travelOption === opt.id ? null : opt.id)}
                aria-pressed={travelOption === opt.id}
              >
                <div className="travel-icon">{opt.icon}</div>
                <div className="travel-title">{opt.title}</div>
                <div className="travel-tag">{opt.tag}</div>
                <div className="travel-body">{opt.body}</div>
                {opt.id === 'train-coach-patna' && (
                  <span
                    className={`btn-count-me-in${wantsTrainCoach ? ' active' : ''}`}
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      setWantsTrainCoach(!wantsTrainCoach);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.stopPropagation();
                        setWantsTrainCoach(!wantsTrainCoach);
                      }
                    }}
                  >
                    {wantsTrainCoach ? "✓ Count me in" : 'Count me in'}
                  </span>
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
          <div className="venue-block">
            <div className="venue-name">{config.venueName}</div>
            <div className="venue-region">{config.venueRegion}</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
