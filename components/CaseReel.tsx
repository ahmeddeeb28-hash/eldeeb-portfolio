import { AnimatePresence, motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight, Leaf, Quote } from 'lucide-react';
import { FUNNEL } from './case-studies/report/ReportData';
import { SaryPhone } from './case-studies/sary/SaryPhone';
import { FreshPhone, type PhoneState } from './case-studies/fresh/FreshPhone';
import { DesktopFrame, PreviewView, type ModeId } from './case-studies/sampo/SampoUI';
import { track } from '../lib/analytics';
import { SARY_LOGO_PATH } from './case-studies/sary/saryLogoPath';

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

/* real figures from each case study; `lead` is drawn larger */
type Stat = { v: number; pre?: string; suf?: string; dp?: number; k: string; note?: string };
const STATS: Record<string, Stat[]> = {
  'sary-design-leadership': [
    { v: 8, k: 'Designers in one team' },
    { v: 3, k: 'Streams, 5 products' },
    { v: 40, pre: '+', suf: '%', k: 'Design velocity' },
  ],
  'sary-repeat-customers': [
    { v: 28, pre: '+', suf: '%', k: 'Repeat purchases' },
    { v: 27, pre: '+', suf: '%', k: 'Average order value' },
    { v: 42, pre: '+', suf: '%', k: 'Use of suggestions' },
  ],
  'sary-usability-report': [
    { v: 9.63, suf: '%', dp: 2, k: 'Of shoppers reached Discover' },
  ],
  'sampo-ai-pricing': [
    { v: 40, pre: '+', suf: '%', k: 'Dashboard usage', note: 'pilot' },
    { v: 22, pre: '−', suf: '%', k: 'Setup friction' },
    { v: 28, pre: '+', suf: '%', k: 'Sign-up intent' },
  ],
  'fresh-order-placed': [
    { v: 5, suf: 's', k: 'To fix the address or items after Pay' },
  ],
};

/* My part in each case, as each case study states it. A line recruiters
   look for first: who did what. */
/* Who did what, the line reviewers look for first: role, team, what I
   owned and how long, in one format on every card. Fields not yet
   confirmed are left out rather than guessed. `proof` points to the
   recommendation that speaks to this work. */
type RoleFacts = { role: string; team?: string; owned?: string; duration?: string; proof?: string };
const ROLE: Record<string, RoleFacts> = {
  'sary-design-leadership': {
    role: 'Senior Product Designer → Product Design Lead',
    team: '8 designers, 3 streams, 5 countries',
    owned: 'OKRs, rituals, the design system and hiring',
    duration: 'Sep 2021 – Sep 2023',
    proof: 'Mohammed Aldossary, Sary’s co-founder & CEO',
  },
  'sary-repeat-customers': {
    role: 'Product Design Lead',
    owned: 'The Buy Again hub, end to end',
    proof: 'Mohammed Aldossary, Sary’s co-founder & CEO',
  },
  'sary-usability-report': {
    role: 'Senior Product Designer',
    owned: 'The quarterly usability report and its rituals',
    proof: 'Asad Ali Shah, Director of Growth',
  },
  'sampo-ai-pricing': {
    role: 'Freelance, then Product Design Consultant (Contract)',
    team: 'Founders, engineering and growth',
    owned: 'Pricing analysis, dashboards, onboarding',
    duration: '14 months',
  },
  'fresh-order-placed': {
    role: 'Product Designer (Freelance)',
    owned: 'The order placed moment, end to end',
  },
};

const COPY: Record<string, { name: string; line: string; tint: string; beats: string[] }> = {
  'sary-design-leadership': {
    name: 'Design leadership',
    line: 'One design team across Demand, Supply and Logistics: retailers, suppliers and drivers.',
    tint: '#0F4C4A',
    beats: ['One lead, one team of eight', 'Three streams, each with its own users', 'Five products on one design system', 'Held together by rituals, OKRs and hiring'],
  },
  'sary-repeat-customers': {
    name: 'Sary Buy Again',
    line: '39 taps down to 3. Repeat purchases up 28%, order value up 27%.',
    tint: '#1D368D',
    beats: ['A store owner opens Sary to restock', 'The Buy Again hub has the usual basket ready', 'Add all: 18 items in the cart in one tap'],
  },
  'sary-usability-report': {
    name: 'Sary usability report',
    line: 'My quarterly report on where shoppers dropped off, and why.',
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
            <div key={f.k} className="min-w-fit h-9 md:h-11 rounded-xl grid place-items-center text-white text-[11px] md:text-xs font-semibold transition-[width] duration-200" style={{ width: `${100 - (100 - final) * t}%`, background: ['#2DD4BF', '#38BDF8', '#3B82F6', '#1E3A8A'][i] }}>
              <span className="whitespace-nowrap px-3">
                {f.k} · {f.pct}%
              </span>
            </div>
          );
        })}
        <p className="mt-3 text-center text-[#0F1B3D]">
          <span className="block text-3xl md:text-4xl font-semibold tabular-nums tracking-tight">{Math.round(shown).toLocaleString('en-US')}</span>
          <span className="text-[#5B6478] text-xs">shoppers {v > 0.62 ? 'reached Discover' : 'still in'}</span>
        </p>
      </div>
      <div className="relative h-[86%] aspect-[318/636] rounded-[28px] overflow-hidden bg-black border-[5px] border-[#1b1d22] shadow-[0_30px_60px_-30px_rgba(15,27,61,0.55)] hidden sm:block lg:hidden xl:block" style={{ opacity: 0.25 + 0.75 * heat, transform: `translateY(${(1 - heat) * 16}px)` }}>
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

/* the team as its architecture: the lead, one design team, and the
   three streams it served with their users and products. Builds up
   with the card's story; the shared layer lights last. */
const ARCH: { name: string; users: string; products: string[] }[] = [
  { name: 'Demand', users: 'Retailers', products: ['Flagship app', 'POS'] },
  { name: 'Supply', users: 'Suppliers', products: ['Ark'] },
  { name: 'Logistics', users: 'Drivers', products: ['Launchpad', 'Lighthouse'] },
];
function TeamStage({ p }: { p: MotionValue<number> }) {
  const v = useStep(p);
  const show = (at: number) => ({ opacity: clamp01((v - at) / 0.12), transform: `translateY(${(1 - clamp01((v - at) / 0.12)) * 8}px)` });
  const shared = v >= 0.72;
  const line = 'rgba(45,212,191,0.45)';
  return (
    <div className="absolute inset-0 flex items-center justify-center px-[5%] text-white">
      <div className="w-full max-w-[560px] flex flex-col items-center">
        <span className="rounded-xl px-3.5 py-1.5 text-xs md:text-sm font-bold text-[#06201E] bg-[#2DD4BF]">Product Design Lead</span>
        <span aria-hidden className="w-px h-4 md:h-5" style={{ background: line }} />
        <div className="w-full rounded-xl md:rounded-2xl border px-3 py-2 md:py-2.5 text-center" style={{ ...show(0.08), borderColor: line, background: 'rgba(45,212,191,0.08)' }}>
          <p className="text-[11px] md:text-sm font-bold">One design team · 8 designers · 5 countries</p>
        </div>
        {/* stems: a bar across, one down to each stream */}
        <div aria-hidden className="relative w-full h-4 md:h-6" style={show(0.2)}>
          <span className="absolute left-1/2 top-0 w-px h-1/2" style={{ background: line }} />
          <span className="absolute left-[16.66%] right-[16.66%] top-1/2 h-px" style={{ background: line }} />
          {[16.66, 50, 83.33].map((x) => (
            <span key={x} className="absolute top-1/2 w-px h-1/2" style={{ left: `${x}%`, background: line }} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1.5 md:gap-2.5 w-full">
          {ARCH.map((s, i) => (
            <div key={s.name} className="rounded-xl md:rounded-2xl border p-2 md:p-3.5 min-w-0" style={{ ...show(0.24 + i * 0.1), borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)' }}>
              <p className="text-xs md:text-base font-bold truncate">{s.name}</p>
              <p className="text-[10px] md:text-xs text-[#CFF5EF]/70 truncate">{s.users}</p>
              <div className="hidden sm:grid gap-1 mt-2 md:mt-3">
                {s.products.map((pr) => (
                  <span key={pr} className="rounded-md px-1.5 md:px-2 py-1 text-[10px] md:text-xs font-medium truncate" style={{ background: 'rgba(45,212,191,0.14)', color: '#E6FBF7' }}>
                    {pr}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* what every stream shares */}
        <div className="hidden sm:flex w-full mt-2.5 md:mt-3 rounded-xl border px-3 py-2 text-[10px] md:text-xs justify-center gap-x-3 gap-y-1 flex-wrap transition-colors duration-300" style={{ ...show(0.6), borderColor: shared ? line : 'rgba(255,255,255,0.1)', color: shared ? '#E6FBF7' : 'rgba(255,255,255,0.55)' }}>
          {['Design system', 'Research ops', 'Rituals', 'OKRs', 'Hiring'].map((x) => (
            <span key={x} className="whitespace-nowrap">{x}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

const STAGE: Record<string, (props: { p: MotionValue<number> }) => ReactNode> = {
  'sary-design-leadership': TeamStage,
  'sary-repeat-customers': SaryStage,
  'sary-usability-report': ReportStage,
  'sampo-ai-pricing': SampoStage,
  'fresh-order-placed': FreshStage,
};

/* ── the four brand marks ─────────────────────────────────────────── */

function SaryWord({ color, h }: { color: string; h: number }) {
  return (
    <svg viewBox="0 0 64 32" style={{ height: h, width: h * 2 }} aria-label="Sary">
      <path fillRule="evenodd" clipRule="evenodd" d={SARY_LOGO_PATH} fill={color} />
    </svg>
  );
}

function SampoSquare({ size, color, cut }: { size: number; color: string; cut: string }) {
  return (
    <span
      className="grid place-items-center font-black italic flex-none"
      style={{ width: size, height: size, borderRadius: size * 0.28, fontSize: size * 0.56, background: color, color: cut }}
    >
      S
    </span>
  );
}

function FreshWord({ color, size }: { color: string; size: number | string }) {
  return (
    <span className="inline-flex items-center gap-[0.12em] font-extrabold tracking-[-0.04em] leading-none" style={{ color, fontSize: size }} aria-label="fresh">
      <Leaf style={{ width: '0.85em', height: '0.85em' }} strokeWidth={2.6} />
      fresh
    </span>
  );
}

/* The logo is stamped into the card: a tone of the card's own colour,
   a shade on its upper edge and a thin highlight on its lower edge, as
   if pressed into the surface. Done with
   drop-shadows so it works in every browser; the brand is still named
   for screen readers. */
type Engrave = { ink: string; cut: string; filter: string };
/* Each ink clears 4.5:1 against the card behind it (measured on the
   colour where the lockup sits), so the logo and the "Q4 ’22 report"
   text stay readable; the pressed-in look comes from the edges. */
const ENGRAVE: Record<string, Engrave> = {
  'sary-design-leadership': {
    ink: '#9FD9CF', // on the deep teal #0F4C4A
    cut: '#0F4C4A',
    filter: 'drop-shadow(0 -1px 0 rgba(2,20,18,0.8)) drop-shadow(0 1px 0 rgba(207,245,239,0.16))',
  },
  'sary-repeat-customers': {
    ink: '#C0C7DF', // 6.4:1 on #1D368D
    cut: '#1D368D',
    filter: 'drop-shadow(0 -1px 0 rgba(4,10,40,0.75)) drop-shadow(0 1px 0 rgba(255,255,255,0.14))',
  },
  'sary-usability-report': {
    ink: '#4860A1', // 5.6:1 on #F2F6FB
    cut: '#F2F6FB',
    filter: 'drop-shadow(0 1px 0 rgba(255,255,255,1)) drop-shadow(0 -1px 0 rgba(15,27,61,0.35))',
  },
  'sampo-ai-pricing': {
    ink: '#ACA8DF', // 6.8:1 on #211A60
    cut: '#211A60',
    filter: 'drop-shadow(0 -1px 0 rgba(4,2,20,0.8)) drop-shadow(0 1px 0 rgba(207,203,255,0.16))',
  },
  'fresh-order-placed': {
    ink: '#2E7355', // 5.1:1 on #E6F6ED
    cut: '#E6F6ED',
    filter: 'drop-shadow(0 1px 0 rgba(255,255,255,1)) drop-shadow(0 -1px 0 rgba(10,61,39,0.35))',
  },
};

/* the lockup at the top of each card */
const LOCKUP: Record<string, (e: Engrave) => ReactNode> = {
  'sary-design-leadership': (e) => (
    <span className="inline-flex items-center gap-2.5">
      <SaryWord color={e.ink} h={38} />
      <span className="h-5 w-[2px] rounded-full" style={{ background: e.ink }} />
      <span className="text-[15px] font-bold" style={{ color: e.ink }}>
        Design team
      </span>
    </span>
  ),
  'sary-repeat-customers': (e) => <SaryWord color={e.ink} h={40} />,
  'sary-usability-report': (e) => (
    <span className="inline-flex items-center gap-2.5">
      <SaryWord color={e.ink} h={38} />
      <span className="h-5 w-[2px] rounded-full" style={{ background: e.ink }} />
      <span className="text-[15px] font-bold" style={{ color: e.ink }}>
        Q4 ’22 report
      </span>
    </span>
  ),
  'sampo-ai-pricing': (e) => (
    <span className="inline-flex items-center gap-2.5">
      <SampoSquare size={32} color={e.ink} cut={e.cut} />
      <b className="text-[16px] tracking-[0.12em]" style={{ color: e.ink }}>
        SAMPO AI
      </b>
    </span>
  ),
  'fresh-order-placed': (e) => <FreshWord color={e.ink} size={30} />,
};

/* ── themes: each card dressed in its own product ───────────────────
   Sary in its navy with the wordmark, the report as a printed page,
   Sampo in indigo with its mode dial, fresh in its own mint. One
   motif each, kept faint, so the screens stay the focus. */
type Theme = {
  bg: string;
  border: string;
  kicker: string;
  ink: string;
  sub: string;
  lead: { bg: string; ink: string; sub: string; border: string };
  tile: { bg: string; ink: string; sub: string; border: string };
  btn: { bg: string; ink: string };
  beatOn: string;
  beatOff: string;
  decor?: ReactNode;
};

const THEMES: Record<string, Theme> = {
  'sary-design-leadership': {
    bg: 'radial-gradient(ellipse 80% 90% at 85% 10%, #17706B 0%, transparent 62%), linear-gradient(160deg, #0F4C4A 0%, #062221 72%)',
    border: 'rgba(45,212,191,0.22)',
    kicker: 'rgba(207,245,239,0.7)',
    ink: '#FFFFFF',
    sub: 'rgba(225,248,244,0.75)',
    lead: { bg: '#2DD4BF', ink: '#06201E', sub: 'rgba(6,32,30,0.72)', border: 'transparent' },
    tile: { bg: 'rgba(45,212,191,0.1)', ink: '#FFFFFF', sub: 'rgba(207,245,239,0.7)', border: 'rgba(45,212,191,0.22)' },
    btn: { bg: '#2DD4BF', ink: '#06201E' },
    beatOn: '#2DD4BF',
    beatOff: 'rgba(45,212,191,0.2)',
  },
  'sary-repeat-customers': {
    bg: 'radial-gradient(ellipse 80% 90% at 85% 10%, #2B4BC0 0%, transparent 62%), linear-gradient(160deg, #1D368D 0%, #0E1A47 70%)',
    border: 'rgba(255,255,255,0.16)',
    kicker: 'rgba(255,255,255,0.66)', // 5.6:1 on the Sary navy
    ink: '#FFFFFF',
    sub: 'rgba(255,255,255,0.7)',
    lead: { bg: '#FFFFFF', ink: '#1D368D', sub: '#4A5A8C', border: 'transparent' },
    tile: { bg: 'rgba(255,255,255,0.1)', ink: '#FFFFFF', sub: 'rgba(255,255,255,0.65)', border: 'rgba(255,255,255,0.14)' },
    btn: { bg: '#FFFFFF', ink: '#1D368D' },
    beatOn: '#FFFFFF',
    beatOff: 'rgba(255,255,255,0.2)',
  },
  'sary-usability-report': {
    bg: 'linear-gradient(180deg, #F4F8FC 0%, #E6EEF8 100%)',
    border: 'rgba(30,58,138,0.14)',
    kicker: '#5B6478',
    ink: '#0F1B3D',
    sub: '#3D4A66',
    lead: { bg: '#1E3A8A', ink: '#FFFFFF', sub: 'rgba(255,255,255,0.75)', border: 'transparent' },
    tile: { bg: '#FFFFFF', ink: '#1E3A8A', sub: '#5B6478', border: 'rgba(30,58,138,0.12)' },
    btn: { bg: '#1E3A8A', ink: '#FFFFFF' },
    beatOn: '#1E3A8A',
    beatOff: 'rgba(30,58,138,0.15)',
    decor: (
      <>
        <div aria-hidden className="absolute left-0 right-0 top-0 h-1.5 bg-[#1E3A8A] pointer-events-none" />
      </>
    ),
  },
  'sampo-ai-pricing': {
    bg: 'radial-gradient(ellipse 70% 80% at 80% 20%, #4C3FD9 0%, transparent 62%), linear-gradient(160deg, #20185E 0%, #0B0820 75%)',
    border: 'rgba(139,133,255,0.28)',
    kicker: 'rgba(207,203,255,0.7)',
    ink: '#FFFFFF',
    sub: 'rgba(225,222,255,0.75)',
    lead: { bg: '#8B85FF', ink: '#14122B', sub: 'rgba(20,18,43,0.7)', border: 'transparent' },
    tile: { bg: 'rgba(139,133,255,0.12)', ink: '#FFFFFF', sub: 'rgba(207,203,255,0.7)', border: 'rgba(139,133,255,0.25)' },
    btn: { bg: '#8B85FF', ink: '#14122B' },
    beatOn: '#8B85FF',
    beatOff: 'rgba(139,133,255,0.2)',
  },
  'fresh-order-placed': {
    bg: 'radial-gradient(ellipse 70% 80% at 85% 15%, #CFF3DD 0%, transparent 60%), linear-gradient(160deg, #EAF8F0 0%, #D6F0E1 100%)',
    border: 'rgba(14,122,78,0.18)',
    kicker: '#3E7A5C',
    ink: '#0A3D27',
    sub: '#2F5E47',
    lead: { bg: '#0E7A4E', ink: '#FFFFFF', sub: 'rgba(255,255,255,0.8)', border: 'transparent' },
    tile: { bg: '#FFFFFF', ink: '#0A3D27', sub: '#4E7A63', border: 'rgba(14,122,78,0.14)' },
    btn: { bg: '#0E7A4E', ink: '#FFFFFF' },
    beatOn: '#0E7A4E',
    beatOff: 'rgba(14,122,78,0.18)',
  },
};

/* the numbers count up with the card's story */
function Stats({ p, stats, th }: { p: MotionValue<number>; stats: Stat[]; th: Theme }) {
  const v = useStep(p);
  const t = clamp01(v / 0.45);
  const eased = 1 - Math.pow(1 - t, 3);
  const show = (s: Stat) => {
    const n = s.v * eased;
    const body = s.dp ? n.toFixed(s.dp) : Math.round(n).toLocaleString('en-US');
    return `${s.pre ?? ''}${body}${s.suf ?? ''}`;
  };
  const [lead, ...rest] = stats;
  return (
    <div className="flex items-end gap-8 xl:gap-12">
      <div className="min-w-0">
        <p className="font-extrabold tabular-nums leading-[0.85] tracking-[-0.06em] whitespace-nowrap text-[clamp(56px,6vw,104px)]" style={{ color: th.beatOn }}>
          {show(lead)}
        </p>
        <p className="text-sm md:text-base mt-3 leading-snug" style={{ color: th.sub }}>
          {lead.k}
          {lead.note && <span className="opacity-70"> · {lead.note}</span>}
        </p>
      </div>
      {rest.length > 0 && <dl className="grid gap-3 pb-1 pl-6 xl:pl-8" style={{ borderLeft: `1px solid ${th.tile.border}` }}>
        {rest.map((s2) => (
          <div key={s2.k} className="flex items-baseline gap-2.5 whitespace-nowrap">
            <dt className="sr-only">{s2.k}</dt>
            <dd className="text-xl xl:text-2xl font-bold tabular-nums tracking-[-0.04em]" style={{ color: th.ink }}>
              {show(s2)}
            </dd>
            <span aria-hidden className="text-sm" style={{ color: th.sub }}>
              {s2.k}
            </span>
          </div>
        ))}
      </dl>}
    </div>
  );
}

/* who did what, in one quiet line next to the button: the role first,
   then what I owned; the recommendation as a small link under it */
function RoleLine({ facts, th }: { facts: RoleFacts; th: Theme }) {
  return (
    <div className="min-w-0 text-[13px] md:text-sm leading-snug">
      <p style={{ color: th.ink }}>
        <span className="font-semibold">{facts.role}</span>
        {facts.owned && <span style={{ color: th.sub }}> · {facts.owned}</span>}
      </p>
      {facts.proof && (
        <a
          href="#recommendations"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            document.getElementById('recommendations')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="inline-flex items-center gap-1.5 mt-1 underline-offset-4 hover:underline"
          style={{ color: th.sub }}
        >
          <Quote className="w-3 h-3" aria-hidden />
          Recommended by {facts.proof}
        </a>
      )}
    </div>
  );
}

/* ── one card ──────────────────────────────────────────────────────── */

const STICK = 88; // under the floating nav
const GAP_VH = 0.9; // scroll spent on each card's story, in viewport heights

function Beat({ p, beats, th }: { p: MotionValue<number>; beats: string[]; th: Theme }) {
  const v = useStep(p);
  const i = Math.min(beats.length - 1, Math.floor(clamp01(v) * beats.length * 0.999));
  return (
    <div className="min-h-[2.6em] max-w-xl">
      <AnimatePresence mode="wait" initial={false}>
        <motion.p key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="text-sm md:text-base font-medium leading-snug" style={{ color: th.sub }}>
          {beats[i]}
        </motion.p>
      </AnimatePresence>
      <div className="flex gap-1.5 mt-2.5">
        {beats.map((b, k) => (
          <span key={b} className="h-1 flex-1 rounded-full transition-colors duration-300" style={{ background: k <= i ? th.beatOn : th.beatOff }} />
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
  const th = THEMES[project.id];
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
      style={{ top: STICK + i * 12, height: `min(880px, calc(100svh - ${STICK + 16 + (n - 1) * 12}px))`, zIndex: i + 1, marginBottom: i < n - 1 ? `${GAP_VH * 100}svh` : 0 }}
    >
      <motion.div
        onClick={onOpen}
        className={`relative h-full w-full overflow-hidden rounded-[32px] grid grid-rows-[auto_minmax(0,1fr)] lg:grid-rows-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.2fr)] ${onOpen ? 'cursor-pointer' : ''}`}
        style={{
          x: reduced ? 0 : x,
          rotate: reduced ? 0 : rot,
          scale: reduced ? 1 : scale,
          transformOrigin: right ? '100% 0%' : '0% 0%',
          background: th.bg,
          border: `1px solid ${th.border}`,
          boxShadow: '0 -30px 60px -30px rgba(0,0,0,0.9)',
        }}
      >
        {th.decor}
        {/* the story side */}
        <div className="relative z-10 flex flex-col justify-between gap-5 p-6 md:p-10 lg:p-12">
          <div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5 md:mb-6">
              {LOCKUP[project.id] && (
                <span className="inline-flex" style={{ filter: ENGRAVE[project.id].filter }}>
                  {LOCKUP[project.id](ENGRAVE[project.id])}
                </span>
              )}
            </div>
            <h3 className="font-extrabold tracking-[-0.055em] leading-[0.92]" style={{ fontSize: 'clamp(38px, 5.2vw, 92px)', color: th.ink }}>{copy.name}</h3>
            <p className="text-base md:text-xl leading-snug mt-4 md:mt-5 max-w-xl tracking-[-0.01em]" style={{ color: th.sub }}>{copy.line}</p>
          </div>
          {STATS[project.id] && (
            <div className="hidden lg:block">
              <Stats p={story} stats={STATS[project.id]} th={th} />
            </div>
          )}
          <div className="grid gap-5">
            <div className="hidden lg:block">
              <Beat p={story} beats={copy.beats} th={th} />
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              {onOpen && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen();
                  }}
                  className="group flex-none w-fit inline-flex items-center gap-2 rounded-full text-[15px] font-semibold pl-6 pr-5 py-3 transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ background: th.btn.bg, color: th.btn.ink, outlineColor: th.btn.bg }}
                >
                  View case
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              )}
              {ROLE[project.id] && <RoleLine facts={ROLE[project.id]} th={th} />}
            </div>
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
    <div ref={ref} className="relative mx-auto max-w-[1440px] px-3 md:px-6 pb-24">
      {list.map((p, i) => (
        <Card key={p.id} project={p} i={i} n={n} enter={enters[i]} story={stories[i]} cover={covers[i]} onOpen={onOpen && p.hasStudy ? () => onOpen(p.id) : undefined} />
      ))}
      {/* a margin on the last card would cut its pin short, so it gets room here */}
      <div aria-hidden style={{ height: `${GAP_VH * 100}svh` }} />
    </div>
  );
}
