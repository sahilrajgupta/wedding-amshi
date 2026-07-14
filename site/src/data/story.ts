export interface StoryStop {
  slug: string;
  year: string;
  city: string;
  note: string;
  /**
   * Longer, expandable narrative shown on this chapter's own page.
   * Placeholder copy written in the same voice as `note` — personalize
   * with real specifics (what were you both doing, a real memory, an
   * actual message you sent) before sharing widely.
   */
  details: string[];
  icon: string;
  final?: boolean;
}

export const storyStops: StoryStop[] = [
  {
    slug: 'chennai-2021',
    year: '2021 · Chennai',
    city: 'Where it began',
    note: 'A spark, an ocean apart — she in Chennai, he in the States.',
    icon: '🌆',
    details: [
      'It started the way most good stories do — quietly, without either of them realizing it yet. A conversation that should have ended in five minutes stretched into hours, then days, then something neither of them had a name for.',
      'She was in Chennai. He was thousands of miles away in the States. The distance should have made it easy to let go. Instead, it became the first practice run for everything that came after — showing up for each other across time zones, screens, and unreasonable hours of the night.',
    ],
  },
  {
    slug: 'london-2024',
    year: '2024 · London',
    city: 'A near miss',
    note: 'Same feelings, wrong timing. She in London, he in Boston.',
    icon: '🌧️',
    details: [
      "Three years on, the timing still hadn't caught up to the feeling. She was building a life in London; he was settling into Boston. The same pull was there — just wrapped in enough uncertainty that neither one said it out loud.",
      'Looking back, they call this the chapter where they were both circling the same answer, just from opposite sides of it.',
    ],
  },
  {
    slug: 'washington-dc-2025',
    year: '2025 · Washington D.C.',
    city: 'Still not yet',
    note: "Closer this time — but the tide hadn't turned.",
    icon: '🏛️',
    details: [
      "Washington D.C. brought them a little closer — geographically, and in every other way. But \"almost\" isn't the same as \"yes,\" and this chapter is the one where they both knew, and still waited.",
      'Some love stories need a long runway. This was theirs.',
    ],
  },
  {
    slug: 'orlando-2026',
    year: '2026 · Orlando',
    city: 'Undeniable',
    note: 'This is where love stopped pretending. She asked. He was already sure.',
    icon: '✨',
    details: [
      "This is the one they'll tell their grandkids about. The moment the pretending stopped. She asked the question that had been sitting between them for five years — and he didn't need a second to answer.",
      'Everything before Orlando was practice. Everything after was real.',
    ],
  },
  {
    slug: 'miami-2026',
    year: '2026 · Miami',
    city: 'Forever, begun',
    note: 'Engaged by the sea, in the city where it all made sense.',
    icon: '💍',
    details: [
      'By the sea, in a city that felt like it was built for exactly this moment, they made it official. Ring, promise, forever — all in one breath.',
      "From here, every plan they made started with the word \"we.\"",
    ],
  },
  {
    slug: 'jim-corbett-2027',
    year: 'Jan 2027 · Jim Corbett',
    city: 'Home, at last',
    note: 'To the river, the forest, and each other — for good.',
    icon: '🌊',
    final: true,
    details: [
      'And now, the river. After six cities and five years of almost, near, and finally — this is where they say it in front of everyone who matters: yes, always, for good.',
      'Come stand with them by the water and watch the long way round finally arrive.',
    ],
  },
];

export const storyIntro = {
  eyebrow: 'Six cities · five years · one yes',
  title: 'The long way to the same shore',
  sub: 'She kept moving. He was her constant. Every road led to the river.',
};

export const storyConstant =
  'Through every city and every year, Boston stayed still — Amit, the fixed point Shikha kept finding her way back to.';
