import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import {
  Archive,
  Check,
  ChevronDown,
  Eye,
  LayoutDashboard,
  Package,
  Settings,
  ShieldCheck,
  Sparkles,
  Tag,
  TriangleAlert,
  Trophy,
  Undo2,
  Zap,
} from 'lucide-react';

/* ── Sampo UI ────────────────────────────────────────
   The merchant dashboard screens from the Sampo boards,
   rebuilt in code so visitors can use them: expand a
   strategy, pick a mode, confirm, watch the test, change
   or disable it. `data-f` marks the parts the case study's
   focus films click and zoom to. Everything is laid out on a fixed desktop
   canvas and scaled to the width it is given, so it reads
   as a real 1440 dashboard on any screen. All figures are
   the boards' sample data. */

export const C = {
  ink: '#14122B',
  sub: '#5E5B78',
  faint: '#9A97B3',
  line: '#E9E7F3',
  surf: '#F6F5FB',
  card: '#FFFFFF',
  indigo: '#4338CA',
  indigo2: '#5B54F0',
  indigoBg: '#EEEDFE',
  careful: '#16A36A',
  carefulBg: '#E6F6EE',
  balanced: '#E59A12',
  balancedBg: '#FDF3DF',
  high: '#4F46E5',
  highBg: '#ECEBFF',
  normal: '#A8A6BD',
  red: '#D92D3A',
  redBg: '#FDECEE',
};

const ui = 'Inter, system-ui, -apple-system, sans-serif';

export type ModeId = 'careful' | 'balanced' | 'high';

export const MODES: Record<
  ModeId,
  {
    name: string;
    line: string;
    discount: number;
    risk: string;
    reach: number;
    views: number;
    color: string;
    bg: string;
    est: { units: [number, string]; revenue: [number, string]; profit: [number, string] };
    tag?: string;
  }
> = {
  careful: {
    name: 'Careful',
    line: 'Small, safe nudges',
    discount: 10,
    risk: 'Low risk',
    reach: 15,
    views: 3,
    color: C.careful,
    bg: C.carefulBg,
    est: { units: [17, '56 units'], revenue: [14, 'SAR 4.9k'], profit: [14, 'SAR 2.0k'] },
  },
  balanced: {
    name: 'Balanced',
    line: 'Steady growth, best profit',
    discount: 15,
    risk: 'Medium risk',
    reach: 25,
    views: 2,
    color: C.balanced,
    bg: C.balancedBg,
    est: { units: [33, '64 units'], revenue: [28, 'SAR 5.5k'], profit: [25, 'SAR 2.3k'] },
    tag: 'Recommended',
  },
  high: {
    name: 'High Impact',
    line: 'Bigger discounts, more reach',
    discount: 20,
    risk: 'High risk',
    reach: 40,
    views: 2,
    color: C.high,
    bg: C.highBg,
    est: { units: [50, '72 units'], revenue: [35, 'SAR 5.8k'], profit: [8, 'SAR 1.9k'] },
  },
};
export const MODE_IDS: ModeId[] = ['careful', 'balanced', 'high'];

/* ── Desktop frame ─────────────────────────────────── */
export function DesktopFrame({
  children,
  canvasH,
  url = 'app.sampo.ai/pricing-strategies',
  active = 'strategies',
  canvasW = 1180,
  className,
  style,
}: {
  children: ReactNode;
  canvasH: number;
  url?: string;
  active?: 'dashboard' | 'strategies' | 'products' | 'yours';
  canvasW?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const total = canvasH + 40;
  const s = w ? w / canvasW : 0;
  return (
    <div ref={ref} className={className} style={{ width: '100%', height: s ? total * s : undefined, aspectRatio: s ? undefined : `${canvasW} / ${total}`, ...style }}>
      {s > 0 && (
        <div
          style={{
            width: canvasW,
            height: total,
            transform: `scale(${s})`,
            transformOrigin: '0 0',
            borderRadius: 14,
            overflow: 'hidden',
            background: C.surf,
            boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 40px 80px -30px rgba(0,0,0,0.7)',
            fontFamily: ui,
            color: C.ink,
            position: 'relative',
          }}
        >
          {/* browser chrome */}
          <div style={{ height: 40, background: '#1B1838', display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px' }}>
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
              <span key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />
            ))}
            <span
              style={{
                marginLeft: 18,
                height: 24,
                flex: '0 1 380px',
                borderRadius: 7,
                background: 'rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.55)',
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
              }}
            >
              {url}
            </span>
          </div>
          <div style={{ display: 'flex', height: canvasH }}>
            <Sidebar active={active} />
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>{children}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function SampoMark({ size = 28 }: { size?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: `linear-gradient(135deg, ${C.indigo2}, ${C.indigo})`,
        display: 'grid',
        placeItems: 'center',
        color: '#fff',
        fontWeight: 900,
        fontSize: size * 0.55,
        fontStyle: 'italic',
        flex: 'none',
      }}
    >
      S
    </span>
  );
}

function Sidebar({ active }: { active: string }) {
  const items: [string, string, ReactNode][] = [
    ['dashboard', 'Dashboard', <LayoutDashboard key="d" size={17} />],
    ['strategies', 'Pricing strategies', <Sparkles key="s" size={17} />],
    ['products', 'Products', <Package key="p" size={17} />],
    ['yours', 'Your strategies', <Archive key="y" size={17} />],
    ['settings', 'Settings', <Settings key="t" size={17} />],
  ];
  return (
    <div style={{ width: 210, background: '#fff', borderRight: `1px solid ${C.line}`, padding: '20px 14px', flex: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 22px' }}>
        <SampoMark />
        <b style={{ fontSize: 15, letterSpacing: '0.12em' }}>SAMPO AI</b>
      </div>
      {items.map(([id, label, icon]) => (
        <div
          key={id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 10px',
            borderRadius: 9,
            fontSize: 13.5,
            fontWeight: id === active ? 700 : 500,
            color: id === active ? C.indigo : C.sub,
            background: id === active ? C.indigoBg : 'transparent',
            marginBottom: 2,
          }}
        >
          {icon}
          {label}
        </div>
      ))}
      <div style={{ marginTop: 28, padding: '14px 12px', borderRadius: 12, background: C.surf, fontSize: 12, color: C.sub, lineHeight: 1.5 }}>
        <b style={{ display: 'block', color: C.ink, marginBottom: 4 }}>Khalifah Store</b>
        Saudi Arabia · SAR
      </div>
    </div>
  );
}

/* ── small parts ───────────────────────────────────── */
export function Btn({
  children,
  kind = 'primary',
  onClick,
  style,
  f,
}: {
  children: ReactNode;
  kind?: 'primary' | 'secondary' | 'link' | 'danger';
  onClick?: () => void;
  style?: CSSProperties;
  f?: string;
}) {
  const k: Record<string, CSSProperties> = {
    primary: { background: C.indigo, color: '#fff', boxShadow: '0 8px 18px -10px rgba(67,56,202,.8)' },
    secondary: { background: '#fff', color: C.ink, border: `1px solid ${C.line}` },
    link: { background: 'transparent', color: C.indigo, padding: '0 4px' },
    danger: { background: C.red, color: '#fff' },
  };
  return (
    <button
      type="button"
      data-f={f}
      onClick={onClick}
      style={{
        height: 38,
        padding: '0 16px',
        borderRadius: 10,
        border: 'none',
        fontFamily: ui,
        fontSize: 13.5,
        fontWeight: 700,
        cursor: onClick ? 'pointer' : 'default',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        whiteSpace: 'nowrap',
        ...k[kind],
        ...style,
      }}
    >
      {children}
    </button>
  );
}

const CHIP: Record<string, [string, string]> = {
  'Not active': ['#F1F0F7', C.sub],
  'Pending activation': [C.balancedBg, '#9A6200'],
  'A/B testing': [C.indigoBg, C.indigo],
  Active: [C.carefulBg, '#0E7A4E'],
  Completed: ['#E8F1FD', '#1F5FB8'],
  Paused: ['#EEF0F4', '#4A5468'],
  Archived: ['#EEF0F4', '#4A5468'],
  Disabled: [C.redBg, C.red],
};
export function StatusChip({ s }: { s: keyof typeof CHIP }) {
  const [bg, fg] = CHIP[s];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: bg, color: fg, fontSize: 12, fontWeight: 700 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: fg }} />
      {s}
    </span>
  );
}

function PageHead({ kicker, title, right }: { kicker: string; title: string; right?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18 }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.faint, marginBottom: 4 }}>{kicker}</div>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em' }}>{title}</div>
      </div>
      {right}
    </div>
  );
}

function Panel({ children, style, f }: { children: ReactNode; style?: CSSProperties; f?: string }) {
  return (
    <div data-f={f} style={{ background: '#fff', border: `1px solid ${C.line}`, borderRadius: 14, ...style }}>
      {children}
    </div>
  );
}

/* ── Rung 01 · Understand ──────────────────────────── */
const STRATEGIES = [
  {
    id: 'rvd',
    name: 'Returning Visitor Discount',
    line: 'Shoppers who view a product twice without buying get 15% off on their next visit.',
    trigger: '2 product views, no purchase',
    action: '15% off, only for that shopper',
    outcome: 'More returning visitors buy',
    products: 30,
    icon: <Eye size={18} />,
  },
  {
    id: 'lsu',
    name: 'Low-Stock Urgency',
    line: 'When stock runs low, prices hold firm and the product page shows what is left.',
    trigger: 'Fewer than 10 units in stock',
    action: 'Pause discounts, show stock left',
    outcome: 'Last units sell at full margin',
    products: 12,
    icon: <Zap size={18} />,
  },
  {
    id: 'osm',
    name: 'Out-of-Season Markdown',
    line: 'Items past their season are marked down step by step until they clear.',
    trigger: 'Season ended, slow sales',
    action: 'Weekly markdown, capped at 30%',
    outcome: 'Stock clears before it ages',
    products: 18,
    icon: <Tag size={18} />,
  },
];

export function UnderstandView() {
  const [open, setOpen] = useState('rvd');
  return (
    <div style={{ padding: 28 }}>
      <PageHead kicker="Sampo AI · suggested for your store" title="Pricing strategies" right={<StatusChip s="Not active" />} />
      <div
        data-f="banner"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '14px 18px',
          borderRadius: 12,
          background: C.indigoBg,
          marginBottom: 16,
          fontSize: 13.5,
          color: C.ink,
        }}
      >
        <Sparkles size={18} color={C.indigo} />
        <span style={{ flex: 1 }}>
          <b>How we determine strategies:</b> Sampo reads your last 90 days of views, orders and stock, then suggests rules you can test before anything changes.
        </span>
        <Btn kind="link">Explore full process</Btn>
      </div>
      <div style={{ display: 'grid', gap: 10 }}>
        {STRATEGIES.map((st) => {
          const isOpen = open === st.id;
          return (
            <Panel key={st.id} f={`card-${st.id}`} style={{ padding: 0, overflow: 'hidden' }}>
              <button
                type="button"
                data-f={`st-${st.id}`}
                onClick={() => setOpen(isOpen ? '' : st.id)}
                style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', width: '100%', boxSizing: 'border-box' }}
              >
                <span style={{ width: 38, height: 38, borderRadius: 10, background: C.indigoBg, color: C.indigo, display: 'grid', placeItems: 'center' }}>{st.icon}</span>
                <span style={{ flex: 1 }}>
                  <b style={{ display: 'block', fontSize: 15 }}>{st.name}</b>
                  <span style={{ fontSize: 13, color: C.sub }}>{st.line}</span>
                </span>
                <span style={{ fontSize: 12, color: C.faint, marginRight: 8 }}>{st.products} products</span>
                <ChevronDown size={18} color={C.sub} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .25s' }} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'stretch', gap: 10, padding: '0 18px 18px 70px' }}>
                      {[
                        ['Trigger', st.trigger],
                        ['Action', st.action],
                        ['Outcome', st.outcome],
                      ].map(([k, v], i) => (
                        <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                          <div style={{ flex: 1, padding: '12px 14px', borderRadius: 10, background: i === 0 ? C.indigoBg : C.surf }}>
                            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', color: C.indigo, textTransform: 'uppercase', marginBottom: 4 }}>{k}</div>
                            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{v}</div>
                          </div>
                          {i < 2 && <span style={{ color: C.faint }}>→</span>}
                        </div>
                      ))}
                      <Btn f={`review-${st.id}`} style={{ alignSelf: 'center' }}>
                        Review & activate
                      </Btn>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}

/* ── Rung 02 · Preview ─────────────────────────────── */
// Mode selector as on board 08 (node 6022:57): a segmented risk dial,
// dots for the share of shoppers, eyes for the views that trigger it.
const TINT: Record<ModeId, string> = { careful: '#E7F6EE', balanced: '#FDF4DF', high: '#ECEBFD' };

function Dial({ id, on }: { id: ModeId; on: boolean }) {
  const m = MODES[id];
  const filled = (m.discount - 5) / 5; // 1, 2 or 3 of the three segments
  const r = 64;
  const seg = (k: number) => {
    const a0 = Math.PI - (k * Math.PI) / 3 - 0.05 * (k ? 1 : 0);
    const a1 = Math.PI - ((k + 1) * Math.PI) / 3 + 0.05 * (k < 2 ? 1 : 0);
    const p = (a: number) => `${(80 + r * Math.cos(a)).toFixed(2)} ${(78 - r * Math.sin(a)).toFixed(2)}`;
    return `M ${p(a0)} A ${r} ${r} 0 0 1 ${p(a1)}`;
  };
  return (
    <svg width={160} height={86} viewBox="0 0 160 86">
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <path d={seg(k)} fill="none" stroke="#ECEAF3" strokeWidth={14} />
          {k < filled && (
            <motion.path
              d={seg(k)}
              fill="none"
              stroke={m.color}
              strokeWidth={14}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.35, delay: (on ? 0.1 : 0.2) + k * 0.28, ease: 'easeOut' }}
            />
          )}
        </g>
      ))}
    </svg>
  );
}

export function ModeCard({ id, selected, onSelect }: { id: ModeId; selected: boolean; onSelect?: () => void }) {
  const m = MODES[id];
  const dots = Math.round(m.reach / 5);
  const profitLow = m.est.profit[0] < 10;
  return (
    <button
      type="button"
      data-f={`mode-${id}`}
      onClick={onSelect}
      style={{
        all: 'unset',
        cursor: onSelect ? 'pointer' : 'default',
        boxSizing: 'border-box',
        borderRadius: 16,
        background: '#fff',
        overflow: 'hidden',
        border: `2px solid ${selected ? C.indigo : C.line}`,
        boxShadow: selected ? '0 18px 36px -20px rgba(67,56,202,.7)' : 'none',
        transition: 'border-color .25s, box-shadow .25s',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ position: 'relative', background: TINT[id], padding: '14px 14px 10px', textAlign: 'center' }}>
        <span
          style={{
            position: 'absolute',
            left: 12,
            top: 12,
            width: 18,
            height: 18,
            borderRadius: '50%',
            boxSizing: 'border-box',
            border: selected ? `5px solid ${C.indigo}` : `1.5px solid ${C.faint}`,
            background: '#fff',
            transition: 'border .2s',
          }}
        />
        {m.tag && (
          <span style={{ position: 'absolute', right: 10, top: 10, fontSize: 11, fontWeight: 700, color: '#fff', background: C.indigo, padding: '3px 10px', borderRadius: 999 }}>
            {m.tag}
          </span>
        )}
        <div style={{ position: 'relative', width: 160, height: 86, margin: '6px auto 0' }}>
          <Dial key={`${id}-${selected}`} id={id} on={selected} />
          <span style={{ position: 'absolute', left: 0, right: 0, bottom: -4, fontSize: 38, fontWeight: 900, letterSpacing: '-0.03em' }}>{m.discount}%</span>
        </div>
        <div style={{ fontSize: 12.5, color: C.sub, marginTop: 4 }}>discount</div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: id === 'balanced' ? '#9A6200' : m.color }}>{m.risk}</div>
      </div>
      <div style={{ padding: '12px 16px 14px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        <div>
          <b style={{ display: 'block', fontSize: 17 }}>{m.name}</b>
          <span style={{ fontSize: 12.5, color: C.sub }}>{m.line}.</span>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: C.sub, marginBottom: 5 }}>
            <span>Who sees it</span>
            <b style={{ color: C.ink }}>{m.reach}% of shoppers</b>
          </div>
          <div style={{ display: 'flex', gap: 3 }}>
            {Array.from({ length: 20 }, (_, i) => (
              <motion.span
                key={i}
                initial={false}
                animate={{ scale: i < dots ? 1 : 0.8, backgroundColor: i < dots ? m.color : '#E6E4EF' }}
                transition={{ delay: i < dots ? i * 0.05 : 0 }}
                style={{ width: 8, height: 8, borderRadius: '50%', display: 'block' }}
              />
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5, color: C.sub }}>
          <span>Triggers after</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: C.ink, fontWeight: 700 }}>
            {Array.from({ length: m.views }, (_, i) => (
              <Eye key={i} size={14} color={m.color} />
            ))}
            &nbsp;{m.views} views
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            ['Est. revenue', m.est.revenue[0], false],
            ['Est. profit', m.est.profit[0], profitLow],
          ].map(([k, v, low]) => (
            <div key={String(k)} style={{ background: C.surf, borderRadius: 10, padding: '8px 10px' }}>
              <div style={{ fontSize: 11, color: C.sub }}>{k}</div>
              <b style={{ fontSize: 18, color: low ? '#9A6200' : '#0E7A4E' }}>+{v}%</b>
            </div>
          ))}
        </div>
      </div>
    </button>
  );
}

function BoldRail({ selected }: { selected: ModeId }) {
  const at: Record<ModeId, number> = { careful: 16.7, balanced: 50, high: 83.3 };
  return (
    <div data-f="slider" style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, fontWeight: 800, letterSpacing: '0.14em', color: C.faint, marginBottom: 8 }}>
        <span>SAFER</span>
        <span>BOLDER</span>
      </div>
      <div style={{ position: 'relative', height: 16 }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 6, height: 4, borderRadius: 2, background: `linear-gradient(90deg, ${C.careful}, ${C.balanced} 50%, ${C.high})` }} />
        {MODE_IDS.map((id) => {
          const on = id === selected;
          return (
            <motion.span
              key={id}
              initial={false}
              animate={{ width: on ? 16 : 10, height: on ? 16 : 10, top: on ? 0 : 3 }}
              style={{
                position: 'absolute',
                left: `${at[id]}%`,
                x: '-50%',
                borderRadius: '50%',
                background: '#fff',
                border: `${on ? 4 : 2.5}px solid ${MODES[id].color}`,
                boxSizing: 'border-box',
                boxShadow: on ? `0 0 0 4px ${MODES[id].color}33` : 'none',
              }}
            />
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 999, background: '#fff', border: `1px solid ${C.line}` }}>
          <Sparkles size={12} color={C.indigo} style={{ verticalAlign: '-1px', marginRight: 6 }} />
          Recommended from your last 30 days
        </span>
      </div>
    </div>
  );
}

function LiftBars({ selected }: { selected: ModeId }) {
  const metrics: ['units' | 'revenue' | 'profit', string][] = [
    ['units', 'Units sold'],
    ['revenue', 'Revenue'],
    ['profit', 'Profit'],
  ];
  return (
    <Panel f="lift" style={{ padding: '14px 18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <b style={{ fontSize: 14 }}>Estimated lift vs. your normal prices</b>
        <span style={{ fontSize: 12, color: C.faint }}>Next 30 days · based on your last 30 days</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {metrics.map(([k, label]) => (
          <div key={k}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', color: C.faint, textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
            {MODE_IDS.map((id) => {
              const m = MODES[id];
              const [v, abs] = m.est[k];
              const on = id === selected;
              return (
                <div key={id} style={{ display: 'grid', gridTemplateColumns: '1fr 92px', alignItems: 'center', gap: 8, marginBottom: 6, opacity: on ? 1 : 0.45, transition: 'opacity .25s' }}>
                  <div style={{ height: 9, borderRadius: 5, background: '#EEEDF5', overflow: 'hidden' }}>
                    <motion.div initial={false} animate={{ width: `${(v / 50) * 100}%` }} transition={{ duration: 0.5 }} style={{ height: '100%', background: m.color, borderRadius: 5 }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>
                    +{v}% <span style={{ fontWeight: 500, color: C.faint }}>{abs}</span>
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </Panel>
  );
}

type Stage = 'preview' | 'confirm' | 'leave' | 'live';

export function PreviewView({
  selected: selectedProp,
  stage: stageProp,
  interactive = true,
  initialStage = 'preview',
}: {
  selected?: ModeId;
  stage?: Stage;
  interactive?: boolean;
  initialStage?: Stage;
}) {
  const [sel, setSel] = useState<ModeId>('balanced');
  const [stg, setStg] = useState<Stage>(initialStage);
  const selected = selectedProp ?? sel;
  const stage = stageProp ?? stg;
  const go = interactive ? setStg : undefined;
  return (
    <div style={{ padding: 28, height: '100%', boxSizing: 'border-box', position: 'relative' }}>
      <PageHead
        kicker="Strategy details · 30 products"
        title="Returning Visitor Discount"
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: C.sub }}>
            <ShieldCheck size={16} color={C.careful} /> All three modes are A/B tested before one is applied
          </div>
        }
      />
      <BoldRail selected={selected} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 14 }}>
        {MODE_IDS.map((id) => (
          <ModeCard key={id} id={id} selected={id === selected} onSelect={interactive ? () => setSel(id) : undefined} />
        ))}
      </div>
      <LiftBars selected={selected} />
      <div
        data-f="bar"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: '12px 28px',
          background: 'rgba(255,255,255,0.96)',
          borderTop: `1px solid ${C.line}`,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span style={{ flex: 1, fontSize: 13, color: C.sub }}>
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: C.balanced, marginRight: 8 }} />
          Recommended: <b style={{ color: C.ink }}>Balanced</b>, best profit (+25%) for moderate risk.
        </span>
        <Btn kind="secondary">View affected products</Btn>
        <Btn f="confirm" onClick={go ? () => go('confirm') : undefined}>
          Confirm & activate
        </Btn>
      </div>
      <AnimatePresence>
        {stage !== 'preview' && (
          <Modal key={stage} onClose={go ? () => go('preview') : undefined}>
            {stage === 'confirm' ? (
              <ConfirmBody selected={selected} onBack={go ? () => go('leave') : undefined} onConfirm={go ? () => go('live') : undefined} />
            ) : stage === 'leave' ? (
              <LeaveBody onLeave={go ? () => go('preview') : undefined} onStay={go ? () => go('confirm') : undefined} />
            ) : (
              <LiveBody onDone={go ? () => go('preview') : undefined} />
            )}
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function Modal({ children, onClose }: { children: ReactNode; onClose?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{ position: 'absolute', inset: 0, background: 'rgba(20,18,43,0.42)', display: 'grid', placeItems: 'center', zIndex: 10 }}
    >
      <motion.div
        initial={{ y: 16, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 8, scale: 0.98 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        data-f="modal"
        style={{ width: 420, background: '#fff', borderRadius: 16, boxShadow: '0 30px 60px -20px rgba(20,18,43,.5)', overflow: 'hidden' }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function ModalIcon({ children, bg, fg }: { children: ReactNode; bg: string; fg: string }) {
  return <span style={{ width: 38, height: 38, borderRadius: 10, background: bg, color: fg, display: 'grid', placeItems: 'center' }}>{children}</span>;
}

function ConfirmBody({ selected, onBack, onConfirm }: { selected: ModeId; onBack?: () => void; onConfirm?: () => void }) {
  return (
    <>
      <div style={{ padding: 22 }}>
        <ModalIcon bg={C.indigoBg} fg={C.indigo}>
          <ShieldCheck size={20} />
        </ModalIcon>
        <div style={{ fontSize: 18, fontWeight: 800, margin: '14px 0 12px' }}>Activate “Returning Visitor Discount”?</div>
        <div style={{ border: `1px solid ${C.line}`, borderRadius: 10, fontSize: 13 }}>
          {[
            ['Test', '3 modes, traffic split evenly'],
            ['Duration', '10–30 days, until a winner is clear'],
            ['Products', '30 products'],
            ['After', 'Best mode applies, change anytime'],
          ].map(([k, v], i) => (
            <div key={k} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', padding: '9px 12px', borderTop: i ? `1px solid ${C.line}` : 'none' }}>
              <span style={{ color: C.faint }}>{k}</span>
              <span style={{ fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 12.5, color: C.sub }}>
          Starting point: <b style={{ color: MODES[selected].color }}>{MODES[selected].name}</b>. All three modes run in the test.
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 22px', borderTop: `1px solid ${C.line}` }}>
        <Btn kind="link">Edit modes</Btn>
        <span style={{ flex: 1 }} />
        <Btn kind="secondary" f="m-back" onClick={onBack}>
          Back
        </Btn>
        <Btn f="m-confirm" onClick={onConfirm}>
          Confirm & activate
        </Btn>
      </div>
    </>
  );
}

function LeaveBody({ onLeave, onStay }: { onLeave?: () => void; onStay?: () => void }) {
  return (
    <>
      <div style={{ padding: 22 }}>
        <ModalIcon bg={C.balancedBg} fg={C.balanced}>
          <TriangleAlert size={20} />
        </ModalIcon>
        <div style={{ fontSize: 18, fontWeight: 800, margin: '14px 0 8px' }}>Leave without activating?</div>
        <div style={{ fontSize: 13.5, color: C.sub, lineHeight: 1.55 }}>Your mode choice won’t be saved. Nothing changes on your store.</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '14px 22px', borderTop: `1px solid ${C.line}` }}>
        <Btn kind="secondary" f="m-leave" onClick={onLeave}>
          Leave
        </Btn>
        <Btn f="m-keep" onClick={onStay}>
          Keep reviewing
        </Btn>
      </div>
    </>
  );
}

function LiveBody({ onDone }: { onDone?: () => void }) {
  return (
    <>
      <div style={{ padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <ModalIcon bg={C.carefulBg} fg={C.careful}>
            <Check size={20} />
          </ModalIcon>
          <StatusChip s="A/B testing" />
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, margin: '14px 0 12px' }}>Your test is live</div>
        {[
          ['Now', '3 modes start on 30 products'],
          ['Day 10–30', 'Sampo picks the winning mode'],
          ['Then', 'Winner applies automatically'],
        ].map(([k, v], i) => (
          <div key={k} style={{ display: 'flex', gap: 12, paddingBottom: 10 }}>
            <span style={{ width: 10, height: 10, marginTop: 4, borderRadius: '50%', background: i === 0 ? C.careful : C.line, flex: 'none' }} />
            <span>
              <span style={{ display: 'block', fontSize: 12, color: C.faint }}>{k}</span>
              <b style={{ fontSize: 13.5 }}>{v}</b>
            </span>
          </div>
        ))}
        <div style={{ fontSize: 12.5, color: C.sub }}>We’ll notify you on the dashboard when the test ends.</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '14px 22px', borderTop: `1px solid ${C.line}` }}>
        <Btn kind="secondary" onClick={onDone}>
          Go to dashboard
        </Btn>
        <Btn onClick={onDone}>Track test</Btn>
      </div>
    </>
  );
}

/* ── Rung 04 · Monitor ─────────────────────────────── */
// Cumulative revenue lift by day (0–21) for each mode, from the board's curve.
const curve = (end: number, shape: (t: number) => number) => Array.from({ length: 22 }, (_, d) => +(end * shape(d / 21)).toFixed(1));
export const AB: Record<ModeId, number[]> = {
  careful: curve(9, (t) => Math.sqrt(t)),
  balanced: curve(17, (t) => Math.pow(t, 0.8)),
  high: curve(12, (t) => (t < 0.35 ? (t / 0.35) * 0.95 : 0.95 + (t - 0.35) * 0.08)),
};

// Per-product results from the board, sorted by revenue lift.
const PRODUCTS: [string, string, ModeId, string, string, number, boolean][] = [
  ['Leather Backpack', 'LB-2207', 'balanced', '2.2%', '2.8%', 24, true],
  ['Watch Series 7', 'OG-01500ML-006', 'balanced', '2.9%', '3.6%', 21, true],
  ['Running Shoes X', 'RS-1180', 'balanced', '3.4%', '4.0%', 17, true],
  ['Wireless Earbuds', 'WE-0931', 'careful', '4.1%', '4.4%', 8, true],
  ['Smart Kettle', 'SK-0412', 'high', '3.0%', '3.1%', 2, false],
];

function Spark({ lift, color }: { lift: number; color: string }) {
  const pts = Array.from({ length: 12 }, (_, i) => {
    const t = i / 11;
    const v = lift * Math.pow(t, 0.7) + Math.sin(i * 1.7) * 1.2;
    return `${i ? 'L' : 'M'}${(i * 9).toFixed(1)},${(22 - (v / 26) * 18).toFixed(1)}`;
  }).join(' ');
  return (
    <svg width={100} height={26} viewBox="0 0 100 26">
      <path d={pts} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />
    </svg>
  );
}

function WinnerBody({ onClose }: { onClose?: () => void }) {
  return (
    <>
      <div style={{ padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <ModalIcon bg={C.balancedBg} fg={C.balanced}>
            <Trophy size={20} />
          </ModalIcon>
          <StatusChip s="Completed" />
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, margin: '14px 0 12px' }}>Balanced mode won</div>
        <div style={{ background: C.balancedBg, borderRadius: 12, padding: '12px 14px', marginBottom: 12 }}>
          <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>+17%</span>
          <span style={{ fontSize: 14, marginLeft: 8 }}>revenue</span>
          <div style={{ fontSize: 12, color: C.sub }}>vs. your normal prices over 21 days</div>
        </div>
        <div style={{ background: C.surf, borderRadius: 12, padding: '10px 14px' }}>
          <div style={{ fontSize: 12, color: C.sub, marginBottom: 6 }}>Revenue lift by mode</div>
          {MODE_IDS.map((id) => (
            <div key={id} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 40px', alignItems: 'center', gap: 8, fontSize: 12.5, marginBottom: 4 }}>
              <span style={{ fontWeight: id === 'balanced' ? 700 : 500 }}>{MODES[id].name}</span>
              <span style={{ height: 6, borderRadius: 3, background: '#E8E6F2' }}>
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: `${(AB[id][21] / 17) * 100}%` }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  style={{ display: 'block', height: '100%', borderRadius: 3, background: MODES[id].color }}
                />
              </span>
              <b style={{ textAlign: 'right' }}>+{AB[id][21]}%</b>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12.5, color: C.sub, marginTop: 10 }}>Applied automatically to 30 products.</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 22px', borderTop: `1px solid ${C.line}` }}>
        <Btn kind="link">Choose another mode</Btn>
        <span style={{ flex: 1 }} />
        <Btn kind="secondary" f="m-later" onClick={onClose}>
          Later
        </Btn>
        <Btn onClick={onClose}>See results</Btn>
      </div>
    </>
  );
}

export function MonitorView() {
  const [day, setDay] = useState(21);
  const [winner, setWinner] = useState(false);
  const W = 860;
  const H = 230;
  const x = (d: number) => 40 + (d / 21) * (W - 70);
  const y = (v: number) => H - 24 - (v / 20) * (H - 40);
  const path = (arr: number[]) => arr.map((v, d) => `${d ? 'L' : 'M'}${x(d).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const leader = MODE_IDS.reduce((a, b) => (AB[a][day] >= AB[b][day] ? a : b));
  return (
    <div style={{ padding: 28, position: 'relative', height: '100%', boxSizing: 'border-box' }}>
      <PageHead
        kicker="Returning Visitor Discount · A/B test"
        title="Is it working?"
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <StatusChip s="A/B testing" />
            <Btn kind="secondary" f="winner-btn" onClick={() => setWinner(true)}>
              <Trophy size={15} /> Test ended
            </Btn>
          </div>
        }
      />
      <div data-f="kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 14 }}>
        {[
          ['Revenue lift · leader', `+${AB[leader][day]}%`, `${MODES[leader].name} vs. normal prices`],
          ['Conversion rate', '3.2% → 3.8%', 'Balanced, last 7 days'],
          ['Orders in test', '1,500', 'across 30 products'],
          ['Confidence', '92%', 'winner picked at 95%'],
        ].map(([k, v, s], i) => (
          <Panel key={k} style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: 12, color: C.faint }}>{k}</div>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', margin: '4px 0' }}>{v}</div>
            <div style={{ fontSize: 11.5, color: C.sub }}>{s}</div>
            {i === 3 && (
              <div style={{ position: 'relative', height: 6, borderRadius: 3, background: '#EEEDF5', marginTop: 8 }}>
                <div style={{ width: '92%', height: '100%', borderRadius: 3, background: C.balanced }} />
                <span style={{ position: 'absolute', left: '95%', top: -3, width: 2, height: 12, background: C.ink }} />
              </div>
            )}
          </Panel>
        ))}
      </div>
      <Panel f="chart-panel" style={{ padding: '14px 18px', marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <b style={{ fontSize: 14 }}>Revenue lift vs. normal prices</b>
          <span style={{ fontSize: 12, color: C.faint }}>Day {day} of 21 · move across the chart</span>
        </div>
        <svg
          data-f="chart"
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          style={{ display: 'block', cursor: 'crosshair', touchAction: 'pan-y' }}
          onPointerMove={(e) => {
            const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
            const px = ((e.clientX - r.left) / r.width) * W;
            setDay(Math.max(0, Math.min(21, Math.round(((px - 40) / (W - 70)) * 21))));
          }}
        >
          {[0, 5, 10, 15, 20].map((v) => (
            <g key={v}>
              <line x1={40} x2={W - 30} y1={y(v)} y2={y(v)} stroke="#EEEDF5" />
              <text x={30} y={y(v) + 4} fontSize={11} fill={C.faint} textAnchor="end">
                {v}%
              </text>
            </g>
          ))}
          <line x1={40} x2={W - 30} y1={y(0)} y2={y(0)} stroke={C.normal} strokeDasharray="4 4" />
          {MODE_IDS.map((id) => (
            <path key={id} d={path(AB[id])} fill="none" stroke={MODES[id].color} strokeWidth={2.5} strokeLinejoin="round" />
          ))}
          <line x1={x(day)} x2={x(day)} y1={10} y2={H - 24} stroke={C.ink} strokeOpacity={0.25} />
          {MODE_IDS.map((id) => (
            <circle key={id} cx={x(day)} cy={y(AB[id][day])} r={5} fill="#fff" stroke={MODES[id].color} strokeWidth={2.5} />
          ))}
          <g transform={`translate(${Math.min(x(day) + 12, W - 190)}, 12)`}>
            <rect width={160} height={78} rx={8} fill={C.ink} />
            <text x={12} y={20} fontSize={11} fill="rgba(255,255,255,.6)">
              Day {day}
            </text>
            {MODE_IDS.map((id, i) => (
              <text key={id} x={12} y={40 + i * 15} fontSize={12} fill="#fff">
                <tspan fill={MODES[id].color}>●</tspan> {MODES[id].name}
                <tspan x={148} textAnchor="end" fontWeight={700}>
                  +{AB[id][day]}%
                </tspan>
              </text>
            ))}
          </g>
          {[1, 7, 14, 21].map((d) => (
            <text key={d} x={x(d)} y={H - 6} fontSize={11} fill={C.faint} textAnchor="middle">
              Day {d}
            </text>
          ))}
        </svg>
        <div style={{ fontSize: 12, color: C.sub }}>High Impact rises fastest, then flattens as deeper discounts eat into revenue per order. Balanced takes the lead on day 9.</div>
      </Panel>
      <Panel f="products" style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <b style={{ fontSize: 14 }}>Products in this test</b>
          <span style={{ fontSize: 12, color: C.faint }}>30 products · sorted by revenue lift</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 0.7fr 1.1fr 0.9fr', fontSize: 11.5, color: C.faint, padding: '6px 0', borderBottom: `1px solid ${C.line}` }}>
          <span>Product</span>
          <span>Mode</span>
          <span>Conversion</span>
          <span>Revenue lift</span>
          <span>21-day trend</span>
          <span>Status</span>
        </div>
        {PRODUCTS.map(([name, sku, mode, from, to, lift, win]) => (
          <div key={sku} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 0.7fr 1.1fr 0.9fr', alignItems: 'center', fontSize: 12.5, padding: '7px 0', borderBottom: `1px solid ${C.line}` }}>
            <span>
              <b style={{ display: 'block' }}>{name}</b>
              <span style={{ fontSize: 11, color: C.faint }}>SKU {sku}</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: MODES[mode].color }} />
              {MODES[mode].name}
            </span>
            <span>
              {from} → <b>{to}</b>
            </span>
            <span>
              <span style={{ fontWeight: 700, color: win ? '#0E7A4E' : C.sub, background: win ? C.carefulBg : C.surf, padding: '2px 7px', borderRadius: 6 }}>+{lift}%</span>
            </span>
            <Spark lift={lift} color={MODES[mode].color} />
            <span>
              <span style={{ fontSize: 11.5, fontWeight: 700, padding: '3px 9px', borderRadius: 999, color: win ? '#0E7A4E' : C.sub, background: win ? C.carefulBg : C.surf }}>
                ● {win ? 'Winning' : 'Low impact'}
              </span>
            </span>
          </div>
        ))}
      </Panel>
      <AnimatePresence>
        {winner && (
          <Modal onClose={() => setWinner(false)}>
            <WinnerBody onClose={() => setWinner(false)} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Rung 05 · Reverse ─────────────────────────────── */
export function ReverseView() {
  const [mode, setMode] = useState<ModeId>('balanced');
  const [prev, setPrev] = useState<ModeId | null>(null);
  const [menu, setMenu] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    if (!prev) return;
    const t = setTimeout(() => setPrev(null), 5000);
    return () => clearTimeout(t);
  }, [prev]);
  const m = MODES[mode];
  return (
    <div style={{ padding: 28, position: 'relative', height: '100%', boxSizing: 'border-box' }}>
      <PageHead kicker="Your strategies" title="Returning Visitor Discount" right={<StatusChip s={disabled ? 'Disabled' : 'Active'} />} />
      <Panel f="mode-panel" style={{ padding: 18, marginBottom: 14, opacity: disabled ? 0.55 : 1, transition: 'opacity .3s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: C.faint, marginBottom: 6 }}>Current mode</div>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button
                type="button"
                data-f="mode-dd"
                disabled={disabled}
                onClick={() => setMenu((v) => !v)}
                style={{
                  all: 'unset',
                  cursor: disabled ? 'default' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 14px',
                  borderRadius: 10,
                  border: `1px solid ${C.line}`,
                  fontSize: 14,
                  fontWeight: 700,
                  minWidth: 220,
                }}
              >
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: m.color }} />
                {m.name}
                <span style={{ flex: 1 }} />
                <ChevronDown size={16} />
              </button>
              <AnimatePresence>
                {menu && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    data-f="menu"
                    style={{ position: 'absolute', top: 46, left: 0, width: 330, background: '#fff', borderRadius: 12, boxShadow: '0 20px 40px -16px rgba(20,18,43,.35)', border: `1px solid ${C.line}`, padding: 6, zIndex: 5 }}
                  >
                    {MODE_IDS.map((id) => (
                      <button
                        key={id}
                        type="button"
                        data-f={`opt-${id}`}
                        onClick={() => {
                          if (id !== mode) {
                            setPrev(mode);
                            setMode(id);
                          }
                          setMenu(false);
                        }}
                        style={{ all: 'unset', cursor: 'pointer', display: 'flex', gap: 10, padding: '10px 10px', borderRadius: 8, width: '100%', boxSizing: 'border-box', background: id === mode ? C.surf : 'transparent' }}
                      >
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: MODES[id].color, marginTop: 4 }} />
                        <span style={{ flex: 1 }}>
                          <b style={{ display: 'block', fontSize: 13.5 }}>{MODES[id].name}</b>
                          <span style={{ fontSize: 12, color: C.sub }}>{MODES[id].line}</span>
                        </span>
                        {id === mode && <Check size={16} color={C.indigo} />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          {[
            ['Revenue lift', `+${m.est.revenue[0]}%`],
            ['Profit lift', `+${m.est.profit[0]}%`],
            ['Products', '30'],
          ].map(([k, v]) => (
            <div key={k} style={{ minWidth: 110 }}>
              <div style={{ fontSize: 12, color: C.faint }}>{k}</div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{v}</div>
            </div>
          ))}
        </div>
      </Panel>
      <Panel f="notice" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ flex: 1, fontSize: 13.5, color: C.sub }}>
          {disabled ? 'Strategy disabled. Prices on 30 products are back to normal and results are kept in your archive.' : 'A new mode applies as soon as it is saved, with a few seconds to undo.'}
        </span>
        {disabled ? (
          <Btn f="reactivate" onClick={() => setDisabled(false)}>
            Re-activate
          </Btn>
        ) : (
          <Btn kind="secondary" f="disable" onClick={() => setDialog(true)} style={{ color: C.red }}>
            Disable strategy
          </Btn>
        )}
      </Panel>
      <AnimatePresence>
        {prev && (
          <motion.div
            initial={{ opacity: 0, y: 12, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 12, x: '-50%' }}
            data-f="toast"
            style={{ position: 'absolute', left: '50%', bottom: 24, background: C.ink, color: '#fff', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14, fontSize: 13.5, whiteSpace: 'nowrap' }}
          >
            Mode changed to {m.name}. Changes apply right away.
            <button
              type="button"
              data-f="undo"
              onClick={() => {
                setMode(prev);
                setPrev(null);
              }}
              style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 800, color: '#B9B5FF' }}
            >
              <Undo2 size={15} /> Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {dialog && (
          <Modal onClose={() => setDialog(false)}>
            <div style={{ padding: 22 }}>
              <ModalIcon bg={C.redBg} fg={C.red}>
                <TriangleAlert size={20} />
              </ModalIcon>
              <div style={{ fontSize: 18, fontWeight: 800, margin: '14px 0 10px' }}>Disable “Returning Visitor Discount”?</div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: C.sub, lineHeight: 1.7 }}>
                <li>Prices on 30 products return to normal</li>
                <li>Test results are kept in your archive</li>
                <li>Re-activate any time</li>
              </ul>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '14px 22px', borderTop: `1px solid ${C.line}` }}>
              <Btn kind="secondary" f="m-keep" onClick={() => setDialog(false)}>
                Keep strategy
              </Btn>
              <Btn
                kind="danger"
                f="m-disable"
                onClick={() => {
                  setDialog(false);
                  setDisabled(true);
                  setPrev(null);
                }}
              >
                Disable strategy
              </Btn>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Your strategies · live card and archive ──────── */
type Row = [string, ModeId | null, number, string, keyof typeof CHIP];
const ACTIVE_ROWS: Row[] = [
  ['Returning Visitor Discount', 'balanced', 30, '2 May', 'A/B testing'],
  ['Low-Stock Urgency', 'careful', 12, '14 Apr', 'Active'],
  ['Out-of-Season Markdown', 'careful', 18, '28 Apr', 'Pending activation'],
  ['Abandoned Cart Recovery', null, 0, '—', 'Not active'],
];
const ARCHIVE_ROWS: Row[] = [
  ['Weekend Flash Sale', 'high', 40, '12 Jan', 'Completed'],
  ['Ramadan Bundle Pricing', 'balanced', 25, '1 Mar', 'Completed'],
  ['Traffic Surge Pricing', 'careful', 8, '9 Feb', 'Disabled'],
  ['Weekly Discount Test', 'balanced', 14, '20 Dec', 'Archived'],
];

function LiveCard() {
  const W = 300;
  const H = 54;
  const pts = AB.balanced.map((v, d) => `${d ? 'L' : 'M'}${((d / 21) * W).toFixed(1)},${(H - 4 - (v / 18) * (H - 8)).toFixed(1)}`).join(' ');
  return (
    <Panel f="live-card" style={{ padding: 18, marginBottom: 14, boxShadow: '0 20px 40px -28px rgba(67,56,202,.45)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <span style={{ width: 38, height: 38, borderRadius: 10, background: C.indigoBg, color: C.indigo, display: 'grid', placeItems: 'center' }}>
          <Eye size={18} />
        </span>
        <span style={{ flex: 1 }}>
          <b style={{ display: 'block', fontSize: 15 }}>Returning Visitor Discount</b>
          <span style={{ fontSize: 12, color: C.faint }}>Running on 30 products · since 2 May</span>
        </span>
        <StatusChip s="A/B testing" />
      </div>
      <div style={{ fontSize: 13.5, color: C.sub, marginBottom: 12 }}>
        Shoppers who view a product <b style={{ color: C.ink }}>twice</b> without buying get <b style={{ color: C.careful }}>15% off</b> on their next visit.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.25fr', gap: 10, alignItems: 'stretch' }}>
        {[
          ['Trigger', '2 product views, no purchase', C.indigoBg, C.indigo],
          ['Action', '15% off, for that shopper only', C.carefulBg, '#0E7A4E'],
          ['Outcome', 'Purchase on the 3rd visit', '#F3EEFF', '#7A3FD1'],
        ].map(([k, v, bg, fg]) => (
          <div key={k} style={{ padding: '10px 12px', borderRadius: 10, background: bg }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.08em', color: fg, textTransform: 'uppercase', marginBottom: 4 }}>{k}</div>
            <div style={{ fontSize: 12.5, fontWeight: 600 }}>{v}</div>
          </div>
        ))}
        <div data-f="live" style={{ borderRadius: 10, background: C.ink, color: '#fff', padding: '10px 12px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', color: '#7EE2B0' }}>● LIVE · DAY 21 OF 21</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '2px 0' }}>
            <b style={{ fontSize: 22 }}>+17%</b>
            <span style={{ fontSize: 11, opacity: 0.7 }}>revenue</span>
            <span style={{ flex: 1 }} />
            <span style={{ fontSize: 10.5, opacity: 0.7 }}>
              Leading <b style={{ color: C.balanced }}>● Balanced</b>
            </span>
          </div>
          <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: 'block' }}>
            <motion.path
              d={pts}
              fill="none"
              stroke={C.balanced}
              strokeWidth={2.5}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
            />
          </svg>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
        {['Low risk', 'Per shopper'].map((t) => (
          <span key={t} style={{ fontSize: 11.5, fontWeight: 600, color: C.sub, background: C.surf, padding: '3px 9px', borderRadius: 999 }}>
            {t}
          </span>
        ))}
        <span style={{ flex: 1 }} />
        <Btn kind="secondary">Change mode</Btn>
        <Btn>View results</Btn>
      </div>
    </Panel>
  );
}

export function StrategiesView() {
  const [tab, setTab] = useState<'active' | 'archive'>('active');
  const rows = tab === 'active' ? ACTIVE_ROWS : ARCHIVE_ROWS;
  return (
    <div style={{ padding: 28 }}>
      <PageHead
        kicker="Pricing strategies · 3 running"
        title="Your strategies"
        right={
          <div data-f="tabs" style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 10, background: '#fff', border: `1px solid ${C.line}` }}>
            {(
              [
                ['active', 'Active', ACTIVE_ROWS.length],
                ['archive', 'Archive', ARCHIVE_ROWS.length],
              ] as const
            ).map(([id, label, n]) => (
              <button
                key={id}
                type="button"
                data-f={`tab-${id}`}
                onClick={() => setTab(id)}
                style={{ all: 'unset', cursor: 'pointer', padding: '6px 14px', borderRadius: 7, fontSize: 12.5, fontWeight: 700, background: tab === id ? C.indigo : 'transparent', color: tab === id ? '#fff' : C.sub }}
              >
                {label} <span style={{ opacity: 0.6 }}>{n}</span>
              </button>
            ))}
          </div>
        }
      />
      <LiveCard />
      <Panel f="table" style={{ padding: '6px 18px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 0.8fr 0.8fr 1.2fr', fontSize: 11.5, color: C.faint, padding: '8px 0', borderBottom: `1px solid ${C.line}` }}>
          <span>Strategy</span>
          <span>Mode</span>
          <span>Products</span>
          <span>Started</span>
          <span>Status</span>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
            {rows.map(([name, mode, n, start, st]) => (
              <div key={name} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 0.8fr 0.8fr 1.2fr', alignItems: 'center', fontSize: 13, padding: '10px 0', borderBottom: `1px solid ${C.line}` }}>
                <b>{name}</b>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: mode ? C.ink : C.faint }}>
                  {mode && <span style={{ width: 7, height: 7, borderRadius: '50%', background: MODES[mode].color }} />}
                  {mode ? MODES[mode].name : 'Not set'}
                </span>
                <span>{n || '—'}</span>
                <span style={{ color: C.sub }}>{start}</span>
                <span>
                  <StatusChip s={st} />
                </span>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </Panel>
    </div>
  );
}

/* ── Store dashboard ───────────────────────────────── */
const THIS_YEAR = [44, 47, 52, 49, 55, 58, 54, 61, 58.8, 63, 60, 66, 68.5];
const LAST_YEAR = [42, 43, 46, 45, 48, 50, 49, 53, 52.1, 55, 54, 57, 59];
// Watch Series 7 by month: sales in SAR and gross margin. October matches
// the board's tooltip (SAR 12,900 sales, SAR 5,900 profit).
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const SALES = [9300, 11800, 7400, 10600, 7800, 9600, 8200, 5600, 11400, 12900, 10400, 8700];
const PROFIT = [3813, 4484, 3182, 4664, 3120, 4032, 3198, 2072, 5130, 5900, 4472, 3567];
const RANGES: Record<string, string> = { '7D': 'Last 7 days', '30D': 'Last 30 days', '90D': 'Last 90 days', '12M': 'Last 12 months' };

export function DashboardView() {
  const [wk, setWk] = useState(8);
  const [range, setRange] = useState('90D');
  const [mo, setMo] = useState(9);
  const W = 560;
  const H = 210;
  const x = (i: number) => 44 + (i / 12) * (W - 64);
  const y = (v: number) => H - 22 - (v / 80) * (H - 34);
  const line = (a: number[]) => a.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const area = `${line(THIS_YEAR)} L${x(12)},${y(0)} L${x(0)},${y(0)} Z`;
  const ch = ((THIS_YEAR[wk] - LAST_YEAR[wk]) / LAST_YEAR[wk]) * 100;
  const impact: [string, number][] = [
    ['Returning Visitor Discount', 58500],
    ['Low-Stock Urgency', 33750],
    ['Out-of-Season Markdown', 20250],
  ];
  return (
    <div style={{ padding: 28 }}>
      <PageHead
        kicker={`${RANGES[range]} · compared with the same period last year`}
        title="Welcome back, Khalifah"
        right={
          <div data-f="range" style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 10, background: '#fff', border: `1px solid ${C.line}` }}>
            {Object.keys(RANGES).map((r) => (
              <button
                key={r}
                type="button"
                data-f={`range-${r}`}
                onClick={() => setRange(r)}
                style={{ all: 'unset', cursor: 'pointer', padding: '6px 12px', borderRadius: 7, fontSize: 12.5, fontWeight: 700, background: r === range ? C.indigo : 'transparent', color: r === range ? '#fff' : C.sub }}
              >
                {r}
              </button>
            ))}
          </div>
        }
      />
      <div data-f="kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 14 }}>
        {[
          ['Revenue', 'SAR 750k', '↑ 11.4%', '+SAR 76,750 vs last year'],
          ['Items sold', '18,000', '↑ 8%', '+1,333 vs last year'],
          ['Orders', '1,500', '↑ 5%', '+71 vs last year'],
          ['Gross margin', '41.9%', '↑ 2.1 pts', 'Watch Series 7 · 12 months'],
        ].map(([k, v, d, s]) => (
          <Panel key={k} style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: C.sub }}>
              {k}
              <span style={{ fontSize: 11.5, fontWeight: 700, color: '#0E7A4E', background: C.carefulBg, padding: '1px 7px', borderRadius: 999 }}>{d}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', margin: '6px 0 2px' }}>{v}</div>
            <div style={{ fontSize: 11.5, color: C.faint }}>{s}</div>
          </Panel>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 12, marginBottom: 14 }}>
        <Panel f="chart-panel" style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <b style={{ fontSize: 14 }}>Revenue by week</b>
            <span style={{ fontSize: 11.5, color: C.faint }}>
              <span style={{ color: C.indigo }}>━</span> This year <span style={{ marginLeft: 8, color: C.normal }}>┅</span> Last year
            </span>
          </div>
          <svg
            data-f="chart"
            width={W}
            height={H}
            viewBox={`0 0 ${W} ${H}`}
            style={{ display: 'block', cursor: 'crosshair', touchAction: 'pan-y' }}
            onPointerMove={(e) => {
              const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
              const px = ((e.clientX - r.left) / r.width) * W;
              setWk(Math.max(0, Math.min(12, Math.round(((px - 44) / (W - 64)) * 12))));
            }}
          >
            <defs>
              <linearGradient id="sampo-area" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor={C.indigo2} stopOpacity={0.25} />
                <stop offset="1" stopColor={C.indigo2} stopOpacity={0} />
              </linearGradient>
            </defs>
            {[0, 20, 40, 60, 80].map((v) => (
              <g key={v}>
                <line x1={44} x2={W - 20} y1={y(v)} y2={y(v)} stroke="#EEEDF5" />
                <text x={36} y={y(v) + 4} fontSize={10.5} fill={C.faint} textAnchor="end">
                  {v ? `${v}k` : '0'}
                </text>
              </g>
            ))}
            <path d={area} fill="url(#sampo-area)" />
            <path d={line(LAST_YEAR)} fill="none" stroke={C.normal} strokeWidth={2} strokeDasharray="5 5" />
            <path d={line(THIS_YEAR)} fill="none" stroke={C.indigo} strokeWidth={2.5} />
            <line x1={x(wk)} x2={x(wk)} y1={8} y2={H - 22} stroke={C.ink} strokeOpacity={0.2} />
            <circle cx={x(wk)} cy={y(LAST_YEAR[wk])} r={4.5} fill="#fff" stroke={C.normal} strokeWidth={2} />
            <circle cx={x(wk)} cy={y(THIS_YEAR[wk])} r={5} fill="#fff" stroke={C.indigo} strokeWidth={2.5} />
            <g transform={`translate(${Math.min(Math.max(x(wk) - 80, 44), W - 180)}, 8)`}>
              <rect width={160} height={64} rx={8} fill={C.ink} />
              <text x={12} y={18} fontSize={11} fill="rgba(255,255,255,.6)">
                Week {wk + 1}
              </text>
              <text x={12} y={36} fontSize={12} fill="#fff">
                This year <tspan x={148} textAnchor="end" fontWeight={700}>SAR {THIS_YEAR[wk].toFixed(1)}k</tspan>
              </text>
              <text x={12} y={53} fontSize={12} fill="#fff">
                Change <tspan x={148} textAnchor="end" fontWeight={700} fill="#7EE2B0">+{ch.toFixed(1)}%</tspan>
              </text>
            </g>
            {[0, 2, 4, 6, 8, 10, 12].map((i) => (
              <text key={i} x={x(i)} y={H - 4} fontSize={10.5} fill={C.faint} textAnchor="middle">
                W{i + 1}
              </text>
            ))}
          </svg>
        </Panel>
        <div
          data-f="impact"
          style={{
            borderRadius: 14,
            padding: '16px 18px',
            color: '#fff',
            background: 'linear-gradient(150deg, #3A2FD6 0%, #2A1FA8 45%, #1A1470 100%)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.75)', marginBottom: 12 }}>SAMPO IMPACT · LAST 90 DAYS</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.14)', marginBottom: 12 }}>
            <svg width={92} height={92} viewBox="0 0 92 92" style={{ flex: 'none' }}>
              <circle cx={46} cy={46} r={38} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth={9} />
              <circle cx={46} cy={46} r={38} fill="none" stroke="#FFD25C" strokeWidth={9} strokeDasharray={`${2 * Math.PI * 38 * 0.15} 999`} transform="rotate(-90 46 46)" />
              <text x={46} y={47} fontSize={18} fontWeight={800} textAnchor="middle" fill="#fff">
                15%
              </text>
              <text x={46} y={62} fontSize={9.5} textAnchor="middle" fill="rgba(255,255,255,0.75)">
                of revenue
              </text>
            </svg>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.01em' }}>SAR 112,500</div>
              <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.8)' }}>came from Sampo prices</div>
            </div>
          </div>
          {impact.map(([k, v]) => (
            <div key={k} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                <span>{k}</span>
                <b>SAR {v.toLocaleString('en-US')}</b>
              </div>
              <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.14)', marginTop: 6 }}>
                <div style={{ width: `${(v / 112500) * 100}%`, height: '100%', borderRadius: 3, background: '#FFD25C' }} />
              </div>
            </div>
          ))}
          <span style={{ flex: 1 }} />
          <button
            type="button"
            style={{ all: 'unset', cursor: 'pointer', marginTop: 8, height: 36, borderRadius: 9, background: '#fff', color: C.indigo, fontSize: 13, fontWeight: 700, display: 'grid', placeItems: 'center' }}
          >
            View strategies →
          </button>
        </div>
      </div>
      <Profitability mo={mo} onMonth={setMo} />
    </div>
  );
}

function Profitability({ mo, onMonth }: { mo: number; onMonth: (i: number) => void }) {
  const W = 876;
  const H = 190;
  const sales = SALES.reduce((a, b) => a + b, 0);
  const profit = PROFIT.reduce((a, b) => a + b, 0);
  const bw = 40;
  const x = (i: number) => 64 + i * ((W - 84) / 12) + 12;
  const y = (v: number) => H - 26 - (v / 15000) * (H - 40);
  const sar = (v: number) => `SAR ${v.toLocaleString('en-US')}`;
  const tipX = Math.min(Math.max(x(mo) + bw / 2 - 90, 60), W - 190);
  return (
    <Panel f="profit" style={{ padding: '14px 18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span>
          <b style={{ fontSize: 14 }}>Product profitability · Watch Series 7</b>
          <span style={{ display: 'block', fontSize: 12, color: C.faint }}>
            {sar(profit)} gross profit on {sar(sales)} sales · {((profit / sales) * 100).toFixed(1)}% margin
          </span>
        </span>
        <span style={{ fontSize: 11.5, color: C.faint }}>
          <span style={{ color: C.indigo }}>■</span> Gross profit <span style={{ marginLeft: 8, color: '#C9C5F5' }}>■</span> Costs
        </span>
      </div>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
        {[0, 5000, 10000, 15000].map((v) => (
          <g key={v}>
            <line x1={56} x2={W - 20} y1={y(v)} y2={y(v)} stroke="#EEEDF5" />
            <text x={48} y={y(v) + 4} fontSize={10.5} fill={C.faint} textAnchor="end">
              {v ? `${v / 1000}k` : '0'}
            </text>
          </g>
        ))}
        {MONTHS.map((m, i) => {
          const on = i === mo;
          return (
            <g key={m} data-f={`month-${i}`} onPointerEnter={() => onMonth(i)} onClick={() => onMonth(i)} style={{ cursor: 'pointer' }}>
              <rect x={x(i) - 8} y={8} width={bw + 16} height={H - 14} rx={8} fill={on ? C.indigoBg : 'transparent'} />
              <rect x={x(i)} y={y(SALES[i])} width={bw} height={y(PROFIT[i]) - y(SALES[i])} rx={3} fill={on ? '#B9B4F4' : '#DCD9FA'} />
              <rect x={x(i)} y={y(PROFIT[i])} width={bw} height={y(0) - y(PROFIT[i])} fill={on ? C.indigo : C.indigo2} opacity={on ? 1 : 0.8} />
              <text x={x(i) + bw / 2} y={H - 8} fontSize={11} fill={on ? C.indigo : C.sub} fontWeight={on ? 800 : 500} textAnchor="middle">
                {m} · {Math.round((PROFIT[i] / SALES[i]) * 100)}%
              </text>
            </g>
          );
        })}
        <g transform={`translate(${tipX}, ${Math.max(y(SALES[mo]) - 86, 0)})`} style={{ pointerEvents: 'none' }}>
          <rect width={180} height={76} rx={8} fill={C.ink} />
          <text x={12} y={18} fontSize={11.5} fill="#fff" fontWeight={700}>
            {MONTHS[mo]}
          </text>
          {[
            ['Sales', sar(SALES[mo])],
            ['Gross profit', sar(PROFIT[mo])],
            ['Margin', `${((PROFIT[mo] / SALES[mo]) * 100).toFixed(1)}%`],
          ].map(([k, v], i) => (
            <text key={k} x={12} y={36 + i * 15} fontSize={11.5} fill="rgba(255,255,255,.75)">
              {k}
              <tspan x={168} textAnchor="end" fill="#fff" fontWeight={700}>
                {v}
              </tspan>
            </text>
          ))}
        </g>
      </svg>
    </Panel>
  );
}

/* ── the 5 second loop (card + film fallback) ──────────
   Careful → Balanced → High Impact → back to Balanced,
   Confirm & activate, then "Your test is live". A cursor
   moves to each target so the sequence reads like a demo. */
type Beat = { ms: number; sel: ModeId; stage: Stage; cur: [number, number]; press?: boolean };
const BEATS: Beat[] = [
  { ms: 900, sel: 'careful', stage: 'preview', cur: [175, 260] },
  { ms: 800, sel: 'balanced', stage: 'preview', cur: [484, 260] },
  { ms: 800, sel: 'high', stage: 'preview', cur: [793, 260] },
  { ms: 800, sel: 'balanced', stage: 'preview', cur: [484, 260] },
  { ms: 500, sel: 'balanced', stage: 'preview', cur: [872, 669], press: true },
  { ms: 900, sel: 'balanced', stage: 'confirm', cur: [598, 520], press: true },
  { ms: 1300, sel: 'balanced', stage: 'live', cur: [650, 480] },
];

export function SampoLoop({ playing = true, className, style }: { playing?: boolean; className?: string; style?: CSSProperties }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '120px' });
  const run = playing && inView && !reduced;
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!run) return;
    const t = setTimeout(() => setI((n) => (n + 1) % BEATS.length), BEATS[i].ms);
    return () => clearTimeout(t);
  }, [i, run]);
  const b = reduced ? BEATS[1] : BEATS[i];
  return (
    <div ref={ref} className={className} style={style}>
      <DesktopFrame canvasH={700}>
        <PreviewView selected={b.sel} stage={b.stage} interactive={false} />
        {!reduced && (
          <motion.div
            animate={{ x: b.cur[0], y: b.cur[1], scale: b.press ? 0.85 : 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', left: 0, top: 0, zIndex: 20, pointerEvents: 'none' }}
          >
            <svg width={22} height={26} viewBox="0 0 22 26">
              <path d="M2 2 L2 21 L7 16 L11 24 L14.5 22.5 L10.5 14.5 L17.5 14.5 Z" fill="#14122B" stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
            </svg>
          </motion.div>
        )}
      </DesktopFrame>
    </div>
  );
}

export { SampoMark };
