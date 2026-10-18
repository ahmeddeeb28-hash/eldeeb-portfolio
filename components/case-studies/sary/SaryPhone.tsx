import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowLeftRight,
  ArrowUp,
  Bell,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Home,
  Info,
  Package,
  Pencil,
  Plus,
  Receipt,
  Repeat,
  Search,
  ShoppingCart,
  Truck,
  User,
  Zap,
} from 'lucide-react';

/* ── Sary phone ──────────────────────────────────────
   The Buy Again screens rebuilt from the Figma page and the
   prototype: same layouts, tokens and product shots, laid out
   on the prototype's 390×844 canvas and scaled to `width`.
   Store, prices and order history are sample data. */

export type SaryState =
  | 'home'
  | 'hub'
  | 'review'
  | 'order'
  | 'added'
  | 'routine';

const IMG = '/images/case-studies/sary';
const W = 390;
const H = 844;
const display = '"Bricolage Grotesque", Inter, system-ui, sans-serif';
const ui = 'Manrope, Inter, system-ui, sans-serif';

export const S = {
  navy: '#1D368D',
  navy9: '#001B6C',
  ink: '#10212E',
  txt: '#38383F',
  sub: '#58646D',
  meta: '#828287',
  faint: '#9B9B9F',
  surf: '#F6F7F9',
  hair: '#F0F0F1',
  mint: '#F0F6E7',
  mintInk: '#4F7A16',
  ok: '#0E8A5F',
  okBg: '#E3F5EC',
  warn: '#9A6B00',
  warnBg: '#F9F1DA',
  red: '#FF3C1E',
  redBg: '#FEE8E7',
  info: '#E9F3FB',
  tonal: '#EAF0FB',
};

const e1 = '0 1px 2px rgba(16,33,46,.05),0 6px 18px -6px rgba(16,33,46,.08)';
const e2 = '0 1px 3px rgba(16,33,46,.06),0 8px 20px -6px rgba(16,33,46,.16)';
const esheet = '0 -8px 28px -6px rgba(16,33,46,.12)';

const P = {
  milk: { n: 'Almarai Low-fat Milk 2 L', k: '6 x 2 L', p: 'SAR 58.50' },
  eggs: { n: 'Fresh Large Eggs', k: 'Tray · 30 pcs', p: 'SAR 23.95' },
  fairy: { n: 'Fairy Lemon Dish Soap', k: '12 x 450 ml', p: 'SAR 98.40' },
  nes: { n: 'Nescafé Gold Blend 200 g', k: '6 jars', p: 'SAR 289.50' },
  coke: { n: 'Coca-Cola Glass 330 ml', k: '24 bottles', p: 'SAR 46.80' },
  indo: { n: 'Indomie Mi Goreng 80 g', k: '40 packs', p: 'SAR 42.00' },
  sun: { n: 'Suntop Orange 250 ml', k: '24 packs', p: 'SAR 21.60' },
  water: { n: 'Nestlé Pure Life 330 ml', k: '40 bottles', p: 'SAR 18.95' },
  tea: { n: 'Lipton Yellow Label 100s', k: '12 boxes', p: 'SAR 162.00' },
  oil: { n: 'Afia Sunflower Oil 1.5 L', k: '12 x 1.5 L', p: 'SAR 167.40' },
  yog: { n: 'Almarai Greek Yogurt', k: '24 x 160 g', p: 'SAR 52.80' },
};
type Sku = keyof typeof P;

/* ── frame ── */
export function SaryPhone({
  state,
  width = 300,
  pressed,
  added,
  badge,
  cartBar,
  flying,
  sheet,
  routineOn,
  toast,
}: {
  state: SaryState;
  width?: number;
  /* animation knobs used by the looping sequence */
  pressed?: boolean;
  added?: boolean;
  badge?: number;
  cartBar?: boolean;
  flying?: boolean;
  sheet?: boolean;
  routineOn?: boolean;
  toast?: boolean;
}) {
  const scale = width / W;
  const isSheet = sheet ?? (state === 'added' || state === 'routine');
  const isRoutine = routineOn ?? state === 'routine';
  const isAdded = added ?? (state === 'added' || state === 'routine');
  const count = badge ?? (isAdded ? 21 : 3);

  return (
    <div style={{ width, height: H * scale, position: 'relative', flex: 'none' }} role="img" aria-label={LABELS[state]}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: W,
          height: H,
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
          borderRadius: 48,
          overflow: 'hidden',
          background: '#fff',
          color: S.ink,
          fontFamily: ui,
          fontSize: 14,
          lineHeight: 1.4,
          boxShadow: '0 0 0 12px #0B0F14, 0 0 0 13px #2a3038, 0 40px 80px -30px rgba(0,0,0,.6)',
          isolation: 'isolate',
        }}
      >
        <StatusBar />
        {state === 'home' && <HomeScreen badge={count} />}
        {(state === 'hub' || state === 'added' || state === 'routine') && (
          <HubScreen pressed={pressed} added={isAdded} badge={count} flying={flying} />
        )}
        {state === 'review' && <ReviewScreen />}
        {state === 'order' && <OrderScreen />}
        {(state === 'home' || state === 'hub' || state === 'added' || state === 'routine') && (
          <>
            <CartBar show={cartBar ?? isAdded} added={isAdded} />
            <Nav on={state === 'home' ? 'Home' : 'Orders'} />
          </>
        )}
        <AddedSheet show={isSheet} routineOn={isRoutine} />
        <Toast show={toast ?? state === 'routine'} />
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            width: 134,
            height: 5,
            marginLeft: -67,
            borderRadius: 3,
            background: '#000',
            zIndex: 99,
          }}
        />
      </div>
    </div>
  );
}

const LABELS: Record<SaryState, string> = {
  home: 'Home for a returning store, with the usual basket as the first card',
  hub: 'Buy Again hub: usual basket, restock day, running low items',
  review: 'Review the usual basket: quantities, price changes and an out of stock swap',
  order: 'Past order: pick items to reorder at today’s prices',
  added: 'Usual basket added to cart, with savings and a weekly reminder option',
  routine: 'Weekly reminder turned on for Sundays',
};

function StatusBar() {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 11,
          left: '50%',
          width: 120,
          height: 34,
          marginLeft: -60,
          borderRadius: 20,
          background: '#0B0F14',
          zIndex: 98,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 50,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '6px 30px 0 34px',
          font: `800 15px ${ui}`,
          zIndex: 97,
        }}
      >
        <span>9:41</span>
        <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <span style={{ width: 17, height: 11, borderRadius: 2, background: '#000' }} />
          <span style={{ width: 24, height: 12, borderRadius: 3, border: '1.5px solid #000' }} />
        </span>
      </div>
    </>
  );
}

/* ── shared bits ── */
const row: CSSProperties = { display: 'flex', alignItems: 'center', gap: 8 };

function Btn({
  children,
  kind = 'p',
  full,
  style,
}: {
  children: ReactNode;
  kind?: 'p' | 'sec' | 'ghost' | 'tonal' | 'ok';
  full?: boolean;
  style?: CSSProperties;
}) {
  const k: Record<string, CSSProperties> = {
    p: { background: S.navy, color: '#fff', boxShadow: '0 8px 18px -8px rgba(29,54,141,.45)' },
    ok: { background: S.ok, color: '#fff', boxShadow: '0 8px 18px -8px rgba(14,138,95,.45)' },
    sec: { background: '#fff', color: S.navy, boxShadow: e1 },
    ghost: { background: '#F3F4F6', color: S.sub },
    tonal: { background: S.tonal, color: S.navy },
  };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        font: `700 16px/1 ${ui}`,
        height: 52,
        padding: '0 22px',
        borderRadius: 14,
        whiteSpace: 'nowrap',
        width: full ? '100%' : undefined,
        boxSizing: 'border-box',
        ...k[kind],
        ...style,
      }}
    >
      {children}
    </span>
  );
}

function Chip({ tone, icon, children }: { tone: 'd' | 'w' | 'n' | 's' | 'i'; icon?: ReactNode; children: ReactNode }) {
  const t = {
    d: [S.redBg, '#E5341A'],
    w: [S.warnBg, S.warn],
    n: ['#F3F3F4', S.sub],
    s: [S.okBg, S.ok],
    i: [S.info, S.navy],
  }[tone];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '4px 10px 4px 8px',
        borderRadius: 999,
        font: `700 12px/16px ${ui}`,
        whiteSpace: 'nowrap',
        background: t[0],
        color: t[1],
        alignSelf: 'flex-start',
      }}
    >
      {icon}
      {children}
    </span>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <motion.span
      key={n}
      initial={{ scale: n > 3 ? 1.35 : 1 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
      style={{
        position: 'absolute',
        top: -1,
        right: -3,
        minWidth: 18,
        height: 18,
        padding: '0 5px',
        borderRadius: 9,
        background: S.red,
        color: '#fff',
        font: `800 11px/18px ${ui}`,
        textAlign: 'center',
        border: '1.5px solid #fff',
      }}
    >
      {n}
    </motion.span>
  );
}

function CartIcon({ n }: { n: number }) {
  return (
    <span style={{ position: 'relative', width: 32, height: 32, display: 'grid', placeItems: 'center' }}>
      <ShoppingCart size={24} strokeWidth={1.5} />
      <Badge n={n} />
    </span>
  );
}

function TopBar({ title, badge = 3 }: { title: string; badge?: number }) {
  return (
    <div style={{ ...row, gap: 12, padding: '58px 16px 10px' }}>
      <span style={{ width: 32, height: 32, display: 'grid', placeItems: 'center' }}>
        <ArrowLeft size={24} strokeWidth={1.5} />
      </span>
      <h3 style={{ font: `700 19px/1.2 ${display}`, margin: 0, flex: 1 }}>{title}</h3>
      <CartIcon n={badge} />
    </div>
  );
}

function Thumbs({ ids, more }: { ids: Sku[]; more: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {ids.map((i) => (
        <span
          key={i}
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: '#fff',
            display: 'grid',
            placeItems: 'center',
            marginRight: -10,
            boxShadow: `0 0 0 2px ${S.mint}`,
          }}
        >
          <img src={`${IMG}/${i}.webp`} alt="" style={{ maxWidth: 32, maxHeight: 32, objectFit: 'contain' }} />
        </span>
      ))}
      <span
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: S.ink,
          color: '#fff',
          display: 'grid',
          placeItems: 'center',
          font: `700 12px/1 ${ui}`,
          boxShadow: `0 0 0 2px ${S.mint}`,
        }}
      >
        {more}
      </span>
    </div>
  );
}

function SecHead({ t, s }: { t: string; s: string }) {
  return (
    <div style={{ ...row, gap: 12, padding: '0 16px' }}>
      <div style={{ flex: 1 }}>
        <h4 style={{ font: `700 19px/1.25 ${display}`, margin: 0 }}>{t}</h4>
        <p style={{ margin: '2px 0 0', color: S.sub, fontWeight: 500 }}>{s}</p>
      </div>
      <span
        style={{
          ...row,
          gap: 4,
          height: 30,
          padding: '0 12px',
          borderRadius: 999,
          background: '#F3F4F6',
          color: S.sub,
          font: `700 14px ${ui}`,
        }}
      >
        View all
      </span>
    </div>
  );
}

function ProductCard({ id, chip }: { id: Sku; chip: [tone: 'd' | 'w' | 'n', label: string] }) {
  const p = P[id];
  return (
    <div style={{ flex: 'none', width: 136, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div
        style={{
          position: 'relative',
          width: 136,
          height: 136,
          borderRadius: 16,
          background: '#fff',
          boxShadow: e1,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <img src={`${IMG}/${id}.webp`} alt="" style={{ maxWidth: 104, maxHeight: 104, objectFit: 'contain' }} />
        <span
          style={{
            position: 'absolute',
            right: 10,
            bottom: 10,
            width: 32,
            height: 32,
            borderRadius: 10,
            background: '#fff',
            color: S.navy9,
            display: 'grid',
            placeItems: 'center',
            boxShadow: e2,
          }}
        >
          <Plus size={20} strokeWidth={1.5} />
        </span>
      </div>
      <Chip tone={chip[0]} icon={<Clock size={12} strokeWidth={2} />}>
        {chip[1]}
      </Chip>
      <div>
        <div style={{ font: `500 14px/20px ${ui}`, color: S.txt, height: 40, overflow: 'hidden' }}>{p.n}</div>
        <div style={{ font: `500 13px/18px ${ui}`, color: S.meta }}>{p.k}</div>
      </div>
    </div>
  );
}

function RunningLow() {
  return (
    <div style={{ display: 'flex', gap: 14, padding: '14px 16px 20px', overflow: 'hidden' }}>
      <ProductCard id="milk" chip={['d', 'Due today']} />
      <ProductCard id="eggs" chip={['w', 'Due in 2 days']} />
      <ProductCard id="fairy" chip={['n', 'Due in 5 days']} />
    </div>
  );
}

function UsualCta({ label, pressed, added }: { label: string; pressed?: boolean; added?: boolean }) {
  return (
    <motion.span
      animate={{ scale: pressed ? 0.97 : 1 }}
      transition={{ duration: 0.12, ease: 'easeOut' }}
      style={{ flex: 1, display: 'flex' }}
    >
      {added ? (
        <Btn kind="ok" full>
          <CheckCircle2 size={20} strokeWidth={1.5} />
          Added · 18 items
        </Btn>
      ) : (
        <Btn full style={pressed ? { background: S.navy9 } : undefined}>
          <Repeat size={20} strokeWidth={1.5} />
          {label}
        </Btn>
      )}
    </motion.span>
  );
}

/* ── 01 Home ── */
function HomeScreen({ badge }: { badge: number }) {
  return (
    <div style={{ paddingTop: 50 }}>
      <div style={{ ...row, gap: 12, padding: '8px 16px 12px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ font: `500 12px/16px ${ui}`, color: '#9E9E9E' }}>Deliver to</div>
          <div style={{ ...row, gap: 4, font: `700 14px/20px ${ui}` }}>
            Al Amana Grocery · Riyadh <ChevronDown size={14} />
          </div>
        </div>
        <CartIcon n={badge} />
      </div>
      <div
        style={{
          margin: '0 16px 16px',
          height: 48,
          borderRadius: 14,
          background: '#F8F8F9',
          ...row,
          padding: '0 14px',
          color: S.meta,
          fontWeight: 500,
        }}
      >
        <Search size={20} strokeWidth={1.5} />
        Search for what you’re missing
      </div>
      <Hero home />
      <div style={{ height: 20 }} />
      <SecHead t="Running low" s="3 items are due this week" />
      <RunningLow />
    </div>
  );
}

function Hero({ home, pressed, added }: { home?: boolean; pressed?: boolean; added?: boolean }) {
  return (
    <div
      style={{
        margin: '0 16px',
        background: S.mint,
        borderRadius: 22,
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {!home && (
        <img
          src={`${IMG}/bag.webp`}
          alt=""
          style={{ position: 'absolute', right: 12, top: 14, width: 92, height: 100, objectFit: 'contain' }}
        />
      )}
      <div>
        <div style={{ ...row, gap: 4, font: `800 10.5px/14px ${ui}`, letterSpacing: '.08em', color: S.mintInk }}>
          <Repeat size={14} strokeWidth={2} />
          {home ? 'WELCOME BACK' : 'YOUR USUAL'}
        </div>
        <h2
          style={{
            font: `800 ${home ? 21 : 24}px/${home ? 26 : 28}px ${display}`,
            letterSpacing: '-.01em',
            margin: '4px 0',
            maxWidth: home ? 'none' : 220,
          }}
        >
          {home ? 'Your usual basket is ready' : 'Restock your usual in one tap'}
        </h2>
        <p style={{ margin: 0, color: S.sub, fontWeight: 500 }}>
          {home ? '18 items · last ordered 6 days ago' : 'Built from your last 6 orders'}
        </p>
      </div>
      <Thumbs ids={home ? ['milk', 'eggs', 'coke', 'fairy', 'nes'] : ['milk', 'eggs', 'tea', 'fairy', 'oil', 'nes']} more={home ? '+13' : '+12'} />
      {!home && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {[
            ['18', 'items'],
            ['SAR 1,284', 'est. total'],
            ['~7 days', 'your cycle'],
          ].map(([b, s]) => (
            <div key={s} style={{ background: '#fff', borderRadius: 12, padding: '10px 12px', boxShadow: e1 }}>
              <b style={{ display: 'block', whiteSpace: 'nowrap', font: `700 15px/22px ${ui}` }}>{b}</b>
              <span style={{ font: `500 12px/16px ${ui}`, color: S.sub }}>{s}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <UsualCta label={home ? 'Add all · SAR 1,284' : 'Add all to cart'} pressed={pressed} added={added} />
        <Btn kind="sec">Review</Btn>
      </div>
    </div>
  );
}

/* ── 02 Hub ── */
function HubScreen({
  pressed,
  added,
  badge,
  flying,
}: {
  pressed?: boolean;
  added?: boolean;
  badge: number;
  flying?: boolean;
}) {
  const tabs = ['Usual basket', 'Past orders', 'Running low', 'Deals'];
  return (
    <div>
      <TopBar title="Buy again" badge={badge} />
      <div style={{ padding: '0 16px' }}>
        <span
          style={{
            ...row,
            display: 'inline-flex',
            gap: 6,
            background: '#F8F8F9',
            borderRadius: 999,
            padding: '6px 12px',
            font: `500 12px/16px ${ui}`,
            color: S.meta,
          }}
        >
          Delivering to <b style={{ color: S.ink }}>Al Amana Grocery · Riyadh</b>
          <ChevronDown size={14} />
        </span>
      </div>
      <div style={{ display: 'flex', gap: 8, padding: '12px 16px 16px', overflow: 'hidden' }}>
        {tabs.map((t, i) => (
          <span
            key={t}
            style={{
              flex: 'none',
              ...row,
              gap: 6,
              padding: '8px 14px',
              borderRadius: 999,
              background: i === 0 ? S.navy : '#F3F4F6',
              color: i === 0 ? '#fff' : S.sub,
              font: `700 14px/20px ${ui}`,
            }}
          >
            {t}
            {t === 'Running low' && <i style={{ width: 6, height: 6, borderRadius: '50%', background: S.red }} />}
          </span>
        ))}
      </div>
      <Hero pressed={pressed} added={added} />
      <div
        style={{
          margin: '12px 16px 0',
          background: S.info,
          borderRadius: 16,
          padding: '12px 14px',
          ...row,
          gap: 12,
        }}
      >
        <span
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: '#fff',
            display: 'grid',
            placeItems: 'center',
            color: S.navy,
          }}
        >
          <Calendar size={20} strokeWidth={1.5} />
        </span>
        <div style={{ flex: 1 }}>
          <b style={{ display: 'block', font: `700 14px/20px ${ui}` }}>You usually restock on Sundays</b>
          <span style={{ font: `500 12px/16px ${ui}`, color: S.sub }}>Next slot: Sun 25 Oct · 8–12 AM</span>
        </div>
        <span style={{ font: `700 14px ${ui}`, color: S.navy }}>Schedule</span>
      </div>
      <div style={{ height: 8, background: '#F6F6F6', margin: '16px 0' }} />
      <SecHead t="Running low" s="Based on how often you reorder" />
      <RunningLow />
      {flying && <Flyers />}
    </div>
  );
}

/* The usual's thumbnails lift off the card and arc into the cart (K2). */
const FLY: Sku[] = ['milk', 'eggs', 'tea', 'fairy', 'oil', 'nes'];
function Flyers() {
  const reduced = useReducedMotion();
  if (reduced) return null;
  // Thumbs sit at roughly y=325 in the hub, x=34 + 34*i; the cart is at (358, 74).
  return (
    <>
      {FLY.map((id, i) => {
        const sx = 34 + i * 34;
        const sy = 325;
        return (
          <motion.span
            key={id}
            initial={{ x: sx, y: sy, scale: 1, opacity: 1 }}
            animate={{
              x: [sx, sx, (sx + 336) / 2 - 50, 336],
              y: [sy, sy - 16, 60, 52],
              scale: [1, 1.12, 0.8, 0.4],
              opacity: [1, 1, 1, 0],
            }}
            transition={{ duration: 0.62, delay: i * 0.08, ease: [0.45, 0, 0.2, 1], times: [0, 0.18, 0.7, 1] }}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#fff',
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 6px 12px rgba(16,33,46,.18)',
              zIndex: 80,
            }}
          >
            <img src={`${IMG}/${id}.webp`} alt="" style={{ maxWidth: 32, maxHeight: 32 }} />
          </motion.span>
        );
      })}
    </>
  );
}

function CartBar({ show, added }: { show: boolean; added: boolean }) {
  return (
    <motion.div
      initial={false}
      animate={{ y: show ? 0 : 24, opacity: show ? 1 : 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 84,
        background: '#fff',
        borderRadius: '24px 24px 0 0',
        boxShadow: esheet,
        padding: '14px 16px 26px',
        ...row,
        gap: 12,
        zIndex: 21,
      }}
    >
      <div style={{ flex: 1 }}>
        <b style={{ display: 'block', font: `700 16px/22px ${ui}` }}>
          {added ? '21 items · SAR 1,413.45' : '3 items · SAR 128.95'}
        </b>
        <span style={{ ...row, gap: 4, font: `700 12px/16px ${ui}`, color: added ? S.ok : S.warn }}>
          <Truck size={14} strokeWidth={1.5} />
          {added ? 'Free delivery unlocked' : 'SAR 371.05 more for free delivery'}
        </span>
      </div>
      <Btn style={{ height: 48 }}>View cart</Btn>
    </motion.div>
  );
}

function Nav({ on }: { on: string }) {
  const items: [string, ReactNode][] = [
    ['Home', <Home key="h" size={24} strokeWidth={1.5} />],
    ['Discover', <Search key="s" size={24} strokeWidth={1.5} />],
    ['Orders', <Package key="o" size={24} strokeWidth={1.5} />],
    ['Account', <User key="a" size={24} strokeWidth={1.5} />],
  ];
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 96,
        background: '#fff',
        borderRadius: '24px 24px 0 0',
        boxShadow: esheet,
        display: 'flex',
        justifyContent: 'space-around',
        padding: '0 8px',
        zIndex: 22,
      }}
    >
      {items.map(([l, icon]) => (
        <span
          key={l}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            width: 84,
            color: l === on ? S.navy : S.sub,
            font: `${l === on ? 700 : 500} 14px/20px ${ui}`,
          }}
        >
          <span
            style={{ width: 32, height: 3, borderRadius: 2, marginBottom: 8, background: l === on ? S.navy : 'transparent' }}
          />
          {icon}
          {l}
        </span>
      ))}
    </div>
  );
}

/* ── 03 Review ── */
function LineRow({ id, name, extra, qty }: { id: Sku; name?: string; extra: ReactNode; qty: number }) {
  return (
    <div style={{ ...row, gap: 14, padding: '14px 0', borderBottom: `1px solid ${S.hair}` }}>
      <span
        style={{
          width: 60,
          height: 60,
          borderRadius: 14,
          background: S.surf,
          display: 'grid',
          placeItems: 'center',
          flex: 'none',
        }}
      >
        <img src={`${IMG}/${id}.webp`} alt="" style={{ maxWidth: 48, maxHeight: 48, objectFit: 'contain' }} />
      </span>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <b style={{ font: `600 14px/20px ${ui}` }}>{name ?? P[id].n}</b>
        <span style={{ font: `500 12px/16px ${ui}`, color: S.sub }}>
          {P[id].k} · {P[id].p}
        </span>
        {extra}
      </div>
      <span
        style={{
          ...row,
          justifyContent: 'space-between',
          width: 108,
          height: 36,
          borderRadius: 999,
          background: '#F3F5F9',
          padding: '0 4px',
          flex: 'none',
        }}
      >
        {[<span key="m">−</span>, <b key="q">{qty}</b>, <span key="p">+</span>].map((el, i) =>
          i === 1 ? (
            el
          ) : (
            <span
              key={i}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#fff',
                color: S.navy,
                display: 'grid',
                placeItems: 'center',
                boxShadow: e1,
                font: `700 16px ${ui}`,
              }}
            >
              {el}
            </span>
          ),
        )}
      </span>
    </div>
  );
}

function Sticky({ label, total, chip, cta }: { label: string; total: string; chip: ReactNode; cta: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        background: '#fff',
        borderRadius: '24px 24px 0 0',
        boxShadow: esheet,
        padding: '16px 16px 30px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        zIndex: 20,
      }}
    >
      <div style={{ ...row }}>
        <div style={{ flex: 1 }}>
          <small style={{ display: 'block', font: `500 12px/16px ${ui}`, color: S.meta }}>{label}</small>
          <span style={{ font: `800 21px/26px ${display}` }}>{total}</span>
        </div>
        {chip}
      </div>
      <Btn full>
        <Repeat size={20} strokeWidth={1.5} />
        {cta}
      </Btn>
    </div>
  );
}

function ReviewScreen() {
  const grp = (t: string, n: number) => (
    <div style={{ ...row, alignItems: 'baseline', gap: 6, paddingTop: 14, font: `700 16px/22px ${ui}` }}>
      {t} <span style={{ font: `500 14px ${ui}`, color: S.meta }}>· {n}</span>
    </div>
  );
  return (
    <>
      <TopBar title="Your usual basket" />
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ ...row }}>
          <span style={{ flex: 1, color: S.sub, fontWeight: 500 }}>18 items · built from your last 6 orders</span>
          <span style={{ ...row, gap: 4, color: S.navy, fontWeight: 700 }}>
            <Pencil size={16} strokeWidth={1.5} />
            Edit list
          </span>
        </div>
        <div style={{ background: S.okBg, borderRadius: 16, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...row }}>
            <Truck size={20} strokeWidth={1.5} color={S.ok} />
            <b style={{ flex: 1, color: S.ok }}>Free delivery unlocked</b>
            <span style={{ font: `500 12px/16px ${ui}`, color: S.sub }}>Min. SAR 500</span>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: S.ok }} />
        </div>
        <div style={{ background: S.warnBg, borderRadius: 16, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...row, color: S.warn }}>
            <Info size={20} strokeWidth={1.5} />
            <b style={{ color: '#6B4A00' }}>1 item is out of stock</b>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 10, ...row, boxShadow: e1 }}>
            <span style={{ width: 44, height: 44, borderRadius: 10, background: S.surf, display: 'grid', placeItems: 'center', opacity: 0.45 }}>
              <img src={`${IMG}/milk.webp`} alt="" style={{ maxWidth: 36, maxHeight: 36 }} />
            </span>
            <ArrowLeftRight size={16} color={S.warn} />
            <span style={{ width: 44, height: 44, borderRadius: 10, background: S.surf, display: 'grid', placeItems: 'center' }}>
              <img src={`${IMG}/milk.webp`} alt="" style={{ maxWidth: 36, maxHeight: 36 }} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <b style={{ display: 'block', font: `700 12px/16px ${ui}` }}>Almarai 2 L is out of stock</b>
              <span style={{ font: `500 12px/16px ${ui}`, color: S.sub }}>Swap for Low-fat 2 L · SAR 0.60 less</span>
            </div>
            <Btn style={{ height: 30, padding: '0 12px', borderRadius: 999, fontSize: 14, boxShadow: 'none' }}>Swap</Btn>
          </div>
        </div>
      </div>
      <div style={{ padding: '0 16px' }}>
        {grp('Beverages', 6)}
        <LineRow id="coke" qty={6} extra={<Chip tone="s" icon={<ArrowDown size={12} />}>Price dropped SAR 2.10</Chip>} />
        <LineRow id="water" qty={10} extra={<span style={{ font: `500 12px/16px ${ui}`, color: S.sub }}>Your usual: 10</span>} />
        {grp('Dairy & eggs', 4)}
        <LineRow id="eggs" qty={8} extra={<Chip tone="d" icon={<ArrowUp size={12} />}>Price up SAR 1.50</Chip>} />
      </div>
      <Sticky
        label="Estimated total"
        total="SAR 1,284.50"
        chip={<Chip tone="s" icon={<Zap size={12} />}>You save SAR 46.20</Chip>}
        cta="Add 18 items to cart"
      />
    </>
  );
}

/* ── 04 Past order ── */
function OrderScreen() {
  const lines: [Sku, number, string, boolean, ReactNode?][] = [
    ['coke', 6, 'SAR 280.80', true, <Chip key="c" tone="s" icon={<ArrowDown size={12} />}>SAR 2.10 cheaper</Chip>],
    ['indo', 4, 'SAR 168.00', true],
    ['sun', 4, 'SAR 86.40', true],
    ['water', 10, 'SAR 189.50', true],
    ['tea', 1, 'SAR 162.00', false, <Chip key="t" tone="w" icon={<Clock size={12} />}>Ordered last week</Chip>],
  ];
  return (
    <>
      <TopBar title="Order #SR-48213" />
      <div style={{ margin: '4px 16px 16px', background: '#F8F8F9', borderRadius: 18, padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ ...row, gap: 10 }}>
          <span style={{ width: 40, height: 40, borderRadius: '50%', background: S.okBg, display: 'grid', placeItems: 'center', color: S.ok }}>
            <CheckCircle2 size={20} strokeWidth={1.5} />
          </span>
          <div style={{ flex: 1 }}>
            <b style={{ display: 'block', font: `700 16px/22px ${ui}` }}>Delivered</b>
            <small style={{ font: `500 12px/16px ${ui}`, color: S.sub }}>Sun, 11 Oct · 10:42 AM</small>
          </div>
          <Btn kind="ghost" style={{ height: 30, padding: '0 12px', borderRadius: 999, fontSize: 14, background: '#fff' }}>
            Invoice
          </Btn>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {[
            ['Items', '14'],
            ['Paid', 'SAR 942.75'],
            ['Saved', 'SAR 31.40'],
          ].map(([k, v]) => (
            <div key={k} style={{ background: '#fff', borderRadius: 12, padding: '8px 10px', boxShadow: e1 }}>
              <small style={{ display: 'block', font: `500 12px/16px ${ui}`, color: S.meta }}>{k}</small>
              <b style={{ font: `700 14px/20px ${ui}` }}>{v}</b>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '0 16px' }}>
        <h4 style={{ font: `700 19px/1.25 ${display}`, margin: 0 }}>Pick items to reorder</h4>
        <p style={{ margin: '2px 0 4px', color: S.sub, fontWeight: 500 }}>Prices updated to today</p>
        {lines.map(([id, q, amt, on, chip]) => (
          <div key={id} style={{ ...row, gap: 14, padding: '12px 0', borderBottom: `1px solid ${S.hair}` }}>
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: 7,
                border: `1.5px solid ${on ? S.navy : '#C9CCD1'}`,
                background: on ? S.navy : '#fff',
                display: 'grid',
                placeItems: 'center',
                color: '#fff',
                flex: 'none',
              }}
            >
              {on && <Check size={16} strokeWidth={2} />}
            </span>
            <span style={{ width: 52, height: 52, borderRadius: 14, background: S.surf, display: 'grid', placeItems: 'center', flex: 'none' }}>
              <img src={`${IMG}/${id}.webp`} alt="" style={{ maxWidth: 42, maxHeight: 42, objectFit: 'contain' }} />
            </span>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <b style={{ font: `600 14px/20px ${ui}` }}>{P[id].n}</b>
              <span style={{ font: `500 12px/16px ${ui}`, color: S.sub }}>
                {q} x {P[id].p}
              </span>
              {chip}
            </div>
            <span style={{ font: `700 14px/20px ${ui}`, color: on ? S.ink : S.faint }}>{amt}</span>
          </div>
        ))}
      </div>
      <Sticky
        label="12 of 14 items selected"
        total="SAR 842.30"
        chip={<Chip tone="i" icon={<Truck size={12} />}>Sun, 8–12 AM</Chip>}
        cta="Reorder 12 items"
      />
    </>
  );
}

/* ── 05 Added + routine ── */
function AddedSheet({ show, routineOn }: { show: boolean; routineOn: boolean }) {
  return (
    <>
      <motion.div
        initial={false}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 0.34 }}
        style={{ position: 'absolute', inset: 0, background: 'rgba(6,6,15,.45)', zIndex: 90, pointerEvents: 'none' }}
      />
      <motion.div
        initial={false}
        animate={{ y: show ? '0%' : '105%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          background: '#fff',
          borderRadius: '28px 28px 0 0',
          padding: '10px 20px 34px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
          zIndex: 91,
        }}
      >
        <span style={{ width: 40, height: 4, borderRadius: 2, background: '#E6E6E7' }} />
        <span style={{ width: 64, height: 64, borderRadius: '50%', background: S.okBg, display: 'grid', placeItems: 'center', color: S.ok }}>
          <Check size={34} strokeWidth={2.2} />
        </span>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ font: `800 21px/26px ${display}`, margin: 0 }}>18 items added to your cart</h3>
          <p style={{ margin: '6px auto 0', color: S.sub, fontWeight: 500, maxWidth: 300 }}>
            Your usual basket is in. You saved SAR 46.20 on deals.
          </p>
        </div>
        <div style={{ width: '100%', background: '#F8F8F9', borderRadius: 14, padding: '12px 14px', ...row, gap: 10 }}>
          <span style={{ display: 'flex' }}>
            {(['milk', 'eggs', 'tea'] as Sku[]).map((i) => (
              <span
                key={i}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  marginRight: -8,
                  boxShadow: '0 0 0 2px #F8F8F9',
                }}
              >
                <img src={`${IMG}/${i}.webp`} alt="" style={{ maxWidth: 24, maxHeight: 24 }} />
              </span>
            ))}
          </span>
          <div style={{ flex: 1, paddingLeft: 8 }}>
            <b style={{ display: 'block', font: `700 14px/20px ${ui}` }}>21 items · SAR 1,413.45</b>
            <span style={{ ...row, gap: 4, font: `700 12px/16px ${ui}`, color: S.ok }}>
              <Truck size={12} />
              Free delivery · Sun, 8–12 AM
            </span>
          </div>
        </div>
        <motion.div
          initial={false}
          animate={{ background: routineOn ? S.info : '#F8F8F9' }}
          style={{
            width: '100%',
            borderRadius: 16,
            padding: 14,
            ...row,
            gap: 12,
            boxShadow: routineOn ? 'inset 0 0 0 1px rgba(29,54,141,.35)' : 'none',
          }}
        >
          <span style={{ width: 40, height: 40, borderRadius: 10, background: '#fff', display: 'grid', placeItems: 'center', color: S.navy, flex: 'none' }}>
            <Bell size={20} strokeWidth={1.5} />
          </span>
          <div style={{ flex: 1 }}>
            <b style={{ display: 'block', font: `700 14px/20px ${ui}` }}>Remind me every Sunday</b>
            <span style={{ font: `500 12px/16px ${ui}`, color: S.sub }}>
              We’ll have your usual basket ready at 8 PM, the night before you restock.
            </span>
          </div>
          <span
            style={{
              width: 44,
              height: 26,
              borderRadius: 13,
              background: routineOn ? S.navy : '#D5D8DD',
              position: 'relative',
              flex: 'none',
              transition: 'background .18s',
            }}
          >
            <motion.span
              initial={false}
              animate={{ x: routineOn ? 18 : 0 }}
              transition={{ duration: 0.18 }}
              style={{
                position: 'absolute',
                top: 3,
                left: 3,
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,.2)',
              }}
            />
          </span>
        </motion.div>
        <Btn full>View cart</Btn>
      </motion.div>
    </>
  );
}

function Toast({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          style={{
            position: 'absolute',
            top: 58,
            left: 0,
            right: 0,
            margin: '0 auto',
            width: 'max-content',
            background: S.ink,
            color: '#fff',
            borderRadius: 16,
            padding: '12px 16px 12px 14px',
            ...row,
            gap: 10,
            zIndex: 95,
            boxShadow: '0 10px 22px -6px rgba(16,33,46,.35)',
          }}
        >
          <CheckCircle2 size={20} color="#5FE0A2" />
          <span>
            <b style={{ display: 'block', font: `700 14px/20px ${ui}` }}>Reminder set</b>
            <span style={{ font: `500 12px/16px ${ui}`, color: '#B8C0C8' }}>Sundays, 8 PM · edit anytime in Orders</span>
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── the "Add all" sequence ──────────────────────────
   K1 tap → K2 items fly to the cart → K3 badge 3 → 21 and
   "Added" → K4 cart bar → K5 sheet with savings → K6 weekly
   reminder on. About five and a half seconds, then it loops. */
type Beat = { ms: number; s: Partial<Parameters<typeof SaryPhone>[0]> };
const BEATS: Beat[] = [
  { ms: 1000, s: {} },
  { ms: 220, s: { pressed: true } },
  { ms: 820, s: { flying: true } },
  { ms: 700, s: { added: true, badge: 21, cartBar: true } },
  { ms: 1500, s: { added: true, badge: 21, cartBar: true, sheet: true } },
  { ms: 1500, s: { added: true, badge: 21, cartBar: true, sheet: true, routineOn: true, toast: true } },
];

export function SaryAddAllLoop({ width = 300, playing = true }: { width?: number; playing?: boolean }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!playing || reduced) return;
    const t = setTimeout(() => setI((n) => (n + 1) % BEATS.length), BEATS[i].ms);
    return () => clearTimeout(t);
  }, [i, playing, reduced]);

  const beat = reduced ? BEATS[4] : BEATS[i];
  return (
    <SaryPhone
      state="hub"
      width={width}
      pressed={false}
      added={false}
      badge={3}
      cartBar={false}
      sheet={false}
      routineOn={false}
      toast={false}
      {...beat.s}
    />
  );
}
