import { useState } from 'react';
import EnvelopeOpener from '../components/EnvelopeOpener';
import Nav from '../components/Nav';
import Hero from '../components/Hero';
import Countdown from '../components/Countdown';
import StoryTimeline from '../components/StoryTimeline';
import WeekendEvents from '../components/WeekendEvents';
import DholSection from '../components/DholSection';
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

  return (
    <>
      {!skipEnvelope && <EnvelopeOpener onDone={onEnter} />}
      {entered && <PetalsLayer density={34} />}
      <Nav />
      <Hero entered={entered} />
      <Countdown />
      <WaveDivider from="var(--paper)" to="var(--cream)" />
      <StoryTimeline />
      <WaveDivider from="var(--cream)" to="var(--paper)" />
      <WeekendEvents />
      <DholSection />
      <GettingThere />
      <RsvpForm />
      <WaveDivider from="var(--cream)" to="var(--dusk)" flip />
      <Footer />
    </>
  );
}
