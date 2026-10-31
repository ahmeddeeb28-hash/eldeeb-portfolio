import { motion } from 'motion/react';
import { useState } from 'react';
import { CaseShell } from './_shared/CaseShell';
import { ChapterTitle } from './_shared/ChapterTitle';
import { CaseIntro, LeadStats, Takeaway } from './_shared/CaseLayout';
import { reveal } from './_shared/CaseBits';
import { ScrollSteps, type Step } from './_shared/ScrollSteps';
import type { Chapter, CaseStudyComponentProps } from './_shared/types';

/* ── Sary · Design leadership ────────────────────────
   How I led design at Sary as Product Design Lead (Jan – Sep 2023):
   the team, the hard first quarter, the rituals, the OKRs, the system
   and the hiring. Every fact comes from the CV and the Sary design
   plan and DesignOps OKR board in Notion. Headcounts per squad and
   before/after cycle times are left out until they are confirmed. */

const ACCENT = '#2DD4BF';
const DEEP = '#0F4C4A';

const CHAPTERS: Chapter[] = [
  { id: 'overview', num: '01', roman: 'I', label: 'Overview', beat: 'Eight designers, three squads.' },
  { id: 'team', num: '02', roman: 'II', label: 'The team', beat: 'Who did what, where.' },
  { id: 'quarter', num: '03', roman: 'III', label: 'Hard quarter', beat: 'Stretched thin, then steady.' },
  { id: 'rituals', num: '04', roman: 'IV', label: 'Rituals', beat: 'A rhythm people could rely on.' },
  { id: 'okrs', num: '05', roman: 'V', label: 'OKRs', beat: 'Objectives with owners.' },
  { id: 'system', num: '06', roman: 'VI', label: 'System & speed', beat: 'One source of truth.' },
  { id: 'hiring', num: '07', roman: 'VII', label: 'Hiring', beat: 'Same brief, same bar.' },
];

/* ── 02 the team ─────────────────────────────────── */

const SQUADS: { name: string; areas: string[] }[] = [
  { name: 'Demand', areas: ['Storefront', 'Catalogue', 'Checkout & Payment'] },
  { name: 'Supply', areas: ['Vendor', 'Growth'] },
  { name: 'Logistics', areas: ['Driver app and delivery'] },
];
const COUNTRIES = ['Egypt', 'Saudi Arabia', 'Palestine', 'India', 'Pakistan'];

function OrgMap() {
  const [hot, setHot] = useState<number | null>(null);
  return (
    <div className="rounded-[28px] border border-white/[0.08] bg-[#0F1413] p-5 md:p-10">
      {/* leadership line */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        <Node label="Head of Product" sub="Weekly production call" />
        <span aria-hidden className="text-white/30">↔</span>
        <Node label="Product Design Lead" sub="Me" accent />
      </div>
      {/* the designers */}
      <div className="text-center mb-8">
        <div className="inline-flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-3" aria-hidden>
          {Array.from({ length: 8 }, (_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.06, type: 'spring', stiffness: 400, damping: 22 }}
              className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-full grid place-items-center text-[9px] sm:text-[11px] font-semibold text-[#06201E]"
              style={{ background: ACCENT }}
            >
              PD
            </motion.span>
          ))}
        </div>
        <p className="text-white text-base md:text-lg font-semibold">8 product designers, junior to mid to product designer</p>
        <p className="text-white/55 text-sm mt-1">with associate UX researchers · across {COUNTRIES.join(', ')}</p>
      </div>
      {/* the squads */}
      <div className="grid md:grid-cols-3 gap-3">
        {SQUADS.map((s, i) => {
          const on = hot === i;
          return (
            <button
              key={s.name}
              type="button"
              onMouseEnter={() => setHot(i)}
              onMouseLeave={() => setHot(null)}
              onFocus={() => setHot(i)}
              onBlur={() => setHot(null)}
              className="h-full flex flex-col items-start justify-start text-left rounded-2xl p-5 border transition-colors duration-300"
              style={{ borderColor: on ? ACCENT : 'rgba(255,255,255,0.08)', background: on ? `${ACCENT}14` : 'rgba(255,255,255,0.02)' }}
            >
              <p className="text-white text-lg font-bold">{s.name} squad</p>
              <p className="text-white/50 text-xs mt-0.5 mb-4">Designers paired day to day with the squad PM</p>
              <ul className="flex flex-wrap gap-1.5">
                {s.areas.map((a) => (
                  <li key={a} className="text-xs font-medium rounded-full px-2.5 py-1" style={{ color: on ? '#06201E' : '#CFF5EF', background: on ? ACCENT : `${ACCENT}1F` }}>
                    {a}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
      <p className="text-white/40 text-xs mt-5 text-center">Roles only. Six product areas grouped into the three streams Sary worked in.</p>
    </div>
  );
}

function Node({ label, sub, accent }: { label: string; sub: string; accent?: boolean }) {
  return (
    <span className="rounded-2xl px-4 py-2.5 text-center" style={{ background: accent ? ACCENT : 'rgba(255,255,255,0.06)', color: accent ? '#06201E' : '#fff' }}>
      <span className="block text-sm font-bold">{label}</span>
      <span className="block text-[11px]" style={{ opacity: 0.7 }}>
        {sub}
      </span>
    </span>
  );
}

/* ── 03 the hard quarter, told one beat at a time ───── */

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="h-full w-full grid place-items-center p-5 md:p-8 bg-[#0F1413]">{children}</div>;
}
const Chip = ({ children, on }: { children: React.ReactNode; on?: boolean }) => (
  <span className="text-xs md:text-sm font-semibold rounded-full px-3 py-1.5" style={{ color: on ? '#06201E' : '#CFF5EF', background: on ? ACCENT : `${ACCENT}1F` }}>
    {children}
  </span>
);

const QUARTER: Step[] = [
  {
    t: 'A young team, asked to cover three streams at once',
    d: 'When we first set fixed quarterly objectives, the team was young and full of new joiners, and we were asked to expand from the Demand stream into Supply and Logistics at the same time.',
    visual: (
      <Panel>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Chip on>Demand</Chip>
          <span className="text-white/40">+</span>
          <Chip>Supply</Chip>
          <span className="text-white/40">+</span>
          <Chip>Logistics</Chip>
        </div>
      </Panel>
    ),
  },
  {
    t: 'Stretched thin',
    d: 'Task allocation caused delays and friction, outputs were inconsistent, and the workload was hurting morale.',
    visual: (
      <Panel>
        <div className="grid gap-2 w-full max-w-xs">
          {['Delays and friction in task allocation', 'Inconsistent outputs', 'Workload hurting morale'].map((x) => (
            <span key={x} className="rounded-xl px-4 py-3 text-sm font-semibold text-[#FFD9D4] bg-[#FF6B5B1F] border border-[#FF6B5B33]">
              {x}
            </span>
          ))}
        </div>
      </Panel>
    ),
  },
  {
    t: 'Owners, a rhythm and one source of truth',
    d: 'I set quarterly OKRs with a named owner for each, introduced daily stand-ups and structured rituals (design reviews, crits, 1:1s, retros) plus designer KPIs, and moved all design and engineering work onto Figma, cutting five tools to one.',
    out: ['OKR owners', 'Rituals', 'Designer KPIs', '5 tools → 1'],
    visual: (
      <Panel>
        <ul className="grid gap-2 w-full max-w-xs">
          {['Quarterly OKRs, one owner each', 'Daily stand-up and weekly review', 'Crits, 1:1s and retros', 'Designer KPIs', 'Everything on Figma: 5 tools → 1'].map((x, i) => (
            <motion.li key={x} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }} className="flex items-center gap-2.5 text-sm text-white">
              <span className="grid place-items-center w-5 h-5 rounded-full text-[11px] font-bold text-[#06201E]" style={{ background: ACCENT }}>
                ✓
              </span>
              {x}
            </motion.li>
          ))}
        </ul>
      </Panel>
    ),
  },
  {
    t: 'By the end of the quarter',
    d: 'We shipped Phase 1 of the design system, built 8 analytics dashboards against a target of 3, and ran Sary’s first usability (SUS) survey, which scored 68.',
    visual: (
      <Panel>
        <div className="grid grid-cols-3 gap-2 w-full max-w-md text-center">
          {[
            ['Phase 1', 'Design system shipped'],
            ['8 / 3', 'Dashboards built / target'],
            ['68', 'First SUS score'],
          ].map(([v, k]) => (
            <div key={k} className="rounded-2xl p-3 md:p-4 bg-white/[0.04] border border-white/[0.08]">
              <p className="text-white text-xl md:text-3xl font-extrabold tracking-tight">{v}</p>
              <p className="text-white/55 text-[11px] md:text-xs mt-1 leading-snug">{k}</p>
            </div>
          ))}
        </div>
      </Panel>
    ),
  },
];

/* ── 04 rituals ──────────────────────────────────── */

const RITUALS: { cadence: string; items: [string, string][] }[] = [
  { cadence: 'Daily', items: [['Stand-up, 15 min', 'Task updates, blockers, Figma progress, team alignment'], ['Designer ↔ PM', 'Each designer stays aligned with their squad PM']] },
  { cadence: 'Weekly', items: [['Design review and team sync', 'Review work in progress as a team'], ['Production call', 'With PMs, managers and the Head of Product']] },
  { cadence: 'Bi-weekly', items: [['1:1s', 'Growth, feedback, frustrations']] },
  { cadence: 'Monthly', items: [['Retro', 'Adjusted to project scale and type']] },
  { cadence: 'Ongoing', items: [['Design crits', 'Open critique across squads']] },
];

/* ── 05 OKRs ─────────────────────────────────────── */

const OKRS: { o: string; mine?: boolean; krs: [string, string][]; moved: string }[] = [
  {
    o: 'Enhance core flows',
    krs: [
      ['Flows fixed', '0 → 3'],
      ['Direct success rate', 'above 70%'],
      ['Flow abandonment', '30% or less'],
    ],
    moved: 'The ordering flow revamped from basket to tracking; order conversion up 6%.',
  },
  {
    o: 'Define metrics to measure design impact',
    mine: true,
    krs: [
      ['SUS surveys', '0 → 3'],
      ['Fullstory dashboards', '0 → 3'],
      ['Segments', '0 → 2'],
    ],
    moved: '8 dashboards built against a target of 3; Sary’s first SUS survey scored 68.',
  },
  {
    o: 'Consolidate tools and widen engineering access',
    krs: [
      ['Design tools', '5 → 1 (Figma)'],
      ['Developers with Figma access', '8 → 20'],
    ],
    moved: 'All design and dev teams moved to Figma: one source of truth, and the base for the design system.',
  },
];

/* ── 07 hiring ───────────────────────────────────── */

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
    <CaseShell chapters={CHAPTERS} metaLine="Sary · Design leadership" onBack={onBack} onNext={onNext} resetKey="sary-design-leadership" pillId="lead-tab-pill">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        {/* ── 01 OVERVIEW ── */}
        <ChapterTitle chapter={CHAPTERS[0]} total="VII" />
        <section id="overview" className="mb-32 scroll-mt-24">
          <CaseIntro
            meta={[
              ['Company', 'Sary'],
              ['Role', 'Product Design Lead'],
              ['Year', 'Jan – Sep 2023'],
            ]}
            title="Eight designers, three squads, one bar."
          >
            <p>
              Sary is a B2B marketplace connecting businesses with suppliers across Saudi Arabia. I joined as Senior Product
              Designer in 2021 and led the design team from January 2023.
            </p>
            <p>
              I managed 8 designers across the Demand, Supply and Logistics squads, spread over five countries. This is how
              I set the team up to ship: owners for every objective, a weekly rhythm, one source of truth, and a hiring bar
              we applied the same way every time.
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
        </section>

        {/* ── 02 THE TEAM ── */}
        <ChapterTitle chapter={CHAPTERS[1]} total="VII" tone="teal" />
        <section id="team" className="mb-32 scroll-mt-24">
          <motion.h2 {...reveal} className="text-white text-3xl md:text-5xl font-semibold tracking-[-0.03em] mb-4 max-w-3xl">
            Six product areas, three streams, one team.
          </motion.h2>
          <motion.p {...reveal} className="text-white/55 text-base md:text-lg leading-relaxed max-w-2xl mb-10">
            I reported into product leadership and ran the design team across the three streams Sary worked in. Point at a
            squad to see what it covered.
          </motion.p>
          <motion.div {...reveal}>
            <OrgMap />
          </motion.div>
        </section>

        {/* ── 03 THE HARD QUARTER ── */}
        <ChapterTitle chapter={CHAPTERS[2]} total="VII" />
        <section id="quarter" className="mb-32 scroll-mt-24">
          <motion.h2 {...reveal} className="text-white text-3xl md:text-5xl font-semibold tracking-[-0.03em] mb-4 max-w-3xl">
            The first quarter with fixed objectives.
          </motion.h2>
          <motion.p {...reveal} className="text-white/55 text-base md:text-lg leading-relaxed max-w-2xl mb-12">
            Scroll through what happened, what I changed and where we ended the quarter.
          </motion.p>
          <ScrollSteps steps={QUARTER} accent={ACCENT} label="The hard quarter" />
        </section>

        {/* ── 04 RITUALS ── */}
        <ChapterTitle chapter={CHAPTERS[3]} total="VII" tone="teal" />
        <section id="rituals" className="mb-32 scroll-mt-24">
          <motion.h2 {...reveal} className="text-white text-3xl md:text-5xl font-semibold tracking-[-0.03em] mb-10 max-w-3xl">
            A rhythm people could rely on.
          </motion.h2>
          <div className="grid gap-3">
            {RITUALS.map((r, i) => (
              <motion.div
                key={r.cadence}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.05 }}
                className="grid md:grid-cols-[160px_minmax(0,1fr)] gap-3 md:gap-6 items-start rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5"
              >
                <p className="text-lg font-bold" style={{ color: ACCENT }}>
                  {r.cadence}
                </p>
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                  {r.items.map(([t, d]) => (
                    <div key={t}>
                      <p className="text-white font-semibold">{t}</p>
                      <p className="text-white/55 text-sm leading-relaxed">{d}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 05 OKRS ── */}
        <ChapterTitle chapter={CHAPTERS[4]} total="VII" />
        <section id="okrs" className="mb-32 scroll-mt-24">
          <motion.h2 {...reveal} className="text-white text-3xl md:text-5xl font-semibold tracking-[-0.03em] mb-4 max-w-3xl">
            Objectives with owners, set each quarter.
          </motion.h2>
          <motion.p {...reveal} className="text-white/55 text-base md:text-lg leading-relaxed max-w-2xl mb-10">
            The three design OKRs from Sary’s design plan, and what each one moved.
          </motion.p>
          <div className="grid lg:grid-cols-3 gap-3">
            {OKRS.map((k, i) => (
              <motion.article
                key={k.o}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.08 }}
                className="rounded-[24px] border border-white/[0.08] bg-[#0F1413] p-6 md:p-7 flex flex-col"
              >
                <div className="flex items-start justify-between gap-3 mb-5">
                  <p className="text-white text-xl font-bold tracking-tight leading-snug">{k.o}</p>
                  {k.mine && (
                    <span className="flex-none text-[11px] font-semibold rounded-full px-2.5 py-1 text-[#06201E]" style={{ background: ACCENT }}>
                      I owned this
                    </span>
                  )}
                </div>
                <dl className="grid gap-2.5 mb-6">
                  {k.krs.map(([a, b]) => (
                    <div key={a} className="flex items-baseline justify-between gap-4 border-b border-white/[0.06] pb-2">
                      <dt className="text-white/60 text-sm">{a}</dt>
                      <dd className="text-white font-semibold tabular-nums text-right">{b}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-auto rounded-xl p-4" style={{ background: `${ACCENT}14` }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: ACCENT }}>
                    What moved
                  </p>
                  <p className="text-white/85 text-sm leading-relaxed">{k.moved}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* ── 06 SYSTEM & SPEED ── */}
        <ChapterTitle chapter={CHAPTERS[5]} total="VII" tone="teal" />
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

        {/* ── 07 HIRING ── */}
        <ChapterTitle chapter={CHAPTERS[6]} total="VII" />
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
      </div>
    </CaseShell>
  );
}
