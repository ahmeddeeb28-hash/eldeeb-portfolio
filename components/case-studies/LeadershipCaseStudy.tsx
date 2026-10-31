import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { CaseShell } from './_shared/CaseShell';
import { ChapterTitle } from './_shared/ChapterTitle';
import { CaseIntro, Takeaway } from './_shared/CaseLayout';
import { reveal } from './_shared/CaseBits';
import type { Chapter, CaseStudyComponentProps } from './_shared/types';

/* ── How I lead design teams ─────────────────────────
   A leadership playbook, not a company story: the principles,
   the rituals, the team shape, how objectives are set, and how
   people are hired and grown. Sary and Lobah appear only as the
   places it was proven. Each chapter is a heading, one sentence
   and one visual. Sources: the CV, Sary's design plan and review
   in Notion, and LinkedIn recommendations. */

const ACCENT = '#2DD4BF';
const DEEP = '#0F4C4A';
const PANEL = '#0F1413';
const LINE = 'rgba(255,255,255,0.08)';

const CHAPTERS: Chapter[] = [
  { id: 'overview', num: '01', roman: 'I', label: 'Overview', beat: 'How I lead.' },
  { id: 'principles', num: '02', roman: 'II', label: 'Principles', beat: 'What I hold to.' },
  { id: 'rituals', num: '03', roman: 'III', label: 'Rituals', beat: 'The rhythm.' },
  { id: 'shape', num: '04', roman: 'IV', label: 'Team shape', beat: 'Streams and one team.' },
  { id: 'objectives', num: '05', roman: 'V', label: 'Objectives', beat: 'One owner each.' },
  { id: 'people', num: '06', roman: 'VI', label: 'People', beat: 'Hire and grow.' },
  { id: 'proof', num: '07', roman: 'VII', label: 'Proof', beat: 'Where it worked.' },
];
const TOTAL = 'VII';

function Section({ i, tone, title, lead, children }: { i: number; tone?: 'teal'; title: string; lead: string; children: ReactNode }) {
  const c = CHAPTERS[i];
  return (
    <>
      <ChapterTitle chapter={c} total={TOTAL} tone={tone} />
      <section id={c.id} className="mb-28 md:mb-36 scroll-mt-24">
        <motion.h2 {...reveal} className="text-white text-3xl md:text-5xl font-semibold tracking-[-0.03em] leading-[1.05] max-w-3xl">
          {title}
        </motion.h2>
        <motion.p {...reveal} className="text-white/55 text-base md:text-lg leading-relaxed max-w-2xl mt-4 mb-10 md:mb-12">
          {lead}
        </motion.p>
        <motion.div {...reveal}>{children}</motion.div>
      </section>
    </>
  );
}

const Panel = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`rounded-[28px] border p-5 md:p-10 ${className}`} style={{ background: PANEL, borderColor: LINE }}>
    {children}
  </div>
);

/* ── 01 ───────────────────────────────────────────── */

const SCALE: [string, string][] = [
  ['10+', 'years in product design'],
  ['12+', 'designers led'],
  ['2', 'teams: Sary and Lobah'],
];

/* ── 02 principles ─────────────────────────────────── */

const PRINCIPLES: [string, string][] = [
  ['One owner for every objective', 'Shared goals drift. A name next to each one keeps it moving.'],
  ['A rhythm people can rely on', 'Small, regular rituals beat big meetings. Everyone knows when work gets seen.'],
  ['One source of truth', 'One design system and one tool for design and engineering, so nothing is redrawn twice.'],
  ['Measure design, don’t assume it', 'Dashboards, session replays and usability scores decide what we fix next.'],
  ['Grow people on a clear bar', 'The same bar for hiring, feedback and promotion, written down.'],
];

function Principles() {
  return (
    <ol className="border-t" style={{ borderColor: LINE }}>
      {PRINCIPLES.map(([t, d], i) => (
        <li key={t} className="grid grid-cols-[44px_minmax(0,1fr)] md:grid-cols-[64px_minmax(0,1fr)_minmax(0,1.1fr)] gap-x-4 gap-y-1 py-6 border-b" style={{ borderColor: LINE }}>
          <span className="text-sm font-semibold tabular-nums pt-1" style={{ color: ACCENT }}>
            {String(i + 1).padStart(2, '0')}
          </span>
          <p className="text-white text-xl md:text-2xl font-semibold tracking-[-0.02em] leading-snug">{t}</p>
          <p className="text-white/55 leading-relaxed col-start-2 md:col-start-auto">{d}</p>
        </li>
      ))}
    </ol>
  );
}

/* ── 03 rituals ──────────────────────────────────── */

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
      { name: 'Production call', meta: 'With PMs and product leadership', input: 'What each squad is shipping', output: 'Priorities and trade-offs agreed' },
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
      { name: 'Session replays', meta: 'Watching real sessions together', input: 'Real sessions on core flows', output: 'UX issues added to the backlog' },
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
        output: 'Next quarter’s objectives, each with one owner',
      },
    ],
  },
];

function Rhythm() {
  return (
    <Panel>
      <ol className="relative">
        <span aria-hidden className="absolute left-[7px] top-2 bottom-2 w-px" style={{ background: `${ACCENT}55` }} />
        {CADENCES.map((c, i) => (
          <li key={c.k} className="relative grid md:grid-cols-[160px_minmax(0,1fr)] gap-x-6 gap-y-3 pl-8 pb-8 last:pb-0">
            <span aria-hidden className="absolute left-0 top-1 w-[15px] h-[15px] rounded-full border-2" style={{ borderColor: ACCENT, background: i === CADENCES.length - 1 ? ACCENT : PANEL }} />
            <p className="text-lg font-bold leading-none pt-0.5" style={{ color: ACCENT }}>
              Every {c.k.toLowerCase()}
            </p>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
              {c.items.map((it) => (
                <div key={it.name}>
                  <p className="text-white font-semibold">{it.name}</p>
                  <p className="text-white/50 text-sm leading-snug mt-0.5">{it.output}</p>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

/* ── 04 team shape ───────────────────────────────── */

function Shape() {
  const line = `${ACCENT}66`;
  return (
    <Panel>
      <div className="flex flex-col items-center">
        <span className="rounded-xl px-4 py-2 text-sm font-bold text-[#06201E]" style={{ background: ACCENT }}>
          Design lead
        </span>
        <span aria-hidden className="w-px h-5" style={{ background: line }} />
        <div className="w-full rounded-2xl border px-4 py-3 text-center" style={{ borderColor: `${ACCENT}55`, background: `${ACCENT}0D` }}>
          <p className="text-white font-semibold">One design team</p>
          <p className="text-white/50 text-sm mt-0.5">System · research · standard · growth</p>
        </div>
        <div aria-hidden className="relative w-full h-6">
          <span className="absolute left-1/2 top-0 w-px h-1/2" style={{ background: line }} />
          <span className="absolute left-[16.66%] right-[16.66%] top-1/2 h-px" style={{ background: line }} />
          {[16.66, 50, 83.33].map((x) => (
            <span key={x} className="absolute top-1/2 w-px h-1/2" style={{ left: `${x}%`, background: line }} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 md:gap-3 w-full">
          {['Stream A', 'Stream B', 'Stream C'].map((s) => (
            <div key={s} className="rounded-2xl border p-3 md:p-5 text-center" style={{ borderColor: LINE }}>
              <p className="text-white font-semibold text-sm md:text-base">{s}</p>
              <p className="text-white/50 text-xs md:text-sm mt-1">Designers + PM</p>
            </div>
          ))}
        </div>
      </div>
      <p className="text-white/45 text-sm mt-8 pt-5 border-t" style={{ borderColor: LINE }}>
        At Sary the streams were Demand, Supply and Logistics: retailers, suppliers and drivers.
      </p>
    </Panel>
  );
}

/* ── 05 objectives: the format ───────────────────── */

const OKR_PARTS: [string, string][] = [
  ['Objective', 'Measure design impact'],
  ['Owner', 'One named person'],
  ['Key results', '0 → 3 dashboards · 0 → 3 SUS surveys'],
  ['Check-in', 'Monthly update to the team'],
  ['Review', 'Quarterly, with product leadership'],
];

function OkrFormat() {
  return (
    <Panel className="!p-0 overflow-hidden">
      {OKR_PARTS.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[110px_minmax(0,1fr)] md:grid-cols-[200px_minmax(0,1fr)] gap-4 px-5 md:px-10 py-4 md:py-5 border-b last:border-0" style={{ borderColor: LINE }}>
          <span className="text-white/45 text-sm pt-0.5">{k}</span>
          <span className="text-white md:text-lg font-semibold">{v}</span>
        </div>
      ))}
      <p className="px-5 md:px-10 py-4 text-sm" style={{ background: `${ACCENT}12`, color: ACCENT }}>
        Result at Sary: 8 dashboards against a target of 3, and a first SUS score of 68.
      </p>
    </Panel>
  );
}

/* ── 06 people ───────────────────────────────────── */

const HIRING = ['Intro chat', 'Portfolio interview', 'Take-home, 6 days', 'Presentation', 'Decision in 2–4 weeks'];

/* ── 07 proof ────────────────────────────────────── */

const PROOF: { where: string; when: string; role: string; points: [string, string][] }[] = [
  {
    where: 'Sary',
    when: '2021 – 2023',
    role: 'Senior Product Designer → Product Design Lead',
    points: [
      ['8', 'designers across 3 streams'],
      ['+40%', 'design velocity'],
      ['25+', 'engineers on one system'],
    ],
  },
  {
    where: 'Lobah',
    when: '2025 – now',
    role: 'Lead Game Product Designer',
    points: [
      ['4+', 'game UI and UX designers'],
      ['4', 'products, PC and mobile'],
    ],
  },
];

export function LeadershipCaseStudy({ onBack, onNext }: CaseStudyComponentProps) {
  return (
    <CaseShell chapters={CHAPTERS} metaLine="Design leadership" onBack={onBack} onNext={onNext} resetKey="sary-design-leadership" pillId="lead-tab-pill">
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-24">
        {/* ── 01 OVERVIEW ── */}
        <ChapterTitle chapter={CHAPTERS[0]} total={TOTAL} />
        <section id="overview" className="mb-28 md:mb-36 scroll-mt-24">
          <CaseIntro
            meta={[
              ['Focus', 'Design leadership'],
              ['Teams', 'Sary, Lobah'],
              ['Years', '2021 – now'],
            ]}
            title="How I lead design teams."
          >
            <p>Five principles and a weekly rhythm I’ve used to run design teams, from a B2B marketplace to a games studio.</p>
          </CaseIntro>
          <motion.dl {...reveal} className="grid grid-cols-3 border-t border-b" style={{ borderColor: LINE }}>
            {SCALE.map(([v, k], i) => (
              <div key={k} className={`py-8 ${i ? 'border-l pl-5 md:pl-8' : ''}`} style={{ borderColor: LINE }}>
                <dt className="sr-only">{k}</dt>
                <dd className="text-white text-5xl md:text-7xl font-extrabold tracking-[-0.06em] leading-none tabular-nums">{v}</dd>
                <p className="text-white/50 text-sm md:text-base mt-3">{k}</p>
              </div>
            ))}
          </motion.dl>
        </section>

        <Section i={1} tone="teal" title="Five things I hold to." lead="Everything else in this page comes from these.">
          <Principles />
        </Section>

        <Section i={2} title="A rhythm from a day to a quarter." lead="Each ritual has one job. Read it top to bottom; the quarter sets what the days work on.">
          <Rhythm />
        </Section>

        <Section i={3} tone="teal" title="Designers in streams, one team behind them." lead="Designers work day to day with a stream and its PM, and come back to one team for the system, research and standard.">
          <Shape />
        </Section>

        <Section i={4} title="Every objective has one owner." lead="Objectives are short, measurable and owned by one person. This is the format, with one of mine as the example.">
          <OkrFormat />
        </Section>

        <Section i={5} tone="teal" title="Hire on one bar, grow on the same one." lead="Every finalist gets the same open brief and is scored on the same four things: storytelling, rationale, quality and prioritisation. Bi-weekly 1:1s turn the same bar into a growth plan.">
          <ol className="grid grid-cols-1 sm:grid-cols-5 border-t" style={{ borderColor: LINE }}>
            {HIRING.map((p, i) => (
              <li key={p} className="pt-5 pb-2 sm:pr-4 grid grid-cols-[32px_minmax(0,1fr)] sm:block gap-2">
                <span className="text-sm font-semibold tabular-nums" style={{ color: ACCENT }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-white font-semibold sm:block sm:mt-2">{p}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section i={6} title="Where it worked." lead="The same playbook, two very different teams.">
          <div className="grid md:grid-cols-2 gap-3 mb-12">
            {PROOF.map((t) => (
              <Panel key={t.where} className="!p-6 md:!p-8">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-white text-2xl font-bold">{t.where}</p>
                  <p className="text-white/45 text-sm tabular-nums">{t.when}</p>
                </div>
                <p className="text-sm mt-1 mb-6" style={{ color: ACCENT }}>
                  {t.role}
                </p>
                <dl className="grid gap-3">
                  {t.points.map(([v, k]) => (
                    <div key={k} className="flex items-baseline gap-4">
                      <dt className="sr-only">{k}</dt>
                      <dd className="text-white text-3xl font-extrabold tracking-[-0.04em] tabular-nums min-w-[3.2ch]">{v}</dd>
                      <span className="text-white/55">{k}</span>
                    </div>
                  ))}
                </dl>
              </Panel>
            ))}
          </div>
          <figure className="border-l-2 pl-6 max-w-3xl" style={{ borderColor: ACCENT }}>
            <blockquote className="text-white text-xl md:text-2xl leading-snug">
              “He has a great talent for organizing work, skillfully delegating tasks based on his team members’ individual
              strengths, while also fostering their professional growth, acting as a true mentor in the process.”
            </blockquote>
            <figcaption className="text-white/45 text-sm mt-4">Polina Kosheleva, Senior Game UI Artist, reported to Ahmad at Lobah</figcaption>
          </figure>
        </Section>

        <Takeaway
          accent={ACCENT}
          deep={DEEP}
          note="“He has fostered a culture of innovation within our design team, enhancing collaboration and elevating our deliverables.” — Mohammed Aldossary, Co-founder & CEO, Sary"
        >
          A team doesn’t need more pressure. It needs an owner for every objective, a rhythm people can rely on, and one source
          of truth.
        </Takeaway>
      </div>
    </CaseShell>
  );
}
