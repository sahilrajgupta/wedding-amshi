export const config = {
  names: 'Shikha & Amit',
  monogram: 'S & A',
  hashtag: '#AmiShi',
  venueName: 'Mango Bloom River Resort',
  venueRegion: 'Jim Corbett National Park, Ramnagar, Mohaan, Uttarakhand 244715',
  venueSiteUrl: 'https://mangobloomcorbett.com/',
  // Haldi start — countdown target (matches the original site's TARGET)
  weddingTarget: '2027-01-17T14:00:00+05:30',

  // ---- placeholders: fill these in once you have them ----
  // Routed by Team Ladki/Ladke pick — see lib/whatsapp.ts. Bride's number is
  // the fallback when no team has been picked yet.
  whatsappBride: import.meta.env.VITE_WHATSAPP_BRIDE || '', // e.g. '91XXXXXXXXXX' — no + or spaces
  whatsappGroom: import.meta.env.VITE_WHATSAPP_GROOM || '',
  rsvpDeadline: import.meta.env.VITE_RSVP_DEADLINE || '2026-07-20', // ISO date, shown to guests
  venueMapsLink: import.meta.env.VITE_VENUE_MAPS_LINK || 'https://maps.app.goo.gl/BGt7gv9gKCA6Kapk6',
  appsScriptUrl: import.meta.env.VITE_APPS_SCRIPT_URL || '', // TODO: paste the Apps Script /exec URL, see SETUP.md
} as const;

export const isPlaceholder = {
  whatsappBride: !config.whatsappBride,
  whatsappGroom: !config.whatsappGroom,
  // True only when *neither* number is set — RsvpForm falls back to
  // whichever one exists when a team hasn't been picked.
  whatsapp: !config.whatsappBride && !config.whatsappGroom,
  appsScript: !config.appsScriptUrl,
  venueMapsLink: !/google\.com\/maps|goo\.gl\/maps|maps\.app\.goo\.gl/.test(config.venueMapsLink),
};
