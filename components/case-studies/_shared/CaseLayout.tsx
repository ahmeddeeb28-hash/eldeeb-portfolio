import { motion, useInView } from 'motion/react';
import { useRef, type ReactNode } from 'react';
import { reveal } from './CaseBits';
import { CountUp } from './CountUp';

/* ── Shared case-study layout pieces ─────────────────
   CaseIntro: the opening, with the facts (company, role, year) in
   a narrow column on the left and the headline and context on
   the right. On phones the headline comes first.

   LeadStats: the result that matters most, large and bold, with
   the others listed beside it. Whole numbers count up once in view;
   anything else ("14.5s") shows as written.

   Takeaway: the closing thought in a panel lit by the study's
   accent, with a large quote mark. No patterns or cards. */

export function CaseIntro({ meta, title, children }: { meta: [string, string][]; title: ReactNode; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,2.6fr)] gap-12 md:gap-20 mb-16 [--intro-w:calc(100vw-48px)] md:[--intro-w:min(1440px,calc(100vw-128px))]"
      // wider than the reading column: spans the page with a side gutter
      style={{ width: 'var(--intro-w)', marginLeft: 'calc(50% - var(--intro-w) / 2)' }}
    >
      <dl className="order-2 md:order-1 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-x-8 gap-y-6 content-start pt-8 md:pt-0 border-t border-white/10 md:border-0">
        {meta.map(([label, value]) => (
          <div key={label}>
            <dt className="text-white/40 text-xs mb-1.5">{label}</dt>
            <dd className="text-white text-base md:text-lg font-medium leading-snug">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="order-1 md:order-2">
        <h1 className="text-white text-5xl md:text-7xl font-semibold mb-8 leading-[0.95] tracking-[-0.04em]">{title}</h1>
        <div className="grid gap-6 text-lg md:text-xl leading-relaxed text-white/55 [&>p:first-child]:text-white/75">{children}</div>
      </div>
    </motion.div>
  );
}

function Num({ v, run, delay = 0 }: { v: string; run: boolean; delay?: number }) {
  const m = v.match(/^([^0-9]*)([0-9]+)([^0-9.].*|)$/);
  if (!m) return <>{v}</>;
  return (
    <>
      {m[1]}
      <CountUp from={0} to={parseInt(m[2], 10)} run={run} ms={1200} delay={delay} />
      {m[3]}
    </>
  );
}

export type Stat = { v: string; k: string };

export function LeadStats({ lead, note, rest, accent }: { lead: Stat; note?: string; rest: Stat[]; accent: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: '-15% 0px' });
  const sign = lead.v.match(/^[+−-]/)?.[0];
  return (
    <motion.div ref={ref} {...reveal} className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 md:gap-16 items-center mb-20">
      <div>
        <p className="text-white font-bold tracking-[-0.05em] leading-none tabular-nums" style={{ fontSize: 'clamp(72px, 9vw, 112px)' }}>
          {sign && <span style={{ color: accent }}>{sign}</span>}
          <Num v={sign ? lead.v.slice(sign.length) : lead.v} run={seen} />
        </p>
        <p className="text-white text-lg md:text-xl font-medium mt-4">{lead.k}</p>
        {note && <p className="text-white/50 text-sm md:text-base mt-1">{note}</p>}
      </div>
      <ul className="grid gap-5 md:border-l md:border-white/10 md:pl-12">
        {rest.map((x, i) => (
          <li key={x.k} className="flex items-baseline gap-4">
            <span className="text-white text-3xl font-semibold tracking-[-0.03em] tabular-nums min-w-[4.5ch] flex-none">
              <Num v={x.v} run={seen} delay={150 + i * 120} />
            </span>
            <span className="text-white/55 text-base">{x.k}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function Takeaway({ accent, deep, label = 'What I carry forward', children, note }: { accent: string; deep: string; label?: string; children: ReactNode; note?: ReactNode }) {
  return (
    <motion.div
      {...reveal}
      className="relative overflow-hidden rounded-[28px] border border-white/[0.07] px-7 py-10 md:px-14 md:py-16"
      style={{
        background: `radial-gradient(ellipse 60% 90% at 88% 10%, ${accent}2E 0%, transparent 60%), radial-gradient(ellipse 50% 70% at 0% 100%, ${deep}55 0%, transparent 65%), #0F1117`,
      }}
    >
      <span aria-hidden className="absolute right-6 md:right-12 -top-6 md:-top-10 text-[160px] md:text-[240px] leading-none font-semibold select-none" style={{ color: `${accent}26` }}>
        “
      </span>
      <div className="relative max-w-3xl">
        <p className="text-white/45 text-sm mb-4">{label}</p>
        <div className="text-white text-2xl md:text-4xl font-semibold leading-snug tracking-[-0.02em]">{children}</div>
        {note && <div className="text-white/45 text-[15px] leading-relaxed mt-8">{note}</div>}
      </div>
    </motion.div>
  );
}
