import { createContext, useContext, useState, type ReactNode } from 'react';

export type TeamPick = 'ladki' | 'ladke' | null;
export type TravelOption = 'train-coach-patna' | 'train-moradabad' | 'road-delhi' | null;

interface RsvpContextValue {
  teamPick: TeamPick;
  setTeamPick: (v: TeamPick) => void;
  travelOption: TravelOption;
  setTravelOption: (v: TravelOption) => void;
  wantsTrainCoach: boolean;
  setWantsTrainCoach: (v: boolean) => void;
}

const RsvpContext = createContext<RsvpContextValue | null>(null);

export function RsvpProvider({ children }: { children: ReactNode }) {
  const [teamPick, setTeamPick] = useState<TeamPick>(null);
  const [travelOption, setTravelOption] = useState<TravelOption>(null);
  const [wantsTrainCoach, setWantsTrainCoach] = useState(false);

  return (
    <RsvpContext.Provider
      value={{ teamPick, setTeamPick, travelOption, setTravelOption, wantsTrainCoach, setWantsTrainCoach }}
    >
      {children}
    </RsvpContext.Provider>
  );
}

export function useRsvp() {
  const ctx = useContext(RsvpContext);
  if (!ctx) throw new Error('useRsvp must be used within RsvpProvider');
  return ctx;
}
