import { useRsvp } from '../../context/RsvpContext';
import './TeamPick.css';

export default function TeamPick() {
  const { teamPick, setTeamPick } = useRsvp();

  return (
    <div className="team-pick">
      <div className="team-pick-label">Pick your side for the Haldi showdown</div>
      <div className="team-pick-options">
        <button
          type="button"
          className={`team-btn team-ladki${teamPick === 'ladki' ? ' active' : ''}`}
          onClick={() => setTeamPick(teamPick === 'ladki' ? null : 'ladki')}
          aria-pressed={teamPick === 'ladki'}
        >
          🌸 Team Ladki Wale
        </button>
        <button
          type="button"
          className={`team-btn team-ladke${teamPick === 'ladke' ? ' active' : ''}`}
          onClick={() => setTeamPick(teamPick === 'ladke' ? null : 'ladke')}
          aria-pressed={teamPick === 'ladke'}
        >
          💪 Team Ladke Wale
        </button>
      </div>
      {teamPick && (
        <p className="team-pick-confirm">
          You're riding with {teamPick === 'ladki' ? 'Team Ladki Wale 🌸' : 'Team Ladke Wale 💪'} — noted for your RSVP.
        </p>
      )}
    </div>
  );
}
