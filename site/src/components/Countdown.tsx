import { useEffect, useState } from 'react';
import { config } from '../config';
import Reveal from './Reveal';
import './Countdown.css';

interface Remaining {
  d: number;
  h: number;
  m: number;
  s: number;
  over: boolean;
}

function getRemaining(target: Date): Remaining {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, over: true };
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor(diff / 3600000) % 24,
    m: Math.floor(diff / 60000) % 60,
    s: Math.floor(diff / 1000) % 60,
    over: false,
  };
}

const pad = (v: number) => String(v).padStart(2, '0');

export default function Countdown() {
  const target = new Date(config.weddingTarget);
  const [remaining, setRemaining] = useState(() => getRemaining(target));

  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining(target)), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="countdown">
      <div className="wrap">
        <Reveal className="section-title">
          <span className="eyebrow">Mark your calendar</span>
          <h2>The weekend begins in</h2>
        </Reveal>

        {remaining.over ? (
          <Reveal>
            <p className="countdown-here">It's here — see you by the river!</p>
          </Reveal>
        ) : (
          <Reveal className="countdown-tiles">
            <div className="count">
              <div className="tile">
                <div className="num">{remaining.d}</div>
                <div className="lab">Days</div>
              </div>
              <div className="tile">
                <div className="num">{pad(remaining.h)}</div>
                <div className="lab">Hours</div>
              </div>
              <div className="tile">
                <div className="num">{pad(remaining.m)}</div>
                <div className="lab">Minutes</div>
              </div>
              <div className="tile">
                <div className="num">{pad(remaining.s)}</div>
                <div className="lab">Seconds</div>
              </div>
            </div>
          </Reveal>
        )}
        <Reveal>
          <p className="count-note">…until the first fistful of turmeric flies at the Haldi. 💛</p>
        </Reveal>
      </div>
    </section>
  );
}
