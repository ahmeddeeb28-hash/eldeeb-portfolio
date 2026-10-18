import { motion, AnimatePresence } from 'motion/react';
import { useRef, useState } from 'react';
import { Play, Volume2 } from 'lucide-react';
import { CaseShell } from './_shared/CaseShell';
import { ChapterTitle } from './_shared/ChapterTitle';
import { Meta } from './_shared/Meta';
import type { Chapter, CaseStudyComponentProps } from './_shared/types';
import { FreshPhone, LoopingPhone, type PhoneState } from './fresh/FreshPhone';

/* ── fresh · Order placed ────────────────────────────
   One moment, end to end: the five seconds after a diner
   taps Pay. Sources are the Figma storyboard ("Order placed ·
   motion", frames K1 to K7, K1a, K1b and the M1 timeline) and
   the checkout-motion prototype. Every rationale and "measured
   by" line is the one written on the Figma stickies.

   Pilot numbers do not exist yet, so the Impact chapter lists
   what each screen is measured by and leaves the results slot
   empty on purpose. Add real figures to RESULTS when they land;
   nothing renders a number that is not there.

   The film lives at public/videos/fresh-order-placed.mp4. Until
   that file is added the hero plays the sequence live in code. */

const ACCENT = '#5FE0A2';
const FILM = '/videos/fresh-order-placed.mp4';
const POSTER = '/images/case-studies/fresh/poster.webp';

const CHAPTERS: Chapter[] = [
  { id: 'overview', num: '01', roman: 'I', label: 'Overview', beat: 'The screen after Pay.' },
  { id: 'problem', num: '02', roman: 'II', label: 'Problem', beat: 'Where we saw it.' },
  { id: 'insight', num: '03', roman: 'III', label: 'Insights', beat: 'What we learned.' },
  { id: 'standards', num: '04', roman: 'IV', label: 'Standards', beat: 'Rules for every screen.' },
  { id: 'cases', num: '05', roman: 'V', label: 'Use Cases', beat: 'Each state and its design.' },
  { id: 'impact', num: '06', roman: 'VI', label: 'Impact', beat: 'What we measure.' },
];

/* Where the problem showed up. Summaries, not quotes. */
const SIGNALS = [
  {
    k: 'Reviews & feedback',
    t: 'Saw the mistake, couldn’t fix it',
    d: 'People noticed a wrong address or item right after paying. The screen only showed a spinner.',
  },
  {
    k: 'Support',
    t: 'Wrong orders and “where’s my food?”',
    d: 'Tickets about wrong addresses and items, and people asking for an update after placing.',
  },
  {
    k: 'Cancellations',
    t: 'Cancel was the only way out',
    d: 'Orders cancelled right after Pay that a small edit could have saved.',
  },
  {
    k: 'Audience',
    t: 'Everyone who pays',
    d: 'Delivery, grocery, pickup, scheduled orders and team orders where each person pays their share.',
  },
];

const INSIGHTS = [
  {
    n: '01',
    t: 'People watch the screen after Pay.',
    d: 'They wait to see that it worked. A spinner gives them nothing to do with that attention.',
  },
  {
    n: '02',
    t: 'Mistakes show up at the last second.',
    d: 'An old address or a wrong quantity is easy to spot once the order feels final. That was the moment we had no fix for.',
  },
  {
    n: '03',
    t: 'Cancelling is too much for a small fix.',
    d: 'If cancel is the only option, a quick correction turns into a lost order, a refund and often a ticket.',
  },
  {
    n: '04',
    t: 'No update means more support contacts.',
    d: 'A spinner followed by a screen with no next step is what makes people ask where their food is.',
  },
];

const STANDARDS = [
  { t: 'One clock', d: 'The ring and the cancel window use the same 5 second timer.' },
  { t: 'Edit before cancel', d: 'Address and items are one tap away. Editing pauses the clock and keeps the same order.' },
  { t: 'Free to cancel', d: 'Cancel inside the window and nothing is charged. The cart stays as it was.' },
  { t: 'Always a next step', d: 'Tracking opens after 5 seconds. Touching the screen pauses it.' },
  { t: 'Celebrate after, not before', d: 'The bag and confetti come only once the order is sent.' },
  { t: 'Reduced motion', d: 'One timeline for the whole sequence, and a simpler version for people who turn motion off.' },
];

/* The M1 timeline. */
const TIMELINE = [
  { at: '0.6s', t: 'Pause', d: 'The screen settles first.' },
  { at: '5s', t: 'Ring and countdown', d: 'Progress and the cancel window together.' },
  { at: 'Tick', t: 'Sent to Vapiano', d: 'Confirmation before the celebration.' },
  { at: '650ms', t: 'Bag pop', d: 'With confetti in brand colours.' },
  { at: '90ms', t: 'Cards slide up', d: 'Arrival time, savings, receipt.' },
  { at: '5s', t: 'Tracking', d: 'Opens unless you’re still reading.' },
];

/* The numbers on the success screen. */
const FEATURED = [
  { v: '19:45', k: 'When', d: 'An arrival time instead of “on its way”.' },
  { v: '$4.00', k: 'Saved', d: 'What the order saved, plus a scratch card.' },
  { v: '$24.19', k: 'Paid', d: 'Amount and payment method, receipt one tap away.' },
  { v: '5s', k: 'Time left', d: 'How long you still have to change your mind.' },
];

type UseCase = {
  id: string;
  code: string;
  title: string;
  state: PhoneState;
  live?: boolean;
  what: string;
  why: string;
  shown: string;
  measured: string;
};

const USE_CASES: UseCase[] = [
  {
    id: 'placing',
    code: 'K1 to K4',
    title: 'Placing (5 seconds)',
    state: 'placing',
    live: true,
    what: 'The ring fills around the delivery address. Address and items each have an Edit button. Cancel is free and shows the seconds left.',
    why: 'Show progress as soon as Pay is tapped, instead of a spinner.',
    shown: 'Everyone who pays',
    measured: 'Wrong-address cancels, drop-offs while placing, cancels in the window',
  },
  {
    id: 'address',
    code: 'K1a',
    title: 'Edit address',
    state: 'edit-address',
    what: 'Opens saved places. The clock pauses and the order waits. Picking a new place keeps the same order and payment.',
    why: 'A wrong address is the most expensive mistake. This catches it before the kitchen starts.',
    shown: 'Anyone who taps Edit on the address',
    measured: 'Address edits vs wrong-address tickets',
  },
  {
    id: 'items',
    code: 'K1b',
    title: 'Edit items',
    state: 'edit-items',
    what: 'Change quantities in place. Changed lines are marked, and the clock waits.',
    why: 'People spot a wrong quantity at the last second.',
    shown: 'Anyone who taps Edit on the order',
    measured: 'Item edits vs cancels',
  },
  {
    id: 'cancel',
    code: 'Cancel',
    title: 'Cancel in time',
    state: 'cancelled',
    what: 'The ring rewinds, nothing is charged and the cart comes back.',
    why: 'A clear countdown before any money moves.',
    shown: 'People who cancel within 5 seconds',
    measured: 'Support tickets about mistakes',
  },
  {
    id: 'sent',
    code: 'K5',
    title: 'Sent to the restaurant',
    state: 'sent',
    what: 'The ring closes and a tick confirms the restaurant has the order.',
    why: 'Confirmation before the celebration.',
    shown: 'Everyone, after the window',
    measured: 'Time to confirmation',
  },
  {
    id: 'burst',
    code: 'K6',
    title: 'Success',
    state: 'burst',
    what: 'The map shrinks, the bag pops in, confetti in brand greens and gold.',
    why: 'The brand shows up at the success moment.',
    shown: 'Every confirmed order',
    measured: 'Time to next tap',
  },
  {
    id: 'placed',
    code: 'K7',
    title: 'Order placed',
    state: 'placed',
    what: 'Arrival time, savings and receipt slide up. Tracking opens in 5 seconds; touching the screen pauses it.',
    why: 'Leads into tracking with no dead end.',
    shown: 'Every confirmed order',
    measured: 'Scratch card reveals, tracking opens',
  },
  {
    id: 'scheduled',
    code: 'Scheduled',
    title: 'Scheduled order',
    state: 'scheduled',
    what: 'Shows when it arrives, when the card is charged, and that tracking starts when the kitchen does.',
    why: 'An order for later needs different copy than a live one.',
    shown: 'People who schedule ahead',
    measured: 'Tracking opens when cooking starts',
  },
  {
    id: 'late',
    code: 'Late',
    title: 'Running late',
    state: 'late',
    what: 'We tell people first: how late, why, and a credit added to their wallet.',
    why: 'Telling people early keeps their trust.',
    shown: 'Orders behind the promised time',
    measured: '“Where’s my food?” contacts',
  },
];

const KPIS = [
  { k: 'Wrong-address cancels', dir: 'down', d: 'Fixed with Edit before a rider is assigned.' },
  { k: 'Edits vs cancels', dir: 'up', d: 'More edits, fewer cancelled orders.' },
  { k: 'Tickets about mistakes', dir: 'down', d: 'Wrong address and wrong item contacts.' },
  { k: '“Where’s my food?”', dir: 'down', d: 'Clear next step and early late notices.' },
  { k: 'Drop-offs while placing', dir: 'down', d: 'People leaving during the wait.' },
  { k: 'Tracking opens', dir: 'up', d: 'People landing on live tracking.' },
];

/* Pilot results go here, e.g. { k: 'Wrong-address cancels', v: '−18%' }.
   Empty until there are real numbers. */
const RESULTS: { k: string; v: string }[] = [];

const SHIPPED = [
  { v: '9', k: 'designed states' },
  { v: '14.5s', k: 'motion timeline' },
  { v: '47s', k: 'launch film' },
  { v: '1', k: 'clock for ring and cancel' },
];

/* ── film ── */
function Film() {
  const ref = useRef<HTMLVideoElement>(null);
  const [hasFilm, setHasFilm] = useState(true);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = false;
    v.currentTime = 0;
    v.controls = true;
    void v.play();
    setPlaying(true);
  };

  return (
    <div
      className="relative aspect-[16/9] rounded-[32px] overflow-hidden border border-white/5"
      style={{ background: 'radial-gradient(ellipse 70% 80% at 50% 30%, #173a2b 0%, #0F1311 70%)' }}
    >
      {hasFilm ? (
        <>
          <video
            ref={ref}
            src={FILM}
            poster={POSTER}
            muted
            loop={!playing}
            autoPlay
            playsInline
            preload="metadata"
            onError={() => setHasFilm(false)}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {!playing && (
            <button
              type="button"
              onClick={play}
              className="absolute inset-0 flex items-end justify-start p-6 md:p-8 bg-gradient-to-t from-black/60 via-transparent to-transparent group"
              aria-label="Play the film with sound"
            >
              <span className="flex items-center gap-3 rounded-full bg-white text-black pl-2 pr-5 py-2 text-sm font-bold group-hover:scale-[1.03] transition-transform">
                <span className="w-9 h-9 rounded-full bg-[#103F2D] text-white grid place-items-center">
                  <Play className="w-4 h-4 fill-current" />
                </span>
                Watch the film
                <span className="flex items-center gap-1 text-black/50 font-semibold">
                  <Volume2 className="w-3.5 h-3.5" /> 0:47
                </span>
              </span>
            </button>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center gap-10 px-6">
          <div className="scale-[0.5] sm:scale-75 md:scale-100 origin-center">
            <LoopingPhone width={196} />
          </div>
          <div className="hidden md:block max-w-[260px]">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: ACCENT }}>
              Live preview</p>
            <p className="text-white/70 text-sm leading-relaxed">
              Ring and countdown, confirmation, success, then arrival time, savings and receipt.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── use cases explorer ── */
function UseCases() {
  const [active, setActive] = useState(0);
  const c = USE_CASES[active];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-10 items-start">
      <div>
        <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Use cases">
          {USE_CASES.map((u, i) => (
            <button
              key={u.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-colors border ${
                i === active
                  ? 'bg-white text-black border-white'
                  : 'border-white/10 text-white/60 hover:text-white hover:border-white/30'
              }`}
            >
              {u.code.startsWith('K') && (
                <span className={i === active ? 'text-black/40' : 'text-white/30'}>{u.code} </span>
              )}
              {u.title}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: ACCENT }}>
              {c.code.startsWith('K') ? c.code : 'Extra case'} · {String(active + 1).padStart(2, '0')} / {String(USE_CASES.length).padStart(2, '0')}
            </p>
            <h3 className="text-white text-3xl md:text-4xl font-black tracking-tight mb-4">{c.title}</h3>
            <p className="text-white/60 text-base md:text-lg leading-relaxed mb-8 max-w-xl">{c.what}</p>

            <dl className="grid gap-px rounded-2xl overflow-hidden border border-white/10 bg-white/10 max-w-xl">
              {[
                ['Why it exists', c.why],
                ['Shown to', c.shown],
                ['Measured by', c.measured],
              ].map(([k, v]) => (
                <div key={k} className="bg-[#0D0D0D] px-5 py-4 grid grid-cols-[110px_1fr] gap-4">
                  <dt className="text-white/35 text-[10px] font-black uppercase tracking-[0.2em] pt-0.5">{k}</dt>
                  <dd className="text-white/85 text-sm leading-relaxed">{v}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center lg:sticky lg:top-40">
        <AnimatePresence mode="wait">
          <motion.div
            key={c.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
          >
            {c.live ? <LoopingPhone width={290} only="placing" /> : <FreshPhone state={c.state} width={290} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Eyebrow({ children, tone = ACCENT }: { children: React.ReactNode; tone?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: tone }} />
      <span className="text-[10px] font-black uppercase tracking-[0.32em]" style={{ color: tone, opacity: 0.8 }}>
        {children}
      </span>
      <span className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
    </div>
  );
}

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10% 0px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

export function FreshOrderPlacedCaseStudy({ onBack, onNext }: CaseStudyComponentProps) {
  return (
    <CaseShell
      chapters={CHAPTERS}
      metaLine="fresh · Order placed"
      onBack={onBack}
      onNext={onNext}
      resetKey="fresh-order-placed"
      pillId="fresh-tab-pill"
    >
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-24">
        {/* ── 01 OVERVIEW ── */}
        <ChapterTitle chapter={CHAPTERS[0]} />
        <section id="overview" className="mb-32 scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.32em] mb-6" style={{ color: ACCENT }}>
              fresh · food & grocery delivery
            </p>
            <h1 className="text-white text-5xl md:text-7xl font-black mb-8 leading-[0.95] tracking-tight max-w-4xl">
              The five seconds after Pay.
            </h1>
            <p className="text-white/50 text-lg md:text-xl leading-relaxed max-w-2xl mb-12">
              Most delivery apps show a spinner after you pay. I used those seconds to let people fix the two most costly mistakes, a wrong address and wrong items, then sent them straight to tracking.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 py-6 border-y border-white/10 mb-12">
              <Meta label="Role" value="Lead Product Designer" />
              <Meta label="Scope" value="Order placed moment" />
              <Meta label="Deliverables" value="9 states · motion · film" />
              <Meta label="Platform" value="iOS · Android" />
            </div>

            <Film />
          </motion.div>
        </section>

        {/* ── 02 PROBLEM ── */}
        <ChapterTitle chapter={CHAPTERS[1]} tone="red" />
        <section id="problem" className="mb-32 scroll-mt-24">
          <motion.div
            {...reveal}
            className="relative rounded-[36px] border border-[#FF5F5F]/15 bg-gradient-to-b from-[#FF5F5F]/[0.04] to-transparent p-8 md:p-14 mb-16"
          >
            <div className="flex items-center gap-2 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF5F5F] animate-pulse" />
              <span className="text-[#FF5F5F]/70 text-[9px] font-black uppercase tracking-[0.4em]">Problem statement</span>
            </div>
            <p className="text-white text-2xl md:text-4xl font-bold leading-[1.15] tracking-tight max-w-3xl mb-8">
              Right after Pay, people are watching the screen but can’t change anything.
            </p>
            <p className="text-white/55 text-base md:text-lg leading-relaxed max-w-2xl">
              The screen showed a spinner. If the address or an item was wrong, the only option was to cancel the whole order. A small mistake became a lost order, a refund, a support ticket or a rider at the wrong door.
            </p>
          </motion.div>

          <Eyebrow tone="#FF5F5F">How we detected it</Eyebrow>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SIGNALS.map((s, i) => (
              <motion.div
                key={s.k}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.06 }}
                className="rounded-[24px] border border-white/5 bg-[#0D0D0D] p-7"
              >
                <p className="text-white/35 text-[10px] font-black uppercase tracking-[0.25em] mb-4">{s.k}</p>
                <p className="text-white text-xl font-bold tracking-tight mb-2">{s.t}</p>
                <p className="text-white/50 text-sm leading-relaxed">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 03 INSIGHTS ── */}
        <ChapterTitle chapter={CHAPTERS[2]} tone="teal" />
        <section id="insight" className="mb-32 scroll-mt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            {INSIGHTS.map((it, i) => (
              <motion.div key={it.n} {...reveal} transition={{ ...reveal.transition, delay: i * 0.06 }}>
                <span className="block text-5xl font-black tracking-tight mb-4" style={{ color: ACCENT, opacity: 0.35 }}>
                  {it.n}
                </span>
                <p className="text-white text-2xl font-bold tracking-tight mb-3">{it.t}</p>
                <p className="text-white/50 leading-relaxed">{it.d}</p>
              </motion.div>
            ))}
          </div>

          <motion.blockquote
            {...reveal}
            className="mt-20 border-l-2 pl-6 md:pl-8 text-white text-2xl md:text-3xl font-bold leading-snug tracking-tight max-w-3xl"
            style={{ borderColor: ACCENT }}
          >
            The goal: give people control during the wait, then tell them clearly what happens next.
          </motion.blockquote>
        </section>

        {/* ── 04 STANDARDS ── */}
        <ChapterTitle chapter={CHAPTERS[3]} />
        <section id="standards" className="mb-32 scroll-mt-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-20">
            {STANDARDS.map((s, i) => (
              <motion.div
                key={s.t}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.05 }}
                className="rounded-[24px] border border-white/5 bg-[#0D0D0D] p-7"
              >
                <span className="block w-8 h-[2px] rounded-full mb-6" style={{ background: ACCENT }} />
                <p className="text-white text-lg font-bold tracking-tight mb-2">{s.t}</p>
                <p className="text-white/50 text-sm leading-relaxed">{s.d}</p>
              </motion.div>
            ))}
          </div>

          <Eyebrow>Managing expectations, beat by beat</Eyebrow>
          <ol className="grid grid-cols-2 md:grid-cols-6 gap-px rounded-2xl overflow-hidden border border-white/10 bg-white/10 mb-20">
            {TIMELINE.map((b, i) => (
              <motion.li
                key={b.t}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.05 }}
                className="bg-[#0D0D0D] p-5"
              >
                <span className="block font-mono text-xs mb-3" style={{ color: ACCENT }}>
                  {b.at}
                </span>
                <span className="block text-white text-sm font-bold mb-1">{b.t}</span>
                <span className="block text-white/45 text-xs leading-relaxed">{b.d}</span>
              </motion.li>
            ))}
          </ol>

          <Eyebrow>The numbers we chose to feature</Eyebrow>
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_260px] gap-10 items-center">
            <div className="grid grid-cols-2 gap-3">
              {FEATURED.map((f, i) => (
                <motion.div
                  key={f.k}
                  {...reveal}
                  transition={{ ...reveal.transition, delay: i * 0.06 }}
                  className="rounded-[24px] border border-white/5 bg-[#0D0D0D] p-6"
                >
                  <p className="text-white/35 text-[10px] font-black uppercase tracking-[0.25em] mb-3">{f.k}</p>
                  <p className="text-white text-4xl font-black tracking-[-0.04em] mb-3">{f.v}</p>
                  <p className="text-white/50 text-sm leading-relaxed">{f.d}</p>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center">
              <FreshPhone state="placed" width={250} />
            </div>
          </div>
          <p className="text-white/35 text-xs mt-6 max-w-xl">
            Values from the prototype order.
          </p>
        </section>

        {/* ── 05 USE CASES ── */}
        <ChapterTitle chapter={CHAPTERS[4]} tone="teal" />
        <section id="cases" className="mb-32 scroll-mt-24">
          <UseCases />
        </section>

        {/* ── 06 IMPACT ── */}
        <ChapterTitle chapter={CHAPTERS[5]} />
        <section id="impact" className="mb-16 scroll-mt-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-16">
            {SHIPPED.map((s, i) => (
              <motion.div
                key={s.k}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.06 }}
                className="rounded-[24px] border border-white/5 bg-[#0D0D0D] p-6"
              >
                <p className="text-white text-4xl md:text-5xl font-black tracking-[-0.04em] mb-2">{s.v}</p>
                <p className="text-white/45 text-sm">{s.k}</p>
              </motion.div>
            ))}
          </div>

          <Eyebrow>How we measure the lift</Eyebrow>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
            {KPIS.map((k, i) => {
              const result = RESULTS.find((r) => r.k === k.k);
              return (
                <motion.div
                  key={k.k}
                  {...reveal}
                  transition={{ ...reveal.transition, delay: i * 0.05 }}
                  className="rounded-[24px] border border-white/5 bg-[#0D0D0D] p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-white font-bold">{k.k}</p>
                    <span
                      className="text-[10px] font-black uppercase tracking-[0.2em]"
                      style={{ color: k.dir === 'up' ? ACCENT : '#FFB547' }}
                    >
                      {k.dir === 'up' ? '↑ aim up' : '↓ aim down'}
                    </span>
                  </div>
                  {result && <p className="text-white text-3xl font-black tracking-tight mb-2">{result.v}</p>}
                  <p className="text-white/50 text-sm leading-relaxed">{k.d}</p>
                </motion.div>
              );
            })}
          </div>

          {RESULTS.length === 0 && (
            <motion.div
              {...reveal}
              className="rounded-[24px] border border-dashed border-white/15 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 mb-20"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
                Pilot in progress
              </span>
              <p className="text-white/60 text-sm leading-relaxed">
                Each screen has a metric. Results will go here when the pilot ends.
              </p>
            </motion.div>
          )}

          <motion.div {...reveal} className="max-w-3xl">
            <Eyebrow>What I carry forward</Eyebrow>
            <p className="text-white text-2xl md:text-3xl font-bold leading-snug tracking-tight">
              Small screens can carry big costs. Design for the moment people are already looking, and give them control while a fix is still cheap.
            </p>
          </motion.div>
        </section>
      </div>
    </CaseShell>
  );
}
