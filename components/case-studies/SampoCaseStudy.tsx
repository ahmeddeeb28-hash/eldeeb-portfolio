import { motion, AnimatePresence } from 'motion/react';
import { useState, type ReactNode } from 'react';
import { CaseShell } from './_shared/CaseShell';
import { ChapterTitle } from './_shared/ChapterTitle';
import { Meta } from './_shared/Meta';
import { CaseFilm, Eyebrow as BaseEyebrow, reveal } from './_shared/CaseBits';
import type { Chapter, CaseStudyComponentProps } from './_shared/types';
import { CameraReel, SHOTS, ScreenReel, type Shot } from './sampo/SampoReel';
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
   72s film. Each flow plays as a reel of the real screens,
   and is also rebuilt in code to try; all figures are the
   boards' sample data. No pilot results are claimed. */

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
  { k: 'Opaque logic', d: 'Strategies read like internal specs.' },
  { k: 'A one-way door', d: 'No preview, no way back. Doing nothing felt safest.' },
  { k: 'Silent after launch', d: 'Nothing said if a strategy was working.' },
];

type Rung = {
  n: string;
  t: string;
  q: string;
  head: string;
  shots: Shot[];
  ratio: number;
  view: ReactNode;
  h: number;
};

const WIDE = 820 / 587;
const NARROW = 534 / 392;

const RUNGS: Rung[] = [
  {
    n: '01',
    t: 'Understand',
    q: 'What does Sampo do?',
    head: 'Explain the engine before asking for the keys.',
    shots: [
      ['understand-1', 'First-time guidance', 50, 62, 1.35],
      ['understand-2', 'How it works, inline', 62, 50, 1.3],
      ['understand-3', 'Walkthrough, step 1', 72, 48, 1.45],
      ['understand-4', 'Walkthrough, step 2', 38, 42, 1.45],
    ],
    ratio: WIDE,
    view: <UnderstandView />,
    h: 560,
  },
  {
    n: '02',
    t: 'Preview',
    q: 'What will it do to my store?',
    head: 'Turn a risky decision into a choice of temperament.',
    shots: [
      ['preview-1', 'Three modes, side by side', 58, 45, 1.3],
      ['preview-2', 'Guided preview', 60, 70, 1.45],
      ['preview-3', 'Mode charts', 62, 55, 1.3],
      ['preview-4', 'Affected products', 58, 50, 1.35],
    ],
    ratio: WIDE,
    view: <PreviewView />,
    h: 700,
  },
  {
    n: '03',
    t: 'Commit',
    q: 'Can I still back out?',
    head: 'A confirmation that lowers the stakes.',
    shots: [
      ['commit-1', 'Review and confirm', 45, 55, 1.55],
      ['commit-2', 'Activation in progress', 50, 45, 1.7],
      ['commit-3', 'Safe exit', 50, 45, 1.7],
    ],
    ratio: NARROW,
    view: <PreviewView initialStage="confirm" />,
    h: 700,
  },
  {
    n: '04',
    t: 'Monitor',
    q: 'Is it working?',
    head: 'After launch, the black box gets a label.',
    shots: [
      ['monitor-1', 'A/B test finished', 50, 52, 1.35],
      ['monitor-2', 'Activation alert bar', 60, 20, 1.45],
      ['monitor-3', 'Status on the product', 55, 45, 1.3],
      ['monitor-4', 'Strategy statuses', 80, 30, 1.5],
    ],
    ratio: WIDE,
    view: <MonitorView />,
    h: 560,
  },
  {
    n: '05',
    t: 'Reverse',
    q: 'Can I take it back?',
    head: 'Every door opens both ways.',
    shots: [
      ['reverse-1', 'Strategies archive', 75, 50, 1.4],
      ['reverse-2', 'Strategy overview', 55, 45, 1.25],
      ['reverse-3', 'Change mode', 60, 68, 1.5],
      ['reverse-4', 'Mode updated', 22, 92, 1.7],
      ['reverse-5', 'Undo', 22, 92, 1.7],
      ['reverse-6', 'Confirm and save', 85, 94, 1.6],
    ],
    ratio: NARROW,
    view: <ReverseView />,
    h: 460,
  },
];

const DASH_STOPS: [string, number, number, number][] = [
  ['The whole store at a glance', 50, 50, 1],
  ['Four numbers first', 50, 12, 1.7],
  ['Revenue against last year', 36, 36, 1.9],
  ['Sampo’s share, in SAR', 83, 36, 2],
  ['Profit that adds up', 72, 78, 1.8],
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

const PRINCIPLES = ['Explain before you ask', 'Show ranges, not promises', 'Make leaving cheap', 'Let status travel'];

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

/* Watch the real screens, or try the rebuilt one */
function WatchOrTry({ mode, onMode }: { mode: 'watch' | 'try'; onMode: (m: 'watch' | 'try') => void }) {
  return (
    <div className="inline-flex self-start md:self-auto rounded-full border border-white/10 p-1 text-xs font-bold">
      {(['watch', 'try'] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onMode(m)}
          className={`rounded-full px-4 py-1.5 transition-colors ${mode === m ? 'bg-white text-black' : 'text-white/55 hover:text-white'}`}
        >
          {m === 'watch' ? 'Watch the flow' : 'Try it live'}
        </button>
      ))}
    </div>
  );
}

function Flows() {
  const [i, setI] = useState(1);
  const [mode, setMode] = useState<'watch' | 'try'>('watch');
  const r = RUNGS[i];
  return (
    <>
      <Ladder active={i} onPick={setI} />
      <AnimatePresence mode="wait">
        <motion.div
          key={r.n + mode}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <h3 className="text-white text-2xl md:text-4xl font-black tracking-tight max-w-2xl">{r.head}</h3>
            <WatchOrTry mode={mode} onMode={setMode} />
          </div>
          {mode === 'watch' ? (
            <ScreenReel shots={r.shots} ratio={r.ratio} accent={ACCENT} />
          ) : (
            <DesktopFrame canvasH={r.h} active={i >= 3 ? 'yours' : 'strategies'}>
              {r.view}
            </DesktopFrame>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

function Dashboard() {
  const [mode, setMode] = useState<'watch' | 'try'>('watch');
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <h2 className="text-white text-2xl md:text-4xl font-black tracking-tight max-w-2xl">A dashboard that answers before it decorates.</h2>
        <WatchOrTry mode={mode} onMode={setMode} />
      </div>
      {mode === 'watch' ? (
        <CameraReel src={`${SHOTS}/dashboard.webp`} ratio={1680 / 1334} stops={DASH_STOPS} accent={ACCENT} />
      ) : (
        <DesktopFrame canvasH={560} active="dashboard" url="app.sampo.ai/dashboard">
          <DashboardView />
        </DesktopFrame>
      )}
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
              An AI that changes store prices. I designed it so merchants can read it, test it and undo it.
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
          <motion.p {...reveal} className="text-white text-3xl md:text-5xl font-black leading-[1.1] tracking-tight max-w-4xl mb-12">
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
        <ChapterTitle chapter={CHAPTERS[2]} tone="teal" />
        <section id="concept" className="mb-32 scroll-mt-24">
          <motion.h2 {...reveal} className="text-white text-3xl md:text-5xl font-black tracking-tight mb-10 max-w-3xl">
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
                <span className="block italic text-3xl mb-2" style={{ color: ACCENT, fontFamily: 'Fraunces, serif', opacity: 0.4 + i * 0.15 }}>
                  {r.n}
                </span>
                <span className="block text-white font-bold mb-1">{r.t}</span>
                <span className="block text-white/45 text-xs leading-snug">“{r.q}”</span>
              </motion.div>
            ))}
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
          <Dashboard />
        </section>

        {/* ── 06 CRAFT ── */}
        <ChapterTitle chapter={CHAPTERS[5]} />
        <section id="craft" className="mb-16 scroll-mt-24">
          <Eyebrow>Four rules for every pop-up</Eyebrow>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-16">
            {RULES.map((r, i) => (
              <motion.div key={r.k} {...reveal} transition={{ ...reveal.transition, delay: i * 0.05 }} className="rounded-[20px] border border-white/5 bg-[#0D0D0D] p-5">
                <span className="font-mono text-xs" style={{ color: ACCENT }}>
                  {r.k}
                </span>
                <p className="text-white font-bold mt-2">{r.t}</p>
              </motion.div>
            ))}
          </div>

          <Eyebrow>Fixes from the audit</Eyebrow>
          <div className="rounded-[24px] border border-white/5 bg-[#0D0D0D] px-5 md:px-7 mb-16">
            {AUDIT.map(([found, fix]) => (
              <div key={found} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 py-4 border-b border-white/5 last:border-0 text-sm">
                <span className="text-white/45">
                  <span className="text-[#FF8A8A] font-bold">Before · </span>
                  {found}
                </span>
                <span className="text-white/85">
                  <span className="font-bold" style={{ color: ACCENT }}>
                    After ·{' '}
                  </span>
                  {fix}
                </span>
              </div>
            ))}
          </div>

          <Eyebrow>One status, everywhere</Eyebrow>
          <div className="flex flex-wrap items-center gap-3 mb-16 rounded-[24px] bg-[#F6F5FB] p-5">
            {(['Suggested', 'Pending', 'Testing', 'Active', 'Completed'] as const).map((st, i, a) => (
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

          <Eyebrow>What held it together</Eyebrow>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {PRINCIPLES.map((p, i) => (
              <motion.div key={p} {...reveal} transition={{ ...reveal.transition, delay: i * 0.05 }} className="rounded-[20px] border border-white/5 bg-[#0D0D0D] p-5">
                <span className="block italic text-3xl mb-2" style={{ color: ACCENT, fontFamily: 'Fraunces, serif' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-white font-bold">{p}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-white/35 text-xs mt-6">All figures are sample data from the design boards.</p>
        </section>
      </div>
    </CaseShell>
  );
}
