import { AnimatePresence, motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { FUNNEL } from './case-studies/report/ReportData';
import { SaryPhone } from './case-studies/sary/SaryPhone';
import { FreshPhone, type PhoneState } from './case-studies/fresh/FreshPhone';
import { DesktopFrame, PreviewView, type ModeId } from './case-studies/sampo/SampoUI';
import { track } from '../lib/analytics';

/* ── Case reel ───────────────────────────────────────
   The Work section as one scroll sequence. Each case is a large card
   that slides in from its side, pins under the nav and plays its
   app's key moment on the real screens while you keep scrolling;
   then the next card slides up over it and the one beneath sinks
   back a little. Scrolling back plays everything in reverse.

     Sary     home → Buy Again hub → Add all → in the cart (39 → 3 taps)
     Report   the funnel narrows to 3,357, then the Discover heatmap
     Sampo    the mode selector: Careful → High Impact → Balanced → live
     fresh    Pay → the five second window runs → placed, to tracking

   With reduced motion the cards still stack but every screen rests
   on its final moment. */

type Project = { id: string; title: string; category?: string; hasStudy?: boolean };

const COPY: Record<string, { name: string; line: string; tint: string; beats: string[] }> = {
  'sary-repeat-customers': {
    name: 'Sary Buy Again',
    line: '39 taps down to 3. Repeat purchases up 28%, order value up 27%.',
    tint: '#1D368D',
    beats: ['A store owner opens Sary to restock', 'The Buy Again hub has the usual basket ready', 'Add all: 18 items in the cart in one tap'],
  },
  'sary-usability-report': {
    name: 'Sary usability report',
    line: 'Only 9.63% of shoppers reached Discover. My quarterly report on why.',
    tint: '#1E3A8A',
    beats: ['34,860 shoppers opened the catalogue', 'Every step lost more of them', 'Only 3,357 reached Discover, and the heatmap shows why'],
  },
  'sampo-ai-pricing': {
    name: 'Sampo AI pricing',
    line: 'An AI that sets prices, made trustworthy: explained, previewed, reversible.',
    tint: '#4338CA',
    beats: ['Careful: small, safe nudges', 'High Impact: more reach, less profit', 'Balanced: best profit for moderate risk', 'Tested before anything goes live'],
  },
  'fresh-order-placed': {
    name: 'fresh order placed',
    line: 'The spinner after Pay became five seconds to fix the order, then tracking.',
    tint: '#0E7A4E',
    beats: ['Pay, and a five second window opens', 'Fix the address or the items while it runs', 'Placed, and straight on to tracking'],
  },
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const pick = <T,>(p: number, cuts: number[], vals: T[]) => vals[cuts.filter((c) => p >= c).length];

/* p as React state, for screens that take props rather than motion values */
function useStep(p: MotionValue<number>) {
  const [v, setV] = useState(p.get());
  useMotionValueEvent(p, 'change', (x) => setV(Math.round(x * 100) / 100));
  return v;
}

/* the box a screen has to fit in */
function useBox<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, box] as const;
}

/* ── the screens ───────────────────────────────────────────────────── */

function SaryStage({ p }: { p: MotionValue<number> }) {
  const v = useStep(p);
  const [ref, box] = useBox<HTMLDivElement>();
  const w = Math.min(box.w * 0.62, (box.h * 0.94 * 390) / 844);
  const state = v < 0.22 ? 'home' : 'hub';
  const taps = Math.round(39 - 36 * clamp01((v - 0.15) / 0.7));
  return (
    <div ref={ref} className="absolute inset-0 grid place-items-center">
      {w > 0 && (
        <div className="relative">
          <SaryPhone
            state={state}
            width={w}
            pressed={v >= 0.5 && v < 0.58}
            flying={v >= 0.58 && v < 0.7}
            added={v >= 0.7}
            badge={v >= 0.7 ? 21 : undefined}
            cartBar={v >= 0.7}
            sheet={v >= 0.86}
          />
          <TapCount n={taps} />
        </div>
      )}
    </div>
  );
}

function TapCount({ n }: { n: number }) {
  return (
    <div className="absolute -left-4 md:-left-24 top-[14%] rounded-2xl px-4 py-3 text-white shadow-[0_20px_40px_-20px_rgba(0,0,0,0.7)]" style={{ background: 'rgba(16,18,24,0.78)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.12)' }}>
      <p className="text-3xl md:text-4xl font-semibold tabular-nums leading-none tracking-tight">{n}</p>
      <p className="text-[11px] text-white/55 mt-1">taps to restock</p>
    </div>
  );
}

function ReportStage({ p }: { p: MotionValue<number> }) {
  const v = useStep(p);
  const shown = FUNNEL[0].n - (FUNNEL[0].n - FUNNEL[3].n) * clamp01((v - 0.1) / 0.55);
  const heat = clamp01((v - 0.62) / 0.15);
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-[5%] px-[6%]">
      <div className="flex-1 max-w-[340px] flex flex-col items-center gap-2">
        {FUNNEL.map((f, i) => {
          const t = clamp01((v - 0.08 - i * 0.12) / 0.3);
          const final = 34 + 66 * Math.sqrt(f.pct / 100);
          return (
            <div key={f.k} className="h-9 md:h-11 rounded-xl grid place-items-center text-white text-[11px] md:text-xs font-semibold transition-[width] duration-200" style={{ width: `${100 - (100 - final) * t}%`, background: ['#2DD4BF', '#38BDF8', '#3B82F6', '#1E3A8A'][i] }}>
              <span className="truncate px-2">
                {f.k} · {f.pct}%
              </span>
            </div>
          );
        })}
        <p className="mt-3 text-center text-white">
          <span className="block text-3xl md:text-4xl font-semibold tabular-nums tracking-tight">{Math.round(shown).toLocaleString('en-US')}</span>
          <span className="text-white/55 text-xs">shoppers {v > 0.62 ? 'reached Discover' : 'still in'}</span>
        </p>
      </div>
      <div className="relative h-[86%] aspect-[318/636] rounded-[28px] overflow-hidden bg-black border-[5px] border-[#1b1d22] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] hidden sm:block" style={{ opacity: 0.25 + 0.75 * heat, transform: `translateY(${(1 - heat) * 16}px)` }}>
        <img src="/images/case-studies/sary-report/heat-2.webp" alt="" aria-hidden className="w-full h-full object-cover" />
        <span className="absolute left-2 bottom-2 rounded-full bg-black/65 text-white text-[10px] font-semibold px-2 py-0.5">Discover heatmap</span>
      </div>
    </div>
  );
}

function SampoStage({ p }: { p: MotionValue<number> }) {
  const v = useStep(p);
  const sel = pick<ModeId>(v, [0.3, 0.52], ['careful', 'high', 'balanced']);
  const stage = pick(v, [0.72, 0.86], ['preview', 'confirm', 'live'] as const);
  return (
    <div className="absolute inset-0 flex items-center justify-center px-[4%]">
      <div className="w-full max-w-[760px] rounded-xl overflow-hidden shadow-[0_40px_70px_-30px_rgba(0,0,0,0.8)]">
        <DesktopFrame canvasH={830} url="app.sampo.ai/strategies/returning-visitor">
          <PreviewView selected={sel} stage={stage} interactive={false} />
        </DesktopFrame>
      </div>
    </div>
  );
}

function FreshStage({ p }: { p: MotionValue<number> }) {
  const v = useStep(p);
  const [ref, box] = useBox<HTMLDivElement>();
  const w = Math.min(box.w * 0.62, (box.h * 0.94 * 440) / 956);
  const progress = clamp01((v - 0.12) / 0.58);
  const state: PhoneState = v < 0.72 ? 'placing' : v < 0.8 ? 'burst' : 'placed';
  return (
    <div ref={ref} className="absolute inset-0 grid place-items-center">
      {w > 0 && <FreshPhone state={state} progress={progress} width={w} />}
    </div>
  );
}

const STAGE: Record<string, (props: { p: MotionValue<number> }) => ReactNode> = {
  'sary-repeat-customers': SaryStage,
  'sary-usability-report': ReportStage,
  'sampo-ai-pricing': SampoStage,
  'fresh-order-placed': FreshStage,
};

/* ── one card ──────────────────────────────────────────────────────── */

const STICK = 88; // under the floating nav
const GAP_VH = 0.9; // scroll spent on each card's story, in viewport heights

function Beat({ p, beats }: { p: MotionValue<number>; beats: string[] }) {
  const v = useStep(p);
  const i = Math.min(beats.length - 1, Math.floor(clamp01(v) * beats.length * 0.999));
  return (
    <div className="min-h-[3.2em]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.p key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="text-white/80 text-[15px] md:text-base leading-snug">
          {beats[i]}
        </motion.p>
      </AnimatePresence>
      <div className="flex gap-1.5 mt-3">
        {beats.map((b, k) => (
          <span key={b} className="h-1 flex-1 rounded-full transition-colors duration-300" style={{ background: k <= i ? '#fff' : 'rgba(255,255,255,0.15)' }} />
        ))}
      </div>
    </div>
  );
}

function Card({
  project,
  i,
  n,
  enter,
  story,
  cover,
  onOpen,
}: {
  project: Project;
  i: number;
  n: number;
  enter: MotionValue<number>;
  story: MotionValue<number>;
  cover: MotionValue<number>;
  onOpen?: () => void;
}) {
  const reduced = useReducedMotion();
  const right = i % 2 === 1;
  const copy = COPY[project.id];
  const Stage = STAGE[project.id];
  const x = useTransform(enter, [0, 1], [right ? '14%' : '-14%', '0%']);
  const rot = useTransform(enter, [0, 1], [right ? 4 : -4, 0]);
  const scale = useTransform([enter, cover], ([e, c]: number[]) => (0.88 + 0.12 * e) * (1 - 0.07 * c));
  const dim = useTransform(cover, [0, 1], [0, 0.55]);

  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const logged = useRef(false);
  if (seen && !logged.current) {
    logged.current = true;
    track('case_card_view', { id: project.id });
  }

  return (
    <motion.div
      ref={ref}
      className="sticky w-full"
      style={{ top: STICK + i * 12, height: `min(760px, calc(100svh - ${STICK + 24 + (n - 1) * 12}px))`, zIndex: i + 1, marginBottom: i < n - 1 ? `${GAP_VH * 100}svh` : 0 }}
    >
      <motion.div
        onClick={onOpen}
        className={`relative h-full w-full overflow-hidden rounded-[28px] border border-white/[0.08] grid grid-rows-[auto_minmax(0,1fr)] md:grid-rows-1 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] ${onOpen ? 'cursor-pointer' : ''}`}
        style={{
          x: reduced ? 0 : x,
          rotate: reduced ? 0 : rot,
          scale: reduced ? 1 : scale,
          transformOrigin: right ? '100% 0%' : '0% 0%',
          background: `radial-gradient(ellipse 70% 80% at ${right ? '15%' : '85%'} 20%, ${copy.tint}B3 0%, transparent 65%), radial-gradient(ellipse 60% 60% at ${right ? '90%' : '10%'} 100%, ${copy.tint}55 0%, transparent 70%), #0F1014`,
          boxShadow: '0 -30px 60px -30px rgba(0,0,0,0.9)',
        }}
      >
        {/* the story side */}
        <div className="relative z-10 flex flex-col justify-between gap-5 p-6 md:p-10">
          <div>
            {project.category && <p className="text-white/45 text-xs md:text-sm mb-3">{project.category}</p>}
            <h3 className="text-white text-2xl md:text-4xl font-semibold tracking-[-0.03em] leading-tight">{copy.name}</h3>
            <p className="text-white/55 text-sm md:text-base leading-relaxed mt-3 max-w-md">{copy.line}</p>
          </div>
          <div className="grid gap-5">
            <div className="hidden md:block">
              <Beat p={story} beats={copy.beats} />
            </div>
            {onOpen && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen();
                }}
                className="group w-fit inline-flex items-center gap-2 rounded-full bg-white text-[#0A0A0A] text-sm font-semibold pl-5 pr-4 py-2.5 transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                View case
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            )}
          </div>
        </div>
        {/* the app */}
        <div className="relative min-h-0" aria-hidden>
          {Stage && <Stage p={story} />}
        </div>
        {/* sinks back as the next card covers it */}
        <motion.span aria-hidden className="pointer-events-none absolute inset-0 z-20 bg-black" style={{ opacity: reduced ? 0 : dim }} />
      </motion.div>
    </motion.div>
  );
}

export function CaseReel({ projects, onOpen }: { projects: (Project & { category?: string })[]; onOpen?: (id: string) => void }) {
  const list = projects.filter((p) => STAGE[p.id]);
  const n = list.length;
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // where the reel starts on the page, and the card rhythm, in px
  const geo = useRef({ top: 0, vh: 800, step: 800 + 720 });
  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const first = el.firstElementChild as HTMLElement | null;
      const vh = window.innerHeight;
      const cardH = first?.offsetHeight ?? vh * 0.8;
      geo.current = { top: el.getBoundingClientRect().top + window.scrollY, vh, step: cardH + vh * GAP_VH };
    };
    measure();
    window.addEventListener('resize', measure);
    const ro = new ResizeObserver(measure);
    if (ref.current) ro.observe(ref.current);
    return () => {
      window.removeEventListener('resize', measure);
      ro.disconnect();
    };
  }, []);

  const { scrollY } = useScroll();
  // scroll position measured from the moment card 0 would pin
  const rel = useTransform(scrollY, (y) => y - (geo.current.top - STICK));
  const enters = list.map((_, i) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTransform(rel, (r) => (reduced ? 1 : clamp01((r - (i * geo.current.step - geo.current.vh * 0.85)) / (geo.current.vh * 0.85)))),
  );
  const stories = list.map((_, i) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTransform(rel, (r) => (reduced ? 1 : clamp01((r - (i * geo.current.step - geo.current.vh * 0.2)) / (geo.current.vh * GAP_VH * 0.95)))),
  );
  const covers = list.map((_, i) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTransform(rel, (r) => (i === n - 1 ? 0 : clamp01((r - ((i + 1) * geo.current.step - geo.current.vh * 0.85)) / (geo.current.vh * 0.85)))),
  );

  return (
    <div ref={ref} className="relative mx-auto max-w-[1240px] px-4 md:px-6 pb-24">
      {list.map((p, i) => (
        <Card key={p.id} project={p} i={i} n={n} enter={enters[i]} story={stories[i]} cover={covers[i]} onOpen={onOpen && p.hasStudy ? () => onOpen(p.id) : undefined} />
      ))}
      {/* a margin on the last card would cut its pin short, so it gets room here */}
      <div aria-hidden style={{ height: `${GAP_VH * 100}svh` }} />
    </div>
  );
}
