import { motion, AnimatePresence } from 'motion/react';
import { useState, type ReactNode } from 'react';
import { CaseShell } from './_shared/CaseShell';
import { ChapterTitle } from './_shared/ChapterTitle';
import { Meta } from './_shared/Meta';
import { CaseFilm, Eyebrow as BaseEyebrow, reveal } from './_shared/CaseBits';
import type { Chapter, CaseStudyComponentProps } from './_shared/types';
import {
  DashboardView,
  DesktopFrame,
  MonitorView,
  PreviewView,
  ReverseView,
  SampoLoop,
  StatusChip,
  UnderstandView,
} from './sampo/SampoUI';

/* ── Sampo AI · Pricing that thinks ──────────────────
   Pricing strategies for an AI pricing engine used by Saudi
   e-commerce stores. Sources: the 12 case study boards in
   Figma (cover, Trust Ladder, five flows, components,
   pop-ups, results, dashboard, audit and principles) and the
   72s film. Every screen is rebuilt in code and can be used;
   all figures are the boards' sample data. No pilot results
   are claimed. */

const ACCENT = '#8B85FF';
const FILM = '/videos/sampo-pricing-film.mp4';
const POSTER = '/images/case-studies/sampo/film-poster.webp';

const CHAPTERS: Chapter[] = [
  { id: 'overview', num: '01', roman: 'I', label: 'Overview', beat: 'Handing an AI the price tag.' },
  { id: 'problem', num: '02', roman: 'II', label: 'Problem', beat: 'Trust, not capability.' },
  { id: 'concept', num: '03', roman: 'III', label: 'Concept', beat: 'A ladder of trust.' },
  { id: 'flows', num: '04', roman: 'IV', label: 'The Flows', beat: 'Five rungs, five screens.' },
  { id: 'dashboard', num: '05', roman: 'V', label: 'Dashboard', beat: 'Answers before decoration.' },
  { id: 'craft', num: '06', roman: 'VI', label: 'Craft', beat: 'The details that hold it.' },
];

const PROBLEMS = [
  {
    k: 'Opaque logic',
    d: 'Strategies read like internal specs, such as “Strategy based on analytics data”. Merchants couldn’t tell what would happen, to which products, or why.',
  },
  {
    k: 'A one-way door',
    d: 'Activating had no preview of the impact and no clear way back, so the safest choice for a merchant was to do nothing.',
  },
  {
    k: 'Silent after launch',
    d: 'Once a strategy was live, nothing on the dashboard said whether it was working, testing, or touching a product.',
  },
];

const ENTRIES: [string, string, string, string][] = [
  ['F1', 'Sidebar', 'First visit to Pricing strategies', 'Guidance on how strategies are chosen'],
  ['F1', 'Banner', '“Explore full process” on the list', 'Interactive walkthrough'],
  ['F2', 'Strategy card', '“Review & activate” on any strategy', 'Strategy details with 3 modes and estimates'],
  ['F3', 'Strategy details', '“Confirm & activate”', 'Review, confirm, live A/B test'],
  ['F4', 'Dashboard', 'Alert bar right after activation', '“View strategy”'],
  ['F4', 'Dashboard', 'Pop-up when the A/B test finishes', 'Winning mode and its details'],
  ['F4', 'Product page', 'Status badge on an affected product', 'Which strategy prices this product'],
  ['F5', 'Your strategies', 'Active and archived list', 'Change mode, undo, disable'],
];

type Rung = {
  n: string;
  t: string;
  q: string;
  head: string;
  body: string;
  points: string[];
  hint: string;
  view: ReactNode;
  h: number;
};

const RUNGS: Rung[] = [
  {
    n: '01',
    t: 'Understand',
    q: 'What does Sampo do, and why this strategy?',
    head: 'Explain the engine before asking for the keys.',
    body: 'The first visit never opens on a switch. It opens on how Sampo thinks, then every strategy explains itself in the same three beats: trigger, action, outcome.',
    points: [
      'A one-time guide explains how Sampo picks strategies.',
      'Each card opens into Trigger → Action → Outcome. The first one is open by default.',
      'Strategies are named by what they do: Low-Stock Urgency, not “Strategy based on low stock”.',
    ],
    hint: 'Open and close the strategy cards.',
    view: <UnderstandView />,
    h: 560,
  },
  {
    n: '02',
    t: 'Preview',
    q: 'What will it do to my store?',
    head: 'Turn a risky decision into a choice of temperament.',
    body: 'Instead of one opaque “expected uplift”, every strategy is tested in three modes. Merchants compare Careful, Balanced and High Impact against their own last 30 days.',
    points: [
      'Each mode shows its discount, risk, reach and trigger up front.',
      'Estimates compare against the merchant’s normal prices, with the trade-off visible: High Impact sells most but earns the least profit.',
      'One clear recommendation, and the affected products are a click away.',
    ],
    hint: 'Pick a mode and watch the estimates change.',
    view: <PreviewView />,
    h: 700,
  },
  {
    n: '03',
    t: 'Commit',
    q: 'Am I sure? Can I still back out?',
    head: 'A confirmation that lowers the stakes.',
    body: 'The commit moment restates the deal in plain words: what runs, how it’s tested, and that it can be changed later. Backing out is always safe and always explicit.',
    points: [
      'A four-line summary: test, duration, products, what happens after.',
      'One primary button on the right, “Back” beside it, “Edit modes” far left.',
      'After confirming, a clear “it’s live” message with two next steps.',
    ],
    hint: 'Confirm, then follow the next step.',
    view: <PreviewView initialStage="confirm" />,
    h: 700,
  },
  {
    n: '04',
    t: 'Monitor',
    q: 'Is it working, and where?',
    head: 'After launch, the black box gets a label.',
    body: 'Trust is kept, not won. Once a strategy is live its status follows the merchant: onto the dashboard, into the strategy list and onto every product page it touches.',
    points: [
      'Four headline numbers and one lift chart against normal prices.',
      'A status chip with one lifecycle: Suggested, Pending, Testing, Active, Completed.',
      'A dashboard pop-up names the winner when the test ends.',
    ],
    hint: 'Move across the chart to scrub through the 21-day test.',
    view: <MonitorView />,
    h: 560,
  },
  {
    n: '05',
    t: 'Reverse',
    q: 'Can I take it back?',
    head: 'Every door opens both ways.',
    body: 'Merchants commit faster when leaving is easy. Changing mode, undoing a change and disabling a strategy each get their own clear moment, consequences first.',
    points: [
      'A dropdown lists the three modes, each with a one-line trade-off.',
      'Undo stays available for a few seconds after a change.',
      'Disabling names what happens: “Keep strategy” or “Disable strategy”, never “Yes”.',
    ],
    hint: 'Change the mode, undo it, then try disabling.',
    view: <ReverseView />,
    h: 460,
  },
];

const RULES = [
  { k: 'R1', t: 'Primary on the right', d: 'The next step always sits bottom right, where the eye ends.' },
  { k: 'R2', t: 'One primary per view', d: 'Never two filled buttons. Alternatives become secondary or a link.' },
  { k: 'R3', t: 'Destructive is named and red', d: 'Say what happens (“Disable strategy”), never “Yes”.' },
  { k: 'R4', t: 'Tertiary goes far left', d: 'Escape hatches like “Edit modes” live away from the commit.' },
];

const AUDIT: [string, string, string][] = [
  ['Content', 'Mode descriptions swapped: “Balanced” described high discounts, “High Impact” minimal changes.', 'Careful is minimal, Balanced moderate, High Impact high discounts, everywhere.'],
  ['Content', 'One strategy promised both 15% and 20%, after “twice” and after “3 times”.', 'One rule: 2 views without buying, 15% off on the next visit.'],
  ['UX', 'All three modes listed identical criteria, so there was no real choice.', 'A new mode selector with distinct discount, audience, trigger and a risk gauge.'],
  ['UX', 'The disable dialog paired “Yes, Disable” with “Yes, Cancel”.', '“Keep strategy” as the safe default, “Disable strategy” in red, consequences listed.'],
  ['Data', '“SAR 750,000 (+11.4%)” sat next to “SAR 120.21 more than last year”.', 'Numbers that add up: SAR 76,750 more, and tooltips match the bars.'],
  ['Localization', 'Charm-pricing examples in $ inside a SAR-only product.', 'SAR examples: SAR 70 → SAR 69.99.'],
];

const PRINCIPLES = [
  { t: 'Explain before you ask', d: 'Guidance comes before every toggle. The first strategy opens by default to teach the pattern once.' },
  { t: 'Show ranges, not promises', d: 'Three modes with their own estimates beat one confident number merchants can’t check.' },
  { t: 'Make leaving cheap', d: 'Cancel, undo and disable are explicit and named, so committing feels safe.' },
  { t: 'Let status travel', d: 'A strategy’s state shows wherever its effect does: dashboard, list, product page.' },
];

const NEXT = [
  { k: 'Validate', d: 'Agree mode defaults (discount, audience, trigger) with the pricing and data team before build.' },
  { k: 'Localize', d: 'A full Arabic right-to-left pass: charts, number formats and chip widths.' },
  { k: 'Measure', d: 'Track activation rate, time to first strategy and 7-day disable rate, to see whether the ladder builds trust.' },
];

const Eyebrow = ({ children, tone = ACCENT }: { children: ReactNode; tone?: string }) => (
  <BaseEyebrow tone={tone}>{children}</BaseEyebrow>
);

function Ladder({ onPick, active }: { onPick: (i: number) => void; active: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-end mb-10" role="tablist" aria-label="Trust ladder">
      {RUNGS.map((r, i) => {
        const on = i === active;
        return (
          <button
            key={r.n}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onPick(i)}
            className={`text-left rounded-2xl border p-4 transition-colors ${
              on ? 'border-[#8B85FF] bg-[#8B85FF]/10' : 'border-white/10 bg-white/[0.02] hover:border-white/25'
            } ${i === 4 ? 'col-span-2 sm:col-span-1' : ''}`}
          >
            <span className="block italic text-2xl mb-1" style={{ color: on ? ACCENT : 'rgba(255,255,255,0.35)', fontFamily: 'Fraunces, serif' }}>
              {r.n}
            </span>
            <span className="block text-white font-bold">{r.t}</span>
            <span className="block text-white/45 text-xs mt-1 leading-snug">“{r.q}”</span>
          </button>
        );
      })}
    </div>
  );
}

function Flows() {
  const [i, setI] = useState(1);
  const r = RUNGS[i];
  return (
    <>
      <Ladder active={i} onPick={setI} />
      <AnimatePresence mode="wait">
        <motion.div
          key={r.n}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] gap-x-12 gap-y-6 mb-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: ACCENT }}>
                Rung {r.n} · {r.t}
              </p>
              <h3 className="text-white text-3xl md:text-4xl font-black tracking-tight mb-4">{r.head}</h3>
              <p className="text-white/60 text-base md:text-lg leading-relaxed">{r.body}</p>
            </div>
            <ul className="self-end grid gap-3">
              {r.points.map((pt) => (
                <li key={pt} className="flex gap-3 text-white/75 text-sm leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full flex-none" style={{ background: ACCENT }} />
                  {pt}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-white/40">
            <span style={{ color: ACCENT }}>Try it</span> · {r.hint}
          </p>
          <DesktopFrame canvasH={r.h} active={i === 3 ? 'yours' : i === 4 ? 'yours' : 'strategies'}>
            {r.view}
          </DesktopFrame>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export function SampoCaseStudy({ onBack, onNext }: CaseStudyComponentProps) {
  return (
    <CaseShell chapters={CHAPTERS} metaLine="Sampo AI · Pricing" onBack={onBack} onNext={onNext} resetKey="sampo-ai-pricing" pillId="sampo-tab-pill">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        {/* ── 01 OVERVIEW ── */}
        <ChapterTitle chapter={CHAPTERS[0]} />
        <section id="overview" className="mb-32 scroll-mt-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <p className="text-[10px] font-black uppercase tracking-[0.32em] mb-6" style={{ color: ACCENT }}>
              Sampo AI · Pricing strategies · Saudi e-commerce
            </p>
            <h1 className="text-white text-5xl md:text-7xl font-black mb-8 leading-[0.95] tracking-tight max-w-4xl">
              Handing an AI the price tag.
            </h1>
            <p className="text-white/50 text-lg md:text-xl leading-relaxed max-w-2xl mb-12">
              Sampo is an AI pricing engine for Saudi online stores. I designed how merchants discover, preview, activate and
              monitor automated pricing, turning a black box into something they can read, test and undo.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 py-6 border-y border-white/10 mb-12">
              <Meta label="Role" value="Lead Product Designer" />
              <Meta label="Timeline" value="Nov 2024 – Dec 2025" />
              <Meta label="Platform" value="Merchant web dashboard" />
              <Meta label="Market" value="Saudi Arabia · SAR · EN/AR" />
            </div>
            <CaseFilm
              src={FILM}
              poster={POSTER}
              length="1:12"
              accent={ACCENT}
              buttonTint="#4338CA"
              background="radial-gradient(ellipse 70% 80% at 50% 25%, #2A1C8F 0%, #08061C 70%)"
              fallback={<SampoLoop style={{ width: 640 }} />}
              decor="Pricing that thinks"
              ticker={['Explainable', 'Previewable', 'Reversible', 'Sampo AI', 'SAR 289']}
            />
          </motion.div>
        </section>

        {/* ── 02 PROBLEM ── */}
        <ChapterTitle chapter={CHAPTERS[1]} tone="red" />
        <section id="problem" className="mb-32 scroll-mt-24">
          <motion.div
            {...reveal}
            className="rounded-[36px] border border-[#FF5F5F]/15 bg-gradient-to-b from-[#FF5F5F]/[0.04] to-transparent p-8 md:p-14 mb-12"
          >
            <div className="flex items-center gap-2 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF5F5F] animate-pulse" />
              <span className="text-[#FF5F5F]/70 text-[9px] font-black uppercase tracking-[0.4em]">Problem statement</span>
            </div>
            <p className="text-white text-2xl md:text-4xl font-bold leading-[1.15] tracking-tight max-w-3xl mb-8">
              Merchants were asked to trust a black box with their margin.
            </p>
            <p className="text-white/55 text-base md:text-lg leading-relaxed max-w-2xl">
              Sampo could already change prices on its own. The question wasn’t “can it?” but “why would a store owner ever let
              it?”. Every day, merchants were guessing their prices instead.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-12">
            {PROBLEMS.map((p, i) => (
              <motion.div key={p.k} {...reveal} transition={{ ...reveal.transition, delay: i * 0.06 }} className="rounded-[24px] border border-white/5 bg-[#0D0D0D] p-7">
                <p className="text-white text-xl font-bold tracking-tight mb-3">{p.k}</p>
                <p className="text-white/50 text-sm leading-relaxed">{p.d}</p>
              </motion.div>
            ))}
          </div>
          <motion.div {...reveal} className="rounded-[24px] p-7 md:p-9 border" style={{ borderColor: `${ACCENT}55`, background: `${ACCENT}0F` }}>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: ACCENT }}>
              Design goal
            </p>
            <p className="text-white text-2xl md:text-3xl font-bold tracking-tight">
              Make every automated price change explainable, previewable and reversible.
            </p>
          </motion.div>
        </section>

        {/* ── 03 CONCEPT ── */}
        <ChapterTitle chapter={CHAPTERS[2]} tone="teal" />
        <section id="concept" className="mb-32 scroll-mt-24">
          <motion.div {...reveal} className="max-w-3xl mb-12">
            <h2 className="text-white text-3xl md:text-5xl font-black tracking-tight mb-5">Control is handed over one rung at a time.</h2>
            <p className="text-white/55 text-base md:text-lg leading-relaxed">
              Instead of one big “Activate” moment, I structured the whole experience as five questions a merchant asks before
              and after letting Sampo price for them. Every flow in the product answers exactly one.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-20 items-end">
            {RUNGS.map((r, i) => (
              <motion.div
                key={r.n}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.07 }}
                className="rounded-2xl border border-white/10 bg-[#0D0D0D] p-5"
                style={{ marginTop: 0 }}
              >
                <span className="block italic text-3xl mb-2" style={{ color: ACCENT, fontFamily: 'Fraunces, serif', opacity: 0.4 + i * 0.15 }}>
                  {r.n}
                </span>
                <span className="block text-white font-bold mb-1">{r.t}</span>
                <span className="block text-white/45 text-xs leading-snug">“{r.q}”</span>
              </motion.div>
            ))}
          </div>

          <Eyebrow>Eight doors, one room</Eyebrow>
          <p className="text-white/55 leading-relaxed max-w-2xl mb-8">
            Merchants don’t arrive at a strategy from one place. I mapped every entry point to a single destination, Strategy
            Details, so the mental model stays the same wherever they come from.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-center">
            <ul className="rounded-[24px] border border-white/5 bg-[#0D0D0D] px-5 md:px-6">
              {ENTRIES.map(([f, where, what, to]) => (
                <li key={what} className="grid grid-cols-[40px_minmax(0,1fr)] md:grid-cols-[40px_minmax(0,1fr)_minmax(0,0.8fr)] gap-x-4 gap-y-1 py-3.5 border-b border-white/5 last:border-0 text-sm">
                  <span className="font-mono text-xs pt-0.5" style={{ color: ACCENT }}>
                    {f}
                  </span>
                  <span>
                    <span className="block text-white/35 text-[11px] uppercase tracking-[0.15em]">{where}</span>
                    <span className="text-white/85">{what}</span>
                  </span>
                  <span className="col-start-2 md:col-start-3 text-white/50 md:self-center">→ {to}</span>
                </li>
              ))}
            </ul>
            <div className="rounded-[24px] p-7 border" style={{ borderColor: `${ACCENT}55`, background: `${ACCENT}12` }}>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: ACCENT }}>
                The room
              </p>
              <p className="text-white text-2xl font-black tracking-tight mb-3">Strategy Details</p>
              <p className="text-white/60 text-sm leading-relaxed mb-5">
                One page that answers every rung: how it works, what it will do, which products it touches, its live status, and
                how to change or stop it.
              </p>
              <div className="flex flex-wrap gap-2">
                {['How it works', 'Modes', 'Estimates', 'Affected products', 'Status', 'Change · Undo · Disable'].map((t) => (
                  <span key={t} className="text-xs text-white/75 rounded-full border border-white/15 px-3 py-1">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 04 FLOWS ── */}
        <ChapterTitle chapter={CHAPTERS[3]} tone="teal" />
        <section id="flows" className="mb-32 scroll-mt-24">
          <Flows />
        </section>

        {/* ── 05 DASHBOARD ── */}
        <ChapterTitle chapter={CHAPTERS[4]} />
        <section id="dashboard" className="mb-32 scroll-mt-24">
          <motion.div {...reveal} className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] gap-x-12 gap-y-6 mb-8">
            <div>
              <h2 className="text-white text-3xl md:text-4xl font-black tracking-tight mb-4">A dashboard that answers before it decorates.</h2>
              <p className="text-white/60 text-base md:text-lg leading-relaxed">
                A merchant opens Sampo and asks: how is my store doing, and is Sampo helping? Four headline numbers, one revenue
                story against last year, and Sampo’s share of it.
              </p>
            </div>
            <ul className="self-end grid gap-3">
              {[
                'Every chart uses a linear scale in SAR, with last year as a dashed line.',
                'Tooltips sit on their data point, and the numbers add up across tiles and charts.',
                'Sampo’s impact is shown in money and split by strategy.',
              ].map((pt) => (
                <li key={pt} className="flex gap-3 text-white/75 text-sm leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full flex-none" style={{ background: ACCENT }} />
                  {pt}
                </li>
              ))}
            </ul>
          </motion.div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-white/40">
            <span style={{ color: ACCENT }}>Try it</span> · Move across the revenue chart and switch the period.
          </p>
          <DesktopFrame canvasH={560} active="dashboard" url="app.sampo.ai/dashboard">
            <DashboardView />
          </DesktopFrame>
          <p className="text-white/35 text-xs mt-4">All dashboard values are sample data.</p>
        </section>

        {/* ── 06 CRAFT ── */}
        <ChapterTitle chapter={CHAPTERS[5]} />
        <section id="craft" className="mb-16 scroll-mt-24">
          <Eyebrow>One action grammar for every pop-up</Eyebrow>
          <p className="text-white/55 leading-relaxed max-w-2xl mb-8">
            The approved pop-ups each placed buttons differently: some had “Yes / Yes”, some put the safe choice on the right. I
            set four placement rules and rebuilt every pop-up around them.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-20">
            {RULES.map((r, i) => (
              <motion.div key={r.k} {...reveal} transition={{ ...reveal.transition, delay: i * 0.05 }} className="rounded-[24px] border border-white/5 bg-[#0D0D0D] p-6">
                <span className="font-mono text-xs" style={{ color: ACCENT }}>
                  {r.k}
                </span>
                <p className="text-white font-bold mt-3 mb-2">{r.t}</p>
                <p className="text-white/50 text-sm leading-relaxed">{r.d}</p>
              </motion.div>
            ))}
          </div>

          <Eyebrow>Fifteen fixes no one would screenshot</Eyebrow>
          <p className="text-white/55 leading-relaxed max-w-2xl mb-8">
            I audited the approved screens and fixed every moment where the product contradicted itself. Six of the fifteen:
          </p>
          <div className="rounded-[24px] border border-white/5 bg-[#0D0D0D] px-5 md:px-7 mb-20">
            {AUDIT.map(([type, found, fix]) => (
              <div key={found} className="grid grid-cols-1 md:grid-cols-[110px_minmax(0,1fr)_minmax(0,1fr)] gap-x-6 gap-y-2 py-5 border-b border-white/5 last:border-0">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 pt-1">{type}</span>
                <span className="text-white/45 text-sm leading-relaxed">
                  <span className="text-[#FF8A8A] font-bold">Before · </span>
                  {found}
                </span>
                <span className="text-white/85 text-sm leading-relaxed">
                  <span className="font-bold" style={{ color: ACCENT }}>
                    After ·{' '}
                  </span>
                  {fix}
                </span>
              </div>
            ))}
          </div>

          <Eyebrow>One status, everywhere</Eyebrow>
          <p className="text-white/55 leading-relaxed max-w-2xl mb-6">
            Status used to be emoji text or coloured links. It is now one chip with one lifecycle, wherever a strategy appears.
          </p>
          <div className="flex flex-wrap items-center gap-3 mb-20 rounded-[24px] bg-[#F6F5FB] p-5">
            {(['Suggested', 'Pending', 'Testing', 'Active', 'Completed'] as const).map((s, i, a) => (
              <span key={s} className="flex items-center gap-3">
                <StatusChip s={s} />
                {i < a.length - 1 && <span className="text-[#9A97B3]">→</span>}
              </span>
            ))}
          </div>

          <Eyebrow>What held it together</Eyebrow>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
            {PRINCIPLES.map((p, i) => (
              <motion.div key={p.t} {...reveal} transition={{ ...reveal.transition, delay: i * 0.05 }} className="rounded-[24px] border border-white/5 bg-[#0D0D0D] p-6">
                <span className="block italic text-3xl mb-3" style={{ color: ACCENT, fontFamily: 'Fraunces, serif' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-white font-bold mb-2">{p.t}</p>
                <p className="text-white/50 text-sm leading-relaxed">{p.d}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...reveal} className="rounded-[24px] border border-white/10 p-7 md:p-9 grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: ACCENT }}>
                Next
              </p>
              <p className="text-white text-2xl font-black tracking-tight">What I’d do next</p>
            </div>
            <ul className="grid gap-4">
              {NEXT.map((n) => (
                <li key={n.k} className="grid grid-cols-[90px_minmax(0,1fr)] gap-4 text-sm">
                  <span className="text-white font-bold">{n.k}</span>
                  <span className="text-white/60 leading-relaxed">{n.d}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <p className="text-white/35 text-xs mt-6">All figures in this case study are sample data from the design boards.</p>
        </section>
      </div>
    </CaseShell>
  );
}
