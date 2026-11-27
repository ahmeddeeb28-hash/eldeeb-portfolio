import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { CaseIntro, LeadStats, Takeaway, MyPart, Learnings } from './_shared/CaseLayout';
import { ChevronsLeftRight, MousePointerClick } from 'lucide-react';
import { CaseShell } from './_shared/CaseShell';
import { ChapterTitle } from './_shared/ChapterTitle';
import { CaseFilm, Eyebrow as BaseEyebrow, UseCaseExplorer, reveal, type UseCase as BaseUseCase } from './_shared/CaseBits';
import type { Chapter, CaseStudyComponentProps } from './_shared/types';
import { MarqueeGallery, type Screen } from './_shared/MarqueeGallery';
import { SaryCover } from './sary/SaryCover';
import { ProblemFilm } from './sary/ProblemFilm';
import { BannerWall, CampaignStage } from './sary/SaryCampaigns';
import { SaryAddAllLoop, SaryAddAllPlay, SaryPhone, type SaryState } from './sary/SaryPhone';

/* ── Sary · Buy Again Hub ────────────────────────────
   Repeat customers on Sary, the B2B grocery app. Sources: the
   Figma page "Buy Again Hub, Repeat Customers [EN]" (intro
   board, five screens, Before → After, the "Add all" motion
   K1 to K6) and the interactive prototype. Store, prices and
   orders on the screens are sample data.

   The results block keeps the figures from the earlier Sary
   case study. The film is public/videos/sary-buy-again-film.mp4;
   if it ever fails to load, the hero plays the "Add all"
   sequence live instead. */

const ACCENT = '#7DA2FF';
const FILM = '/videos/sary-buy-again-film.mp4';
const POSTER = '/images/case-studies/sary/film-poster.webp';

const CHAPTERS: Chapter[] = [
  { id: 'overview', num: '01', roman: 'I', label: 'Overview', beat: 'A home for stores that come back.' },
  { id: 'problem', num: '02', roman: 'II', label: 'Problem', beat: 'What was in the way.' },
  { id: 'screens', num: '03', roman: 'III', label: 'Screens', beat: 'Every screen, side by side.' },
  { id: 'cases', num: '04', roman: 'IV', label: 'Use Cases', beat: 'Each case and its design.' },
  { id: 'motion', num: '05', roman: 'V', label: 'Motion', beat: 'Try Add all yourself.' },
  { id: 'campaigns', num: '06', roman: 'VI', label: 'Campaigns', beat: 'The banner system around it.' },
  { id: 'impact', num: '07', roman: 'VII', label: 'Impact', beat: 'What changed.' },
];

const SIGNALS = [
  { k: 'Analytics', t: '85% left after Confirm Order', d: 'The “You might also like” sidebar went unseen.' },
  { k: 'Session replays', t: 'Suggestions didn’t fit', d: 'Owners hovered over them, then closed the app.' },
  { k: 'Segments', t: '60% irrelevant', d: 'Most of what café owners were shown didn’t apply to them.' },
  { k: 'Order history', t: 'Same basket every week', d: 'The same few dozen products, usually on the same weekday.' },
];

const BEFORE_AFTER = [
  {
    n: '1',
    t: 'Where a returning store lands',
    before: 'A discount banner, category shortcuts and brand rails. The same for every store, every visit.',
    after: 'A Welcome back card with the usual basket, one tap Add all, and what’s running low this week.',
  },
  {
    n: '2',
    t: 'Rebuilding the weekly basket',
    before: 'Search or browse the category rails and add the same items one by one, every week.',
    after: 'A hub built from the store’s own orders, with reorder timing on each item: due today, in 2 days, later.',
  },
];


type UseCase = BaseUseCase & { state: SaryState; live?: boolean };

const USE_CASES: UseCase[] = [
  {
    id: 'home',
    code: '01',
    title: 'Start from the usual',
    state: 'home',
    what: 'Returning stores land on a Welcome back card: last week’s basket, its total, Add all and Review. What’s running low sits right below.',
    why: 'Reordering should start on the first screen, not after a search.',
    shown: 'Stores with past orders',
    measured: 'Share of orders started from Buy Again',
  },
  {
    id: 'usual',
    code: '02',
    title: 'Restock in one tap',
    state: 'hub',
    live: true,
    what: 'The usual basket is built from the last 6 orders, with the quantities the store actually buys. One tap adds all 18 items.',
    why: 'A weekly chore becomes a quick decision: confirm, adjust, done.',
    shown: 'Every returning store',
    measured: 'Time from opening the app to checkout',
  },
  {
    id: 'low',
    code: '02',
    title: 'Know what’s running low',
    state: 'hub',
    what: 'Each item’s reorder cycle flags it as due today, due soon or later, so owners restock before the shelf is empty.',
    why: 'Running out costs a store sales. The app knows the cycle, so it should say when.',
    shown: 'Stores with a regular reorder pattern',
    measured: 'Repeat-order rate',
  },
  {
    id: 'review',
    code: '03',
    title: 'Review and swap',
    state: 'review',
    what: 'Quantities can be adjusted, price changes since last time are marked, and an out of stock item gets a same-size swap right in the list.',
    why: 'An out of stock item shouldn’t stop the whole order at checkout.',
    shown: 'Stores who tap Review',
    measured: 'Orders completed after a swap',
  },
  {
    id: 'order',
    code: '04',
    title: 'Reorder a past order',
    state: 'order',
    what: 'Open any past order, pick the lines to repeat, and see today’s prices. Unavailable items are skipped with a Notify me option.',
    why: 'Not every week is the usual. Sometimes it’s “last Sunday’s order, minus the tea”.',
    shown: 'Stores browsing past orders',
    measured: 'Reorders started from past orders',
  },
  {
    id: 'routine',
    code: '05',
    title: 'Make it a routine',
    state: 'routine',
    what: 'After adding, a sheet shows the savings and offers a weekly reminder on the store’s restock day. One toggle, and the basket is ready the night before.',
    why: 'This is the lever for repeat customers: one order turns into a weekly habit.',
    shown: 'Every store that adds its usual',
    measured: 'Reminders turned on, repeat-order rate',
  },
];

const RESULTS = [
  { v: '+28%', k: 'Repeat purchases' },
  { v: '+27%', k: 'Average order value' },
  { v: '+42%', k: 'Interaction with suggestions' },
  { v: '+20%', k: 'Auto-reorder habit' },
];

const Eyebrow = ({ children, tone = ACCENT }: { children: React.ReactNode; tone?: string }) => (
  <BaseEyebrow tone={tone}>{children}</BaseEyebrow>
);

/* Before and after, as the real screens from the Figma board
   ("4 · Before → After"): the current Arabic home and catalogue
   against the new home and Buy Again hub. The before screen sits
   on top and is clipped at a seam you can drag (pointer, touch or
   arrow keys); it wipes in once on arrival. Pick the case with the
   tabs. */
const CMP = '/images/case-studies/sary/compare';
const PAIRS = [
  ['before-home', 'after-home'],
  ['before-catalogue', 'after-hub'],
];

function ScreenCompare() {
  const [i, setI] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  const seam = useMotionValue(50);
  const smooth = useSpring(seam, { stiffness: 320, damping: 34 });
  const clip = useTransform(smooth, (v) => `inset(0 ${100 - v}% 0 0)`);
  const left = useTransform(smooth, (v) => `${v}%`);
  const beforeTag = useTransform(smooth, [16, 26], [0, 1]);
  const afterTag = useTransform(smooth, [74, 84], [1, 0]);
  const beforeOp = useTransform(smooth, [0, 50, 100], [0.45, 1, 1]);
  const afterOp = useTransform(smooth, [0, 50, 100], [1, 1, 0.45]);
  const inView = useInView(box, { once: true, margin: '-20% 0px' });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView || reduced) return;
    seam.jump(100);
    const t = setTimeout(() => seam.set(50), 350);
    return () => clearTimeout(t);
  }, [inView, reduced, seam]);

  const moveTo = (x: number) => {
    const r = box.current!.getBoundingClientRect();
    seam.set(Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100)));
  };
  const b = BEFORE_AFTER[i];

  return (
    <div className="grid md:grid-cols-[300px_minmax(0,1fr)] gap-10 md:gap-16 items-center">
      <div className="mx-auto w-[260px] md:w-[300px]">
        <div
          ref={box}
          className="relative select-none cursor-ew-resize rounded-[38px] overflow-hidden bg-white"
          style={{ aspectRatio: '414 / 924', touchAction: 'pan-y', boxShadow: '0 0 0 10px #0B0F14, 0 0 0 11px #2a3038, 0 40px 80px -30px rgba(0,0,0,.6)' }}
          onPointerDown={(e) => {
            drag.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            // grabbing the handle keeps the seam where it is; anywhere else jumps to the finger
            if (!(e.target as HTMLElement).closest('[data-handle]')) moveTo(e.clientX);
          }}
          onPointerMove={(e) => drag.current && moveTo(e.clientX)}
          onPointerUp={() => (drag.current = false)}
          onPointerCancel={() => (drag.current = false)}
        >
          <img src={`${CMP}/${PAIRS[i][1]}.webp`} alt={`After: ${b.after}`} width={414} height={924} draggable={false} className="absolute inset-0 w-full h-full" />
          <motion.img
            src={`${CMP}/${PAIRS[i][0]}.webp`}
            alt={`Before: ${b.before}`}
            width={414}
            height={924}
            draggable={false}
            className="absolute inset-0 w-full h-full"
            style={{ clipPath: clip }}
          />
          {/* the seam: a line with a round knob, and a tag on each side that rides along it */}
          <motion.div data-handle className="absolute inset-y-0 w-10 -ml-5 cursor-ew-resize" style={{ left }}>
            <span className="absolute inset-y-0 left-1/2 w-[2px] -ml-px bg-white shadow-[0_0_10px_rgba(0,0,0,0.25)]" />
            <motion.span
              className="absolute top-[54px] right-[calc(50%+8px)] rounded-full bg-[#0F1117] text-white text-[11px] font-semibold px-2.5 py-1 whitespace-nowrap shadow-[0_4px_12px_-4px_rgba(0,0,0,0.5)]"
              style={{ opacity: beforeTag }}
            >
              Before
            </motion.span>
            <motion.span
              className="absolute top-[54px] left-[calc(50%+8px)] rounded-full bg-[#1D368D] text-white text-[11px] font-semibold px-2.5 py-1 whitespace-nowrap shadow-[0_4px_12px_-4px_rgba(0,0,0,0.5)]"
              style={{ opacity: afterTag }}
            >
              After
            </motion.span>
            <span
              role="slider"
              tabIndex={0}
              aria-label="Drag to compare before and after"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuetext="Before on the left, after on the right"
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') seam.set(Math.max(0, seam.get() - 5));
                if (e.key === 'ArrowRight') seam.set(Math.min(100, seam.get() + 5));
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white text-[#1D368D] grid place-items-center shadow-[0_6px_20px_-4px_rgba(0,0,0,0.45),0_0_0_4px_rgba(255,255,255,0.35)] transition-transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7DA2FF]"
            >
              <ChevronsLeftRight className="w-5 h-5" strokeWidth={2.25} />
            </span>
          </motion.div>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Before and after cases">
          {BEFORE_AFTER.map((x, k) => (
            <button
              key={x.n}
              type="button"
              role="tab"
              aria-selected={k === i}
              onClick={() => {
                setI(k);
                seam.set(50);
              }}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${k === i ? 'bg-white text-black' : 'border border-white/15 text-white/60 hover:text-white'}`}
            >
              {x.n} · {x.t}
            </button>
          ))}
        </div>
        <motion.div style={{ opacity: beforeOp }} className="mb-6">
          <p className="text-xs font-semibold mb-1.5 text-[#FF8A8A]">Before</p>
          <p className="text-white/80 text-base md:text-lg leading-relaxed">{b.before}</p>
        </motion.div>
        <motion.div style={{ opacity: afterOp }}>
          <p className="text-xs font-semibold mb-1.5" style={{ color: ACCENT }}>
            After
          </p>
          <p className="text-white text-base md:text-lg leading-relaxed">{b.after}</p>
        </motion.div>
        <p className="text-white/35 text-sm mt-8">Drag the handle on the phone to compare. Screens from the design board.</p>
      </div>
    </div>
  );
}

/* All the Buy Again screens for the marquee gallery. Neighbouring
   columns start on different screens; "Add all" plays live in two. */
const ph = (state: SaryState): Screen => (w) => <SaryPhone state={state} width={w} />;
const live: Screen = (w, on) => <SaryAddAllLoop width={w} playing={on} />;
const SCREENS: Screen[][] = [
  [ph('home'), ph('review'), ph('routine')],
  [ph('hub'), ph('order'), live],
  [ph('added'), ph('home'), ph('review')],
  [live, ph('routine'), ph('hub')],
  [ph('order'), ph('added'), ph('home')],
  [ph('review'), ph('hub'), ph('added')],
];

export function SaryCaseStudy({ onBack, onNext }: CaseStudyComponentProps) {
  return (
    <CaseShell
      chapters={CHAPTERS}
      metaLine="Sary · Buy Again Hub"
      onBack={onBack}
      onNext={onNext}
      resetKey="sary-repeat-customers"
      pillId="sary-tab-pill"
    >
      <div className="max-w-5xl mx-auto px-6 pt-16">
        <SaryCover />
        {/* ── 01 OVERVIEW ── */}
        <ChapterTitle chapter={CHAPTERS[0]} />
        <section id="overview" className="mb-24 scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <CaseIntro
              meta={[
                ['Company', 'Sary'],
                ['Role', 'Product Design Lead'],
                ['Year', '2023'],
              ]}
              glance={{ problem: "Store owners tapped 39 times to restock the same 18 items every week.", role: "Product Design Lead", result: "+28% repeat purchases and +27% order value." }}
              title="Restock in 3 taps, not 39."
            >
              <p>
                Sary is a B2B grocery marketplace in Saudi Arabia. Most store owners buy the same few dozen products every
                week, so I designed a Buy Again hub that turns that routine into one tap.
              </p>
            </CaseIntro>

            <CaseFilm
              src={FILM}
              poster={POSTER}
              vertical={{ src: FILM.replace('.mp4', '-vertical.mp4'), poster: POSTER.replace('.webp', '-vertical.webp') }}
              length="1:00"
              accent={ACCENT}
              buttonTint="#1D368D"
              background="radial-gradient(ellipse 70% 80% at 50% 30%, #1f3474 0%, #0b1022 70%)"
              fallback={<SaryAddAllLoop width={200} />}
              decor="Buy again"
              ticker={['Restock in one tap', 'Running low', 'Weekly routine', 'Sary', 'Al Amana Grocery · Riyadh']}
            />
          </motion.div>
        </section>

        {/* ── 02 PROBLEM ── */}
        <ChapterTitle chapter={CHAPTERS[1]} tone="red" />
        <section id="problem" className="mb-24 scroll-mt-24">
          {/* the whole problem in one view: the statement, and beside it the scene it describes */}
          <motion.div {...reveal} className="grid gap-8 md:gap-14 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-center mb-10">
            <div>
              <p className="text-[#FF8A8A] text-xs font-semibold mb-4">Problem statement</p>
              <p className="text-white text-2xl md:text-[34px] font-bold leading-[1.15] tracking-tight mb-4">
                Stores that order the same basket every week had to build it from scratch every time.
              </p>
              <p className="text-white/55 leading-relaxed">
                The first screen was built for discovery. Last Sunday’s 18 item order wasn’t on it, and most buyers ordered once
                and didn’t come back.
              </p>
              <p className="mt-6 flex items-baseline gap-3 text-white/45 text-sm">
                <span className="text-white text-xl font-semibold tabular-nums">≈ 39 taps</span> before
                <span className="text-white/25">→</span>
                <span className="text-xl font-semibold tabular-nums" style={{ color: ACCENT }}>3</span> after
              </p>
              <p className="text-white/30 text-xs mt-1">Estimated from the two flows, for 18 usual items.</p>
            </div>
            <div className="w-full max-w-[380px] mx-auto md:mx-0 md:justify-self-end">
              <ProblemFilm />
            </div>
          </motion.div>

          {/* the evidence, one line each */}
          <motion.dl
            {...reveal}
            className="grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-[20px] border border-white/[0.06] bg-white/[0.06] mb-20"
          >
            {SIGNALS.map((x) => (
              <div key={x.k} className="bg-[#0B0B0C] p-5">
                <dt className="text-white/35 text-xs font-semibold mb-2">{x.k}</dt>
                <dd className="text-white font-semibold leading-snug">{x.t}</dd>
                <dd className="text-white/45 text-sm leading-snug mt-1">{x.d}</dd>
              </div>
            ))}
          </motion.dl>

          <Eyebrow tone="#FF5F5F">Before and after</Eyebrow>
          <ScreenCompare />

          <motion.blockquote
            {...reveal}
            className="mt-16 border-l-2 pl-6 md:pl-8 text-white text-xl md:text-2xl font-semibold leading-snug tracking-tight max-w-3xl"
            style={{ borderColor: ACCENT }}
          >
            The goal: make the repeat order the starting point, not something owners rebuild by hand.
          </motion.blockquote>
          <MyPart
            accent={ACCENT}
            role="Product Design Lead at Sary, 2023"
            did={<p>I designed the hub around that routine: the usual basket, running-low flags and a reminder on the store’s restock day.</p>}
            calls={[
              { call: 'Make the usual basket the first screen', why: 'Returning stores aren’t browsing. Reordering should start on the first screen, not after a search.' },
              { call: 'Let owners watch their own products go into the cart', why: 'Owners trust what they can see. Adding 18 items at once only feels safe when they watch their own products go in.' },
              { call: 'Say when to reorder, not only what', why: 'Running out costs a store sales. The app knows the cycle, so it should say when.' },
            ]}
          />
        </section>

        {/* ── 03 SCREENS ── */}
        <ChapterTitle chapter={CHAPTERS[2]} />
      </div>
      <section id="screens" className="mb-32 scroll-mt-24">
        <MarqueeGallery columns={SCREENS} aspect={390 / 844} label="All the Buy Again screens, scrolling in columns" />
      </section>
      <div className="max-w-5xl mx-auto px-6 pb-24">
        {/* ── 04 USE CASES ── */}
        <ChapterTitle chapter={CHAPTERS[3]} />
        <section id="cases" className="mb-32 scroll-mt-24">
          <UseCaseExplorer
            cases={USE_CASES}
            accent={ACCENT}
            renderPhone={(c) => (c.live ? <SaryAddAllLoop width={290} /> : <SaryPhone state={c.state} width={290} />)}
          />
        </section>

        {/* ── 05 MOTION ── */}
        <ChapterTitle chapter={CHAPTERS[4]} />
        <section id="motion" className="mb-32 scroll-mt-24">
          {/* framed as a playground, so it reads as something to try before anyone taps */}
          <motion.div
            {...reveal}
            className="rounded-[28px] border border-white/10 bg-[#111214] overflow-hidden"
          >
            <div className="flex items-center justify-between gap-4 px-5 md:px-7 py-4 border-b border-white/[0.06] bg-[#111214]/80">
              <span className="flex items-center gap-2.5 text-sm font-medium text-white whitespace-nowrap">
                <MousePointerClick className="w-4 h-4" style={{ color: ACCENT }} />
                Interactive prototype
              </span>
              <span className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs text-white/60 whitespace-nowrap">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inset-0 rounded-full opacity-60 motion-safe:animate-ping" style={{ background: ACCENT }} />
                  <span className="relative w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
                </span>
                Live<span className="hidden sm:inline"> · tap to try</span>
              </span>
            </div>
            <div className="flex justify-center px-4 py-10 md:py-16">
              <SaryAddAllPlay width={300} />
            </div>
          </motion.div>
        </section>

        {/* ── 06 CAMPAIGNS ── */}
        <ChapterTitle chapter={CHAPTERS[5]} />
        <section id="campaigns" className="scroll-mt-24">
          <motion.p {...reveal} className="max-w-2xl text-white/70 text-lg leading-relaxed mb-10">
            Buy Again sits inside Sary’s catalogue, and the catalogue runs on banners: brand launches, seasonal deals, cashback,
            coupons. These are twelve of them, rebuilt in English from the original Arabic files with the same art and grid.
          </motion.p>
          <motion.div {...reveal}>
            <CampaignStage />
          </motion.div>
        </section>
      </div>
      <div className="mt-10 mb-32">
        <BannerWall />
      </div>
      <div className="max-w-5xl mx-auto px-6 pb-24">
        {/* ── 07 IMPACT ── */}
        <ChapterTitle chapter={CHAPTERS[6]} />
        <section id="impact" className="mb-16 scroll-mt-24">
          <LeadStats lead={RESULTS[0]} note="The number this project was built to move." rest={RESULTS.slice(1)} accent={ACCENT} />
          <Learnings accent={ACCENT}>
            <p>
              Order history turned out to be the clearest research we had: the same stores, ordering the same basket, week
              after week. Since then I look at what people repeat before I design for what they might discover. Taking steps
              out of a routine people already have is often worth more than a new feature.
            </p>
          </Learnings>
          <Takeaway
            accent={ACCENT}
            deep="#1D368D"
            note="Next on Sary, we keep watching the repeat-order rate, time to checkout, and the share of orders that start from Buy Again."
          >
            Store owners were already reordering the same basket every week. The{' '}
            <span style={{ color: ACCENT }}>biggest win</span> wasn’t a bigger redesign: it was putting that basket first, one
            tap away.
          </Takeaway>
        </section>
      </div>
    </CaseShell>
  );
}
