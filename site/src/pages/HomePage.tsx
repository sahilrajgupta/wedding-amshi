import { useState } from 'react';
import EnvelopeOpener from '../components/EnvelopeOpener';
import Nav from '../components/Nav';
import Hero from '../components/Hero';
import Countdown from '../components/Countdown';
import StoryTimeline from '../components/StoryTimeline';
import WeekendEvents from '../components/WeekendEvents';
import DholSection from '../components/DholSection';
import TeamPickSection from '../components/TeamPickSection';
import GettingThere from '../components/GettingThere';
import RsvpForm from '../components/RsvpForm';
import Footer from '../components/Footer';
import WaveDivider from '../components/WaveDivider';
import PetalsLayer from '../components/ambient/PetalsLayer';

export default function HomePage({ entered, onEnter }: { entered: boolean; onEnter: () => void }) {
  // Captured once, at mount, on purpose: if the site was already "entered"
  // before this HomePage instance existed (e.g. navigating back from a story
  // page, which remounts HomePage fresh), skip the envelope entirely. But if
  // `entered` flips true *during* this instance's life (the user just opened
  // it), keep rendering EnvelopeOpener so its own fade-out animation can
  // finish — it unmounts itself once that completes.
  const [skipEnvelope] = useState(entered);
  // Lifted here (not owned by StoryTimeline) so Hero's "RSVP →" button can
  // mark the pinned reveal as already-played *before* it scrolls past that
  // section — otherwise the reveal's own scroll-jack spacer collapses
  // mid-flight during that jump, fighting the in-progress scroll (see
  // StoryTimeline.tsx for the version that tried compensating for that
  // instead — this sidesteps the race entirely).
  const [storyRevealed, setStoryRevealed] = useState(false);

  return (
    <>
      {!skipEnvelope && <EnvelopeOpener onDone={onEnter} />}
      {entered && <PetalsLayer density={34} />}
      <Nav />
      <Hero entered={entered} onRsvpJump={() => setStoryRevealed(true)} />
      <Countdown />
      <WaveDivider from="var(--paper)" to="var(--cream)" />
      <StoryTimeline revealed={storyRevealed} onRevealed={() => setStoryRevealed(true)} />
      <WaveDivider from="var(--cream)" to="var(--paper)" />
      <WeekendEvents />
      <DholSection />
      <WaveDivider from="var(--paper)" to="var(--cream)" />
      <TeamPickSection />
      <GettingThere />
      <RsvpForm />
      <WaveDivider from="var(--cream)" to="var(--dusk)" flip />
      <Footer />
    </>
  );
}
