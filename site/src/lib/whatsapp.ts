import type { TeamPick, TravelOption } from '../context/RsvpContext';

export interface RsvpPayload {
  name: string;
  headcount: string;
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

export function buildWhatsappMessage(payload: RsvpPayload): string {
  const lines = [
    `RSVP for Shikha & Amit's wedding 🌸`,
    `Name: ${payload.name}`,
    `Headcount: ${payload.headcount}`,
  ];
  if (payload.teamPick) lines.push(`Team: ${TEAM_LABEL[payload.teamPick]}`);
  if (payload.travelOption) lines.push(`Travel: ${TRAVEL_LABEL[payload.travelOption]}`);
  if (payload.travelOption === 'train-coach-patna' && payload.wantsTrainCoach) {
    lines.push(`Count me in for the Patna coach: Yes`);
  }
  if (payload.message.trim()) lines.push(`Message: ${payload.message.trim()}`);
  return lines.join('\n');
}

export function buildWhatsappUrl(phone: string, payload: RsvpPayload): string {
  const text = buildWhatsappMessage(payload);
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
