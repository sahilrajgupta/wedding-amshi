import { config } from '../config';
import type { TeamPick, TravelOption } from '../context/RsvpContext';

export interface RsvpPayload {
  name: string;
  attending: 'yes' | 'no';
  celebrations: string[]; // WeddingEvent ids from data/events.ts the guest is attending
  headcount: string;
  contact: string; // phone or email
  songRequest: string;
  message: string;
  teamPick: TeamPick;
  travelOption: TravelOption;
  wantsTrainCoach: boolean;
}

const TEAM_LABEL: Record<NonNullable<TeamPick>, string> = {
  ladki: 'Team Ladki Wale',
  ladke: 'Team Ladke Wale',
};

const TRAVEL_LABEL: Record<NonNullable<TravelOption>, string> = {
  'train-coach-patna': 'Wedding train from Patna',
  'train-moradabad': 'Train to Moradabad + drive',
  'road-delhi': 'Road trip from Delhi',
};

export const CELEBRATION_LABEL: Record<string, string> = {
  haldi: 'Haldi',
  'mehendi-sangeet': 'Mehendi & Sangeet',
  wedding: 'Wedding',
};

export function buildWhatsappMessage(payload: RsvpPayload): string {
  if (payload.attending === 'no') {
    const lines = [
      `RSVP for Shikha & Amit's wedding`,
      `Name: ${payload.name}`,
      `Regretfully, can't make it 💔`,
    ];
    if (payload.message.trim()) lines.push(`Message: ${payload.message.trim()}`);
    return lines.join('\n');
  }

  const lines = [
    `RSVP for Shikha & Amit's wedding 🌸`,
    `Name: ${payload.name}`,
    `Joyfully yes! 🎉`,
    `Headcount: ${payload.headcount}`,
  ];
  if (payload.celebrations.length) {
    lines.push(`Celebrations: ${payload.celebrations.map((id) => CELEBRATION_LABEL[id] ?? id).join(', ')}`);
  }
  if (payload.teamPick) lines.push(`Team: ${TEAM_LABEL[payload.teamPick]}`);
  if (payload.travelOption) lines.push(`Travel: ${TRAVEL_LABEL[payload.travelOption]}`);
  if (payload.travelOption === 'train-coach-patna' && payload.wantsTrainCoach) {
    lines.push(`Count me in for the Patna coach: Yes`);
  }
  if (payload.contact.trim()) lines.push(`Contact: ${payload.contact.trim()}`);
  if (payload.songRequest.trim()) lines.push(`Sangeet song request: ${payload.songRequest.trim()}`);
  if (payload.message.trim()) lines.push(`Message: ${payload.message.trim()}`);
  return lines.join('\n');
}

export function buildWhatsappUrl(phone: string, payload: RsvpPayload): string {
  const text = buildWhatsappMessage(payload);
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/** Routes to the team-matching number; falls back to whichever side is configured if no team is picked (or that side's number isn't set yet). */
export function pickWhatsappNumber(teamPick: TeamPick): string {
  if (teamPick === 'ladke' && config.whatsappGroom) return config.whatsappGroom;
  if (teamPick === 'ladki' && config.whatsappBride) return config.whatsappBride;
  return config.whatsappBride || config.whatsappGroom || '';
}
