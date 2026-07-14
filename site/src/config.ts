export const config = {
  names: 'Shikha & Amit',
  monogram: 'S & A',
  hashtag: '#AmiShi',
  venueName: 'Mango Bloom Riverview Resort',
  venueRegion: 'Jim Corbett · Uttarakhand',
  venueSiteUrl: 'https://mangobloomcorbett.com/',
  // Haldi start — countdown target (matches the original site's TARGET)
  weddingTarget: '2027-01-17T14:00:00+05:30',

  // ---- placeholders: fill these in once you have them ----
  whatsappPhone: import.meta.env.VITE_WHATSAPP_PHONE || '', // e.g. '91XXXXXXXXXX' — no + or spaces
  rsvpDeadline: import.meta.env.VITE_RSVP_DEADLINE || '2026-12-20', // ISO date, shown to guests
  venueMapsLink:
    import.meta.env.VITE_VENUE_MAPS_LINK ||
    'https://mangobloomcorbett.com/', // TODO: replace with a real Google Maps directions link
  appsScriptUrl: import.meta.env.VITE_APPS_SCRIPT_URL || '', // TODO: paste the Apps Script /exec URL, see SETUP.md
} as const;

export const isPlaceholder = {
  whatsapp: !config.whatsappPhone,
  appsScript: !config.appsScriptUrl,
  venueMapsLink: !/google\.com\/maps|goo\.gl\/maps/.test(config.venueMapsLink),
};
