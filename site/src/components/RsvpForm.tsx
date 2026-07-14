import { useState, type FormEvent } from 'react';
import { config, isPlaceholder } from '../config';
import { useRsvp } from '../context/RsvpContext';
import { buildWhatsappUrl } from '../lib/whatsapp';
import { logRsvpToSheet } from '../lib/sheet';
import Reveal from './Reveal';
import DiyasLayer from './ambient/DiyasLayer';
import './RsvpForm.css';

export default function RsvpForm() {
  const { teamPick, travelOption, wantsTrainCoach } = useRsvp();
  const [name, setName] = useState('');
  const [headcount, setHeadcount] = useState('1');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const deadline = new Date(config.rsvpDeadline).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = { name: name.trim(), headcount, message, teamPick, travelOption, wantsTrainCoach };

    // Fire the Sheet log without blocking the WhatsApp hand-off.
    void logRsvpToSheet(payload);

    if (!isPlaceholder.whatsapp) {
      const url = buildWhatsappUrl(config.whatsappPhone, payload);
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
              <label htmlFor="rsvp-message">A note for the couple (optional)</label>
              <textarea
                id="rsvp-message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Song requests, dietary notes, blessings…"
              />
            </div>

            {(teamPick || travelOption) && (
              <div className="rsvp-summary">
                {teamPick && <span>Team: {teamPick === 'ladki' ? 'Ladki Wale 🌸' : 'Ladke Wale 💪'}</span>}
                {travelOption && <span>Travel: {travelOption.replace(/-/g, ' ')}</span>}
              </div>
            )}

            <button type="submit" className="btn-whatsapp" disabled={isPlaceholder.whatsapp}>
              {isPlaceholder.whatsapp ? 'WhatsApp number not set yet' : '💬 Send RSVP on WhatsApp'}
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
