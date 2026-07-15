import { config } from '../config';
import FirefliesLayer from './ambient/FirefliesLayer';
import './Footer.css';

export default function Footer() {
  return (
    <footer id="footer">
      <FirefliesLayer count={10} />
      <div className="hash">{config.hashtag}</div>
      <div className="love">With all our love — {config.names}</div>
      <div className="div-f divider" />
      <div className="trip">
        Getting there: fly into Delhi (≈6 hr drive) or Pantnagar (≈1.5 hr), or train to Ramnagar.
        We'll share travel &amp; stay details with your RSVP.
      </div>
      <div className="meta">
        {config.venueName}
        <br />
        {config.venueRegion}
        <br />
        17 – 18 January 2027
      </div>
    </footer>
  );
}
