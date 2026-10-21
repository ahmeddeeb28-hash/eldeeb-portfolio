import { motion, AnimatePresence } from 'motion/react';
import { useState, type ReactNode } from 'react';
import { CaseShell } from './_shared/CaseShell';
import { ChapterTitle } from './_shared/ChapterTitle';
import { CaseIntro, Takeaway } from './_shared/CaseLayout';
import { CaseFilm, reveal } from './_shared/CaseBits';
import type { Chapter, CaseStudyComponentProps } from './_shared/types';
import { FocusFilm, type FocusScene, type FocusStep } from './sampo/FocusFilm';
import {
  DashboardView,
  MonitorView,
  PreviewView,
  ReverseView,
  SampoLoop,
  StatusChip,
  StrategiesView,
  UnderstandView,
} from './sampo/SampoUI';

/* ── Sampo AI · Pricing that thinks ──────────────────
   Pricing strategies for an AI pricing engine used by Saudi
   e-commerce stores. Sources: the 12 case study boards in
   Figma (cover, Trust Ladder, five flows, components,
   pop-ups, results, dashboard, audit and principles) and the
   72s film. Every screen is the new design rebuilt in code;
   each flow plays as a focus film over it and can be taken
   over and used. All figures are the boards' sample data.
   No pilot results are claimed. */

const ACCENT = '#8B85FF';
const FILM = '/videos/sampo-pricing-film.mp4';
const POSTER = '/images/case-studies/sampo/film-poster.webp';

const CHAPTERS: Chapter[] = [
  { id: 'overview', num: '01', roman: 'I', label: 'Overview', beat: 'Handing an AI the price tag.' },
  { id: 'problem', num: '02', roman: 'II', label: 'Problem', beat: 'Trust, not capability.' },
  { id: 'concept', num: '03', roman: 'III', label: 'Concept', beat: 'A ladder of trust.' },
  { id: 'process', num: '04', roman: 'IV', label: 'Process', beat: 'Agreed, prototyped, tested.' },
  { id: 'flows', num: '05', roman: 'V', label: 'The Flows', beat: 'Five rungs, five screens.' },
  { id: 'dashboard', num: '06', roman: 'VI', label: 'Dashboard', beat: 'Answers before decoration.' },
  { id: 'craft', num: '07', roman: 'VII', label: 'Craft', beat: 'The details that hold it.' },
];

const PROBLEMS = [
  { k: 'Opaque logic', d: 'Strategies read like internal specs.' },
  { k: 'A one-way door', d: 'No preview, no way back. Doing nothing felt safest.' },
  { k: 'Silent after launch', d: 'Nothing said if a strategy was working.' },
];

type Rung = {
  n: string;
  t: string;
  q: string;
  head: string;
  h: number;
  scenes: FocusScene[];
  steps: FocusStep[];
};

const RUNGS: Rung[] = [
  {
    n: '01',
    t: 'Understand',
    q: 'What does Sampo do?',
    head: 'Explain the engine before asking for the keys.',
    h: 560,
    scenes: [{ node: <UnderstandView /> }],
    steps: [
      { cap: 'Strategies, explained first', ms: 1600 },
      { cap: 'How Sampo decides, up front', look: 'banner', z: 2, ms: 2200 },
      { cap: 'Every card reads trigger, action, outcome', look: 'card-rvd', z: 1.7, ms: 2400 },
      { cap: 'Open another, same three beats', act: 'st-lsu', look: 'card-lsu', z: 1.7, ms: 2600 },
      { cap: 'One next step on every card', act: 'st-osm', look: 'review-osm', z: 2.2, ms: 2400 },
      { cap: 'Back to the whole list', ms: 1400 },
    ],
  },
  {
    n: '02',
    t: 'Preview',
    q: 'What will it do to my store?',
    head: 'Turn a risky decision into a choice of temperament.',
    h: 830,
    scenes: [{ node: <PreviewView /> }],
    steps: [
      { cap: 'Three modes, one page', ms: 1600 },
      { cap: 'Safer to bolder, recommended from your last 30 days', look: 'slider', ms: 2200 },
      { cap: 'Careful: small, safe nudges', act: 'mode-careful', ms: 2600 },
      { cap: 'High Impact: more reach, less profit', act: 'mode-high', ms: 2600 },
      { cap: 'Balanced: best profit for moderate risk', act: 'mode-balanced', ms: 2600 },
      { cap: 'Estimates against your normal prices', look: 'lift', ms: 2400 },
      { cap: 'One clear recommendation', look: 'bar', ms: 1800 },
    ],
  },
  {
    n: '03',
    t: 'Commit',
    q: 'Can I still back out?',
    head: 'A confirmation that lowers the stakes.',
    h: 830,
    scenes: [{ node: <PreviewView /> }],
    steps: [
      { cap: 'Ready to activate', look: 'bar', ms: 1600 },
      { cap: 'The deal, in plain words', act: 'confirm', look: 'modal', ms: 2800 },
      { cap: 'Leaving is always safe', act: 'm-back', look: 'modal', ms: 2400 },
      { cap: 'Back to the review', act: 'm-keep', look: 'modal', ms: 1800 },
      { cap: 'Your test is live', act: 'm-confirm', look: 'modal', ms: 2800 },
    ],
  },
  {
    n: '04',
    t: 'Monitor',
    q: 'Is it working?',
    head: 'After launch, the black box gets a label.',
    h: 900,
    scenes: [{ node: <StrategiesView />, active: 'yours', url: 'app.sampo.ai/your-strategies' }, { node: <MonitorView />, active: 'yours', url: 'app.sampo.ai/strategies/returning-visitor/results' }],
    steps: [
      { cap: 'Your strategies', ms: 1500 },
      { cap: 'The strategy card shows its live result', look: 'live-card', ms: 2600 },
      { cap: 'One status chip, one lifecycle', look: 'table', z: 1.6, ms: 2200 },
      { cap: 'The archive keeps every result', act: 'tab-archive', look: 'table', z: 1.6, ms: 2400 },
      { cap: 'Four numbers first', scene: 1, look: 'kpis', ms: 2200 },
      { cap: 'High Impact starts fastest', scene: 1, scrub: ['chart', 0.2], look: 'chart-panel', z: 1.5, ms: 2000 },
      { cap: 'Balanced takes the lead on day 9', scene: 1, scrub: ['chart', 0.44], look: 'chart-panel', z: 1.5, ms: 2000 },
      { cap: 'Day 21: Balanced +17%', scene: 1, scrub: ['chart', 0.97], look: 'chart-panel', z: 1.5, ms: 1800 },
      { cap: 'A winner, with the numbers', scene: 1, act: 'winner-btn', look: 'modal', ms: 2800 },
      { cap: 'Results per product', scene: 1, act: 'm-later', look: 'products', z: 1.5, ms: 2600 },
    ],
  },
  {
    n: '05',
    t: 'Reverse',
    q: 'Can I take it back?',
    head: 'Every door opens both ways.',
    h: 460,
    scenes: [{ node: <ReverseView />, active: 'yours', url: 'app.sampo.ai/strategies/returning-visitor' }],
    steps: [
      { cap: 'A running strategy', ms: 1400 },
      { cap: 'Every mode, one trade-off each', act: 'mode-dd', look: 'menu', ms: 2400 },
      { cap: 'Changed, with a way back', act: 'opt-careful', look: 'toast', ms: 2400 },
      { cap: 'Undone in one click', act: 'undo', look: 'mode-panel', ms: 2000 },
      { cap: 'Consequences before the button', act: 'disable', look: 'modal', ms: 2600 },
      { cap: 'Disabled, results kept', act: 'm-disable', look: 'notice', ms: 2200 },
      { cap: 'Back on whenever you want', act: 'reactivate', ms: 1600 },
    ],
  },
];

const DASH_STEPS: FocusStep[] = [
  { cap: 'The store at a glance', ms: 1600 },
  { cap: 'Switch the period', act: 'range-30D', look: 'range', ms: 1800 },
  { cap: 'Four numbers first', act: 'range-90D', look: 'kpis', ms: 2200 },
  { cap: 'Revenue against last year', scrub: ['chart', 0.67], look: 'chart-panel', ms: 2400 },
  { cap: 'Sampo’s share, in SAR', look: 'impact', ms: 2400 },
  { cap: 'Profit that adds up', act: 'month-9', look: 'profit', ms: 2600 },
  { cap: 'All on one screen', ms: 1400 },
];

const PROCESS: { t: string; d: string; out: string[] }[] = [
  {
    t: 'Shared the diagnosis with the other teams',
    d: 'I walked product, data and engineering through the problem as one story: merchants did not distrust the math, they could not see it.',
    out: ['Problem board', 'Trust ladder'],
  },
  {
    t: 'Agreed the feature, its use and its impact',
    d: 'Before any screen was final we agreed what the feature does, how a merchant uses it day to day, and how we would know it worked.',
    out: ['Feature scope', 'Utilization', 'Impact metrics'],
  },
  {
    t: 'Built the prototype with AI',
    d: 'I built the clickable prototype with Claude: every flow, the mode selector and the dashboard as working screens, not static frames. It is the prototype you can use on this page.',
    out: ['Claude', 'Working prototype', 'All five flows'],
  },
  {
    t: 'Tested it and fed back',
    d: 'We tested the prototype flow by flow with the team. Every round of feedback became a named fix, so the design changed for a reason we could point to.',
    out: ['Team feedback', 'Fix list'],
  },
  {
    t: 'Handed over rules, not just screens',
    d: 'The team kept building with four components, one status chip and four placement rules for every pop-up.',
    out: ['4 components', '4 rules', '1 status system'],
  },
];

const AGREED: [string, string][] = [
  ['Feature', 'Pricing strategies a merchant can read, preview in three modes, test, and undo.'],
  ['Utilization', 'Activation rate and time to first strategy: do merchants start, and how fast.'],
  ['Impact', 'Revenue and profit lift against normal prices, and the 7-day disable rate as the trust signal.'],
];

const RULES = [
  { k: 'R1', t: 'Primary on the right' },
  { k: 'R2', t: 'One primary per view' },
  { k: 'R3', t: 'Destructive is named and red' },
  { k: 'R4', t: 'Tertiary goes far left' },
];

const AUDIT: [string, string][] = [
  ['“Balanced” described high discounts.', 'Careful, Balanced, High Impact mean one thing everywhere.'],
  ['One strategy promised 15% and 20%.', 'One rule: 2 views, then 15% off.'],
  ['“Yes, Disable” next to “Yes, Cancel”.', '“Keep strategy” or “Disable strategy”.'],
  ['$ examples in a SAR-only product.', 'SAR 70 → SAR 69.99.'],
];


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
            <span className="block font-semibold tabular-nums text-2xl mb-1" style={{ color: on ? ACCENT : 'rgba(255,255,255,0.35)' }}>
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
          <h3 className="text-white text-2xl md:text-4xl font-semibold tracking-[-0.03em] max-w-2xl mb-6">{r.head}</h3>
          <FocusFilm scenes={r.scenes} steps={r.steps} h={r.h} accent={ACCENT} />
        </motion.div>
      </AnimatePresence>
    </>
  );
}

function Dashboard() {
  return (
    <>
      <h2 className="text-white text-2xl md:text-4xl font-semibold tracking-[-0.03em] max-w-2xl mb-6">A dashboard that answers before it decorates.</h2>
      <FocusFilm scenes={[{ node: <DashboardView />, active: 'dashboard', url: 'app.sampo.ai/dashboard' }]} steps={DASH_STEPS} h={780} accent={ACCENT} />
    </>
  );
}

export function SampoCaseStudy({ onBack, onNext }: CaseStudyComponentProps) {
  return (
    <CaseShell chapters={CHAPTERS} metaLine="Sampo AI · Pricing" onBack={onBack} onNext={onNext} resetKey="sampo-ai-pricing" pillId="sampo-tab-pill">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        {/* ── 01 OVERVIEW ── */}
        <ChapterTitle total="VII" chapter={CHAPTERS[0]} />
        <section id="overview" className="mb-32 scroll-mt-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <CaseIntro
              meta={[
                ['Company', 'Sampo AI'],
                ['Role', 'Consultation & Design team management'],
                ['Year', '2024 – 2025'],
              ]}
              title="AI pricing merchants can trust, test and undo."
            >
              <p>An AI that changes store prices for Saudi e-commerce merchants.</p>
              <p>
                As consultant and design team lead, I got the teams to agree on the feature and its impact, built the prototype
                with AI, and tested it before handoff.
              </p>
            </CaseIntro>
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
        <ChapterTitle total="VII" chapter={CHAPTERS[1]} tone="red" />
        <section id="problem" className="mb-32 scroll-mt-24">
          <motion.p {...reveal} className="text-white text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight max-w-4xl mb-12">
            Merchants were asked to trust a black box with their margin.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-12">
            {PROBLEMS.map((p, i) => (
              <motion.div key={p.k} {...reveal} transition={{ ...reveal.transition, delay: i * 0.06 }} className="rounded-[24px] border border-[#FF5F5F]/15 bg-[#FF5F5F]/[0.03] p-7">
                <p className="text-white text-xl font-bold tracking-tight mb-2">{p.k}</p>
                <p className="text-white/50 text-sm leading-relaxed">{p.d}</p>
              </motion.div>
            ))}
          </div>
          <motion.p {...reveal} className="text-2xl md:text-3xl font-bold tracking-tight text-white/90">
            The goal: every price change{' '}
            <span style={{ color: ACCENT }}>explainable, previewable and reversible.</span>
          </motion.p>
        </section>

        {/* ── 03 CONCEPT ── */}
        <ChapterTitle total="VII" chapter={CHAPTERS[2]} tone="teal" />
        <section id="concept" className="mb-32 scroll-mt-24">
          <motion.h2 {...reveal} className="text-white text-3xl md:text-5xl font-semibold tracking-[-0.03em] mb-10 max-w-3xl">
            Control is handed over one rung at a time.
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-end">
            {RUNGS.map((r, i) => (
              <motion.div
                key={r.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-white/10 bg-[#0D0D0D] p-5"
                style={{ minHeight: 120 + i * 18 }}
              >
                <span className="block font-semibold tabular-nums text-3xl mb-2" style={{ color: ACCENT, opacity: 0.4 + i * 0.15 }}>
                  {r.n}
                </span>
                <span className="block text-white font-bold mb-1">{r.t}</span>
                <span className="block text-white/45 text-xs leading-snug">“{r.q}”</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 04 PROCESS ── */}
        <ChapterTitle total="VII" chapter={CHAPTERS[3]} tone="teal" />
        <section id="process" className="mb-32 scroll-mt-24">
          <motion.h2 {...reveal} className="text-white text-3xl md:text-5xl font-semibold tracking-[-0.03em] mb-4 max-w-3xl">
            I ran it as a consultant: agree first, then prototype, then test.
          </motion.h2>
          <motion.p {...reveal} className="text-white/55 text-base md:text-lg leading-relaxed max-w-2xl mb-12">
            My job was to get product, data and engineering to one plan, and to prove it with something people could click.
          </motion.p>
          <ol className="relative grid gap-4">
            <span className="absolute left-[23px] top-6 bottom-6 w-px bg-gradient-to-b from-[#8B85FF]/60 via-[#8B85FF]/20 to-transparent hidden sm:block" aria-hidden />
            {PROCESS.map((p, i) => (
              <motion.li
                key={p.t}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="relative grid grid-cols-[48px_minmax(0,1fr)] gap-4 sm:gap-6"
              >
                <span
                  className="w-12 h-12 rounded-full grid place-items-center text-sm font-semibold border"
                  style={{ borderColor: `${ACCENT}66`, background: '#0D0B1F', color: ACCENT }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="rounded-[20px] border border-white/8 bg-[#0D0D0D] p-5 md:p-6 grid md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] gap-4 md:gap-8 items-start">
                  <div>
                    <p className="text-white text-lg md:text-xl font-bold tracking-tight mb-1.5">{p.t}</p>
                    <p className="text-white/55 text-sm md:text-base leading-relaxed">{p.d}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    {p.out.map((o) => (
                      <span key={o} className="text-xs font-semibold rounded-full px-3 py-1.5 border" style={{ borderColor: `${ACCENT}44`, color: '#CFCBFF', background: `${ACCENT}12` }}>
                        {o}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
          <motion.div
            {...reveal}
            className="mt-10 rounded-[24px] p-6 md:p-8 border grid md:grid-cols-3 gap-6"
            style={{ borderColor: `${ACCENT}44`, background: `${ACCENT}0D` }}
          >
            {AGREED.map(([k, v]) => (
              <div key={k}>
                <p className="text-xs font-semibold mb-2" style={{ color: ACCENT }}>
                  {k}
                </p>
                <p className="text-white/85 text-sm md:text-base leading-relaxed">{v}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ── 05 FLOWS ── */}
        <ChapterTitle total="VII" chapter={CHAPTERS[4]} tone="teal" />
        <section id="flows" className="mb-32 scroll-mt-24">
          <p className="text-white/55 text-base md:text-lg leading-relaxed max-w-2xl mb-10">
            Every screen here is the prototype I built with Claude and tested with the team. Watch each flow, or click the screen and use it.
          </p>
          <Flows />
        </section>

        {/* ── 06 DASHBOARD ── */}
        <ChapterTitle total="VII" chapter={CHAPTERS[5]} />
        <section id="dashboard" className="mb-32 scroll-mt-24">
          <Dashboard />
        </section>

        {/* ── 07 CRAFT ── */}
        <ChapterTitle total="VII" chapter={CHAPTERS[6]} />
        <section id="craft" className="mb-16 scroll-mt-24">
          <motion.div {...reveal} className="mb-16">
            <p className="text-white/45 text-sm mb-5">Four rules for every pop-up</p>
            <ol className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5">
              {RULES.map((r) => (
                <li key={r.k}>
                  <span className="font-mono text-xs" style={{ color: ACCENT }}>
                    {r.k}
                  </span>
                  <p className="text-white font-medium mt-1">{r.t}</p>
                </li>
              ))}
            </ol>
          </motion.div>

          <motion.div {...reveal} className="mb-16">
            <div className="hidden md:grid grid-cols-2 gap-x-10 text-sm mb-4">
              <span className="text-[#FF8A8A]">Before the audit</span>
              <span style={{ color: ACCENT }}>After</span>
            </div>
            <ul className="grid gap-5">
              {AUDIT.map(([found, fix]) => (
                <li key={found} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-1 text-[15px] leading-relaxed">
                  <span className="text-white/45">
                    <span className="md:hidden text-[#FF8A8A]">Before · </span>
                    {found}
                  </span>
                  <span className="text-white/85">
                    <span className="md:hidden" style={{ color: ACCENT }}>
                      After ·{' '}
                    </span>
                    {fix}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          <p className="text-white/45 text-sm mb-5">One status, everywhere</p>
          <div className="flex flex-wrap items-center gap-3 mb-16 rounded-[24px] bg-[#F6F5FB] p-5">
            {(['Not active', 'Pending activation', 'A/B testing', 'Active', 'Completed'] as const).map((st, i, a) => (
              <motion.span
                key={st}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <StatusChip s={st} />
                {i < a.length - 1 && <span className="text-[#9A97B3]">→</span>}
              </motion.span>
            ))}
          </div>

          <Takeaway accent={ACCENT} deep="#2A1C8F" label="What held it together" note="All figures are sample data from the design boards.">
            <span style={{ color: ACCENT }}>Explain before you ask.</span> Show ranges, not promises. Make leaving cheap. Let
            status travel.
          </Takeaway>
        </section>
      </div>
    </CaseShell>
  );
}
