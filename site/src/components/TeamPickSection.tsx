import { config } from '../config';
import { useRsvp } from '../context/RsvpContext';
import Reveal from './Reveal';
import './TeamPickSection.css';

// "Shikha & Amit" -> ["Shikha", "Amit"] — reuses the existing config value
// rather than adding new bride/groom-first-name placeholders.
const [brideName, groomName] = config.names.split(' & ');

export default function TeamPickSection() {
  const { teamPick, setTeamPick } = useRsvp();

  return (
    <section id="team-pick" className="section-cream section-mint">
      <div className="wrap">
        <Reveal className="section-title team-pick-title">
          <span className="eyebrow">A little friendly rivalry</span>
          <h2>Pick your side</h2>
          <p>The Corbett Olympics need teams. Your pick rides along with your RSVP.</p>
        </Reveal>

        <Reveal className="team-pick-row">
          <button
            type="button"
            className={`team-side-card team-side-ladki${teamPick === 'ladki' ? ' active' : ''}`}
            onClick={() => setTeamPick(teamPick === 'ladki' ? null : 'ladki')}
            aria-pressed={teamPick === 'ladki'}
          >
            <span className="team-side-icon">🌼</span>
            <span className="team-side-label">Team Ladki Wale</span>
            <span className="team-side-name">{brideName}</span>
          </button>

          <span className="team-side-vs">vs</span>

          <button
            type="button"
            className={`team-side-card team-side-ladke${teamPick === 'ladke' ? ' active' : ''}`}
            onClick={() => setTeamPick(teamPick === 'ladke' ? null : 'ladke')}
            aria-pressed={teamPick === 'ladke'}
          >
            <span className="team-side-icon">👳</span>
            <span className="team-side-label">Team Ladke Wale</span>
            <span className="team-side-name">{groomName}</span>
          </button>
        </Reveal>

        {teamPick && (
          <Reveal>
            <p className="team-pick-confirm">
              You're riding with {teamPick === 'ladki' ? 'Team Ladki Wale 🌼' : 'Team Ladke Wale 👳'} — noted for
              your RSVP.
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
