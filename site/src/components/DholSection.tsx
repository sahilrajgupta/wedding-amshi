import TapTheDhol from './games/TapTheDhol';
import DiyasLayer from './ambient/DiyasLayer';
import Reveal from './Reveal';
import './DholSection.css';

export default function DholSection() {
  return (
    <section id="dhol" className="dhol-section">
      <DiyasLayer count={5} />
      <div className="wrap">
        <Reveal className="section-title">
          <span className="eyebrow">Warm up your hands</span>
          <h2>Tap the Dhol</h2>
          <p>How loud can you get the Sangeet before the band even starts?</p>
        </Reveal>
        <Reveal delay={0.1}>
          <TapTheDhol />
        </Reveal>
      </div>
    </section>
  );
}
