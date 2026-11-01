import { AnimatePresence, motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight, Leaf } from 'lucide-react';
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
    { v: 40, pre: '+', suf: '%', k: 'Design velocity', note: 'brief to dev-ready' },
    { v: 12, suf: '+', k: 'Designers led' },
    { v: 30, suf: '%', k: 'Faster handoff' },
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

const COPY: Record<string, { name: string; line: string; tint: string; beats: string[] }> = {
  'sary-design-leadership': {
    name: 'How I lead design teams',
    line: 'One owner per objective, a steady rhythm, one source of truth. Proven at Sary and Lobah.',
    tint: '#0343F8',
    beats: ['Building the team behind the product', 'Making a priority actionable', 'Turning critique into a decision', 'Coaching through the work'],
  },
  'sary-repeat-customers': {
    name: 'Restock in 3 taps, not 39',
    line: 'A Buy Again hub for grocery stores. Repeat purchases up 28%, order value up 27%.',
    tint: '#1D368D',
    beats: ['A store owner opens Sary to restock', 'The Buy Again hub has the usual basket ready', 'Add all: 18 items in the cart in one tap'],
  },
  'sary-usability-report': {
    name: 'Where shoppers dropped off, and why',
    line: 'My quarterly usability report: the catalogue funnel and the heatmaps behind it.',
    tint: '#1E3A8A',
    beats: ['34,860 shoppers opened the catalogue', 'Every step lost more of them', 'Only 3,357 reached Discover, and the heatmap shows why'],
  },
  'sampo-ai-pricing': {
    name: 'AI pricing merchants can trust',
    line: 'An AI that sets store prices, with every strategy explained, previewed and reversible.',
    tint: '#4338CA',
    beats: ['Careful: small, safe nudges', 'High Impact: more reach, less profit', 'Balanced: best profit for moderate risk', 'Tested before anything goes live'],
  },
  'fresh-order-placed': {
    name: 'Five seconds to fix an order',
    line: 'The spinner after Pay became a window to change the address or items, then tracking.',
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
      {/* one clean frame around the real screen: the heatmap screenshot is
          cropped to its content, the bezel, island and status bar are drawn */}
      <div
        className="@container relative h-[86%] aspect-[0.49] hidden sm:block lg:hidden xl:block"
        style={{ opacity: 0.25 + 0.75 * heat, transform: `translateY(${(1 - heat) * 16}px)` }}
      >
       <div className="relative h-full w-full rounded-[13cqi] bg-[#0B0C0F] p-[3.2cqi] shadow-[0_40px_70px_-30px_rgba(15,27,61,0.6),0_0_0_1px_rgba(15,27,61,0.18)]">
        <div className="relative h-full w-full rounded-[10cqi] overflow-hidden bg-white flex flex-col">
          <div className="relative flex-none h-[11cqi] flex items-center justify-between px-[8cqi] text-[#0F1B3D] text-[4.6cqi] font-semibold">
            <span>9:41</span>
            <span aria-hidden className="absolute left-1/2 top-[2.4cqi] -translate-x-1/2 h-[7.5cqi] w-[30cqi] rounded-full bg-[#0B0C0F]" />
            <span aria-hidden className="flex items-center gap-[1.4cqi]">
              <span className="w-[5cqi] h-[2.6cqi] rounded-[0.8cqi] border border-[#0F1B3D]/70" />
            </span>
          </div>
          <img src="/images/case-studies/sary-report/heat-2-screen.webp" alt="" aria-hidden className="flex-1 min-h-0 w-full object-cover object-top" />
          <span aria-hidden className="absolute bottom-[2.2cqi] left-1/2 -translate-x-1/2 h-[1.3cqi] w-[34cqi] rounded-full bg-[#0F1B3D]/80" />
        </div>
        <span className="absolute left-[7cqi] bottom-[9cqi] rounded-full bg-[#0F1B3D]/80 backdrop-blur text-white text-[4.4cqi] font-semibold px-[3.5cqi] py-[1.2cqi]">Discover heatmap</span>
       </div>
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

/* three phones, one per action: Pay starts the window, the address is
   fixed while the clock pauses, then placed. They rise in one after
   another, float on a slow offset bob, and the phone for the current
   beat steps forward. */
const FRESH_CSS = `@keyframes fresh-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-2.2%)}}
@media (prefers-reduced-motion: reduce){.fresh-bob{animation:none!important}}`;
function FreshStage({ p }: { p: MotionValue<number> }) {
  const v = useStep(p);
  const [ref, box] = useBox<HTMLDivElement>();
  // the centre phone at a comfortable size; the two behind it peek out
  // either side, so the whole group always fits inside the card
  const w = Math.min(box.w * 0.4, (box.h * 0.74 * 440) / 956);
  const focus = v < 0.4 ? 0 : v < 0.7 ? 1 : 2;
  const pay = clamp01(v / 0.38);
  const phones: { state: PhoneState; progress: number; label: string }[] = [
    { state: pay >= 1 ? 'sent' : 'placing', progress: pay, label: 'Pay' },
    { state: 'edit-address', progress: 0.38, label: 'Fix it' },
    { state: v >= 0.7 && v < 0.78 ? 'burst' : 'placed', progress: 1, label: 'Placed' },
  ];
  return (
    <div ref={ref} className="absolute inset-0">
      <style>{FRESH_CSS}</style>
      {w > 0 &&
        phones.map((ph, i) => {
          // 0 = centre, 1 = behind on the right, -1 = behind on the left
          const d = (i - focus + 3) % 3;
          const role = d === 0 ? 0 : d === 1 ? 1 : -1;
          const on = role === 0;
          const rise = clamp01((v + 0.02 - i * 0.035) / 0.1);
          const x = role * w * 0.62;
          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 transition-[transform,opacity,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-55% + ${(1 - rise) * 30}%)) scale(${on ? 1 : 0.8})`,
                opacity: rise * (on ? 1 : 0.55),
                filter: on ? 'none' : 'saturate(0.8)',
                zIndex: on ? 3 : 1,
              }}
            >
              <div className="fresh-bob" style={{ animation: `fresh-bob 3.6s ease-in-out ${i * -1.2}s infinite` }}>
                <FreshPhone state={ph.state} progress={ph.progress} width={w} />
              </div>
            </div>
          );
        })}
      {/* one label for the phone in front */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[3%] flex gap-1.5 z-10">
        {phones.map((ph, i) => (
          <span
            key={ph.label}
            className="rounded-full px-2.5 md:px-3 py-1 text-[10px] md:text-xs font-bold whitespace-nowrap transition-colors duration-300"
            style={{ background: i === focus ? '#0E7A4E' : 'rgba(14,122,78,0.12)', color: i === focus ? '#FFFFFF' : '#2F5E47' }}
          >
            {String(i + 1).padStart(2, '0')} · {ph.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* the leadership story as a deck of illustrated cutouts: the cover,
   then the three practices. Each one lands on top of the last as
   the card's story plays; the ones before stay stacked behind. */
const LEAD_IMG = '/images/case-studies/leadership';
const DECK = [
  { src: `${LEAD_IMG}/cover.webp`, alt: 'Design leadership: building the team behind the product' },
  { src: `${LEAD_IMG}/priority.webp`, alt: 'Making a priority actionable: frame, choose, own' },
  { src: `${LEAD_IMG}/critique.webp`, alt: 'Turning critique into a decision: show the reasoning, challenge the work, record the decision' },
  { src: `${LEAD_IMG}/coaching.webp`, alt: 'Coaching through the work: listen, practise, reflect' },
];
function TeamStage({ p }: { p: MotionValue<number> }) {
  const v = useStep(p);
  const cur = Math.min(DECK.length - 1, Math.floor(clamp01((v - 0.04) / 0.8) * DECK.length));
  return (
    <div className="absolute inset-0 grid place-items-center px-[5%]">
      <div className="relative w-full max-w-[680px] aspect-[3/2]">
        {DECK.map((d, i) => {
          const past = i < cur;
          const on = i === cur;
          const depth = cur - i;
          return (
            <img
              key={d.src}
              src={d.src}
              alt={on ? d.alt : ''}
              aria-hidden={!on}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover rounded-xl md:rounded-2xl transition-all duration-500 ease-out"
              style={{
                opacity: on ? 1 : past ? Math.max(0, 0.55 - depth * 0.18) : 0,
                transform: on
                  ? 'translateY(0) rotate(0deg) scale(1)'
                  : past
                    ? `translateY(${-depth * 4}%) rotate(${(i % 2 ? 1 : -1) * (2 + depth)}deg) scale(${1 - depth * 0.05})`
                    : 'translateY(8%) rotate(0deg) scale(0.96)',
                zIndex: i,
                boxShadow: on ? '0 40px 70px -30px rgba(0,0,0,0.85)' : 'none',
              }}
            />
          );
        })}
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
    ink: '#0343F8', // 6.9:1 on #F2F3EE
    cut: '#F2F3EE',
    filter: 'drop-shadow(0 1px 0 rgba(255,255,255,1)) drop-shadow(0 -1px 0 rgba(1,20,80,0.3))',
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
    <span className="text-[15px] md:text-base font-bold" style={{ color: e.ink }}>
      Leadership playbook
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
    // the illustrations' own paper, ink and royal blue
    bg: 'radial-gradient(ellipse 70% 80% at 88% 12%, rgba(3,67,248,0.10) 0%, transparent 60%), linear-gradient(160deg, #F2F3EE 0%, #E9E9E2 100%)',
    border: 'rgba(16,18,22,0.12)',
    kicker: '#55565E',
    ink: '#101216',
    sub: '#3F4048',
    lead: { bg: '#0343F8', ink: '#FFFFFF', sub: 'rgba(255,255,255,0.8)', border: 'transparent' },
    tile: { bg: '#FFFFFF', ink: '#101216', sub: '#55565E', border: 'rgba(16,18,22,0.14)' },
    btn: { bg: '#101216', ink: '#F2F3EE' },
    beatOn: '#0343F8',
    beatOff: 'rgba(16,18,22,0.14)',
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
            <h3 className="font-extrabold tracking-[-0.05em] leading-[0.95] max-w-[12ch]" style={{ fontSize: 'clamp(36px, 4.4vw, 80px)', color: th.ink }}>{copy.name}</h3>
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
            <div className="grid justify-items-start gap-3">
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
