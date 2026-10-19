import { motion } from 'motion/react';
import { CaseShell } from './_shared/CaseShell';
import { ChapterTitle } from './_shared/ChapterTitle';
import { Meta } from './_shared/Meta';
import { CaseFilm, Eyebrow as BaseEyebrow, UseCaseExplorer, reveal, type UseCase as BaseUseCase } from './_shared/CaseBits';
import type { Chapter, CaseStudyComponentProps } from './_shared/types';
import { SaryAddAllLoop, SaryPhone, type SaryState } from './sary/SaryPhone';

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
  { id: 'problem', num: '02', roman: 'II', label: 'Problem', beat: 'Where we saw it.' },
  { id: 'insight', num: '03', roman: 'III', label: 'Insights', beat: 'What we learned.' },
  { id: 'cases', num: '04', roman: 'IV', label: 'Use Cases', beat: 'Each case and its design.' },
  { id: 'motion', num: '05', roman: 'V', label: 'Motion', beat: 'Add all, frame by frame.' },
  { id: 'impact', num: '06', roman: 'VI', label: 'Impact', beat: 'What changed.' },
];

const SIGNALS = [
  {
    k: 'Analytics',
    t: 'Buyers left after checkout',
    d: '85% of buyers left right after Confirm Order. The generic “You might also like” sidebar went unseen.',
  },
  {
    k: 'Session replays',
    t: 'Suggestions didn’t fit',
    d: 'Owners hovered over suggestions and then closed the app. The products didn’t match their kind of store.',
  },
  {
    k: 'Segments',
    t: 'Wrong shelf',
    d: 'Café owners had the most room to grow, but 60% of what they were shown was irrelevant to them.',
  },
  {
    k: 'Order history',
    t: 'Same basket every week',
    d: 'Stores reorder the same few dozen products, usually on the same day of the week.',
  },
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

const INSIGHTS = [
  {
    n: '01',
    t: 'Returning stores aren’t browsing.',
    d: 'They come back for the same products. Banners and category rails slow them down.',
  },
  {
    n: '02',
    t: 'Owners trust what they can see.',
    d: 'Adding 18 items at once only feels safe when they watch their own products go into the cart.',
  },
  {
    n: '03',
    t: 'Timing matters as much as products.',
    d: 'Stores restock on a cycle, often the same weekday. A reminder on that day turns one order into a habit.',
  },
  {
    n: '04',
    t: 'Relevance beats volume.',
    d: 'Suggestions only work when they come from what this store already buys.',
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

const MOTION = [
  { k: 'K1', t: 'Tap', at: '0–120 ms', what: 'The button presses in and darkens. Light haptic.', why: 'Instant feedback. Nothing moves yet, so a mis-tap can still be cancelled.' },
  { k: 'K2', t: 'Lift', at: '120–520 ms', what: 'The six preview items lift off the card and arc into the cart, 40 ms apart.', why: 'Owners trust Add all when they see their own products go in.' },
  { k: 'K3', t: 'Land', at: '520–760 ms', what: 'The cart badge bumps and rolls from 3 to 21. The button turns green: Added.', why: 'Confirms the count without a toast and stops double adds.' },
  { k: 'K4', t: 'Cart bar', at: '760–1060 ms', what: 'The cart bar slides up with the new total and Free delivery unlocked.', why: 'Money is the first thing an owner checks.' },
  { k: 'K5', t: 'Sheet', at: '1060–1400 ms', what: 'A sheet rises with a tick, the summary and SAR saved.', why: 'Closes the loop with the value and the next step.' },
  { k: 'K6', t: 'Routine', at: 'On tap', what: 'Remind me every Sunday: the switch slides and a toast confirms.', why: 'Turns a one-off reorder into a weekly habit.' },
];

const RESULTS = [
  { v: '+28%', k: 'Repeat purchases' },
  { v: '+27%', k: 'Average order value' },
  { v: '+42%', k: 'Interaction with suggestions' },
  { v: '+20%', k: 'Auto-reorder habit' },
];

const SIGNALS_TRACKED = [
  { k: 'Repeat-order rate', d: 'Stores that order again within their cycle.' },
  { k: 'Time to checkout', d: 'From opening the app to paying, for returning stores.' },
  { k: 'Orders from Buy Again', d: 'Share of orders that start on the hub or the Welcome back card.' },
];

const Eyebrow = ({ children, tone = ACCENT }: { children: React.ReactNode; tone?: string }) => (
  <BaseEyebrow tone={tone}>{children}</BaseEyebrow>
);

/* 39 taps vs 3, drawn as dots. */
function TapCount() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {[
        { label: 'Before', n: 39, steps: 'Open app · search · add · × 18 items · cart · checkout', tone: '#FF5F5F' },
        { label: 'After', n: 3, steps: 'Open app · Add all · checkout', tone: ACCENT },
      ].map((b) => (
        <motion.div key={b.label} {...reveal} className="rounded-[24px] border border-white/5 bg-[#0D0D0D] p-6 md:p-7">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-4" style={{ color: b.tone }}>
            {b.label}
          </p>
          <p className="text-white text-5xl font-black tracking-[-0.04em] mb-1">≈ {b.n}</p>
          <p className="text-white/45 text-sm mb-5">taps to restock 18 usual items</p>
          <div className="flex flex-wrap gap-1.5 mb-5" aria-hidden>
            {Array.from({ length: b.n }, (_, i) => (
              <span key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: b.tone, opacity: 0.85 }} />
            ))}
          </div>
          <p className="text-white/50 text-xs leading-relaxed">{b.steps}</p>
        </motion.div>
      ))}
    </div>
  );
}

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
              Sary · B2B grocery · Repeat customers
            </p>
            <h1 className="text-white text-5xl md:text-7xl font-black mb-8 leading-[0.95] tracking-tight max-w-4xl">
              Restock in 3 taps, not 39.
            </h1>
            <p className="text-white/50 text-lg md:text-xl leading-relaxed max-w-2xl mb-12">
              Grocery owners reorder the same few dozen products every week. I designed a page that turns that routine
              into one tap, flags what’s running low before the shelf is empty, and suggests the next order on the
              store’s own restock day.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 py-6 border-y border-white/10 mb-12">
              <Meta label="Role" value="Lead Product Designer" />
              <Meta label="User" value="Grocery owner, Riyadh" />
              <Meta label="Surface" value="Home · Orders tab" />
              <Meta label="Deliverables" value="5 screens · motion · film" />
            </div>

            <CaseFilm
              src={FILM}
              poster={POSTER}
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
              Stores that order the same basket every week had to build it from scratch every time.
            </p>
            <p className="text-white/55 text-base md:text-lg leading-relaxed max-w-2xl">
              The app was built for discovery: banners, categories and search. A returning store saw the same discount
              banner as everyone else, and last Sunday’s 18 item order wasn’t visible anywhere on the first screen. Most
              buyers ordered once and didn’t come back.
            </p>
          </motion.div>

          <Eyebrow tone="#FF5F5F">How we found it</Eyebrow>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-20">
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

          <Eyebrow tone="#FF5F5F">Before and after</Eyebrow>
          <div className="grid gap-3 mb-3">
            {BEFORE_AFTER.map((b, i) => (
              <motion.div
                key={b.n}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.06 }}
                className="rounded-[24px] border border-white/5 bg-[#0D0D0D] p-6 md:p-7"
              >
                <p className="text-white font-bold text-lg mb-5">
                  <span className="text-white/30 mr-3">{b.n}</span>
                  {b.t}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-2 text-[#FF5F5F]">Before</p>
                    <p className="text-white/55 text-sm leading-relaxed">{b.before}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-2" style={{ color: ACCENT }}>
                      After
                    </p>
                    <p className="text-white/85 text-sm leading-relaxed">{b.after}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <TapCount />
          <p className="text-white/35 text-xs mt-4 max-w-xl">
            Estimated from the two flows, not measured. Reviewing the basket adds 1 to 3 taps.
          </p>
        </section>

        {/* ── 03 INSIGHTS ── */}
        <ChapterTitle chapter={CHAPTERS[2]} tone="teal" />
        <section id="insight" className="mb-32 scroll-mt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            {INSIGHTS.map((it, i) => (
              <motion.div key={it.n} {...reveal} transition={{ ...reveal.transition, delay: i * 0.06 }}>
                <span className="block text-5xl font-black tracking-tight mb-4" style={{ color: ACCENT, opacity: 0.4 }}>
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
            The goal: make the repeat order the starting point, not something owners rebuild by hand.
          </motion.blockquote>
        </section>

        {/* ── 04 USE CASES ── */}
        <ChapterTitle chapter={CHAPTERS[3]} tone="teal" />
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
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-10 items-start">
            <div>
              <p className="text-white/60 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                One tap restocks the usual basket. The items fly into the cart so the owner sees exactly what was added,
                then the app offers to make it a weekly routine. About 1.4 seconds, and every step can be interrupted.
              </p>
              <ol className="grid gap-px rounded-2xl overflow-hidden border border-white/10 bg-white/10">
                {MOTION.map((m, i) => (
                  <motion.li
                    key={m.k}
                    {...reveal}
                    transition={{ ...reveal.transition, delay: i * 0.04 }}
                    className="bg-[#0D0D0D] p-5 grid grid-cols-[52px_1fr] gap-4"
                  >
                    <span className="font-mono text-xs pt-1" style={{ color: ACCENT }}>
                      {m.k}
                    </span>
                    <span>
                      <span className="flex flex-wrap items-baseline gap-x-3 mb-1">
                        <span className="text-white font-bold">{m.t}</span>
                        <span className="text-white/35 text-xs font-mono">{m.at}</span>
                      </span>
                      <span className="block text-white/70 text-sm leading-relaxed">{m.what}</span>
                      <span className="block text-white/40 text-sm leading-relaxed mt-1">{m.why}</span>
                    </span>
                  </motion.li>
                ))}
              </ol>
            </div>
            <div className="flex justify-center lg:sticky lg:top-40">
              <SaryAddAllLoop width={280} />
            </div>
          </div>
        </section>

        {/* ── 06 IMPACT ── */}
        <ChapterTitle chapter={CHAPTERS[5]} />
        <section id="impact" className="mb-16 scroll-mt-24">
          <Eyebrow>Results</Eyebrow>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-16">
            {RESULTS.map((r, i) => (
              <motion.div
                key={r.k}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.06 }}
                className="rounded-[24px] border border-white/5 bg-[#0D0D0D] p-6"
              >
                <p className="text-white text-4xl md:text-5xl font-black tracking-[-0.04em] mb-2">{r.v}</p>
                <p className="text-white/45 text-sm">{r.k}</p>
              </motion.div>
            ))}
          </div>

          <Eyebrow>Signals we keep watching</Eyebrow>
          <motion.ul
            {...reveal}
            className="rounded-[24px] border border-white/5 bg-[#0D0D0D] px-6 md:px-7 mb-20"
          >
            {SIGNALS_TRACKED.map((s) => (
              <li key={s.k} className="py-5 border-b border-white/5 last:border-0 md:grid md:grid-cols-[240px_1fr] md:gap-6">
                <span className="block text-white font-bold mb-1 md:mb-0">{s.k}</span>
                <span className="block text-white/50 text-sm leading-relaxed">{s.d}</span>
              </li>
            ))}
          </motion.ul>

          <motion.div {...reveal} className="max-w-3xl">
            <Eyebrow>What I carry forward</Eyebrow>
            <p className="text-white text-2xl md:text-3xl font-bold leading-snug tracking-tight">
              The biggest wins don’t always need a big redesign. Look past the surface numbers, learn what people
              already do, and make that the easiest thing in the app.
            </p>
          </motion.div>
        </section>
      </div>
    </CaseShell>
  );
}
