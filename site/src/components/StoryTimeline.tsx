import { useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform, type MotionValue, type MotionStyle } from 'framer-motion';
import { storyStops, storyIntro, storyConstant, type StoryStop } from '../data/story';
import Reveal from './Reveal';
import { useReducedMotion } from '../lib/reducedMotion';
import { useMediaQuery } from '../lib/useMediaQuery';
import './StoryTimeline.css';

const MOBILE_QUERY = '(max-width: 860px)';
// Beyond this |distance| from the focal index, a stop is fully collapsed
// into its breadcrumb form; inside it, it's rendered as the big card.
const CRUMB_START = 0.75;
const CRUMB_END = 1.25;
// Fixed spacing between adjacent breadcrumb slots along the trail's axis.
// Deliberately a constant per-index slot (not distance-driven) so the trail
// is a stable, non-overlapping row — an earlier version tied each
// breadcrumb's position to its live scroll distance, which (since
// focalIndex ends up past every index at the end of the sweep) left every
// breadcrumb bunched on the same side instead of spread into a line.
// Smaller on mobile — the trail runs in the card's own side margin there,
// not the full screen width, and labels are shorter (year only).
const CRUMB_SPACING_DESKTOP = 190;
const CRUMB_SPACING_MOBILE = 58;

function CarouselStop({
  stop,
  index,
  total,
  focalIndex,
  isMobile,
}: {
  stop: StoryStop;
  index: number;
  total: number;
  focalIndex: MotionValue<number>;
  isMobile: boolean;
}) {
  const distance = useTransform(focalIndex, (f) => f - index);
  const absDistance = useTransform(distance, Math.abs);

  // 0 = fully the big card, 1 = fully the small breadcrumb.
  const crumbBlend = useTransform(absDistance, [CRUMB_START, CRUMB_END], [0, 1]);
  const cardOpacity = useTransform(crumbBlend, (b) => 1 - b);
  const cardScale = useTransform(distance, [-1.3, -0.15, 0, 0.15, 1.3], [0.4, 0.92, 1, 0.92, 0.4]);
  const cardZ = useTransform(absDistance, (d) => Math.round((2 - Math.min(d, 2)) * 50));

  // Self-centering (-50%) plus a distance-proportional offset, combined in
  // one calc() so no separate CSS transform is needed (framer-motion's x/y
  // would otherwise fully overwrite a stylesheet `transform`, not compose
  // with it). Tuned smaller than a first pass, since the cards are now
  // portrait/narrow rather than wide — a wide card needed a bigger push to
  // reach the crop edge, a narrow one needs less. Negated on purpose:
  // distance = focalIndex - index, so a stop *before* the focal one (lower
  // index, should sit on the left to match the breadcrumb trail's
  // chronological left-to-right order) has a *positive* distance — without
  // the negation it ended up mirrored, with earlier stops appearing right
  // of the focal card and later ones appearing left of it.
  const cardX = useTransform(distance, (d) => `calc(-50% + ${-d * 36}vw)`);
  const cardY = useTransform(distance, (d) => `calc(-50% + ${-d * 42}vh)`);

  // Each chapter's backdrop is themed to its own mood/city (see
  // `accent` in data/story.ts) rather than one flat card color for all six.
  const background = `linear-gradient(165deg, ${stop.accent[0]}, ${stop.accent[1]})`;
  const cardStyle: MotionStyle = isMobile
    ? { opacity: cardOpacity, scale: cardScale, x: '-50%', y: cardY, zIndex: cardZ, background }
    : { opacity: cardOpacity, scale: cardScale, x: cardX, y: '-50%', zIndex: cardZ, background };

  // The breadcrumb trail runs along the *same* axis as the card sweep — a
  // horizontal row docked at the bottom on desktop, a vertical rail in the
  // card's side margin on mobile — rather than always staying horizontal.
  const crumbSlot = (index - (total - 1) / 2) * (isMobile ? CRUMB_SPACING_MOBILE : CRUMB_SPACING_DESKTOP);
  const crumbStyle: MotionStyle = isMobile
    ? { opacity: crumbBlend, y: `calc(-50% + ${crumbSlot}px)` }
    : { opacity: crumbBlend, x: `calc(-50% + ${crumbSlot}px)` };

  return (
    <>
      <motion.div className="carousel-card" style={cardStyle}>
        <span className="carousel-card-watermark" aria-hidden="true">
          {stop.icon}
        </span>
        <div className="yr">{stop.year}</div>
        <div className="city">
          {stop.icon} {stop.city}
        </div>
        <div className="note">{stop.note}</div>
        <Link to={`/story/${stop.slug}`} className="stop-cta">
          Read the story →
        </Link>
      </motion.div>
      <motion.div className="carousel-crumb" style={crumbStyle}>
        <span className="crumb-dot" />
        <span className="crumb-label">{stop.year}</span>
      </motion.div>
    </>
  );
}

function RecapStop({ stop }: { stop: StoryStop }) {
  const background = `linear-gradient(165deg, ${stop.accent[0]}, ${stop.accent[1]})`;
  return (
    <div className={`recap-stop${stop.final ? ' final' : ''}`} style={{ background }}>
      <span className="recap-dot" />
      <Link to={`/story/${stop.slug}`} className="recap-link">
        <div className="yr">{stop.year}</div>
        <div className="city">
          {stop.icon} {stop.city}
        </div>
        <div className="note">{stop.note}</div>
        <span className="stop-cta">Read the story →</span>
      </Link>
    </div>
  );
}

export default function StoryTimeline({
  revealed,
  onRevealed,
}: {
  revealed: boolean;
  onRevealed: () => void;
}) {
  const reduced = useReducedMotion();
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const trackRef = useRef<HTMLDivElement>(null);
  const recapRef = useRef<HTMLDivElement>(null);
  const total = storyStops.length;
  // A tall spacer gives real, controllable scroll distance for the sweep —
  // ~100vh of scroll per stop, plus a little lead-in/lead-out room — rather
  // than inferring progress from the (short) row's own natural transit.
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6 });
  const focalIndex = useTransform(smoothProgress, [0, 1], [-0.3, total - 1 + 1.3]);
  // The breadcrumb trail's line must span exactly as far as the breadcrumb
  // slots themselves do — a fixed-width line was too short for a 6-stop
  // trail, so the outer stops' dots visibly sat past its end.
  const crumbTrailLength = (total - 1) * (isMobile ? CRUMB_SPACING_MOBILE : CRUMB_SPACING_DESKTOP);
  const crumbLineStyle = isMobile ? { height: crumbTrailLength, width: 2 } : { width: crumbTrailLength, height: 2 };
  const crumbLineTransform = isMobile ? 'translateY(-50%)' : 'translateX(-50%)';

  // The pinned reveal is meant to play once — after the guest has scrolled
  // all the way through it, drop the tall scroll-jack spacer entirely so
  // scrolling back up doesn't replay it or leave a huge empty gap.
  // `revealed`/`onRevealed` are owned by HomePage (not local state) so the
  // hero's "RSVP →" button can mark this done *before* it scrolls past the
  // section — see HomePage.tsx for why. Watch the *raw* scrollYProgress
  // (not the spring-smoothed one) so the natural-scroll path fires right as
  // the guest actually reaches the end, not lagging behind it.
  const preCollapseRecapTopRef = useRef<number | null>(null);
  const triggeredRef = useRef(false);
  useEffect(() => {
    if (revealed) return;
    triggeredRef.current = false;
    const unsubscribe = scrollYProgress.on('change', (v) => {
      // Guard against re-firing within the same tick: `revealed` (read via
      // this closure) only updates on the *next* effect run, but multiple
      // 'change' events can arrive synchronously before React gets there —
      // e.g. a direct scroll jump straight to the bottom of the spacer.
      if (triggeredRef.current) return;
      // Guard against a spurious edge-value event on the very first layout
      // pass, before the spacer's tall inline height has actually been
      // committed/measured — without this, `v` can briefly read as ~1 on
      // mount and collapse the section before any real scrolling happened.
      if (v >= 0.985 && window.scrollY > 200) {
        triggeredRef.current = true;
        // Capture where the (always-rendered) recap section currently sits
        // on screen, *before* the spacer disappears — this is what the
        // compensation below restores, and it's measured directly rather
        // than computed from document heights on purpose: a naive
        // before/after `scrollHeight` delta looked right in isolation, but
        // the browser can already auto-clamp `scrollY` the instant the
        // document shrinks (before this component's own correction ever
        // runs), so subtracting the *full* computed delta on top of that
        // already-adjusted position overcorrected down to 0 on a fast,
        // large scroll jump (e.g. a scrollbar drag). getBoundingClientRect
        // always reflects the true current state, so comparing it before
        // and after isn't fooled by whatever the browser already did.
        preCollapseRecapTopRef.current = recapRef.current?.getBoundingClientRect().top ?? null;
        onRevealed();
      }
    });
    return unsubscribe;
  }, [scrollYProgress, revealed, onRevealed]);
  // Collapsing the spacer removes ~600vh of page height in one frame, which
  // would otherwise fling the scroll position deep into whatever section
  // now sits where the recap used to be. Restore the recap section to
  // exactly the on-screen position it was at before the collapse — not an
  // absolute jump like `scrollIntoView`, which an earlier version used and
  // which stomped on an in-flight native smooth scroll (e.g. the hero's
  // "RSVP →" button scrolling past this section on its way further down the
  // page) and left it stalled partway. A relative correction only cancels
  // out the exact visual shift the collapse caused, so it doesn't assert a
  // competing destination.
  useLayoutEffect(() => {
    if (revealed && preCollapseRecapTopRef.current !== null) {
      const targetTop = preCollapseRecapTopRef.current;
      const currentTop = recapRef.current?.getBoundingClientRect().top ?? targetTop;
      const delta = currentTop - targetTop;
      if (Math.abs(delta) > 1) window.scrollBy(0, delta);
      preCollapseRecapTopRef.current = null;
    }
  }, [revealed]);

  return (
    <section id="story" className="section-cream section-lilac">
      <div className="wrap">
        <Reveal className="section-title">
          <span className="eyebrow">{storyIntro.eyebrow}</span>
          <h2>{storyIntro.title}</h2>
          <p>{storyIntro.sub}</p>
        </Reveal>
      </div>

      {!reduced && !revealed && (
        <div className="timeline-scroll-track" ref={trackRef} style={{ height: `${(total + 0.5) * 100}vh` }}>
          <div className="timeline-pin">
            <div className="crumb-line" style={{ ...crumbLineStyle, transform: crumbLineTransform }} />
            <motion.div
              className="crumb-line-fill"
              style={
                isMobile
                  ? { ...crumbLineStyle, y: '-50%', scaleY: smoothProgress }
                  : { ...crumbLineStyle, x: '-50%', scaleX: smoothProgress }
              }
            />
            {storyStops.map((stop, i) => (
              <CarouselStop key={stop.slug} stop={stop} index={i} total={total} focalIndex={focalIndex} isMobile={isMobile} />
            ))}
          </div>
        </div>
      )}

      {/* The connected recap timeline — the pinned reveal above (skipped
          entirely under reduced motion, and dropped from the DOM once
          played through once — see `revealed`) is a one-time entrance;
          once it's done, this single-row (desktop) / single-column
          (mobile) timeline with a connecting dot-and-line is the lasting,
          always-visible representation. Don't reintroduce a wrapping grid
          of disconnected cards here — that read as unrelated boxes, not a
          timeline. */}
      <div className="wrap" ref={recapRef}>
        <div className="recap-track">
          <div className="recap-line" />
          {storyStops.map((stop) => (
            <RecapStop key={stop.slug} stop={stop} />
          ))}
        </div>
      </div>

      <div className="wrap">
        <Reveal>
          <p className="constant">{storyConstant}</p>
        </Reveal>
      </div>
    </section>
  );
}
