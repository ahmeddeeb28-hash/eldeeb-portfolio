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
  Undo2,
  Zap,
} from 'lucide-react';

/* ── Sampo UI ────────────────────────────────────────
   The merchant dashboard screens from the Sampo boards,
   rebuilt in code so visitors can use them: expand a
   strategy, pick a mode, confirm, watch the test, change
   or disable it. Everything is laid out on a fixed desktop
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
}: {
  children: ReactNode;
  kind?: 'primary' | 'secondary' | 'link' | 'danger';
  onClick?: () => void;
  style?: CSSProperties;
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
  Suggested: ['#F1F0F7', C.sub],
  Pending: [C.balancedBg, '#9A6200'],
  Testing: [C.indigoBg, C.indigo],
  Active: [C.carefulBg, '#0E7A4E'],
  Completed: ['#EEF0F4', '#4A5468'],
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

function Panel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.line}`, borderRadius: 14, ...style }}>{children}</div>
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
      <PageHead kicker="Sampo AI · suggested for your store" title="Pricing strategies" right={<StatusChip s="Suggested" />} />
      <div
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
            <Panel key={st.id} style={{ padding: 0, overflow: 'hidden' }}>
              <button
                type="button"
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
                      <Btn style={{ alignSelf: 'center' }}>Review & activate</Btn>
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
function Gauge({ pct, color }: { pct: number; color: string }) {
  const r = 34;
  const len = Math.PI * r;
  return (
    <svg width={92} height={54} viewBox="0 0 92 54">
      <path d={`M 12 48 A ${r} ${r} 0 0 1 80 48`} fill="none" stroke="#E8E6F2" strokeWidth={9} strokeLinecap="round" />
      <path
        d={`M 12 48 A ${r} ${r} 0 0 1 80 48`}
        fill="none"
        stroke={color}
        strokeWidth={9}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - pct / 25)}
        style={{ transition: 'stroke-dashoffset .6s ease' }}
      />
    </svg>
  );
}

export function ModeCard({ id, selected, onSelect }: { id: ModeId; selected: boolean; onSelect?: () => void }) {
  const m = MODES[id];
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        all: 'unset',
        cursor: onSelect ? 'pointer' : 'default',
        boxSizing: 'border-box',
        padding: 16,
        borderRadius: 14,
        background: '#fff',
        border: `2px solid ${selected ? m.color : C.line}`,
        boxShadow: selected ? `0 14px 30px -18px ${m.color}` : 'none',
        transition: 'border-color .25s, box-shadow .25s',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: m.color, background: m.bg, padding: '3px 9px', borderRadius: 999 }}>{m.risk}</span>
        {m.tag && <span style={{ fontSize: 11, fontWeight: 800, color: C.indigo }}>{m.tag}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Gauge pct={m.discount} color={m.color} />
        <div>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>{m.discount}%</div>
          <div style={{ fontSize: 11.5, color: C.faint }}>discount</div>
        </div>
      </div>
      <div>
        <b style={{ display: 'block', fontSize: 15 }}>{m.name}</b>
        <span style={{ fontSize: 12.5, color: C.sub }}>{m.line}</span>
      </div>
      <div style={{ display: 'grid', gap: 6, fontSize: 12, color: C.sub }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Who sees it</span>
          <b style={{ color: C.ink }}>{m.reach}% of shoppers</b>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Triggers after</span>
          <b style={{ color: C.ink }}>{m.views} views</b>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[
          ['Est. revenue', m.est.revenue[0]],
          ['Est. profit', m.est.profit[0]],
        ].map(([k, v]) => (
          <div key={k} style={{ background: C.surf, borderRadius: 9, padding: '8px 10px' }}>
            <div style={{ fontSize: 11, color: C.faint }}>{k}</div>
            <b style={{ fontSize: 16, color: '#0E7A4E' }}>+{v}%</b>
          </div>
        ))}
      </div>
    </button>
  );
}

function LiftBars({ selected }: { selected: ModeId }) {
  const metrics: ['units' | 'revenue' | 'profit', string][] = [
    ['units', 'Units sold'],
    ['revenue', 'Revenue'],
    ['profit', 'Profit'],
  ];
  return (
    <Panel style={{ padding: '14px 18px' }}>
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

type Stage = 'preview' | 'confirm' | 'live';

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
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', color: C.faint }}>
        SAFER
        <div style={{ flex: 1, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${C.careful}, ${C.balanced}, ${C.high})` }} />
        BOLDER
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 14 }}>
        {MODE_IDS.map((id) => (
          <ModeCard key={id} id={id} selected={id === selected} onSelect={interactive ? () => setSel(id) : undefined} />
        ))}
      </div>
      <LiftBars selected={selected} />
      <div
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
        <Btn onClick={go ? () => go('confirm') : undefined}>Confirm & activate</Btn>
      </div>
      <AnimatePresence>
        {stage !== 'preview' && (
          <Modal key={stage} onClose={go ? () => go('preview') : undefined}>
            {stage === 'confirm' ? (
              <ConfirmBody selected={selected} onBack={go ? () => go('preview') : undefined} onConfirm={go ? () => go('live') : undefined} />
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
        <Btn kind="secondary" onClick={onBack}>
          Back
        </Btn>
        <Btn onClick={onConfirm}>Confirm & activate</Btn>
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
          <StatusChip s="Testing" />
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

export function MonitorView() {
  const [day, setDay] = useState(21);
  const W = 860;
  const H = 230;
  const x = (d: number) => 40 + (d / 21) * (W - 70);
  const y = (v: number) => H - 24 - (v / 20) * (H - 40);
  const path = (arr: number[]) => arr.map((v, d) => `${d ? 'L' : 'M'}${x(d).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const leader = MODE_IDS.reduce((a, b) => (AB[a][day] >= AB[b][day] ? a : b));
  return (
    <div style={{ padding: 28 }}>
      <PageHead kicker="Returning Visitor Discount · A/B test" title="Is it working?" right={<StatusChip s="Testing" />} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 14 }}>
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
      <Panel style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <b style={{ fontSize: 14 }}>Revenue lift vs. normal prices</b>
          <span style={{ fontSize: 12, color: C.faint }}>Day {day} of 21 · move across the chart</span>
        </div>
        <svg
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
      <Panel style={{ padding: 18, marginBottom: 14, opacity: disabled ? 0.55 : 1, transition: 'opacity .3s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: C.faint, marginBottom: 6 }}>Current mode</div>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button
                type="button"
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
                    style={{ position: 'absolute', top: 46, left: 0, width: 330, background: '#fff', borderRadius: 12, boxShadow: '0 20px 40px -16px rgba(20,18,43,.35)', border: `1px solid ${C.line}`, padding: 6, zIndex: 5 }}
                  >
                    {MODE_IDS.map((id) => (
                      <button
                        key={id}
                        type="button"
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
      <Panel style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ flex: 1, fontSize: 13.5, color: C.sub }}>
          {disabled ? 'Strategy disabled. Prices on 30 products are back to normal and results are kept in your archive.' : 'A mode change applies right away and can be undone for 5 seconds.'}
        </span>
        {disabled ? (
          <Btn onClick={() => setDisabled(false)}>Re-activate</Btn>
        ) : (
          <Btn kind="secondary" onClick={() => setDialog(true)} style={{ color: C.red }}>
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
            style={{ position: 'absolute', left: '50%', bottom: 24, background: C.ink, color: '#fff', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14, fontSize: 13.5, whiteSpace: 'nowrap' }}
          >
            Mode changed to {m.name}. New prices apply from now on.
            <button
              type="button"
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
              <Btn kind="secondary" onClick={() => setDialog(false)}>
                Keep strategy
              </Btn>
              <Btn
                kind="danger"
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

/* ── Store dashboard ───────────────────────────────── */
const THIS_YEAR = [44, 47, 52, 49, 55, 58, 54, 61, 58.8, 63, 60, 66, 68.5];
const LAST_YEAR = [42, 43, 46, 45, 48, 50, 49, 53, 52.1, 55, 54, 57, 59];

export function DashboardView() {
  const [wk, setWk] = useState(8);
  const [range, setRange] = useState('90D');
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
        kicker="Last 90 days · compared with the same period last year"
        title="Welcome back, Khalifah"
        right={
          <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 10, background: '#fff', border: `1px solid ${C.line}` }}>
            {['7D', '30D', '90D', '12M'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                style={{ all: 'unset', cursor: 'pointer', padding: '6px 12px', borderRadius: 7, fontSize: 12.5, fontWeight: 700, background: r === range ? C.indigo : 'transparent', color: r === range ? '#fff' : C.sub }}
              >
                {r}
              </button>
            ))}
          </div>
        }
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 14 }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 12 }}>
        <Panel style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <b style={{ fontSize: 14 }}>Revenue by week</b>
            <span style={{ fontSize: 11.5, color: C.faint }}>
              <span style={{ color: C.indigo }}>━</span> This year <span style={{ marginLeft: 8, color: C.normal }}>┅</span> Last year
            </span>
          </div>
          <svg
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
        <Panel style={{ padding: '16px 18px' }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', color: C.faint, marginBottom: 12 }}>SAMPO IMPACT · LAST 90 DAYS</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
            <svg width={84} height={84} viewBox="0 0 84 84">
              <circle cx={42} cy={42} r={34} fill="none" stroke="#EEEDF5" strokeWidth={10} />
              <circle cx={42} cy={42} r={34} fill="none" stroke={C.indigo} strokeWidth={10} strokeDasharray={`${2 * Math.PI * 34 * 0.15} 999`} transform="rotate(-90 42 42)" strokeLinecap="round" />
              <text x={42} y={46} fontSize={16} fontWeight={800} textAnchor="middle" fill={C.ink}>
                15%
              </text>
            </svg>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>SAR 112,500</div>
              <div style={{ fontSize: 12.5, color: C.sub }}>of revenue came from Sampo prices</div>
            </div>
          </div>
          {impact.map(([k, v]) => (
            <div key={k} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                <span>{k}</span>
                <b>SAR {v.toLocaleString('en-US')}</b>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: '#EEEDF5', marginTop: 5 }}>
                <div style={{ width: `${(v / 112500) * 100}%`, height: '100%', borderRadius: 3, background: C.indigo2 }} />
              </div>
            </div>
          ))}
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <Btn kind="link">View strategies →</Btn>
          </div>
        </Panel>
      </div>
    </div>
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
