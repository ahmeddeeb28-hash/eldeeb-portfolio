import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { CaseShell } from './_shared/CaseShell';
import { ChapterTitle } from './_shared/ChapterTitle';
import { CaseIntro, LeadStats, Takeaway } from './_shared/CaseLayout';
import { reveal } from './_shared/CaseBits';
import type { Chapter, CaseStudyComponentProps } from './_shared/types';

/* ── Design leadership · Sary, then Lobah ─────────────
   How I led design at Sary from Senior Product Designer to
   Product Design Lead (Sep 2021 – Sep 2023), and the game design
   team I lead at Lobah now. Sources: the CV, Sary's design plan
   and quarterly review in Notion (objectives, key results, stream
   work, research volume), and LinkedIn recommendations. Roles only,
   no names. Headcounts per stream are not shown: they changed
   through the period and aren't confirmed. */

const ACCENT = '#2DD4BF';
const DEEP = '#0F4C4A';
const PANEL = '#0F1413';
const LINE = 'rgba(255,255,255,0.08)';

const CHAPTERS: Chapter[] = [
  { id: 'overview', num: '01', roman: 'I', label: 'Overview', beat: 'The teams I lead.' },
  { id: 'architecture', num: '02', roman: 'II', label: 'Architecture', beat: 'Three streams, one team.' },
  { id: 'rituals', num: '03', roman: 'III', label: 'Rituals', beat: 'One connected rhythm.' },
  { id: 'okrs', num: '04', roman: 'IV', label: 'OKRs', beat: 'Baseline to target.' },
  { id: 'system', num: '05', roman: 'V', label: 'System & speed', beat: 'One source of truth.' },
  { id: 'hiring', num: '06', roman: 'VI', label: 'Hiring', beat: 'Same brief, same bar.' },
  { id: 'lobah', num: '07', roman: 'VII', label: 'Lobah', beat: 'Leading a game design team.' },
];
const TOTAL = 'VII';

/* ── 01 the teams I've led ───────────────────────── */

const TEAMS: { where: string; when: string; role: string; facts: [string, string][]; scope: string[] }[] = [
  {
    where: 'Sary',
    when: 'Sep 2021 – Sep 2023',
    role: 'Senior Product Designer → Product Design Lead',
    facts: [
      ['8', 'designers, plus associate UX researchers'],
      ['3', 'streams: Demand, Supply, Logistics'],
      ['5', 'countries'],
    ],
    scope: ['B2B grocery marketplace', 'Retailers, suppliers, drivers', 'Mobile and web'],
  },
  {
    where: 'Lobah',
    when: 'Jan 2025 – now',
    role: 'Lead Game Product Designer',
    facts: [
      ['4+', 'game UI and UX designers'],
      ['4', 'products: Samla, IceBreaker, Jackaroo, Lobahplay'],
      ['2', 'platforms: PC and mobile'],
    ],
    scope: ['Games and a gaming hub', 'Players', 'PC and mobile'],
  },
];

function TeamsLed() {
  return (
    <div className="grid lg:grid-cols-2 gap-3">
      {TEAMS.map((t, i) => (
        <motion.article
          key={t.where}
          {...reveal}
          transition={{ ...reveal.transition, delay: i * 0.08 }}
          className="rounded-[24px] border p-6 md:p-8"
          style={{ background: PANEL, borderColor: LINE }}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-1">
            <p className="text-white text-2xl font-bold tracking-tight">{t.where}</p>
            <p className="text-white/45 text-sm tabular-nums">{t.when}</p>
          </div>
          <p className="text-sm font-medium mb-6" style={{ color: ACCENT }}>
            {t.role}
          </p>
          <dl className="grid grid-cols-3 gap-4 pb-6 mb-5 border-b" style={{ borderColor: LINE }}>
            {t.facts.map(([v, k]) => (
              <div key={k}>
                <dt className="sr-only">{k}</dt>
                <dd className="text-white text-4xl md:text-5xl font-extrabold tracking-[-0.05em] tabular-nums leading-none">{v}</dd>
                <p className="text-white/55 text-xs md:text-sm mt-2 leading-snug">{k}</p>
              </div>
            ))}
          </dl>
          <p className="text-white/50 text-sm">{t.scope.join('  ·  ')}</p>
        </motion.article>
      ))}
    </div>
  );
}

/* ── 02 architecture: three streams, one team ─────── */

type Stream = {
  name: string;
  users: string;
  products: string[];
  areas: string[];
  did: string[];
  proof: [string, string][];
};

const STREAMS: Stream[] = [
  {
    name: 'Demand',
    users: 'Retailers: baqalas and cafes',
    products: ['Flagship app', 'POS'],
    areas: ['Storefront', 'Catalogue', 'Checkout & Payment'],
    did: [
      'Revamped the ordering flow, from basket to tracking',
      'Readied the SKU page, Reorder, Cart and Category page for launch',
      'Order tracking service blueprint and an online ordering friction audit',
      'POS e-invoices and credit notes for the new e-invoicing rules, then the POS pilot',
    ],
    proof: [
      ['133', 'Baqala interviews in 3 cities'],
      ['30', 'Cafe interviews'],
      ['+6%', 'Order conversion'],
    ],
  },
  {
    name: 'Supply',
    users: 'Suppliers and vendors',
    products: ['Ark, the supplier platform'],
    areas: ['Vendor', 'Growth'],
    did: [
      'Designed the new supplier onboarding gate',
      'Purchase orders in Ark',
      'Started a vendor persona from field visits',
      'Brought Ark into Fullstory so the stream could be measured',
    ],
    proof: [['25', 'Vendors met for the persona']],
  },
  {
    name: 'Logistics',
    users: 'Drivers and fleet operations',
    products: ['Launchpad, the driver app', 'Lighthouse, fleet management'],
    areas: ['Driver app and delivery'],
    did: [
      'Launchpad 1.5: landing, itinerary, loading and review, en route, cash collection',
      'Interviews and usability tests with drivers, shaped around their daily route',
      'SUS run as interviews with drivers, not a form',
      'Lighthouse tables, navigation, shipments and invoices',
    ],
    proof: [['68', 'First SUS score, Flagship and Launchpad']],
  },
];

const SHARED = ['Design system', 'Research ops: personas, Fullstory, SUS', 'Rituals', 'Hiring and growth'];

function Architecture() {
  const [sel, setSel] = useState(0);
  const s = STREAMS[sel];
  const reduced = useReducedMotion();
  return (
    <div className="rounded-[28px] border overflow-hidden" style={{ background: PANEL, borderColor: LINE }}>
      <div className="p-5 md:p-10">
        {/* leadership line */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-sm">
          <span className="rounded-xl px-3.5 py-2 bg-white/[0.06] text-white font-semibold">Head of Product</span>
          <span aria-hidden className="hidden sm:block w-6 h-px bg-white/25" />
          <span className="rounded-xl px-3.5 py-2 font-bold text-[#06201E]" style={{ background: ACCENT }}>
            Product Design Lead
          </span>
          <span aria-hidden className="hidden sm:block w-6 h-px bg-white/25" />
          <span className="rounded-xl px-3.5 py-2 bg-white/[0.06] text-white font-semibold">PMs in each stream</span>
        </div>
        <div aria-hidden className="mx-auto w-px h-6 bg-white/20" />
        {/* the one team, shared across every stream */}
        <div className="rounded-2xl border px-4 py-4 md:px-6 text-center" style={{ borderColor: `${ACCENT}55`, background: `${ACCENT}0D` }}>
          <p className="text-white font-bold">One design team · 8 designers and associate UX researchers · 5 countries</p>
          <p className="text-white/55 text-xs md:text-sm mt-1.5">Shared across all three: {SHARED.join('  ·  ')}</p>
        </div>
        {/* stems down to the streams */}
        <div aria-hidden className="hidden md:grid grid-cols-3 h-6">
          {STREAMS.map((x, i) => (
            <span key={x.name} className="mx-auto w-px h-full transition-colors" style={{ background: i === sel ? ACCENT : 'rgba(255,255,255,0.2)' }} />
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-2.5 mt-3 md:mt-0" role="tablist" aria-label="Streams">
          {STREAMS.map((x, i) => {
            const on = i === sel;
            return (
              <button
                key={x.name}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setSel(i)}
                onMouseEnter={() => setSel(i)}
                className="text-left rounded-2xl p-4 md:p-5 border transition-colors"
                style={{ borderColor: on ? ACCENT : LINE, background: on ? `${ACCENT}14` : 'rgba(255,255,255,0.02)' }}
              >
                <p className="flex items-center justify-between gap-2">
                  <span className="text-white text-lg font-bold">{x.name}</span>
                  <span className="text-xs tabular-nums" style={{ color: on ? ACCENT : 'rgba(255,255,255,0.4)' }}>
                    {x.areas.length} {x.areas.length === 1 ? 'area' : 'areas'}
                  </span>
                </p>
                <p className="text-white/55 text-sm mt-0.5">{x.users}</p>
                <p className="text-white/80 text-sm mt-3">{x.products.join(' · ')}</p>
              </button>
            );
          })}
        </div>
      </div>
      {/* what the team did in the selected stream */}
      <div className="border-t p-5 md:p-10" style={{ borderColor: LINE, background: 'rgba(255,255,255,0.015)' }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={s.name}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-8"
          >
            <div>
              <p className="text-white/45 text-sm mb-3">
                What the team did in <span className="text-white">{s.name}</span>
              </p>
              <ol className="grid gap-3">
                {s.did.map((d, i) => (
                  <li key={d} className="grid grid-cols-[28px_minmax(0,1fr)] gap-3 items-baseline">
                    <span className="text-sm tabular-nums font-semibold" style={{ color: ACCENT }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-white/85 leading-snug">{d}</span>
                  </li>
                ))}
              </ol>
              <p className="text-white/40 text-xs mt-5">Product areas: {s.areas.join(', ')}</p>
            </div>
            <div className="grid gap-3 content-start">
              {s.proof.map(([v, k]) => (
                <div key={k} className="flex items-baseline gap-4 border-b pb-3" style={{ borderColor: LINE }}>
                  <span className="text-white text-4xl font-extrabold tracking-[-0.05em] tabular-nums min-w-[3.2ch]">{v}</span>
                  <span className="text-white/60 text-sm">{k}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── 03 rituals: one connected rhythm ──────────────
   Each ritual has what goes in and what comes out; the output
   of one is the input of the next, and the quarterly review
   sets what the daily stand-ups work on. The slider zooms out
   from a day to a quarter. */

type Ritual = { name: string; meta: string; input: string; output: string };
const CADENCES: { k: string; items: Ritual[] }[] = [
  {
    k: 'Day',
    items: [
      { name: 'Stand-up', meta: '15 min, whole team', input: 'Yesterday’s progress in Figma', output: 'Blockers raised the same day' },
      { name: 'Designer ↔ PM', meta: 'Each designer with their squad PM', input: 'Squad priorities', output: 'Scope agreed before design starts' },
    ],
  },
  {
    k: 'Week',
    items: [
      { name: 'Design review', meta: 'Team sync on work in progress', input: 'Work from every stream', output: 'One standard across streams' },
      { name: 'Design crit', meta: 'Open critique across squads', input: 'Flows ready for feedback', output: 'Stronger rationale before handoff' },
      { name: 'Production call', meta: 'With PMs, managers and the Head of Product', input: 'What each squad is shipping', output: 'Priorities and trade-offs agreed' },
      { name: 'Design QA', meta: 'With engineering, on Jira', input: 'Built screens', output: 'Usability fixes before release' },
    ],
  },
  {
    k: 'Two weeks',
    items: [{ name: '1:1s', meta: 'With every designer', input: 'Growth, feedback, frustrations', output: 'A growth plan per person' }],
  },
  {
    k: 'Month',
    items: [
      { name: 'Fullstory replays', meta: 'Session replay analysis', input: 'Real sessions on core flows', output: 'UX issues added to the backlog' },
      { name: 'Retro', meta: 'Adjusted to project scale', input: 'What worked and what didn’t', output: 'Process changes for next month' },
    ],
  },
  {
    k: 'Quarter',
    items: [
      {
        name: 'OKR review',
        meta: 'Objectives, each with one owner',
        input: 'Dashboards, SUS scores, replays',
        output: 'Next quarter’s objectives, back into the daily stand-up',
      },
    ],
  },
];

function Rhythm() {
  const [c, setC] = useState(1);
  const [r, setR] = useState(0);
  const reduced = useReducedMotion();
  const cad = CADENCES[c];
  const rit = cad.items[Math.min(r, cad.items.length - 1)];
  const pick = (i: number) => {
    setC(i);
    setR(0);
  };
  return (
    <div className="rounded-[28px] border overflow-hidden" style={{ background: PANEL, borderColor: LINE }}>
      {/* the map of every ritual, by cadence; the chosen zoom and everything inside it light up */}
      <div className="p-5 md:p-10 pb-6">
        {/* phones: the rituals at the chosen cadence, full names */}
        <div className="md:hidden flex flex-wrap gap-1.5 min-h-[76px] content-start">
          {cad.items.map((it, j) => {
            const on = j === Math.min(r, cad.items.length - 1);
            return (
              <button
                key={it.name}
                type="button"
                onClick={() => setR(j)}
                className="rounded-lg px-3 py-2 text-sm font-semibold"
                style={{ background: on ? ACCENT : `${ACCENT}1F`, color: on ? '#06201E' : '#E6FBF7' }}
              >
                {it.name}
              </button>
            );
          })}
        </div>
        <div className="hidden md:grid grid-cols-5 gap-3">
          {CADENCES.map((x, i) => (
            <div key={x.k} className="min-w-0">
              <div className="grid gap-1.5">
                {x.items.map((it, j) => {
                  const on = i === c && j === Math.min(r, x.items.length - 1);
                  const lit = i <= c;
                  return (
                    <button
                      key={it.name}
                      type="button"
                      onClick={() => {
                        setC(i);
                        setR(j);
                      }}
                      className="rounded-xl px-3 py-2 text-left text-sm font-semibold leading-tight transition-all truncate"
                      style={{
                        background: on ? ACCENT : lit ? `${ACCENT}1F` : 'rgba(255,255,255,0.03)',
                        color: on ? '#06201E' : lit ? '#E6FBF7' : 'rgba(255,255,255,0.35)',
                        outline: on ? 'none' : undefined,
                      }}
                      title={it.name}
                    >
                      {it.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {/* the slider: a day out to a quarter */}
        <div className="mt-6">
          <input
            type="range"
            min={0}
            max={CADENCES.length - 1}
            step={1}
            value={c}
            onChange={(e) => pick(Number(e.target.value))}
            aria-label="Cadence, from a day to a quarter"
            aria-valuetext={cad.k}
            className="w-full accent-[#2DD4BF] cursor-pointer"
          />
          <div className="grid grid-cols-5 mt-1">
            {CADENCES.map((x, i) => (
              <button
                key={x.k}
                type="button"
                onClick={() => pick(i)}
                className="text-[11px] md:text-sm font-medium transition-colors"
                style={{ color: i === c ? ACCENT : 'rgba(255,255,255,0.45)' }}
              >
                {x.k}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* the chosen ritual: what goes in, what comes out */}
      <div className="border-t p-5 md:p-10" style={{ borderColor: LINE, background: 'rgba(255,255,255,0.015)' }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={rit.name}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.1fr)_auto_minmax(0,1fr)] gap-3 md:gap-4 items-stretch"
          >
            <Flow label="Goes in" text={rit.input} />
            <Arrow />
            <div className="rounded-2xl p-5 text-[#06201E]" style={{ background: ACCENT }}>
              <p className="text-xs font-semibold opacity-70">Every {cad.k.toLowerCase()}</p>
              <p className="text-xl font-bold leading-tight mt-1">{rit.name}</p>
              <p className="text-sm mt-1.5 opacity-80">{rit.meta}</p>
            </div>
            <Arrow />
            <Flow label="Comes out" text={rit.output} />
          </motion.div>
        </AnimatePresence>
        <p className="text-white/40 text-xs mt-5">
          Drag the slider or pick a ritual. Each output feeds the next ritual, and the quarterly review sets what the
          stand-ups work on.
        </p>
      </div>
    </div>
  );
}

const Flow = ({ label, text }: { label: string; text: string }) => (
  <div className="rounded-2xl border p-5" style={{ borderColor: LINE }}>
    <p className="text-white/45 text-xs font-medium">{label}</p>
    <p className="text-white font-semibold leading-snug mt-1.5">{text}</p>
  </div>
);
const Arrow = () => (
  <span aria-hidden className="grid place-items-center text-white/30">
    <ArrowRight className="w-5 h-5 rotate-90 md:rotate-0" />
  </span>
);

/* ── 04 OKRs: baseline to target ───────────────────── */

type KR = { k: string; from?: number; to?: number; text?: string };
const OKRS: { o: string; mine?: boolean; krs: KR[]; moved: string }[] = [
  {
    o: 'Define metrics to measure design impact',
    mine: true,
    krs: [
      { k: 'SUS surveys', from: 0, to: 3 },
      { k: 'Fullstory dashboards', from: 0, to: 3 },
      { k: 'Fullstory segments', from: 0, to: 2 },
    ],
    moved: '8 dashboards built against a target of 3. Sary’s first SUS survey scored 68.',
  },
  {
    o: 'Enhance core flows',
    krs: [
      { k: 'Flows fixed', from: 0, to: 3 },
      { k: 'Direct success rate', text: 'above 70%' },
      { k: 'Flow abandonment', text: '30% or less' },
    ],
    moved: 'The ordering flow revamped from basket to tracking. Order conversion up 6%.',
  },
  {
    o: 'Increase user engagement',
    krs: [
      { k: 'Customers interviewed', from: 48, to: 60 },
      { k: 'Formal personas', from: 2, to: 5 },
    ],
    moved: 'Baqala persona round two: 133 interviews in 3 cities. Cafe and vendor personas started.',
  },
  {
    o: 'Expand design to Supply and Logistics',
    krs: [
      { k: 'Stream workshops and plans', from: 0, to: 2 },
      { k: 'Core flows per stream', from: 0, to: 4 },
    ],
    moved: 'The team took on Ark, Lighthouse and Launchpad alongside Demand.',
  },
  {
    o: 'Consolidate tools',
    krs: [
      { k: 'Design tools', from: 5, to: 1 },
      { k: 'Developers in Figma', from: 8, to: 20 },
    ],
    moved: 'All designs and the dev team moved to Figma. One source of truth.',
  },
  {
    o: 'First look at Sary 2.0',
    krs: [
      { k: 'Flows researched', from: 0, to: 3 },
      { k: 'Wireframe flows', from: 0, to: 3 },
      { k: 'UI trials', from: 0, to: 4 },
      { k: 'Flow prototypes', from: 0, to: 2 },
    ],
    moved: 'Phase 1 of Sary 2.0 delivered.',
  },
];

/* one key result as a track: the baseline as a ring, the target as a dot */
function Track({ kr }: { kr: KR }) {
  const reduced = useReducedMotion();
  if (kr.from === undefined || kr.to === undefined)
    return (
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 items-baseline">
        <span className="text-white/60 text-sm">{kr.k}</span>
        <span className="text-white text-sm font-semibold">{kr.text}</span>
      </div>
    );
  const max = Math.max(kr.from, kr.to) * 1.15 || 1;
  const a = (kr.from / max) * 100;
  const b = (kr.to / max) * 100;
  const lo = Math.min(a, b);
  const w = Math.abs(b - a);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <span className="text-white/60 text-sm">{kr.k}</span>
        <span className="text-white text-sm font-semibold tabular-nums">
          {kr.from} → {kr.to}
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-white/[0.06]">
        <motion.span
          className="absolute top-0 h-full rounded-full"
          style={{ left: `${lo}%`, background: `${ACCENT}99`, transformOrigin: b >= a ? '0 50%' : '100% 50%' }}
          initial={reduced ? false : { width: 0 }}
          whileInView={{ width: `${w}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
        <span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 bg-[#0F1413]" style={{ left: `${a}%`, borderColor: 'rgba(255,255,255,0.5)' }} />
        <span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full" style={{ left: `${b}%`, background: ACCENT }} />
      </div>
    </div>
  );
}

function OkrBoard() {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {OKRS.map((k, i) => (
        <motion.article
          key={k.o}
          {...reveal}
          transition={{ ...reveal.transition, delay: (i % 2) * 0.06 }}
          className="rounded-[24px] border p-6 md:p-7 flex flex-col"
          style={{ background: PANEL, borderColor: k.mine ? `${ACCENT}66` : LINE }}
        >
          <div className="flex items-start justify-between gap-3 mb-5">
            <p className="text-white text-lg md:text-xl font-bold tracking-tight leading-snug">
              <span className="text-white/35 tabular-nums mr-2">{String(i + 1).padStart(2, '0')}</span>
              {k.o}
            </p>
            {k.mine && (
              <span className="flex-none text-[11px] font-semibold rounded-full px-2.5 py-1 text-[#06201E]" style={{ background: ACCENT }}>
                I owned this
              </span>
            )}
          </div>
          <div className="grid gap-4 mb-6">
            {k.krs.map((kr) => (
              <Track key={kr.k} kr={kr} />
            ))}
          </div>
          <p className="mt-auto text-white/80 text-sm leading-relaxed border-t pt-4" style={{ borderColor: LINE }}>
            <span className="font-semibold" style={{ color: ACCENT }}>
              What moved ·{' '}
            </span>
            {k.moved}
          </p>
        </motion.article>
      ))}
    </div>
  );
}

/* ── 07 Lobah ─────────────────────────────────────── */

const LOBAH_PRODUCTS: [string, string][] = [
  ['Samla', 'AAA game'],
  ['IceBreaker', 'Game'],
  ['Jackaroo', 'Board game'],
  ['Lobahplay', 'The gaming hub'],
];
const LOBAH_QUOTES: [string, string][] = [
  [
    'He has a great talent for organizing work, skillfully delegating tasks based on his team members’ individual strengths, while also fostering their professional growth, acting as a true mentor in the process.',
    'Polina Kosheleva, Senior Game UI Artist · reported to Ahmad',
  ],
  [
    'Under his leadership, everything was well-organized, transparent, and clearly communicated. He created an environment where everyone felt supported, heard, and appreciated.',
    'Sandra Mistal, UI Designer · reported to Ahmad',
  ],
  [
    'Ahmed is a serious designer and a great manager, he would be a great addition to any team.',
    'Axel Xiberras, UX UI Designer · reported to Ahmad',
  ],
];

const PROFILES: [string, string, string][] = [
  ['Senior Product Designer', '4–5 years', 'Owns a squad’s problem space end to end, governs the design system and knows when to let a squad diverge, runs workshops, measures outcomes, mentors juniors.'],
  ['Product Design Lead', '5+ years, led 3+ designers', 'Owns the design roadmap, grows designers’ careers, takes part in hiring, documents core patterns so engineers can build independently.'],
  ['Senior / Lead Product Researcher', 'Bilingual Arabic and English', 'Runs evaluative research across products, turns findings into backlog items, coaches designers and PMs on research.'],
];
const PROCESS = ['Application and intro chat', 'Portfolio and experience interview', 'Take-home task, 6 days max', 'Presentation call', 'Feedback in 2–4 weeks'];
const SCORECARD = ['Document organisation and storytelling', 'Problem-solving and rationale', 'Quality of the final outcome', 'Time management and prioritisation'];
const LOOKED_FOR = ['Systems thinking, not one-off screens', 'Decisions grounded in data and research', 'Influence with PMs, engineers and leadership', 'A track record of mentoring others'];


export function LeadershipCaseStudy({ onBack, onNext }: CaseStudyComponentProps) {
  return (
    <CaseShell chapters={CHAPTERS} metaLine="Design leadership" onBack={onBack} onNext={onNext} resetKey="sary-design-leadership" pillId="lead-tab-pill">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        {/* ── 01 OVERVIEW ── */}
        <ChapterTitle chapter={CHAPTERS[0]} total={TOTAL} />
        <section id="overview" className="mb-32 scroll-mt-24">
          <CaseIntro
            meta={[
              ['Company', 'Sary, then Lobah'],
              ['Role', 'Senior Product Designer → Product Design Lead'],
              ['Years', 'Sep 2021 – Sep 2023 · 2025 – now'],
            ]}
            title="One design team across three streams."
          >
            <p>
              Sary is a B2B marketplace connecting retailers with suppliers across Saudi Arabia. I joined in 2021 as Senior
              Product Designer and grew into Product Design Lead, running one design team across the Demand, Supply and
              Logistics streams.
            </p>
            <p>
              This is how that team was built: the architecture, the rhythm that held it together, the objectives we set and
              measured, the system we shipped, and how we hired. It ends with the game design team I lead at Lobah today.
            </p>
          </CaseIntro>
          <LeadStats
            lead={{ v: '+40%', k: 'Design velocity' }}
            note="Design cycle time, brief to dev-ready"
            rest={[
              { v: '30%', k: 'Faster design-to-dev handoff' },
              { v: '25+', k: 'Engineers building from the system' },
              { v: '8', k: 'Analytics dashboards, target was 3' },
            ]}
            accent={ACCENT}
          />
          <p className="text-white/45 text-sm mt-16 mb-4">The teams I lead</p>
          <TeamsLed />
        </section>

        {/* ── 02 ARCHITECTURE ── */}
        <ChapterTitle chapter={CHAPTERS[1]} total={TOTAL} tone="teal" />
        <section id="architecture" className="mb-32 scroll-mt-24">
          <motion.h2 {...reveal} className="text-white text-3xl md:text-5xl font-semibold tracking-[-0.03em] mb-4 max-w-3xl">
            Three streams, one team.
          </motion.h2>
          <motion.p {...reveal} className="text-white/55 text-base md:text-lg leading-relaxed max-w-2xl mb-10">
            We worked as a matrix. Designers sat with a stream and its PM day to day, and came back to one team for the
            system, the research and the standard. Pick a stream to see who it served and what we did there.
          </motion.p>
          <motion.div {...reveal}>
            <Architecture />
          </motion.div>
        </section>

        {/* ── 03 RITUALS ── */}
        <ChapterTitle chapter={CHAPTERS[2]} total={TOTAL} />
        <section id="rituals" className="mb-32 scroll-mt-24">
          <motion.h2 {...reveal} className="text-white text-3xl md:text-5xl font-semibold tracking-[-0.03em] mb-4 max-w-3xl">
            One rhythm, from a day to a quarter.
          </motion.h2>
          <motion.p {...reveal} className="text-white/55 text-base md:text-lg leading-relaxed max-w-2xl mb-10">
            A team spread over five countries needs rituals that hand off to each other. What one produces, the next one uses.
          </motion.p>
          <motion.div {...reveal}>
            <Rhythm />
          </motion.div>
        </section>

        {/* ── 04 OKRS ── */}
        <ChapterTitle chapter={CHAPTERS[3]} total={TOTAL} tone="teal" />
        <section id="okrs" className="mb-32 scroll-mt-24">
          <motion.h2 {...reveal} className="text-white text-3xl md:text-5xl font-semibold tracking-[-0.03em] mb-4 max-w-3xl">
            Six objectives, each with one owner.
          </motion.h2>
          <motion.p {...reveal} className="text-white/55 text-base md:text-lg leading-relaxed max-w-2xl mb-10">
            The design team’s first quarter with fixed objectives, from Sary’s design plan. Each track runs from the baseline
            <span className="inline-block w-2.5 h-2.5 rounded-full border-2 border-white/50 mx-1.5 align-middle" aria-hidden /> to the target
            <span className="inline-block w-2.5 h-2.5 rounded-full mx-1.5 align-middle" style={{ background: ACCENT }} aria-hidden />.
          </motion.p>
          <OkrBoard />
        </section>

        {/* ── 05 SYSTEM & SPEED ── */}
        <ChapterTitle chapter={CHAPTERS[4]} total={TOTAL} />
        <section id="system" className="mb-32 scroll-mt-24">
          <motion.h2 {...reveal} className="text-white text-3xl md:text-5xl font-semibold tracking-[-0.03em] mb-6 max-w-3xl">
            One tokenized system, built from directly.
          </motion.h2>
          <motion.p {...reveal} className="text-white/60 text-lg md:text-xl leading-relaxed max-w-3xl mb-12">
            “Adopted” meant one tokenized system that engineers across all three streams built from directly, adapting it per
            product without one-off designs. Phase 1 of the mobile system shipped in the team’s first OKR quarter.
          </motion.p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              ['+40%', 'Design velocity', 'Design cycle time, brief to dev-ready'],
              ['30%', 'Faster handoff', 'Design to development'],
              ['25+', 'Engineers', 'Building from the system'],
              ['8 → 20', 'Developers in Figma', 'With 5 design tools cut to 1'],
            ].map(([v, k, d], i) => (
              <motion.div key={k} {...reveal} transition={{ ...reveal.transition, delay: i * 0.06 }} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                <p className="text-white text-4xl font-extrabold tracking-[-0.04em] tabular-nums">{v}</p>
                <p className="text-white font-semibold mt-2">{k}</p>
                <p className="text-white/50 text-sm">{d}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 06 HIRING ── */}
        <ChapterTitle chapter={CHAPTERS[5]} total={TOTAL} tone="teal" />
        <section id="hiring" className="mb-24 scroll-mt-24">
          <motion.h2 {...reveal} className="text-white text-3xl md:text-5xl font-semibold tracking-[-0.03em] mb-4 max-w-3xl">
            The same brief and the same bar for every finalist.
          </motion.h2>
          <motion.p {...reveal} className="text-white/55 text-base md:text-lg leading-relaxed max-w-2xl mb-12">
            I built Sary’s design hiring process from scratch and used it to hire senior and principal-level designers. Every
            role had a clear profile, every finalist got the same take-home brief, and we scored each one on the same criteria:
            fair decisions across a team spread over five countries.
          </motion.p>

          <p className="text-white/45 text-sm mb-4">Role profiles I wrote</p>
          <div className="grid lg:grid-cols-3 gap-3 mb-14">
            {PROFILES.map(([t, y, d], i) => (
              <motion.div key={t} {...reveal} transition={{ ...reveal.transition, delay: i * 0.06 }} className="rounded-2xl border border-white/[0.08] bg-[#0F1413] p-6">
                <p className="text-white text-lg font-bold">{t}</p>
                <p className="text-sm font-semibold mt-1 mb-3" style={{ color: ACCENT }}>
                  {y}
                </p>
                <p className="text-white/60 text-sm leading-relaxed">{d}</p>
              </motion.div>
            ))}
          </div>

          <p className="text-white/45 text-sm mb-4">The process</p>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-14">
            {PROCESS.map((p, i) => (
              <motion.li key={p} {...reveal} transition={{ ...reveal.transition, delay: i * 0.05 }} className="rounded-2xl border border-white/[0.08] p-5">
                <span className="grid place-items-center w-8 h-8 rounded-full text-sm font-bold text-[#06201E] mb-3" style={{ background: ACCENT }}>
                  {i + 1}
                </span>
                <p className="text-white font-semibold leading-snug">{p}</p>
              </motion.li>
            ))}
          </ol>

          <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-3 mb-20">
            <motion.div {...reveal} className="rounded-[24px] p-6 md:p-8" style={{ background: `linear-gradient(160deg, ${DEEP}, #0B1F1E)` }}>
              <p className="text-white text-xl font-bold mb-2">The take-home brief</p>
              <p className="text-white/70 leading-relaxed mb-4">
                An open problem: a venue-booking app with a social sports community, covering booking, payment, cancellation,
                cost-sharing, matchmaking, gamification and tournaments. Left open on purpose, to see how far a senior
                candidate takes it.
              </p>
              <p className="text-white/50 text-sm mb-2">Business goals to design for</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {['Daily active users', 'Bookings per user', 'Download → booking', 'Total GMV'].map((x) => (
                  <span key={x} className="text-xs font-medium rounded-full px-2.5 py-1 text-[#CFF5EF]" style={{ background: `${ACCENT}26` }}>
                    {x}
                  </span>
                ))}
              </div>
              <p className="text-white/50 text-sm mb-2">Deliverables</p>
              <p className="text-white/80 text-sm">Personas (pains, needs, motivations), user scenarios, high-fidelity wireframes.</p>
            </motion.div>
            <motion.div {...reveal} className="grid gap-3">
              <div className="rounded-[24px] border border-white/[0.08] p-6">
                <p className="text-white font-bold mb-3">Scorecard</p>
                <ul className="grid gap-2">
                  {SCORECARD.map((x) => (
                    <li key={x} className="flex gap-2.5 text-white/75 text-sm">
                      <span style={{ color: ACCENT }}>✓</span>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[24px] border border-white/[0.08] p-6">
                <p className="text-white font-bold mb-3">What I looked for at senior and principal level</p>
                <ul className="grid gap-2">
                  {LOOKED_FOR.map((x) => (
                    <li key={x} className="flex gap-2.5 text-white/75 text-sm">
                      <span style={{ color: ACCENT }}>✓</span>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          <Takeaway
            accent={ACCENT}
            deep={DEEP}
            label="What I carry forward"
            note="“His ability to distill complex data into actionable insights has been invaluable for our strategic decision-making. He has fostered a culture of innovation within our design team.” — Mohammed Aldossary, Co-founder & CEO, Sary"
          >
            A young team didn’t need more pressure. It needed an owner for every objective, a rhythm people could rely on, and
            one source of truth.
          </Takeaway>
        </section>

        {/* ── 07 LOBAH ── */}
        <ChapterTitle chapter={CHAPTERS[6]} total={TOTAL} />
        <section id="lobah" className="mb-16 scroll-mt-24">
          <motion.h2 {...reveal} className="text-white text-3xl md:text-5xl font-semibold tracking-[-0.03em] mb-4 max-w-3xl">
            Now: a game design team at Lobah.
          </motion.h2>
          <motion.p {...reveal} className="text-white/55 text-base md:text-lg leading-relaxed max-w-2xl mb-10">
            Since January 2025 I’ve led a team of 4+ game UI and UX designers across four products, on PC and mobile. We
            redesigned onboarding and progression to shorten time to play.
          </motion.p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
            {LOBAH_PRODUCTS.map(([n, d], i) => (
              <motion.div key={n} {...reveal} transition={{ ...reveal.transition, delay: i * 0.05 }} className="rounded-2xl border p-5" style={{ borderColor: LINE, background: PANEL }}>
                <p className="text-white text-xl font-bold">{n}</p>
                <p className="text-white/50 text-sm mt-1">{d}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-white/45 text-sm mb-4">From the designers who report to me</p>
          <div className="grid lg:grid-cols-3 gap-3">
            {LOBAH_QUOTES.map(([q, by], i) => (
              <motion.figure key={by} {...reveal} transition={{ ...reveal.transition, delay: i * 0.06 }} className="rounded-[24px] border p-6 flex flex-col" style={{ borderColor: LINE }}>
                <blockquote className="text-white/85 leading-relaxed flex-1">“{q}”</blockquote>
                <figcaption className="text-white/45 text-sm mt-5">{by}</figcaption>
              </motion.figure>
            ))}
          </div>
        </section>
      </div>
    </CaseShell>
  );
}
