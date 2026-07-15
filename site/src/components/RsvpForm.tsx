import { useState, type FormEvent } from 'react';
import { config } from '../config';
import { useRsvp } from '../context/RsvpContext';
import { buildWhatsappUrl, pickWhatsappNumber } from '../lib/whatsapp';
import { logRsvpToSheet } from '../lib/sheet';
import Reveal from './Reveal';
import DiyasLayer from './ambient/DiyasLayer';
import './RsvpForm.css';

// Finer-grained than data/events.ts's three cards on purpose — some guests
// only make it to one half of the Mehendi/Sangeet evening.
const CELEBRATIONS = [
  { id: 'haldi', label: 'Haldi' },
  { id: 'mehendi', label: 'Mehendi' },
  { id: 'sangeet', label: 'Sangeet' },
  { id: 'wedding', label: 'The Wedding' },
];

export default function RsvpForm() {
  const { teamPick, travelOption, wantsTrainCoach, setWantsTrainCoach } = useRsvp();
  const [name, setName] = useState('');
  const [attending, setAttending] = useState<'yes' | 'no' | null>(null);
  const [celebrations, setCelebrations] = useState<string[]>([]);
  const [headcount, setHeadcount] = useState('1');
  const [contact, setContact] = useState('');
  const [songRequest, setSongRequest] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const deadline = new Date(config.rsvpDeadline).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  });

  const whatsappNumber = pickWhatsappNumber(teamPick);

  function toggleCelebration(id: string) {
    setCelebrations((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !attending) return;

    const payload = {
      name: name.trim(),
      attending,
      celebrations,
      headcount,
      contact: contact.trim(),
      songRequest: songRequest.trim(),
      message,
      teamPick,
      travelOption,
      wantsTrainCoach,
    };

    // Fire the Sheet log without blocking the WhatsApp hand-off.
    void logRsvpToSheet(payload);

    if (whatsappNumber) {
      const url = buildWhatsappUrl(whatsappNumber, payload);
      window.open(url, '_blank', 'noopener');
      setSent(true);
    }
  }

  return (
    <section id="rsvp" className="section-cream">
      <DiyasLayer count={4} />
      <div className="wrap">
        <Reveal className="section-title">
          <span className="eyebrow">Kindly respond</span>
          <h2>Will you join us by the river?</h2>
          <p>A quick yes means a warm bed, good food, and your song on the Sangeet playlist.</p>
        </Reveal>

        <Reveal className="rsvp-card">
          <form onSubmit={handleSubmit}>
            <div className="rsvp-field">
              <label htmlFor="rsvp-name">Your name</label>
              <input
                id="rsvp-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Sharma"
              />
            </div>

            <div className="rsvp-field">
              <label>Will you attend?</label>
              <div className="rsvp-attend-row">
                <button
                  type="button"
                  className={`rsvp-attend-btn${attending === 'yes' ? ' active yes' : ''}`}
                  onClick={() => setAttending('yes')}
                  aria-pressed={attending === 'yes'}
                >
                  Joyfully yes
                </button>
                <button
                  type="button"
                  className={`rsvp-attend-btn${attending === 'no' ? ' active no' : ''}`}
                  onClick={() => setAttending('no')}
                  aria-pressed={attending === 'no'}
                >
                  Regretfully no
                </button>
              </div>
            </div>

            {attending === 'yes' && (
              <>
                <div className="rsvp-field">
                  <label>Which celebrations? (tap all that apply)</label>
                  <div className="rsvp-chips">
                    {CELEBRATIONS.map((c) => (
                      <button
                        type="button"
                        key={c.id}
                        className={`rsvp-chip${celebrations.includes(c.id) ? ' active' : ''}`}
                        onClick={() => toggleCelebration(c.id)}
                        aria-pressed={celebrations.includes(c.id)}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rsvp-field">
                  <label htmlFor="rsvp-headcount">Number of guests</label>
                  <input
                    id="rsvp-headcount"
                    type="number"
                    min={1}
                    value={headcount}
                    onChange={(e) => setHeadcount(e.target.value)}
                  />
                </div>

                <div className="rsvp-field">
                  <label>Coming on the wedding train from Patna?</label>
                  <button
                    type="button"
                    className={`rsvp-train-btn${wantsTrainCoach ? ' active' : ''}`}
                    onClick={() => setWantsTrainCoach(!wantsTrainCoach)}
                    aria-pressed={wantsTrainCoach}
                  >
                    🚂 {wantsTrainCoach ? "Count me in — I'm on the train!" : 'Count me in'}
                  </button>
                </div>

                <div className="rsvp-field">
                  <label htmlFor="rsvp-contact">Phone or email</label>
                  <input
                    id="rsvp-contact"
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="So we can send travel & stay details"
                  />
                </div>

                <div className="rsvp-field">
                  <label htmlFor="rsvp-song">A song for the Sangeet</label>
                  <input
                    id="rsvp-song"
                    type="text"
                    value={songRequest}
                    onChange={(e) => setSongRequest(e.target.value)}
                    placeholder="The one that gets you on the floor"
                  />
                </div>
              </>
            )}

            <div className="rsvp-field">
              <label htmlFor="rsvp-message">A message or blessing</label>
              <textarea
                id="rsvp-message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Say something lovely (or roast us, we don't mind)"
              />
            </div>

            {(teamPick || travelOption) && (
              <div className="rsvp-summary">
                {teamPick && <span>Team: {teamPick === 'ladki' ? 'Ladki Wale 🌼' : 'Ladke Wale 👳'}</span>}
                {travelOption && <span>Travel: {travelOption.replace(/-/g, ' ')}</span>}
              </div>
            )}

            <button type="submit" className="btn-whatsapp" disabled={!whatsappNumber}>
              {!whatsappNumber ? 'WhatsApp number not set yet' : '💬 Send RSVP on WhatsApp'}
            </button>
            {sent && <p className="rsvp-sent">Thank you! We've noted your RSVP.</p>}

            <p className="rsvp-routing-note">
              Your pick of Team Ladki or Team Ladke sends this to the right side of the family. Prefer to call?
              Ring us any time.
            </p>
          </form>
        </Reveal>

        <Reveal>
          <p className="rsvp-deadline-badge">Kindly reply by {deadline}</p>
        </Reveal>
        <Reveal>
          <p className="rsvp-note">
            We're counting beds, hampers and train berths — an early yes helps us more than you know. 🌸
          </p>
        </Reveal>
      </div>
    </section>
  );
}
