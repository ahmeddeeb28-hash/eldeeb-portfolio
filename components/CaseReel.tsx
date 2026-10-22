import { motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';
import { useRef, useState, type ReactNode } from 'react';
import { FUNNEL } from './case-studies/report/ReportData';
import { track } from '../lib/analytics';

/* ── Case reel ───────────────────────────────────────
   The Work section as a reel of large panels, set left and right in
   turn. Each panel slides in from its side as it scrolls up, and its
   picture plays the case study's own story, scrubbed by the scroll:

     Sary     twelve products gather into one basket, 39 taps → 3
     Report   the funnel narrows from 34,860 shoppers to 3,357
     Sampo    the five rungs of the trust ladder light up in turn
     fresh    the five second window after Pay runs out, then tracking

   A glass "View case" disc follows the pointer over a panel. On touch
   it sits in the corner instead. With reduced motion every picture
   shows its end state and nothing moves. */

type Project = { id: string; title: string; accentColor: string; hasStudy?: boolean };

const COPY: Record<string, { name: string; line: string; tint: string }> = {
  'sary-repeat-customers': { name: 'Sary Buy Again', line: '39 taps down to 3. Repeat purchases up 28%.', tint: '#1D368D' },
  'sary-usability-report': { name: 'Sary usability report', line: 'Only 9.63% of shoppers reached Discover. Here is why.', tint: '#1E3A8A' },
  'sampo-ai-pricing': { name: 'Sampo AI pricing', line: 'Every price change explained, previewed and reversible.', tint: '#4338CA' },
  'fresh-order-placed': { name: 'fresh order placed', line: 'Five seconds to fix an order, then straight to tracking.', tint: '#0E7A4E' },
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

/* ── the four pictures, each driven by p: 0 → 1 ───────────────────── */

const SARY_ITEMS = ['coke', 'eggs', 'fairy', 'indo', 'milk', 'nes', 'oil', 'sun', 'tea', 'water', 'yog', 'bag'];

function SaryVis({ p }: { p: MotionValue<number> }) {
  const taps = useTransform(p, [0.15, 0.85], [39, 3], { clamp: true });
  const tapsText = useTransform(taps, (v) => String(Math.round(v)));
  const btn = useTransform(p, [0.7, 0.9], [0, 1]);
  const btnY = useTransform(p, [0.7, 0.9], [14, 0]);
  return (
    <div className="absolute inset-0">
      {SARY_ITEMS.map((k, i) => {
        // scattered start, on a ring around the basket
        const a = (i / SARY_ITEMS.length) * Math.PI * 2 + 0.4;
        const r = 34 + (i % 3) * 6;
        const x0 = Math.cos(a) * r;
        const y0 = Math.sin(a) * r * 0.78;
        const s0 = 0.12 + (i % 4) * 0.025;
        const t = 0.1 + (i % 6) * 0.06;
        return <SaryItem key={k} k={k} p={p} x0={x0} y0={y0} rot={(i % 2 ? 1 : -1) * (8 + i)} from={t} size={s0} />;
      })}
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <div className="text-center">
          <p className="text-white font-semibold tabular-nums leading-none" style={{ fontSize: 'clamp(56px, 9vw, 120px)', letterSpacing: '-0.05em' }}>
            <motion.span>{tapsText}</motion.span>
            <span className="text-white/50" style={{ fontSize: '0.4em', letterSpacing: '-0.02em' }}>
              {' '}
              taps
            </span>
          </p>
          <p className="text-white/55 text-sm md:text-base mt-2">to restock 18 usual items</p>
          <motion.span
            className="inline-flex mt-5 rounded-full bg-white text-[#1D368D] text-sm font-semibold px-5 py-2.5"
            style={{ opacity: btn, y: btnY }}
          >
            Add all to cart
          </motion.span>
        </div>
      </div>
    </div>
  );
}

function SaryItem({ k, p, x0, y0, rot, from, size }: { k: string; p: MotionValue<number>; x0: number; y0: number; rot: number; from: number; size: number }) {
  const to = from + 0.45;
  const left = useTransform(p, [from, to], [`${50 + x0}%`, '50%'], { clamp: true });
  const top = useTransform(p, [from, to], [`${50 + y0}%`, '50%'], { clamp: true });
  const o = useTransform(p, [to - 0.08, to], [1, 0], { clamp: true });
  const s = useTransform(p, [from, to], [1, 0.4], { clamp: true });
  const rotate = useTransform(p, [from, to], [rot, 0], { clamp: true });
  return (
    <motion.img
      src={`/images/case-studies/sary/${k}.webp`}
      alt=""
      aria-hidden
      className="absolute rounded-2xl bg-white p-2 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)]"
      style={{ width: `${size * 100}%`, maxWidth: 110, left, top, x: '-50%', y: '-50%', opacity: o, scale: s, rotate }}
    />
  );
}

function ReportVis({ p }: { p: MotionValue<number> }) {
  const reached = useTransform(p, [0.15, 0.85], [FUNNEL[0].n, FUNNEL[FUNNEL.length - 1].n], { clamp: true });
  const reachedText = useTransform(reached, fmt);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-[3%] px-[8%]">
      {FUNNEL.map((f, i) => (
        <ReportBand key={f.k} p={p} i={i} k={f.k} pct={f.pct} />
      ))}
      <p className="mt-4 text-center">
        <motion.span className="text-white font-semibold tabular-nums" style={{ fontSize: 'clamp(28px, 4vw, 52px)', letterSpacing: '-0.04em' }}>
          {reachedText}
        </motion.span>
        <span className="block text-white/55 text-sm">of 34,860 shoppers reached Discover</span>
      </p>
    </div>
  );
}

function ReportBand({ p, i, k, pct }: { p: MotionValue<number>; i: number; k: string; pct: number }) {
  const final = 30 + 70 * Math.sqrt(pct / 100);
  const w = useTransform(p, [0.1 + i * 0.12, 0.45 + i * 0.12], ['100%', `${final}%`], { clamp: true });
  return (
    <motion.div className="h-[11%] min-h-[30px] rounded-xl grid place-items-center text-white text-xs md:text-sm font-semibold" style={{ width: w, background: ['#2DD4BF', '#38BDF8', '#3B82F6', '#1E3A8A'][i] }}>
      <span className="truncate px-2">
        {k} · {pct}%
      </span>
    </motion.div>
  );
}

const RUNGS = ['Understand', 'Preview', 'Commit', 'Monitor', 'Reverse'];
function SampoVis({ p }: { p: MotionValue<number> }) {
  return (
    <div className="absolute inset-0 flex flex-col-reverse items-start justify-center gap-[2.5%] px-[10%]">
      {RUNGS.map((r, i) => (
        <SampoRung key={r} p={p} i={i} label={r} />
      ))}
      <p className="text-white/55 text-sm mb-3">Control handed over one rung at a time</p>
    </div>
  );
}
function SampoRung({ p, i, label }: { p: MotionValue<number>; i: number; label: string }) {
  const at = 0.12 + i * 0.15;
  const on = useTransform(p, [at, at + 0.08], [0, 1], { clamp: true });
  const bg = useTransform(on, [0, 1], ['rgba(139,133,255,0.12)', 'rgba(139,133,255,1)']);
  const x = useTransform(on, [0, 1], [-18, 0]);
  return (
    <motion.div className="rounded-xl px-4 py-[1.6%] min-h-[34px] flex items-center gap-3 text-white font-semibold text-sm md:text-lg" style={{ width: `${48 + i * 11}%`, background: bg, x }}>
      <span className="text-white/60 text-xs tabular-nums">{i + 1}</span>
      {label}
    </motion.div>
  );
}

function FreshVis({ p }: { p: MotionValue<number> }) {
  const C = 2 * Math.PI * 46;
  const dash = useTransform(p, [0.12, 0.72], [0, C], { clamp: true });
  const secs = useTransform(p, [0.12, 0.72], [5, 0], { clamp: true });
  const secsText = useTransform(secs, (v) => `${Math.ceil(v)}s`);
  const edit = useTransform(p, [0.6, 0.72], [1, 0], { clamp: true });
  const track = useTransform(p, [0.74, 0.88], [0, 1], { clamp: true });
  const trackY = useTransform(p, [0.74, 0.88], [16, 0], { clamp: true });
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="relative w-[44%] max-w-[260px] aspect-square">
        <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
          <motion.circle cx="50" cy="50" r="46" fill="none" stroke="#5FE0A2" strokeWidth="3" strokeLinecap="round" strokeDasharray={C} style={{ strokeDashoffset: dash }} />
        </svg>
        <img src="/images/case-studies/fresh/placed_bag.webp" alt="" aria-hidden className="absolute inset-[18%] object-contain" />
        <motion.span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 text-white text-sm font-semibold px-3 py-1 tabular-nums">
          {secsText}
        </motion.span>
      </div>
      <motion.div className="absolute bottom-[12%] flex gap-2" style={{ opacity: edit }}>
        {['Change address', 'Edit items'].map((t) => (
          <span key={t} className="rounded-full border border-white/25 text-white/85 text-xs md:text-sm px-3 py-1.5">
            {t}
          </span>
        ))}
      </motion.div>
      <motion.div className="absolute bottom-[12%] rounded-full bg-[#5FE0A2] text-[#0A2A1B] text-xs md:text-sm font-semibold px-4 py-1.5" style={{ opacity: track, y: trackY }}>
        On its way · tracking your order
      </motion.div>
    </div>
  );
}

const VIS: Record<string, (props: { p: MotionValue<number> }) => ReactNode> = {
  'sary-repeat-customers': SaryVis,
  'sary-usability-report': ReportVis,
  'sampo-ai-pricing': SampoVis,
  'fresh-order-placed': FreshVis,
};

/* ── one panel ─────────────────────────────────────────────────────── */

function Panel({ project, i, onOpen }: { project: Project; i: number; onOpen?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const right = i % 2 === 1;
  const copy = COPY[project.id] ?? { name: project.title, line: '', tint: '#222' };
  const Vis = VIS[project.id];

  // 0 as the panel enters at the bottom, 1 once it sits in the middle
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const fixed = useMotionValue(1);
  const p = reduced ? fixed : smooth;
  const x = useTransform(p, [0, 1], [right ? '8%' : '-8%', '0%']);
  const scale = useTransform(p, [0, 1], [0.86, 1]);
  const radius = useTransform(p, [0, 1], [48, 28]);

  // CTR: one view per panel per visit
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const logged = useRef(false);
  if (seen && !logged.current) {
    logged.current = true;
    track('case_card_view', { id: project.id });
  }

  // the pointer disc
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 500, damping: 40 });
  const sy = useSpring(my, { stiffness: 500, damping: 40 });
  const [hover, setHover] = useState(false);

  return (
    <div className={`flex ${right ? 'md:justify-end' : 'md:justify-start'}`}>
      <div className="w-full md:w-[68%]">
        <motion.button
          ref={ref as never}
          type="button"
          onClick={onOpen}
          disabled={!onOpen}
          aria-label={`Open the ${copy.name} case study`}
          onPointerMove={(e) => {
            if (e.pointerType !== 'mouse') return;
            const b = e.currentTarget.getBoundingClientRect();
            mx.set(e.clientX - b.left);
            my.set(e.clientY - b.top);
            setHover(true);
          }}
          onPointerLeave={() => setHover(false)}
          className="group relative block w-full overflow-hidden text-left aspect-[4/5] sm:aspect-[16/11] md:cursor-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          style={{
            x: reduced ? 0 : x,
            scale: reduced ? 1 : scale,
            borderRadius: radius,
            background: `radial-gradient(ellipse 80% 70% at ${right ? '20%' : '80%'} 10%, ${copy.tint}CC 0%, transparent 65%), radial-gradient(ellipse 60% 60% at ${right ? '90%' : '10%'} 100%, ${copy.tint}66 0%, transparent 70%), #101114`,
          }}
        >
          {Vis && <Vis p={p} />}
          {/* the disc: follows the mouse, sits in the corner on touch */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-10 hidden md:grid place-items-center w-[92px] h-[92px] -ml-[46px] -mt-[46px] rounded-full text-white text-[11px] font-semibold text-center leading-tight"
            style={{
              x: sx,
              y: sy,
              opacity: hover ? 1 : 0,
              scale: hover ? 1 : 0.6,
              background: 'rgba(255,255,255,0.14)',
              backdropFilter: 'blur(14px) saturate(140%)',
              WebkitBackdropFilter: 'blur(14px) saturate(140%)',
              border: '1px solid rgba(255,255,255,0.22)',
              transition: 'opacity 0.2s, scale 0.25s',
            }}
          >
            View
            <br />
            case
          </motion.span>
          <span className="md:hidden absolute right-4 bottom-4 z-10 rounded-full text-white text-xs font-semibold px-3.5 py-2" style={{ background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
            View case
          </span>
        </motion.button>
        <p className="mt-4 text-[17px] md:text-xl leading-snug">
          <span className="text-white font-medium">{copy.name}</span> <span className="text-white/45">{copy.line}</span>
        </p>
      </div>
    </div>
  );
}

export function CaseReel({ projects, onOpen }: { projects: Project[]; onOpen?: (id: string) => void }) {
  return (
    <div className="mx-auto max-w-[1240px] px-6 pb-32 grid gap-24 md:gap-36">
      {projects
        .filter((p) => VIS[p.id])
        .map((p, i) => (
          <Panel key={p.id} project={p} i={i} onOpen={onOpen && p.hasStudy ? () => onOpen(p.id) : undefined} />
        ))}
    </div>
  );
}
