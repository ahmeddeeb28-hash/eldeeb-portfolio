import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CaseShell } from './_shared/CaseShell';
import { ChapterTitle } from './_shared/ChapterTitle';
import { CaseIntro, Takeaway, Learnings } from './_shared/CaseLayout';
import { reveal } from './_shared/CaseBits';
import type { Chapter, CaseStudyComponentProps } from './_shared/types';

/* ── How I lead design teams ─────────────────────────
   A leadership playbook, not a company story: the principles,
   the rituals, the team shape, how objectives are set, and how
   people are hired and grown. Sary and Lobah appear only as the
   places it was proven. Each chapter is a heading, one sentence
   and one visual. Sources: the CV, Sary's design plan and review
   in Notion, and LinkedIn recommendations. */

const ACCENT = '#D4F03A'; // the lime from the illustrations
const DEEP = '#0343F8'; // their royal blue
const PANEL = '#0F1413';
const LINE = 'rgba(255,255,255,0.08)';

const CHAPTERS: Chapter[] = [
  { id: 'overview', num: '01', roman: 'I', label: 'Overview', beat: 'How I lead.' },
  { id: 'principles', num: '02', roman: 'II', label: 'My style', beat: 'What I hold to.' },
  { id: 'rituals', num: '03', roman: 'III', label: 'Rituals', beat: 'The rhythm.' },
  { id: 'practice', num: '04', roman: 'IV', label: 'In practice', beat: 'Three moments.' },
  { id: 'shape', num: '05', roman: 'V', label: 'Team shape', beat: 'Streams and one team.' },
  { id: 'objectives', num: '06', roman: 'VI', label: 'Objectives', beat: 'One owner each.' },
  { id: 'people', num: '07', roman: 'VII', label: 'People', beat: 'Hire and grow.' },
  { id: 'proof', num: '08', roman: 'VIII', label: 'Proof', beat: 'Where it worked.' },
];
const TOTAL = 'VIII';

/* the illustrations open the page as one carousel; the chapters after
   it tell the same ideas in words */
const IMG = '/images/case-studies/leadership';
const SLIDES: { src: string; title: string; line: string; alt: string }[] = [
  { src: `${IMG}/cover.webp`, title: 'Design leadership', line: 'Building the team behind the product.', alt: 'Design leadership. Building the team behind the product. People, products, practice.' },
  { src: `${IMG}/rhythm.webp`, title: 'A rhythm for better decisions', line: 'Shared priorities, open critique, learning carried forward.', alt: 'A rhythm for better decisions. Shared priorities. Open critique. Learning carried forward. Align, review, learn.' },
  { src: `${IMG}/priority.webp`, title: 'Making a priority actionable', line: 'Frame, choose, own.', alt: 'Making a priority actionable. Frame: bring the problem and goals into view. Choose: discuss the trade-off and agree the focus. Own: give the work an owner and a next step. Clarity, commitment, action.' },
  { src: `${IMG}/critique.webp`, title: 'Turning critique into a decision', line: 'Show the reasoning, challenge the work, record the decision.', alt: 'Turning critique into a decision. Show the reasoning, challenge the work, record the decision. The outcome is a design decision the team can act on.' },
  { src: `${IMG}/coaching.webp`, title: 'Coaching through the work', line: 'Listen, practise, reflect.', alt: 'Coaching through the work. Listen: find the challenge behind the design. Practise: create an opportunity to apply the focus. Reflect: discuss the reasoning and the next step.' },
];

/* centred slides with the neighbours peeking in; arrows, dots, swipe
   and arrow keys; moves on by itself every 6 seconds until someone
   touches it, never under reduced motion */
function Carousel() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(!reduced);
  const [w, setW] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const start = useRef<number | null>(null);
  const dragged = useRef(false);
  const n = SLIDES.length;
  const go = (k: number) => setI(((k % n) + n) % n);
  const stop = () => setAuto(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    if (!auto || reduced) return;
    const t = window.setTimeout(() => setI((x) => (x + 1) % n), 6000);
    return () => window.clearTimeout(t);
  }, [auto, reduced, i, n]);

  const slideW = Math.min(w * (w < 640 ? 0.86 : 0.72), 1040);
  const gap = w < 640 ? 12 : 24;
  const x = w / 2 - slideW / 2 - i * (slideW + gap);
  const s = SLIDES[i];

  return (
    <div
      className="[--c-w:calc(100vw-0px)] md:[--c-w:min(1440px,calc(100vw-64px))]"
      style={{ width: 'var(--c-w)', marginLeft: 'calc(50% - var(--c-w) / 2)' }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') { stop(); go(i + 1); }
        if (e.key === 'ArrowLeft') { stop(); go(i - 1); }
      }}
    >
      <div
        ref={box}
        role="region"
        aria-roledescription="carousel"
        aria-label="Leadership illustrations"
        tabIndex={0}
        className="relative overflow-hidden outline-none select-none touch-pan-y"
        onPointerDown={(e) => (start.current = e.clientX)}
        onPointerUp={(e) => {
          if (start.current === null) return;
          const d = e.clientX - start.current;
          start.current = null;
          dragged.current = Math.abs(d) > 40;
          if (dragged.current) { stop(); go(i + (d < 0 ? 1 : -1)); }
        }}
      >
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ gap, transform: `translateX(${x}px)` }}
        >
          {SLIDES.map((sl, k) => {
            const on = k === i;
            return (
              <button
                key={sl.src}
                type="button"
                onClick={() => {
                  // the click that ends a swipe is not a pick
                  if (dragged.current) { dragged.current = false; return; }
                  stop();
                  go(k);
                }}
                aria-label={on ? sl.title : `Show ${sl.title}`}
                aria-current={on}
                className="flex-none transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ width: slideW || undefined, transform: `scale(${on ? 1 : 0.9})`, opacity: on ? 1 : 0.4 }}
              >
                <img src={sl.src} alt={on ? sl.alt : ''} draggable={false} loading={k < 2 ? 'eager' : 'lazy'} decoding="async" className="w-full h-auto rounded-[18px] md:rounded-[28px] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]" />
              </button>
            );
          })}
        </div>
      </div>
      {/* caption and controls, lined up under the slide in front */}
      <div className="mx-auto mt-6 md:mt-8 px-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-4" style={{ maxWidth: slideW ? slideW + 48 : undefined }}>
        <div className="min-w-0" aria-live="polite">
          <p className="text-white text-lg md:text-2xl font-semibold tracking-[-0.02em]">
            <span className="tabular-nums mr-3" style={{ color: ACCENT }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            {s.title}
          </p>
          <p className="text-white/55 mt-1">{s.line}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5" aria-hidden>
            {SLIDES.map((sl, k) => (
              <span key={sl.src} className="h-1.5 rounded-full transition-all duration-300" style={{ width: k === i ? 22 : 6, background: k === i ? ACCENT : 'rgba(255,255,255,0.25)' }} />
            ))}
          </div>
          <button type="button" onClick={() => { stop(); go(i - 1); }} aria-label="Previous illustration" className="grid place-items-center w-11 h-11 rounded-full border border-white/15 text-white/80 hover:text-white hover:border-white/40 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => { stop(); go(i + 1); }} aria-label="Next illustration" className="grid place-items-center w-11 h-11 rounded-full border border-white/15 text-white/80 hover:text-white hover:border-white/40 transition-colors">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* the three practices, told in words: the steps in order, then what
   actually happens in the room */
const PRACTICES: { title: string; steps: string[]; story: string; principle: string }[] = [
  {
    title: 'Making a priority actionable',
    steps: ['Frame', 'Choose', 'Own'],
    story: 'When a priority lands, I first put the problem and the goals on the table so everyone is looking at the same thing. Then we talk through the trade-off and agree one focus. It isn’t done until the work has an owner and a next step.',
    principle: 'One owner for every objective',
  },
  {
    title: 'Turning critique into a decision',
    steps: ['Show the reasoning', 'Challenge the work', 'Record the decision'],
    story: 'In a crit the designer explains the choice and the open question, not just the screens. We challenge the work against the concern, never personal taste. Then we write the decision down so it carries into the next step.',
    principle: 'A rhythm people can rely on',
  },
  {
    title: 'Coaching through the work',
    steps: ['Listen', 'Practise', 'Reflect'],
    story: 'Coaching happens inside real projects. I listen for the challenge behind the design, set up a chance to practise that skill on the next piece of work, then we reflect on the reasoning together. Growth carries into the next project.',
    principle: 'Grow people on a clear bar',
  },
];

function Practices() {
  return (
    <ol className="grid gap-4">
      {PRACTICES.map((pr, k) => (
        <li key={pr.title} className="rounded-[24px] border p-6 md:p-10 grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-6 md:gap-12" style={{ background: PANEL, borderColor: LINE }}>
          <div>
            <p className="text-sm font-semibold tabular-nums mb-3" style={{ color: ACCENT }}>
              {String(k + 1).padStart(2, '0')}
            </p>
            <h3 className="text-white text-2xl md:text-3xl font-semibold tracking-[-0.02em] leading-tight">{pr.title}</h3>
            <ol className="flex flex-wrap items-center gap-2 mt-5">
              {pr.steps.map((st, j) => (
                <li key={st} className="flex items-center gap-2">
                  <span className="rounded-full px-3 py-1.5 text-sm font-semibold" style={{ background: j === pr.steps.length - 1 ? ACCENT : 'rgba(255,255,255,0.06)', color: j === pr.steps.length - 1 ? '#101216' : '#FFFFFF' }}>
                    {st}
                  </span>
                  {j < pr.steps.length - 1 && <ArrowRight aria-hidden className="w-3.5 h-3.5 text-white/35" />}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className="text-white/75 text-lg leading-relaxed">{pr.story}</p>
            <p className="text-white/40 text-sm mt-4">Principle: {pr.principle}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

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

/* Polina's avatar pops out of the testimonial card as it scrolls into
   view: it grows from behind the card's edge, overshoots a little and
   settles with a slight tilt. Linked to the case study's own scroller. */
function PopAvatar({ target }: { target: RefObject<HTMLElement | null> }) {
  const reduced = useReducedMotion();
  const raw = useMotionValue(0);
  // after commit both refs exist: follow the case study's own scroller
  useEffect(() => {
    const el = target.current;
    if (!el) return;
    const scroller: HTMLElement | Window = (el.closest('.overflow-y-auto') as HTMLElement | null) ?? window;
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the card's top enters the bottom of the screen, 1 when it reaches the middle
      raw.set(Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.5))));
    };
    update();
    scroller.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      scroller.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [target, raw]);
  const p = useSpring(raw, { stiffness: 140, damping: 16, mass: 0.6 });
  // the chat head pops first, then its message bubble, like a Messenger head
  const scale = useTransform(p, [0.15, 0.6, 0.75], [0.2, 1.15, 1]);
  const y = useTransform(p, [0.15, 0.75], [60, 0]);
  const opacity = useTransform(p, [0.1, 0.3], [0, 1]);
  const bScale = useTransform(p, [0.6, 0.85, 1], [0.6, 1.04, 1]);
  const bOpacity = useTransform(p, [0.6, 0.8], [0, 1]);
  const bX = useTransform(p, [0.6, 1], [16, 0]);
  return (
    <div aria-hidden className="absolute z-10 -top-7 right-5 md:-top-9 md:right-12 flex items-end gap-2.5">
      <motion.div
        className="origin-bottom-right max-w-[230px] md:max-w-[280px] rounded-[20px] rounded-br-[6px] bg-white px-4 py-2.5 text-[13px] md:text-sm leading-snug text-[#0B0B0B]"
        style={{
          boxShadow: '0 12px 30px -10px rgba(0,0,0,0.45)',
          ...(reduced ? {} : { scale: bScale, opacity: bOpacity, x: bX }),
        }}
      >
        <span className="block text-[11px] font-semibold text-black/45 mb-0.5">Polina</span>
        acting as a true mentor in the process.
      </motion.div>
      <motion.span className="relative flex-none" style={reduced ? undefined : { scale, y, opacity }}>
        <img
          src="/images/people/polina.webp"
          alt=""
          width={60}
          height={60}
          className="w-[52px] h-[52px] md:w-[60px] md:h-[60px] rounded-full object-cover"
          style={{ boxShadow: '0 0 0 3px #fff, 0 14px 30px -8px rgba(0,0,0,0.55)' }}
        />
        <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#31A24C]" style={{ boxShadow: '0 0 0 2.5px #fff' }} />
      </motion.span>
    </div>
  );
}

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
        <span className="rounded-xl px-4 py-2 text-sm font-bold text-[#101216]" style={{ background: ACCENT }}>
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


/* The hiring path as a story about mindset: each step is there to show
   how someone thinks, and lights up the parts of the bar it reveals.
   After the offer, the same four things become the growth plan. */
const BAR = ['Storytelling', 'Rationale', 'Quality', 'Prioritisation'];
const STORY: { t: string; d: string; shows: number[]; grow?: boolean }[] = [
  { t: 'Intro chat', d: 'Mindset first: what they are curious about, and how they talk about the problems they want to solve.', shows: [0] },
  { t: 'Portfolio interview', d: 'The thinking behind the work, not the pixels: why each call was made, and what they would change now.', shows: [1, 2] },
  { t: 'Take-home, 6 days', d: 'An open brief with no single right answer, the same for every finalist. It shows how they frame a problem and where they take it further.', shows: [0, 1, 2, 3] },
  { t: 'Presentation', d: 'How they tell the story, defend their trade-offs and choose what matters first.', shows: [0, 1, 3] },
  { t: 'Decision in 2–4 weeks', d: 'One decision, made against the same four things for everyone.', shows: [0, 1, 2, 3] },
  { t: 'Then, the team', d: 'Bi-weekly 1:1s keep growing the same mindset: the four things become a growth plan.', shows: [0, 1, 2, 3], grow: true },
];

function HiringStory() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const step = STORY[i];
  const last = STORY.length - 1;
  const go = (n: number) => setI(Math.max(0, Math.min(last, n)));
  return (
    <div
      role="group"
      aria-label="How each hiring step reads mindset"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(i + 1);
        if (e.key === 'ArrowLeft') go(i - 1);
      }}
      className="rounded-[28px] border p-5 md:p-9 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
      style={{ background: PANEL, borderColor: LINE, outlineColor: ACCENT }}
    >
      {/* the path: tap any stop, the candidate walks there */}
      <div className="relative">
        <div className="absolute left-[18px] right-[18px] top-[17px] h-[2px] rounded" style={{ background: LINE }} />
        <motion.div
          className="absolute left-[18px] top-[17px] h-[2px] rounded"
          style={{ background: ACCENT }}
          animate={{ width: `calc(${(i / last) * 100}% - ${(i / last) * 36}px)` }}
          transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 160, damping: 24 }}
        />
        <ol className="relative flex items-center justify-between">
          {STORY.map((s, k) => {
            const done = k <= i;
            return (
              <li key={s.t}>
                <button
                  type="button"
                  onClick={() => go(k)}
                  aria-current={k === i ? 'step' : undefined}
                  aria-label={s.t}
                  className="relative grid place-items-center w-9 h-9 rounded-full text-xs font-bold tabular-nums transition-colors"
                  style={{ background: done ? ACCENT : '#15171D', color: done ? '#0B0B0B' : 'rgba(255,255,255,0.55)', boxShadow: `0 0 0 1px ${done ? ACCENT : LINE}` }}
                >
                  {k === last ? '★' : String(k + 1).padStart(2, '0')}
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-6 md:gap-10 mt-9 md:mt-10 items-start">
        <div className="min-h-[150px]">
          <motion.div key={i} initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
            <p className="text-sm tabular-nums mb-2" style={{ color: ACCENT }}>
              {i === last ? 'After the offer' : `Step ${i + 1} of ${last} · what it shows`}
            </p>
            <h3 className="text-white text-2xl md:text-3xl font-semibold tracking-[-0.02em] leading-tight">{step.t}</h3>
            <p className="text-white/60 text-base md:text-lg leading-relaxed mt-3">{step.d}</p>
          </motion.div>
          <div className="flex items-center gap-2 mt-6">
            <button type="button" onClick={() => go(i - 1)} disabled={i === 0} aria-label="Previous step" className="grid place-items-center w-10 h-10 rounded-full border text-white/70 disabled:opacity-30" style={{ borderColor: LINE }}>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => (i === last ? setI(0) : go(i + 1))}
              className="h-10 px-5 rounded-full text-sm font-semibold"
              style={{ background: ACCENT, color: '#0B0B0B' }}
            >
              {i === last ? 'Start over' : 'Next step'}
            </button>
          </div>
        </div>

        {/* the bar: the same four things, lighting up where they count */}
        <div className="rounded-2xl p-5" style={{ background: '#0B0C10', boxShadow: `inset 0 0 0 1px ${LINE}` }}>
          <p className="text-white/45 text-sm mb-4">{step.grow ? 'The same four, now a growth plan' : 'The bar: what this step reveals'}</p>
          <ul className="grid gap-3">
            {BAR.map((b, k) => {
              const on = step.shows.includes(k);
              return (
                <li key={b}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className={on ? 'text-white' : 'text-white/35'}>{b}</span>
                    {on && <span style={{ color: ACCENT }}>{step.grow ? 'growing' : 'shows here'}</span>}
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: ACCENT }}
                      animate={{ width: on ? '100%' : '0%' }}
                      transition={reduced ? { duration: 0 } : { duration: 0.55, delay: k * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

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
  const reduced = useReducedMotion();
  const quoteRef = useRef<HTMLDivElement>(null);
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
            glance={{ problem: "Keeping a growing design team aligned across several product streams.", role: "Product Design Lead at Sary, Lead Game Product Designer at Lobah", result: "+40% design velocity at Sary, with 8 designers across 3 streams." }}
            title="How I lead design teams."
          >
            <p>Five principles and a weekly rhythm I’ve used to run design teams, from a B2B marketplace to a games studio.</p>
          </CaseIntro>
          <motion.div {...reveal} className="mb-16 md:mb-20">
            <Carousel />
          </motion.div>
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

        <Section i={1} tone="teal" title="Here’s my style." lead="Five things I hold to. Everything else on this page comes from them.">
          <Principles />
        </Section>

        <Section i={2} title="A rhythm from a day to a quarter." lead="Each ritual has one job. Read it top to bottom; the quarter sets what the days work on.">
          <Rhythm />
        </Section>

        <Section i={3} tone="teal" title="Three moments where it shows." lead="How a priority, a critique and a coaching conversation run on my teams, step by step.">
          <Practices />
        </Section>

        <Section i={4} title="Designers in streams, one team behind them." lead="Designers work day to day with a stream and its PM, and come back to one team for the system, research and standard.">
          <Shape />
        </Section>

        <Section i={5} tone="teal" title="Every objective has one owner." lead="Objectives are short, measurable and owned by one person. This is the format, with one of mine as the example.">
          <OkrFormat />
        </Section>

        <Section i={6} title="Hire on one bar, grow on the same one." lead="Every finalist gets the same open brief and is scored on the same four things: storytelling, rationale, quality and prioritisation. Bi-weekly 1:1s turn the same bar into a growth plan.">
          <HiringStory />
        </Section>

        <Section i={7} tone="teal" title="Where it worked." lead="The same playbook, two very different teams.">
          <div className="grid md:grid-cols-2 gap-3">
            {PROOF.map((t) => (
              <Panel key={t.where} className="!p-6 md:!p-9 flex flex-col">
                <div className="flex items-start justify-between gap-4 md:min-h-[5.25rem]">
                  <div>
                    <p className="text-white text-2xl font-bold leading-tight">{t.where}</p>
                    <p className="text-sm mt-1.5" style={{ color: ACCENT }}>
                      {t.role}
                    </p>
                  </div>
                  <p className="text-white/45 text-sm tabular-nums whitespace-nowrap pt-1.5">{t.when}</p>
                </div>
                <dl className="mt-8 pt-6 border-t grid gap-4" style={{ borderColor: LINE }}>
                  {t.points.map(([v, k]) => (
                    <div key={k} className="grid grid-cols-[6.5rem_minmax(0,1fr)] md:grid-cols-[7.5rem_minmax(0,1fr)] items-baseline gap-4">
                      <dd className="text-white text-3xl font-extrabold tracking-[-0.04em] tabular-nums">{v}</dd>
                      <dt className="text-white/60 leading-snug">{k}</dt>
                    </div>
                  ))}
                </dl>
              </Panel>
            ))}
          </div>
          {/* The one moment on the page that breaks the dark-panel rhythm:
              the testimonial on a quiet warm paper tone. */}
          <div ref={quoteRef} className="relative mt-16 md:mt-20">
          <PopAvatar target={quoteRef} />
          <motion.figure
            initial={reduced ? false : { opacity: 0, y: 28, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[32px] px-7 pt-20 pb-10 md:px-16 md:py-16"
            style={{ background: '#E9E7DF', color: '#0B0B0B' }}
          >
            <span aria-hidden className="absolute -bottom-24 md:-bottom-36 right-6 md:right-10 select-none font-extrabold leading-none" style={{ fontSize: 'clamp(160px, 22vw, 300px)', color: 'rgba(11,11,11,0.08)' }}>
              ”
            </span>
            <p className="relative text-xs md:text-sm font-semibold mb-6 md:mb-8" style={{ color: 'rgba(11,11,11,0.6)' }}>
              From the team
            </p>
            <blockquote className="relative font-semibold tracking-[-0.025em] leading-[1.18] max-w-4xl md:pr-40" style={{ fontSize: 'clamp(24px, 3.4vw, 44px)' }}>
              “He has a great talent for organizing work, skillfully delegating tasks based on his team members’ individual strengths, while also fostering their professional growth,{' '}
              <span style={{ background: '#0B0B0B', color: '#F4F2EC', padding: '0 0.18em', borderRadius: 6, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>
                acting as a true mentor in the process.
              </span>
              ”
            </blockquote>
            <figcaption className="relative flex items-center gap-4 mt-10 md:mt-12">
              <img src="/images/people/polina.webp" alt="" width={56} height={56} loading="lazy" className="w-14 h-14 rounded-full object-cover" style={{ boxShadow: '0 0 0 3px #0B0B0B' }} />
              <span>
                <span className="block font-bold text-base md:text-lg">Polina Kosheleva</span>
                <span className="block text-sm" style={{ color: 'rgba(11,11,11,0.65)' }}>
                  Senior Game UI Artist, reported to Ahmad at Lobah
                </span>
              </span>
            </figcaption>
          </motion.figure>
          </div>
        </Section>

        <Learnings accent={ACCENT}>
          <p>
            I learned to treat the way a team works as a design problem. The same habits apply: find where people get stuck,
            make the next step obvious, and write the rules down where everyone can see them. Writing the bar down is what made
            reviews and hiring feel fair, because nobody had to guess what good looked like.
          </p>
        </Learnings>
        <Takeaway
          accent={ACCENT}
          deep={DEEP}
        >
          A team doesn’t need more pressure. It needs an owner for every objective, a rhythm people can rely on, and one source
          of truth.
        </Takeaway>
      </div>
    </CaseShell>
  );
}
