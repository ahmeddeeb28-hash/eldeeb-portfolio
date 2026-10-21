import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { FUNNEL, FUNNEL_GUIDE, HEAT, NAVY, SKY, STATUS, TEAL, TILES, VIOLET, type Quarter } from './ReportData';

/* ── Report UI ───────────────────────────────────────
   The usability report rebuilt as live pieces: a funnel that
   pours from 34,860 shoppers down to Discover, conversion tiles
   with a quarter switch, and a heatmap reel that pushes the camera
   into each screen's hot spot. */

const IMG = '/images/case-studies/sary-report';
const fmt = (n: number) => n.toLocaleString('en-US');

/* A real funnel: each step is a band as wide as its share (on a
   square-root scale, so Discover's 9.6% stays readable), and dots
   pour in at the top. At every step some drift out through the side,
   in the same proportions as the shoppers who left there; about one
   in ten reaches Discover. Hover or tap a step for its drop-off. */
const ROW = 76;
const GAP = 6;
const wOf = (pct: number) => 46 + 54 * Math.sqrt(pct / 100); // % of width

function useDrops(count: number) {
  // where each dot leaves: 0..n-1 is the step it drops out after, n means it reached the end
  return useState(() => {
    const out: number[] = [];
    for (let d = 0; d < count; d++) {
      const share = (d + 0.5) / count; // spread evenly through 0..1
      // passes step k+1 while its share is inside the shoppers who reached it
      let k = 0;
      while (k < FUNNEL.length - 1 && share >= 1 - FUNNEL[k + 1].pct / 100) k++;
      out.push(k === FUNNEL.length - 1 ? FUNNEL.length : k);
    }
    // the order they fall in should look random, but stay the same every render
    return out.map((v, i) => ({ v, r: ((i * 7919) % 97) / 97 - 0.5, delay: ((i * 37) % count) * 0.22 }));
  })[0];
}

export function Funnel() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: '-15% 0px' });
  const reduced = useReducedMotion();
  const [sel, setSel] = useState(0);
  const held = useRef(false); // a visitor picked a step: stop the tour
  const drops = useDrops(28);
  const n = FUNNEL.length;
  const H = n * ROW + (n - 1) * GAP;
  const widths = FUNNEL.map((f) => wOf(f.pct));
  const wAt = (i: number) => (i < n ? widths[i] : widths[n - 1] * 0.86);
  const yTop = (i: number) => i * (ROW + GAP);

  // walk through the steps once the funnel is in view
  useEffect(() => {
    if (!seen || reduced) return;
    const t = window.setInterval(() => {
      if (!held.current) setSel((x) => (x + 1) % n);
    }, 4200);
    return () => window.clearInterval(t);
  }, [seen, reduced, n]);
  const pick = (i: number) => {
    held.current = true;
    setSel(i);
  };

  const f = FUNNEL[sel];
  const g = FUNNEL_GUIDE[sel];
  const st = STATUS[g.status];
  const prev = sel > 0 ? FUNNEL[sel - 1] : null;
  const kept = prev ? (f.n / prev.n) * 100 : 100;

  return (
    <div ref={ref} className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-8 lg:gap-10 items-center">
      <div>
        <div className="relative" style={{ height: H + 40 }}>
          {FUNNEL.map((x, i) => {
            const t = wAt(i);
            const btm = wAt(i + 1);
            const L1 = (100 - t) / 2;
            const L2 = (100 - btm) / 2;
            const on = sel === i;
            const s2 = STATUS[FUNNEL_GUIDE[i].status];
            return (
              <motion.button
                key={x.k}
                type="button"
                onMouseEnter={() => pick(i)}
                onFocus={() => pick(i)}
                onClick={() => pick(i)}
                aria-pressed={on}
                aria-label={`${x.k}: ${fmt(x.n)}, ${s2.label}`}
                className="absolute left-0 right-0 grid place-items-center text-center cursor-pointer"
                style={{
                  top: yTop(i),
                  height: ROW,
                  clipPath: `polygon(${L1}% 0, ${100 - L1}% 0, ${100 - L2}% 100%, ${L2}% 100%)`,
                  background: `linear-gradient(180deg, ${s2.color}, ${s2.deep})`,
                }}
                initial={{ opacity: 0, y: -14 }}
                animate={seen ? { opacity: on ? 1 : 0.6, y: 0 } : { opacity: 0, y: -14 }}
                transition={{ duration: 0.5, delay: seen ? i * 0.12 : 0, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="leading-tight px-2">
                  <span className="block text-[11px] sm:text-xs font-semibold text-white/85">{x.k}</span>
                  <span className="block text-base sm:text-xl font-bold text-white tabular-nums">
                    {fmt(x.n)} <span className="text-white/75 text-xs sm:text-sm font-semibold">· <Rate v={x.pct} run={seen} delay={i * 180} /></span>
                  </span>
                </span>
              </motion.button>
            );
          })}

          {/* the dots: pour in, filter out at the sides, a few reach the end */}
          {seen && !reduced && (
            <div aria-hidden className="absolute inset-0 pointer-events-none">
              {drops.map((d, i) => {
                const side = d.r < 0 ? -1 : 1;
                const stops: { x: number; y: number }[] = [];
                const last = Math.min(d.v, n - 1);
                for (let k = 0; k <= last + 1; k++) stops.push({ x: 50 + d.r * wAt(k) * 0.8, y: k <= n - 1 ? yTop(k) : H });
                const end =
                  d.v >= n
                    ? { x: 50 + d.r * 10, y: H + 34 } // through the bottom
                    : { x: 50 + side * (wAt(d.v + 1) / 2 + 9), y: yTop(d.v) + ROW * 0.9 }; // out through the side
                const pts = [...stops.slice(0, d.v >= n ? stops.length : last + 1), end];
                return (
                  <motion.span
                    key={i}
                    className="absolute w-2 h-2 -ml-1 -mt-1 rounded-full"
                    style={{ background: '#fff', border: `1.5px solid ${NAVY}`, boxShadow: d.v >= n ? `0 0 10px ${TEAL}` : 'none' }}
                    initial={{ left: `${pts[0].x}%`, top: -18, opacity: 0 }}
                    animate={{
                      left: [`${pts[0].x}%`, ...pts.map((p) => `${p.x}%`)],
                      top: [-18, ...pts.map((p) => p.y)],
                      opacity: [0, ...pts.map((_, k) => (k === pts.length - 1 ? 0 : 1))],
                    }}
                    transition={{ duration: 1.1 + pts.length * 0.55, delay: 0.8 + d.delay, repeat: Infinity, repeatDelay: 1.2, ease: 'easeIn' }}
                  />
                );
              })}
            </div>
          )}
        </div>
        {/* what the colors mean */}
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-1">
          {Object.values(STATUS).map((x) => (
            <li key={x.label} className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: '#5B6478' }}>
              <span className="w-2.5 h-2.5 rounded-[3px]" style={{ background: x.color }} />
              {x.label}
            </li>
          ))}
        </ul>
      </div>

      {/* the guide for the selected step */}
      <div className="rounded-[20px] bg-white p-5 md:p-6 border min-h-[300px]" style={{ borderColor: '#E3ECF5' }} aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={sel}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="text-lg font-bold" style={{ color: NAVY }}>
                {f.k}
              </p>
              <span className="text-[11px] font-semibold rounded-full px-2.5 py-1 whitespace-nowrap" style={{ background: `${st.color}1F`, color: st.deep }}>
                {st.label}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-bold tabular-nums" style={{ color: NAVY }}>
                {fmt(f.n)}
              </span>
              <span className="text-sm font-semibold" style={{ color: '#5B6478' }}>
                {f.pct}% of all shoppers
              </span>
            </div>
            {prev && (
              <div className="mt-3 mb-4">
                <div className="flex justify-between text-xs mb-1.5" style={{ color: '#5B6478' }}>
                  <span>
                    {kept.toFixed(1)}% of {prev.k.toLowerCase()} kept going
                  </span>
                  <span className="font-semibold" style={{ color: '#C2410C' }}>
                    {fmt(prev.n - f.n)} left
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: '#FDE7D7' }}>
                  <motion.div className="h-full rounded-full" style={{ background: st.color }} initial={{ width: 0 }} animate={{ width: `${kept}%` }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} />
                </div>
              </div>
            )}
            <dl className="grid gap-3 mt-4 text-[13px] leading-relaxed">
              <div>
                <dt className="font-semibold mb-0.5" style={{ color: NAVY }}>
                  What it counts
                </dt>
                <dd style={{ color: '#5B6478' }}>{g.counts}</dd>
              </div>
              <div>
                <dt className="font-semibold mb-0.5" style={{ color: NAVY }}>
                  What we saw
                </dt>
                <dd style={{ color: '#5B6478' }}>{g.saw}</dd>
              </div>
              {g.did && (
                <div className="rounded-xl px-3 py-2.5" style={{ background: `${st.color}14` }}>
                  <dt className="font-semibold mb-0.5" style={{ color: st.deep }}>
                    The fix
                  </dt>
                  <dd style={{ color: '#3D4659' }}>{g.did}</dd>
                </div>
              )}
            </dl>
          </motion.div>
        </AnimatePresence>
        {/* step dots for the tour */}
        <div className="flex gap-1.5 mt-5" role="tablist" aria-label="Funnel steps">
          {FUNNEL.map((x, i) => (
            <button
              key={x.k}
              type="button"
              role="tab"
              aria-selected={i === sel}
              aria-label={x.k}
              onClick={() => pick(i)}
              className="h-1.5 flex-1 rounded-full transition-colors"
              style={{ background: i === sel ? STATUS[FUNNEL_GUIDE[i].status].color : '#E3ECF5' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* CountUp works in whole numbers, so rates are counted in hundredths */
export function Rate({ v, run, delay = 0 }: { v: number; run: boolean; delay?: number }) {
  const [n, setN] = useState(v * 100);
  useEffect(() => {
    if (!run) return setN(v * 100);
    let raf = 0;
    const start = performance.now() + delay;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / 900));
      setN(v * 100 * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [v, run, delay]);
  const val = n / 100;
  return <>{val >= 10 ? val.toFixed(1) : val.toFixed(2)}%</>;
}

export function ConversionTiles() {
  const [q, setQ] = useState<Quarter>('Q4');
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: '-15% 0px' });
  return (
    <div ref={ref}>
      <div className="inline-flex rounded-full p-1 mb-6 bg-white/5 border border-white/10" role="tablist" aria-label="Quarter">
        {(['Q3', 'Q4'] as Quarter[]).map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={q === k}
            onClick={() => setQ(k)}
            className={`px-5 py-1.5 rounded-full text-xs font-bold transition-colors ${q === k ? 'bg-white text-black' : 'text-white/55 hover:text-white'}`}
          >
            {k} {k === 'Q3' ? 'Jul to Sep' : 'Oct to Dec'}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {TILES.map((t, i) => {
          const cur = t.q[q];
          const other = t.q[q === 'Q4' ? 'Q3' : 'Q4'];
          const delta = cur && other ? cur[0] - other[0] : null;
          return (
            <div key={t.k} className="rounded-[22px] bg-white p-6 text-[#0F1B3D] relative overflow-hidden">
              <p className="text-xs font-bold" style={{ color: NAVY }}>
                {t.k}
              </p>
              <p className="text-[13px] text-[#5B6478] mt-1 mb-5">{t.line}</p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={q} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                  {cur ? (
                    <>
                      <div className="flex items-baseline gap-3">
                        <b className="text-5xl font-semibold tracking-[-0.03em] tabular-nums">
                          <Rate v={cur[0]} run={seen} delay={i * 150} />
                        </b>
                        {delta !== null && q === 'Q4' && (
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${delta < 0 ? 'bg-[#FDECEE] text-[#D92D3A]' : 'bg-[#E6F6EE] text-[#0E7A4E]'}`}>
                            {delta > 0 ? '+' : ''}
                            {delta.toFixed(1)} pts vs Q3
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-[#5B6478] mt-1">{cur[1]} shoppers</p>
                      <div className="mt-5 h-2 rounded-full bg-[#EEF2F7] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: q === 'Q4' ? SKY : VIOLET }}
                          initial={{ width: 0 }}
                          animate={{ width: seen ? `${cur[0]}%` : 0 }}
                          transition={{ duration: 0.8, delay: 0.1 + i * 0.12 }}
                        />
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-[#5B6478] py-6">Sliders launched in Q4, so there is no Q3 figure.</p>
                  )}
                </motion.div>
              </AnimatePresence>
              {t.best && (
                <div className="mt-5 pt-4 border-t border-[#EEF2F7] flex items-center justify-between text-[13px]">
                  <span className="font-bold text-[#D92D3A] text-xs">{t.best[0]}</span>
                  <span>
                    <b>{t.best[1]}%</b> <span className="text-[#5B6478]">{t.best[2]}</span>
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* the heatmaps as a reel: the camera pushes into each hot spot */
export function HeatReel({ accent = TEAL, ms = 3200 }: { accent?: string; ms?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-15% 0px' });
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const run = inView && !reduced;
  useEffect(() => {
    if (!run) return;
    const t = setTimeout(() => setI((n) => (n + 1) % HEAT.length), ms);
    return () => clearTimeout(t);
  }, [i, run, ms]);
  const h = HEAT[i];
  return (
    <div ref={ref} className="grid md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] gap-8 md:gap-12 items-center">
      <div className="relative mx-auto w-full max-w-[300px] aspect-[318/636] rounded-[36px] overflow-hidden bg-black">
        {HEAT.map((x, n) => (
          <motion.img
            key={x.img}
            src={`${IMG}/${x.img}.webp`}
            alt={`${x.t} heatmap`}
            loading="lazy"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transformOrigin: `${x.fx}% ${x.fy}%` }}
            initial={false}
            animate={{ opacity: n === i ? 1 : 0, scale: n === i && run ? 1.35 : 1 }}
            transition={{ opacity: { duration: 0.5 }, scale: n === i && run ? { duration: ms / 1000 - 0.4, delay: 0.4, ease: [0.45, 0, 0.2, 1] } : { duration: 0.5 } }}
          />
        ))}
      </div>
      <div>
        <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Screens">
          {HEAT.map((x, n) => (
            <button
              key={x.img}
              type="button"
              role="tab"
              aria-selected={n === i}
              onClick={() => setI(n)}
              className={`rounded-full px-4 py-2 text-xs font-bold border transition-colors ${n === i ? 'bg-white text-black border-white' : 'border-white/15 text-white/60 hover:text-white'}`}
            >
              {x.t}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={h.t}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="text-white text-xl md:text-2xl font-semibold leading-snug tracking-tight"
          >
            {h.d}
          </motion.p>
        </AnimatePresence>
        <div className="flex items-center gap-4 mt-8 text-xs text-white/50">
          <span className="h-2 w-28 rounded-full" style={{ background: 'linear-gradient(90deg, #1E3A8A, #22C55E, #EF4444)' }} />
          Fewer clicks → more clicks
        </div>
        <div className="flex gap-1.5 mt-6">
          {HEAT.map((x, n) => (
            <span key={x.img} className="relative flex-1 h-[3px] rounded-full bg-white/10 overflow-hidden">
              {n < i && <span className="absolute inset-0" style={{ background: accent }} />}
              {n === i && run && (
                <motion.span
                  key={`${i}`}
                  className="absolute inset-0 origin-left"
                  style={{ background: accent }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: ms / 1000, ease: 'linear' }}
                />
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
