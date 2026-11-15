import { motion } from 'motion/react';
import type { CSSProperties } from 'react';
import { ChevronDown, Info, ShieldCheck, Sparkles, Watch } from 'lucide-react';
import { AB, Btn, C, MODES, MODE_IDS, MONTHS, PRODUCTS, PROFIT, PageHead, Panel, SALES, StatusChip, type ModeId } from './SampoUI';

/* ── More Sampo screens ──────────────────────────────
   Screens from the approved and ready-for-development Figma
   pages that the flows above don't show: the A/B simulation
   with its walkthrough, a live strategy's details, and a
   product's performance page. Rebuilt in the same style as
   the production strategy screens. Figures are the boards'
   sample data, carried over from the screens above so the
   numbers agree from one screen to the next. */

const label: CSSProperties = { fontSize: 11.5, fontWeight: 600, color: C.faint };

function Dot({ color, size = 8 }: { color: string; size?: number }) {
  return <span style={{ width: size, height: size, borderRadius: '50%', background: color, flex: 'none', display: 'inline-block' }} />;
}

function ModePill({ id }: { id: ModeId }) {
  const m = MODES[id];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 999, background: m.bg, fontSize: 12, fontWeight: 700, color: C.ink }}>
      <Dot color={m.color} size={7} />
      {m.name}
    </span>
  );
}

/* ── A/B simulation ────────────────────────────────── */
// The store as it is today, worked back from each mode's estimate
// and its lift (56 units at +17% → 48 units).
const BASE = { units: 48, revenue: 4.3, profit: 1.8 };
const SERIES: { key: 'units' | 'revenue' | 'profit'; title: string; base: string; max: number; fmt: (v: number) => string }[] = [
  { key: 'units', title: 'Units sold', base: '48 units', max: 80, fmt: (v) => `${Math.round(v)}` },
  { key: 'revenue', title: 'Revenue', base: 'SAR 4.3k', max: 6.4, fmt: (v) => `SAR ${v.toFixed(1)}k` },
  { key: 'profit', title: 'Profit', base: 'SAR 1.8k', max: 2.6, fmt: (v) => `SAR ${v.toFixed(1)}k` },
];
const EST: Record<ModeId, { units: number; revenue: number; profit: number }> = {
  careful: { units: 56, revenue: 4.9, profit: 2.0 },
  balanced: { units: 64, revenue: 5.5, profit: 2.3 },
  high: { units: 72, revenue: 5.8, profit: 1.9 },
};
const ORDER: ModeId[] = ['careful', 'balanced', 'high'];

function EstChart({ s, delay }: { s: (typeof SERIES)[number]; delay: number }) {
  const bars: [string, string, number][] = [
    ['Today', C.normal, BASE[s.key]],
    ...ORDER.map((id) => [MODES[id].name, MODES[id].color, EST[id][s.key]] as [string, string, number]),
  ];
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.line}`, borderRadius: 12, padding: '14px 16px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
        <b style={{ fontSize: 13.5 }}>{s.title}</b>
        <span style={label}>today {s.base}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, alignItems: 'end', height: 150, borderBottom: `1px solid ${C.line}` }}>
        {bars.map(([n, color, v], i) => (
          <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: i ? C.ink : C.faint, marginBottom: 4, whiteSpace: 'nowrap' }}>{s.fmt(v)}</span>
            <motion.span
              initial={{ height: 0 }}
              whileInView={{ height: `${(v / s.max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: delay + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: '100%', maxWidth: 34, borderRadius: '6px 6px 0 0', background: i ? color : '#E4E2EE' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SimulationView({ coach = false }: { coach?: boolean }) {
  return (
    <div style={{ padding: 28, height: '100%', boxSizing: 'border-box', position: 'relative' }}>
      <PageHead kicker="Returning Visitor Discount · before anything goes live" title="A/B test simulation" right={<StatusChip s="Pending activation" />} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 14 }}>
        {ORDER.map((id) => {
          const m = MODES[id];
          return (
            <Panel key={id} style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <Dot color={m.color} />
                <b style={{ fontSize: 14 }}>{m.name}</b>
                {m.tag && <span style={{ marginLeft: 'auto', fontSize: 10.5, fontWeight: 800, color: '#9A6200', background: C.balancedBg, padding: '2px 8px', borderRadius: 999 }}>{m.tag}</span>}
              </div>
              <div style={{ fontSize: 12.5, color: C.sub, marginBottom: 10 }}>{m.line}</div>
              <div style={{ ...label, marginBottom: 6 }}>Applied criteria</div>
              {[
                `Reaches ${m.reach}% of shoppers`,
                `${m.discount}% discount`,
                `After ${m.views} product views`,
              ].map((t) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, marginBottom: 4 }}>
                  <Dot color={m.color} size={5} />
                  {t}
                </div>
              ))}
            </Panel>
          );
        })}
      </div>
      <div style={{ position: 'relative', zIndex: coach ? 12 : 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <b style={{ fontSize: 14 }}>Estimated results</b>
          <span style={{ fontSize: 12, color: coach ? '#fff' : C.sub }}>From your last 30 days of orders</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {SERIES.map((s, i) => (
            <EstChart key={s.key} s={s} delay={i * 0.12} />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }}>
        {[['Today', '#C9C6D9'] as const, ...ORDER.map((id) => [MODES[id].name, MODES[id].color] as const)].map(([n, c]) => (
          <span key={n} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 8, background: '#fff', border: `1px solid ${C.line}`, fontSize: 12 }}>
            <span style={{ width: 9, height: 9, borderRadius: 2, background: c }} />
            {n}
          </span>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '12px 28px', background: 'rgba(255,255,255,0.96)', borderTop: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.sub }}>
          <ShieldCheck size={16} color={C.careful} /> Estimates show a range from your own data, not a promise. The real test decides.
        </span>
        <Btn kind="secondary">Cancel</Btn>
        <Btn>Confirm & activate</Btn>
      </div>
      {coach && (
        <>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,18,43,0.55)', zIndex: 11 }} />
          <div
            style={{
              position: 'absolute',
              zIndex: 13,
              left: '50%',
              bottom: 74,
              transform: 'translateX(-50%)',
              width: 380,
              borderRadius: 14,
              background: C.indigo,
              color: '#fff',
              padding: '16px 18px',
              boxShadow: '0 24px 50px -20px rgba(20,18,43,.8)',
            }}
          >
            <span style={{ position: 'absolute', top: -7, left: '50%', width: 14, height: 14, background: C.indigo, transform: 'translateX(-50%) rotate(45deg)' }} />
            <b style={{ display: 'block', fontSize: 15, marginBottom: 6 }}>Review the estimated outcomes</b>
            <span style={{ display: 'block', fontSize: 13, lineHeight: 1.5, opacity: 0.88 }}>Each mode, side by side with your store today, based on the last 30 days.</span>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 14 }}>
              <span style={{ display: 'flex', gap: 4, flex: 1 }}>
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} style={{ width: i === 1 ? 18 : 6, height: 6, borderRadius: 3, background: i === 1 ? '#fff' : 'rgba(255,255,255,0.35)' }} />
                ))}
              </span>
              <span style={{ fontSize: 12, opacity: 0.7, marginRight: 12 }}>2 of 4</span>
              <Btn kind="secondary" style={{ height: 34, border: 'none' }}>
                Got it
              </Btn>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ── A live strategy's details ─────────────────────── */
export function LiveStrategyView() {
  const best = Math.max(...MODE_IDS.map((id) => AB[id][21]));
  return (
    <div style={{ padding: 28 }}>
      <PageHead kicker="Your strategies · strategy details" title="Returning Visitor Discount" right={<Btn kind="secondary" style={{ color: C.red }}>Disable strategy</Btn>} />
      <Panel style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr auto', alignItems: 'center', padding: '14px 20px', marginBottom: 12 }}>
        {[
          ['Pricing strategy', 'Returning Visitor Discount'],
          ['Products', '30 SKUs'],
          ['Started', '15 Mar 2024'],
        ].map(([k, v], i) => (
          <div key={k} style={{ paddingLeft: i ? 18 : 0, borderLeft: i ? `1px solid ${C.line}` : 'none' }}>
            <div style={label}>{k}</div>
            <b style={{ fontSize: 14 }}>{v}</b>
          </div>
        ))}
        <StatusChip s="Active" />
      </Panel>
      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 12, marginBottom: 12 }}>
        <Panel style={{ padding: 18 }}>
          <b style={{ fontSize: 14 }}>Applied mode</b>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: C.indigoBg, borderRadius: 10, padding: '10px 12px', margin: '10px 0 12px', fontSize: 12.5, lineHeight: 1.45 }}>
            <Info size={15} color={C.indigo} style={{ flex: 'none', marginTop: 1 }} />
            <span>Sampo applied this mode after the A/B test. It gave the best profit for its risk on your store.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, border: `1.5px solid ${C.balanced}`, background: C.balancedBg, marginBottom: 12 }}>
            <Dot color={C.balanced} size={12} />
            <span style={{ flex: 1 }}>
              <b style={{ display: 'block', fontSize: 14 }}>Balanced</b>
              <span style={{ fontSize: 12.5, color: C.sub }}>{MODES.balanced.line}</span>
            </span>
            <b style={{ fontSize: 13 }}>+{AB.balanced[21]}% revenue</b>
          </div>
          <div style={{ ...label, marginBottom: 6 }}>Want a different pace? Pick a mode to see its projected results first.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 38, padding: '0 12px', borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 13 }}>
            <Dot color={C.balanced} />
            <b>Balanced</b>
            <span style={{ fontSize: 11, color: C.faint, background: C.surf, padding: '2px 8px', borderRadius: 6 }}>Current</span>
            <ChevronDown size={16} color={C.sub} style={{ marginLeft: 'auto' }} />
          </div>
        </Panel>
        <Panel style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <b style={{ fontSize: 14 }}>Revenue lift by mode</b>
            <span style={label}>21-day A/B test</span>
          </div>
          <div style={{ marginTop: 16, display: 'grid', gap: 14 }}>
            {MODE_IDS.map((id, i) => (
              <div key={id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 6 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: id === 'balanced' ? 800 : 500 }}>
                    <Dot color={MODES[id].color} />
                    {MODES[id].name}
                    {id === 'balanced' && <span style={{ fontSize: 10.5, color: '#9A6200', background: C.balancedBg, padding: '1px 7px', borderRadius: 999 }}>Applied</span>}
                  </span>
                  <b>+{AB[id][21]}%</b>
                </div>
                <div style={{ height: 10, borderRadius: 5, background: C.surf }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(AB[id][21] / best) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 + i * 0.08 }}
                    style={{ height: '100%', borderRadius: 5, background: MODES[id].color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, fontSize: 12, color: C.sub, lineHeight: 1.5 }}>Compared with your normal prices on the same products, same days.</div>
        </Panel>
      </div>
      <Panel style={{ padding: '6px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '10px 0 8px' }}>
          <b style={{ fontSize: 14 }}>Products using this strategy</b>
          <span style={label}>30 products</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.1fr 0.8fr', fontSize: 11.5, color: C.faint, padding: '8px 0', borderBottom: `1px solid ${C.line}` }}>
          <span>Product</span>
          <span>Mode</span>
          <span>Conversion</span>
          <span style={{ textAlign: 'right' }}>Revenue lift</span>
        </div>
        {PRODUCTS.slice(0, 4).map(([name, sku, mode, from, to, lift]) => (
          <div key={sku} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.1fr 0.8fr', alignItems: 'center', fontSize: 13, padding: '9px 0', borderBottom: `1px solid ${C.line}` }}>
            <span>
              <b style={{ display: 'block' }}>{name}</b>
              <span style={{ fontSize: 11, color: C.faint }}>SKU {sku}</span>
            </span>
            <span>
              <ModePill id={mode} />
            </span>
            <span style={{ color: C.sub }}>
              {from} → <b style={{ color: C.ink }}>{to}</b>
            </span>
            <b style={{ textAlign: 'right', color: '#0E7A4E' }}>+{lift}%</b>
          </div>
        ))}
      </Panel>
    </div>
  );
}

/* ── A product's performance ───────────────────────── */
const FUNNEL: [string, string, number][] = [
  ['Sessions', '9.3K', 9300],
  ['Product views', '4.7K', 4700],
  ['Add to cart', '914', 914],
  ['Checkout', '872', 872],
  ['Purchase', '463', 463],
];

function Kpi({ k, v, note, tone }: { k: string; v: string; note: string; tone: 'up' | 'down' }) {
  return (
    <div>
      <div style={label}>{k}</div>
      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', margin: '2px 0' }}>{v}</div>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: tone === 'up' ? '#0E7A4E' : C.red }}>{note}</div>
    </div>
  );
}

export function ProductView() {
  const top = Math.max(...SALES);
  const mo = 9; // October, the board's tooltip
  const fw = 520;
  const fh = 110;
  const step = fw / FUNNEL.length;
  const hgt = (n: number) => 14 + (Math.log(n) / Math.log(9300)) ** 3 * (fh - 14);
  // a flat run under each stage, eased into the next one
  const q = step * 0.25;
  const half = FUNNEL.map(([, , n]) => hgt(n) / 2);
  let band = `M0,${fh / 2 - half[0]}`;
  half.forEach((hh, i) => {
    const yy = fh / 2 - hh;
    if (i) band += ` C${i * step},${fh / 2 - half[i - 1]} ${i * step},${yy} ${i * step + q},${yy}`;
    band += ` L${i === half.length - 1 ? fw : (i + 1) * step - q},${yy}`;
  });
  band += ` L${fw},${fh / 2 + half[half.length - 1]}`;
  for (let i = half.length - 1; i >= 0; i--) {
    const yy = fh / 2 + half[i];
    band += ` L${i ? i * step + q : 0},${yy}`;
    if (i) band += ` C${i * step},${yy} ${i * step},${fh / 2 + half[i - 1]} ${i * step - q},${fh / 2 + half[i - 1]}`;
  }
  band += ' Z';
  return (
    <div style={{ padding: 28 }}>
      <PageHead
        kicker="Products · Electronics"
        title="Watch Series 7"
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ModePill id="balanced" />
            <StatusChip s="Active" />
          </div>
        }
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 0.9fr', gap: 12, marginBottom: 12 }}>
        <Panel style={{ padding: '14px 16px' }}>
          <Kpi k="Sales in October" v={`SAR ${SALES[mo].toLocaleString('en-US')}`} note="Best month this year" tone="up" />
        </Panel>
        <Panel style={{ padding: '14px 16px' }}>
          <Kpi k="Gross profit in October" v={`SAR ${PROFIT[mo].toLocaleString('en-US')}`} note={`${Math.round((PROFIT[mo] / SALES[mo]) * 100)}% margin`} tone="up" />
        </Panel>
        <Panel style={{ padding: '14px 16px' }}>
          <Kpi k="Conversion" v="3.6%" note="Up from 2.9% before the strategy" tone="up" />
        </Panel>
        <Panel style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 46, height: 46, borderRadius: 12, background: C.surf, display: 'grid', placeItems: 'center' }}>
            <Watch size={24} color={C.ink} />
          </span>
          <span>
            <b style={{ display: 'block', fontSize: 13.5 }}>Watch Series 7</b>
            <span style={{ fontSize: 11, color: C.faint, whiteSpace: 'nowrap' }}>OG-01500ML-006</span>
          </span>
        </Panel>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: 12, marginBottom: 12 }}>
        <Panel style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <b style={{ fontSize: 14 }}>Profitability</b>
            <span style={label}>Sales and gross profit by month</span>
          </div>
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 6, alignItems: 'end', height: 150 }}>
            {SALES.map((v, i) => (
              <div key={MONTHS[i]} style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                <div style={{ width: '100%', height: `${(v / top) * 100}%`, borderRadius: 4, background: i === mo ? '#DCD9FB' : '#ECEBF5', position: 'relative' }}>
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: `${(PROFIT[i] / v) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.03 }}
                    style={{ position: 'absolute', left: 0, right: 0, bottom: 0, borderRadius: 4, background: i === mo ? C.indigo : '#A9A4F2' }}
                  />
                </div>
              </div>
            ))}
            <div style={{ position: 'absolute', right: 0, top: -4, background: C.ink, color: '#fff', borderRadius: 8, padding: '6px 10px', fontSize: 11, lineHeight: 1.5 }}>
              <b>October</b>
              <br />
              Sales SAR 12,900 · Profit SAR 5,900
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 6, marginTop: 6 }}>
            {MONTHS.map((m, i) => (
              <span key={m} style={{ fontSize: 10, textAlign: 'center', color: i === mo ? C.ink : C.faint, fontWeight: i === mo ? 700 : 500 }}>
                {m}
              </span>
            ))}
          </div>
        </Panel>
        <Panel style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <b style={{ fontSize: 14 }}>Product page funnel</b>
            <span style={label}>Last 30 days</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${FUNNEL.length}, 1fr)`, marginBottom: 8 }}>
            {FUNNEL.map(([k, v], i) => (
              <div key={k} style={{ paddingLeft: 8, borderLeft: `1px solid ${C.line}`, background: i === 2 ? C.indigoBg : 'transparent', borderRadius: i === 2 ? 6 : 0, padding: '4px 8px' }}>
                <div style={{ fontSize: 10.5, color: i === 2 ? C.indigo : C.faint, fontWeight: 600 }}>{k}</div>
                <b style={{ fontSize: 16 }}>{v}</b>
              </div>
            ))}
          </div>
          <svg viewBox={`0 0 ${fw} ${fh}`} width="100%" height={fh} preserveAspectRatio="none" style={{ display: 'block' }}>
            <defs>
              <linearGradient id="smp-funnel" x1="0" x2="1">
                <stop offset="0" stopColor="#C9C5FA" />
                <stop offset="1" stopColor={C.indigo} />
              </linearGradient>
            </defs>
            <path d={band} fill="url(#smp-funnel)" opacity={0.9} />
          </svg>
          <div style={{ fontSize: 12, color: C.sub, marginTop: 6 }}>
            Most shoppers leave before adding to cart. That is where the returning-visitor offer meets them.
          </div>
        </Panel>
      </div>
      <Panel style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px' }}>
        <span style={{ width: 38, height: 38, borderRadius: 10, background: C.indigoBg, color: C.indigo, display: 'grid', placeItems: 'center' }}>
          <Sparkles size={18} />
        </span>
        <span style={{ flex: 1 }}>
          <b style={{ display: 'block', fontSize: 14 }}>Pricing strategy on this product</b>
          <span style={{ fontSize: 12.5, color: C.sub }}>Returning Visitor Discount, Balanced mode. 15% off for shoppers who viewed it twice without buying.</span>
        </span>
        <b style={{ fontSize: 13, color: '#0E7A4E', marginRight: 8 }}>+21% revenue</b>
        <Btn kind="secondary">View strategy</Btn>
      </Panel>
    </div>
  );
}
