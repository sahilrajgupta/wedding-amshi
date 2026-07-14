import { useRsvp } from '../context/RsvpContext';
import './TeamHueOverlay.css';

export default function TeamHueOverlay() {
  const { teamPick } = useRsvp();
  return <div className={`team-hue${teamPick ? ` team-hue-${teamPick}` : ''}`} aria-hidden="true" />;
}
