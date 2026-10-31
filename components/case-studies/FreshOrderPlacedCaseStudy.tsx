import { motion } from 'motion/react';
import { CaseShell } from './_shared/CaseShell';
import { ChapterTitle } from './_shared/ChapterTitle';
import { CaseIntro, LeadStats, Takeaway } from './_shared/CaseLayout';
import type { Chapter, CaseStudyComponentProps } from './_shared/types';
import { FreshPhone, LoopingPhone, type PhoneState } from './fresh/FreshPhone';
import { FreshPlay } from './fresh/FreshPlay';
import { MousePointerClick } from 'lucide-react';
import { MarqueeGallery, type Screen } from './_shared/MarqueeGallery';
import { CaseFilm, Eyebrow as BaseEyebrow, UseCaseExplorer, reveal, type UseCase as BaseUseCase } from './_shared/CaseBits';

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

   The film is public/videos/fresh-order-placed.mp4; if it ever
   fails to load, the hero plays the sequence live in code. */

const ACCENT = '#5FE0A2';
const FILM = '/videos/fresh-order-placed.mp4';
const POSTER = '/images/case-studies/fresh/film-poster.webp';

const CHAPTERS: Chapter[] = [
  { id: 'overview', num: '01', roman: 'I', label: 'Overview', beat: 'The screen after Pay.' },
  { id: 'problem', num: '02', roman: 'II', label: 'Problem', beat: 'Where we saw it.' },
  { id: 'insight', num: '03', roman: 'III', label: 'Insights', beat: 'What we learned.' },
  { id: 'standards', num: '04', roman: 'IV', label: 'Standards', beat: 'Rules for every screen.' },
  { id: 'screens', num: '05', roman: 'V', label: 'Screens', beat: 'Every state, side by side.' },
  { id: 'cases', num: '06', roman: 'VI', label: 'Use Cases', beat: 'Each state and its design.' },
  { id: 'motion', num: '07', roman: 'VII', label: 'Motion', beat: 'Try the five seconds yourself.' },
  { id: 'impact', num: '08', roman: 'VIII', label: 'Impact', beat: 'What we measure.' },
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

type UseCase = BaseUseCase & { state: PhoneState; live?: boolean };

const Eyebrow = ({ children, tone = ACCENT }: { children: React.ReactNode; tone?: string }) => (
  <BaseEyebrow tone={tone}>{children}</BaseEyebrow>
);

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
    title: 'Scheduled order',
    state: 'scheduled',
    what: 'Shows when it arrives, when the card is charged, and that tracking starts when the kitchen does.',
    why: 'An order for later needs different copy than a live one.',
    shown: 'People who schedule ahead',
    measured: 'Tracking opens when cooking starts',
  },
  {
    id: 'late',
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
  { v: '9', k: 'Designed states' },
  { v: '14.5s', k: 'Motion timeline' },
  { v: '47s', k: 'Launch film' },
  { v: '1', k: 'Clock for ring and cancel' },
];

/* Every Order placed state for the marquee gallery. The placing
   countdown plays live in two columns. */
const ph = (state: PhoneState): Screen => (w) => <FreshPhone state={state} width={w} progress={0.45} />;
const live: Screen = (w, on) => <LoopingPhone width={w} only="placing" playing={on} />;
const SCREENS: Screen[][] = [
  [ph('placed'), ph('edit-address'), ph('sent')],
  [live, ph('late'), ph('edit-items')],
  [ph('scheduled'), ph('burst'), ph('cancelled')],
  [ph('edit-items'), live, ph('placed')],
  [ph('sent'), ph('scheduled'), ph('late')],
  [ph('cancelled'), ph('placing'), ph('burst')],
];

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
      <div className="max-w-5xl mx-auto px-6 pt-16">
        {/* ── 01 OVERVIEW ── */}
        <ChapterTitle chapter={CHAPTERS[0]} />
        <section id="overview" className="mb-32 scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <CaseIntro
              meta={[
                ['Company', 'fresh'],
                ['Role', 'Product Designer (Freelance)'],
                ['Year', 'Now'],
              ]}
              title="The five seconds after Pay."
            >
              <p>Most delivery apps show a spinner after you pay.</p>
              <p>
                I used those seconds to let people fix the two most costly mistakes, a wrong address and wrong items, then
                sent them straight to tracking.
              </p>
            </CaseIntro>

            <CaseFilm
              src={FILM}
              poster={POSTER}
              length="0:47"
              accent={ACCENT}
              buttonTint="#103F2D"
              background="radial-gradient(ellipse 70% 80% at 50% 30%, #173a2b 0%, #0F1311 70%)"
              fallback={<LoopingPhone width={200} />}
              decor="Order placed"
              ticker={['5 second window', 'Edit before cancel', 'Sent to Vapiano', 'fresh', 'Arrives 19:45']}
            />
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
              <span className="text-[#FF5F5F]/70 text-xs font-semibold">Problem statement</span>
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
                <p className="text-white/35 text-xs font-semibold mb-4">{s.k}</p>
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
                <span className="block text-5xl font-semibold tracking-[-0.03em] mb-4" style={{ color: ACCENT, opacity: 0.35 }}>
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
                  <p className="text-white/35 text-xs font-semibold mb-3">{f.k}</p>
                  <p className="text-white text-4xl font-semibold tracking-[-0.04em] mb-3">{f.v}</p>
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

        {/* ── 05 SCREENS ── */}
        <ChapterTitle chapter={CHAPTERS[4]} />
      </div>
      <section id="screens" className="mb-32 scroll-mt-24">
        <MarqueeGallery columns={SCREENS} aspect={440 / 956} label="Every Order placed state, scrolling in columns" />
      </section>
      <div className="max-w-5xl mx-auto px-6 pb-24">
        {/* ── 06 USE CASES ── */}
        <ChapterTitle chapter={CHAPTERS[5]} />
        <section id="cases" className="mb-32 scroll-mt-24">
          <UseCaseExplorer
            cases={USE_CASES}
            accent={ACCENT}
            renderPhone={(c) =>
              c.live ? <LoopingPhone width={290} only="placing" /> : <FreshPhone state={c.state} width={290} />
            }
          />
        </section>

        {/* ── 07 MOTION ── */}
        <ChapterTitle chapter={CHAPTERS[6]} />
        <section id="motion" className="mb-32 scroll-mt-24">
          {/* framed as a playground, so it reads as something to try before anyone taps */}
          <motion.div {...reveal} className="rounded-[28px] border border-white/10 bg-[#111214] overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-5 md:px-7 py-4 border-b border-white/[0.06]">
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
              <FreshPlay width={300} />
            </div>
          </motion.div>
        </section>

        {/* ── 08 IMPACT ── */}
        <ChapterTitle chapter={CHAPTERS[7]} />
        <section id="impact" className="mb-16 scroll-mt-24">
          <LeadStats lead={SHIPPED[0]} note="Every moment between Pay and tracking, designed." rest={SHIPPED.slice(1)} accent={ACCENT} />

          <motion.div {...reveal} className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 md:gap-16 mb-20">
            {(
              [
                { dir: 'down', label: 'Should go down', arrow: '↓', color: '#FFB547' },
                { dir: 'up', label: 'Should go up', arrow: '↑', color: ACCENT },
              ] as const
            ).map((g) => (
              <div key={g.dir}>
                <p className="text-sm mb-4" style={{ color: g.color }}>
                  {g.arrow} {g.label}
                </p>
                <ul className="grid gap-4">
                  {KPIS.filter((k) => k.dir === g.dir).map((k) => {
                    const result = RESULTS.find((r) => r.k === k.k);
                    return (
                      <li key={k.k} className="flex items-baseline justify-between gap-6">
                        <span>
                          <span className="block text-white font-medium">{k.k}</span>
                          <span className="block text-white/45 text-sm leading-relaxed">{k.d}</span>
                        </span>
                        {result && <span className="text-white text-2xl font-semibold tracking-[-0.03em] shrink-0">{result.v}</span>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </motion.div>

          <Takeaway
            accent={ACCENT}
            deep="#103F2D"
            note={RESULTS.length === 0 ? 'The pilot is running. Each screen has a metric, and results go here when it ends.' : undefined}
          >
            Small screens can carry <span style={{ color: ACCENT }}>big costs</span>. Design for the moment people are already
            looking, and give them control while a fix is still cheap.
          </Takeaway>
        </section>
      </div>
    </CaseShell>
  );
}
