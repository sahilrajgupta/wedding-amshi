import { useState, type FormEvent } from 'react';
import { config } from '../config';
import { useRsvp } from '../context/RsvpContext';
import { buildWhatsappUrl, pickWhatsappNumber, CELEBRATION_LABEL } from '../lib/whatsapp';
import { logRsvpToSheet } from '../lib/sheet';
import { weddingEvents } from '../data/events';
import Reveal from './Reveal';
import DiyasLayer from './ambient/DiyasLayer';
import './RsvpForm.css';

export default function RsvpForm() {
  const { teamPick, travelOption, wantsTrainCoach } = useRsvp();
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
          <p>A quick yes means a warm seat, good food, and your song on the Sangeet playlist.</p>
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
              <label>Will you be joining us?</label>
              <div className="rsvp-attending">
                <button
                  type="button"
                  className={`rsvp-chip${attending === 'yes' ? ' active yes' : ''}`}
                  onClick={() => setAttending('yes')}
                  aria-pressed={attending === 'yes'}
                >
                  🎉 Joyfully, yes!
                </button>
                <button
                  type="button"
                  className={`rsvp-chip${attending === 'no' ? ' active no' : ''}`}
                  onClick={() => setAttending('no')}
                  aria-pressed={attending === 'no'}
                >
                  💔 Regretfully, no
                </button>
              </div>
            </div>

            {attending === 'yes' && (
              <>
                <div className="rsvp-field">
                  <label>Which celebrations?</label>
                  <div className="rsvp-chips">
                    {weddingEvents.map((ev) => (
                      <button
                        type="button"
                        key={ev.id}
                        className={`rsvp-chip${celebrations.includes(ev.id) ? ' active' : ''}`}
                        onClick={() => toggleCelebration(ev.id)}
                        aria-pressed={celebrations.includes(ev.id)}
                      >
                        {CELEBRATION_LABEL[ev.id] ?? ev.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rsvp-field">
                  <label htmlFor="rsvp-headcount">How many of you?</label>
                  <input
                    id="rsvp-headcount"
                    type="number"
                    min={1}
                    value={headcount}
                    onChange={(e) => setHeadcount(e.target.value)}
                  />
                </div>

                <div className="rsvp-field">
                  <label htmlFor="rsvp-contact">Phone or email</label>
                  <input
                    id="rsvp-contact"
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="For travel & stay details"
                  />
                </div>

                <div className="rsvp-field">
                  <label htmlFor="rsvp-song">Sangeet song request (optional)</label>
                  <input
                    id="rsvp-song"
                    type="text"
                    value={songRequest}
                    onChange={(e) => setSongRequest(e.target.value)}
                    placeholder="What gets you on the dance floor?"
                  />
                </div>
              </>
            )}

            <div className="rsvp-field">
              <label htmlFor="rsvp-message">A note for the couple (optional)</label>
              <textarea
                id="rsvp-message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Dietary notes, blessings…"
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
          </form>
        </Reveal>

        <Reveal>
          <p className="rsvp-note">
            Please respond by <strong>{deadline}</strong> · Questions about travel or stay? Ring the family — details
            below.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
