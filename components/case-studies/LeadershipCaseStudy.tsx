import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState, type ReactNode } from 'react';
import { CaseShell } from './_shared/CaseShell';
import { ChapterTitle } from './_shared/ChapterTitle';
import { CaseIntro, Takeaway } from './_shared/CaseLayout';
import { reveal } from './_shared/CaseBits';
import type { Chapter, CaseStudyComponentProps } from './_shared/types';

/* ── Design leadership · Sary ────────────────────────
   One story, one idea per chapter: the team, how it was built,
   how it ran, what it committed to, what changed, how we hired,
   and where I lead now. Each chapter is a heading, one sentence
   and one visual. Sources: the CV, Sary's design plan and quarterly
   review in Notion, and LinkedIn recommendations. Roles only. */

const ACCENT = '#2DD4BF';
const DEEP = '#0F4C4A';
const PANEL = '#0F1413';
const LINE = 'rgba(255,255,255,0.08)';

const CHAPTERS: Chapter[] = [
  { id: 'overview', num: '01', roman: 'I', label: 'Overview', beat: 'The team.' },
  { id: 'structure', num: '02', roman: 'II', label: 'Structure', beat: 'Three streams, one team.' },
  { id: 'rituals', num: '03', roman: 'III', label: 'Rituals', beat: 'How it ran.' },
  { id: 'objectives', num: '04', roman: 'IV', label: 'Objectives', beat: 'What we committed to.' },
  { id: 'results', num: '05', roman: 'V', label: 'Results', beat: 'What changed.' },
  { id: 'hiring', num: '06', roman: 'VI', label: 'Hiring', beat: 'Same brief, same bar.' },
  { id: 'now', num: '07', roman: 'VII', label: 'Now', beat: 'Lobah.' },
];
const TOTAL = 'VII';

/* every chapter has the same shape: heading, one sentence, one visual */
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

/* ── 01 the team in four numbers ─────────────────── */

const SCALE: [string, string][] = [
  ['8', 'designers'],
  ['3', 'streams'],
  ['5', 'products'],
  ['5', 'countries'],
];

/* ── 02 structure ─────────────────────────────────── */

type Stream = { name: string; users: string; products: string; did: string[] };
const STREAMS: Stream[] = [
  {
    name: 'Demand',
    users: 'Retailers',
    products: 'Flagship app, POS',
    did: ['Ordering flow revamped, basket to tracking', 'SKU, Cart, Reorder and Category pages readied for launch', 'Baqala persona: 133 interviews in 3 cities'],
  },
  {
    name: 'Supply',
    users: 'Suppliers',
    products: 'Ark',
    did: ['New supplier onboarding gate', 'Purchase orders in Ark', 'Vendor persona from field visits'],
  },
  {
    name: 'Logistics',
    users: 'Drivers',
    products: 'Launchpad, Lighthouse',
    did: ['Launchpad 1.5, the driver app revamp', 'Usability tests with drivers on their route', 'Lighthouse fleet tables and navigation'],
  },
];

function Structure() {
  const [sel, setSel] = useState(0);
  const reduced = useReducedMotion();
  const s = STREAMS[sel];
  return (
    <div className="rounded-[28px] border p-5 md:p-10" style={{ background: PANEL, borderColor: LINE }}>
      {/* lead → one team → three streams */}
      <div className="flex flex-col items-center">
        <span className="rounded-xl px-4 py-2 text-sm font-bold text-[#06201E]" style={{ background: ACCENT }}>
          Product Design Lead
        </span>
        <span aria-hidden className="w-px h-5" style={{ background: `${ACCENT}66` }} />
        <span className="rounded-xl px-4 py-2 text-sm font-semibold text-white border" style={{ borderColor: `${ACCENT}55` }}>
          One design team
        </span>
        <div aria-hidden className="relative w-full h-6 hidden md:block">
          <span className="absolute left-1/2 top-0 w-px h-1/2" style={{ background: `${ACCENT}66` }} />
          <span className="absolute left-[16.66%] right-[16.66%] top-1/2 h-px" style={{ background: `${ACCENT}66` }} />
          {[16.66, 50, 83.33].map((x) => (
            <span key={x} className="absolute top-1/2 w-px h-1/2" style={{ left: `${x}%`, background: `${ACCENT}66` }} />
          ))}
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-2.5 mt-4 md:mt-0" role="tablist" aria-label="Streams">
        {STREAMS.map((x, i) => {
          const on = i === sel;
          return (
            <button
              key={x.name}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setSel(i)}
              className="text-left rounded-2xl p-5 border transition-colors"
              style={{ borderColor: on ? ACCENT : LINE, background: on ? `${ACCENT}12` : 'transparent' }}
            >
              <span className="block text-white text-xl font-bold">{x.name}</span>
              <span className="block text-white/55 text-sm mt-1">
                {x.users} · {x.products}
              </span>
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={s.name}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid md:grid-cols-3 gap-x-8 gap-y-3 mt-8 pt-6 border-t"
          style={{ borderColor: LINE }}
        >
          {s.did.map((d) => (
            <li key={d} className="text-white/80 leading-snug pl-4 border-l-2" style={{ borderColor: ACCENT }}>
              {d}
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </div>
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
        output: 'Next quarter’s objectives, each with one owner',
      },
    ],
  },
];

function Rhythm() {
  return (
    <div className="rounded-[28px] border p-5 md:p-10" style={{ background: PANEL, borderColor: LINE }}>
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
    </div>
  );
}

/* ── 04 objectives: three of the six, as a plain table ── */

const OBJECTIVES: { o: string; target: string; moved: string; mine?: boolean }[] = [
  { o: 'Measure design impact', target: '3 dashboards, 3 SUS surveys', moved: '8 dashboards. First SUS score: 68', mine: true },
  { o: 'Fix the core flows', target: '3 flows, success above 70%', moved: 'Ordering flow revamped. Conversion +6%' },
  { o: 'One tool for design and engineering', target: '5 tools to 1, 8 to 20 developers', moved: 'Everyone on Figma' },
];

function Objectives() {
  return (
    <div className="rounded-[28px] border overflow-hidden" style={{ background: PANEL, borderColor: LINE }}>
      <div className="hidden md:grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1.1fr)] gap-6 px-8 py-4 text-white/40 text-sm border-b" style={{ borderColor: LINE }}>
        <span>Objective</span>
        <span>Target</span>
        <span>What moved</span>
      </div>
      {OBJECTIVES.map((k) => (
        <div key={k.o} className="grid md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1.1fr)] gap-x-6 gap-y-1 px-5 md:px-8 py-5 md:py-6 border-b last:border-0" style={{ borderColor: LINE }}>
          <p className="text-white text-lg font-semibold">
            {k.o}
            {k.mine && (
              <span className="ml-2 align-middle text-[11px] font-semibold rounded-full px-2 py-0.5 text-[#06201E]" style={{ background: ACCENT }}>
                Mine
              </span>
            )}
          </p>
          <p className="text-white/55">{k.target}</p>
          <p className="font-semibold" style={{ color: ACCENT }}>
            {k.moved}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ── 05 results: each number once ───────────────── */

const RESULTS: [string, string][] = [
  ['+40%', 'Design velocity: brief to dev-ready'],
  ['30%', 'Faster design-to-dev handoff'],
  ['25+', 'Engineers building from the system'],
  ['5 → 1', 'Design tools, everyone on Figma'],
];

/* ── 06 hiring ───────────────────────────────────── */

const PROCESS = ['Intro chat', 'Portfolio interview', 'Take-home, 6 days', 'Presentation', 'Decision in 2–4 weeks'];

export function LeadershipCaseStudy({ onBack, onNext }: CaseStudyComponentProps) {
  return (
    <CaseShell chapters={CHAPTERS} metaLine="Design leadership" onBack={onBack} onNext={onNext} resetKey="sary-design-leadership" pillId="lead-tab-pill">
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-24">
        {/* ── 01 OVERVIEW ── */}
        <ChapterTitle chapter={CHAPTERS[0]} total={TOTAL} />
        <section id="overview" className="mb-28 md:mb-36 scroll-mt-24">
          <CaseIntro
            meta={[
              ['Company', 'Sary'],
              ['Role', 'Senior Product Designer → Product Design Lead'],
              ['Years', '2021 – 2023'],
            ]}
            title="One design team across three streams."
          >
            <p>At Sary, a B2B grocery marketplace, I grew from Senior Product Designer to Product Design Lead and ran one design team for retailers, suppliers and drivers.</p>
          </CaseIntro>
          <motion.dl {...reveal} className="grid grid-cols-2 md:grid-cols-4 border-t border-b" style={{ borderColor: LINE }}>
            {SCALE.map(([v, k], i) => (
              <div key={k} className={`py-8 ${i ? 'md:border-l md:pl-8' : ''} ${i % 2 ? 'border-l pl-6 md:pl-8' : ''}`} style={{ borderColor: LINE }}>
                <dt className="sr-only">{k}</dt>
                <dd className="text-white text-6xl md:text-7xl font-extrabold tracking-[-0.06em] leading-none tabular-nums">{v}</dd>
                <p className="text-white/50 mt-3">{k}</p>
              </div>
            ))}
          </motion.dl>
        </section>

        <Section i={1} tone="teal" title="Three streams, one team." lead="Designers worked day to day inside a stream with its PM, and came back to one team for the system, the research and the standard. Pick a stream.">
          <Structure />
        </Section>

        <Section i={2} title="A rhythm from a day to a quarter." lead="Each ritual has one job. Read it top to bottom.">
          <Rhythm />
        </Section>

        <Section i={3} tone="teal" title="Objectives with one owner each." lead="Our first quarter with fixed objectives had six. These three show the shape of it.">
          <Objectives />
        </Section>

        <Section i={4} title="What changed." lead="Phase 1 of the design system shipped that quarter, and engineers across all three streams built from it.">
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {RESULTS.map(([v, k]) => (
              <div key={k}>
                <dt className="sr-only">{k}</dt>
                <dd className="text-5xl md:text-6xl font-extrabold tracking-[-0.05em] leading-none tabular-nums" style={{ color: ACCENT }}>
                  {v}
                </dd>
                <p className="text-white/60 mt-3 leading-snug">{k}</p>
              </div>
            ))}
          </dl>
        </Section>

        <Section i={5} tone="teal" title="The same brief and the same bar." lead="I built Sary’s design hiring process from scratch and used it to hire senior and principal designers across five countries.">
          <ol className="grid grid-cols-1 sm:grid-cols-5 border-t" style={{ borderColor: LINE }}>
            {PROCESS.map((p, i) => (
              <li key={p} className="pt-5 pb-2 sm:pr-4 grid grid-cols-[32px_minmax(0,1fr)] sm:block gap-2">
                <span className="text-sm font-semibold tabular-nums" style={{ color: ACCENT }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-white font-semibold sm:block sm:mt-2">{p}</span>
              </li>
            ))}
          </ol>
          <p className="text-white/55 leading-relaxed mt-8 max-w-3xl">
            Every finalist got the same open brief, a venue-booking app with a sports community, and was scored on the same
            four things: storytelling, rationale, quality and prioritisation.
          </p>
        </Section>

        <Section i={6} title="Now: a game design team at Lobah." lead="Since 2025 I lead 4+ game UI and UX designers across Samla, IceBreaker, Jackaroo and Lobahplay, on PC and mobile.">
          <figure className="border-l-2 pl-6 max-w-3xl" style={{ borderColor: ACCENT }}>
            <blockquote className="text-white text-xl md:text-2xl leading-snug">
              “He has a great talent for organizing work, skillfully delegating tasks based on his team members’ individual
              strengths, while also fostering their professional growth, acting as a true mentor in the process.”
            </blockquote>
            <figcaption className="text-white/45 text-sm mt-4">Polina Kosheleva, Senior Game UI Artist, reported to Ahmad</figcaption>
          </figure>
        </Section>

        <Takeaway
          accent={ACCENT}
          deep={DEEP}
          note="“He has fostered a culture of innovation within our design team, enhancing collaboration and elevating our deliverables.” — Mohammed Aldossary, Co-founder & CEO, Sary"
        >
          A young team didn’t need more pressure. It needed an owner for every objective, a rhythm people could rely on, and one
          source of truth.
        </Takeaway>
      </div>
    </CaseShell>
  );
}
