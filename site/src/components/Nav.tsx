import { useState } from 'react';
import { config } from '../config';
import './Nav.css';

const LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#countdown', label: 'Countdown' },
  { href: '#story', label: 'Our Story' },
  { href: '#weekend', label: 'The Weekend' },
  { href: '#getting-there', label: 'Getting There' },
  { href: '#rsvp', label: 'RSVP' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="nav-inner wrap">
        <span className="nav-mono">{config.monogram}</span>
        <button className="nav-toggle" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
          ☰
        </button>
        <ul className={open ? 'open' : ''}>
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
