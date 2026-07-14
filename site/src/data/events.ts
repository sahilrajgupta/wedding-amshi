export interface EventDetail {
  term: string;
  desc: string;
}

export interface WeddingEvent {
  id: string;
  image: string;
  imageAlt: string;
  tag: string;
  title: string;
  when: string;
  lede: string;
  details: EventDetail[];
  quirk: string;
  /** ISO datetimes (Asia/Kolkata, +05:30) used to build calendar invites. */
  start: string;
  end: string;
  location: string;
}

export const weekendIntro = {
  eyebrow: '17 – 18 January 2027 · by the Kosi',
  title: 'The Weekend',
  sub: "Two days, one jungle, and zero chance you'll want to leave.",
};

export const weddingEvents: WeddingEvent[] = [
  {
    id: 'haldi',
    image: '/img/haldi.jpg',
    imageAlt: 'Haldi & the Great Corbett Olympics',
    tag: 'Day One · Afternoon',
    title: 'Haldi & the Great Corbett Olympics',
    when: '17 January · 2:00 PM onwards',
    lede: 'Sunshine, turmeric, and full-blown chaos by the river.',
    details: [
      {
        term: 'Dress',
        desc: 'Every shade of yellow you own — marigold, mustard, sunflower, lemon. The louder, the better.',
      },
      {
        term: 'Entry',
        desc: "No shades, no entry 😎 — it's about to get bright, yellow, and gloriously messy.",
      },
      {
        term: 'Games',
        desc: 'Ladke Wale vs Ladki Wale. Tug of war, push-up face-offs, matka phod, lemon-\'n\'-spoon, sack race.',
      },
    ],
    quirk: "Warning: you'll arrive a guest and leave as turmeric.",
    start: '2027-01-17T14:00:00+05:30',
    end: '2027-01-17T17:00:00+05:30',
    location: 'Mango Bloom Riverview Resort, Jim Corbett, Uttarakhand',
  },
  {
    id: 'mehendi-sangeet',
    image: '/img/mehendi-sangeet.jpg',
    imageAlt: 'Mehendi Sundowner & Sangeet Night',
    tag: 'Day One · Evening into Night',
    title: 'Mehendi Sundowner & Sangeet Night',
    when: '17 January · 5:00 PM onwards',
    lede: 'Golden hour by the water, dissolving into a starlit dance floor.',
    details: [
      { term: '5:00–6:45', desc: 'Mehendi, chai, mocktails, snacks & golden-hour photos.' },
      { term: '7:00–10:00', desc: 'Sangeet — performances, dancing & dinner under the stars.' },
      {
        term: 'Dress',
        desc: 'Mehendi — greens & peach (sage, olive, bottle-green, coral). Sangeet — your call, wear your boldest.',
      },
      {
        term: 'Entry',
        desc: 'Mehendi: nails done, phone charged — your hands are about to go out of service. Sangeet: bring your dance game.',
      },
    ],
    quirk:
      'The henna needs 90 minutes to set — that\'s your window to eat, flirt, and warm up your hips.',
    start: '2027-01-17T17:00:00+05:30',
    end: '2027-01-17T22:00:00+05:30',
    location: 'Mango Bloom Riverview Resort, Jim Corbett, Uttarakhand',
  },
  {
    id: 'wedding',
    image: '/img/save-the-weekend.jpg',
    imageAlt: 'The Wedding by the river',
    tag: 'Day Two · The main event',
    title: 'The Wedding',
    when: '18 January · games from the afternoon, pheras in the evening',
    lede: 'The long way round finally arrives — vows by the river, under the sal trees.',
    details: [
      {
        term: 'Afternoon',
        desc: "Couple games — \"Who's more likely to…\", the Newlywed Game, joota chhupai (steal the groom's shoes), ring-in-the-milk.",
      },
      { term: 'Evening', desc: 'The ceremony & dinner at Mango Bloom Riverview Resort.' },
      { term: 'Dress', desc: 'Festive jewel tones — bring your finest.' },
    ],
    quirk: 'Come early — the games start before the vows. Steal the shoes at your own risk.',
    start: '2027-01-18T14:00:00+05:30',
    end: '2027-01-18T23:00:00+05:30',
    location: 'Mango Bloom Riverview Resort, Jim Corbett, Uttarakhand',
  },
];
