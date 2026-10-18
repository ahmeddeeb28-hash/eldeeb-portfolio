import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';

/* ── fresh phone ─────────────────────────────────────
   The "Order placed" screens rebuilt in code from the
   checkout-motion prototype, so every use case in the case
   study shows the real design, not a screenshot. Everything
   is laid out on the prototype's own 440×956 canvas and scaled
   to the width it is given; values match the Figma frames
   (K1 to K7, K1a, K1b) and the prototype's tokens. */

export type PhoneState =
  | 'placing'
  | 'edit-address'
  | 'edit-items'
  | 'cancelled'
  | 'sent'
  | 'burst'
  | 'placed'
  | 'late'
  | 'scheduled';

const IMG = '/images/case-studies/fresh';

export const F = {
  deep: '#103F2D',
  green: '#1F9D63',
  mint: '#E4F4EA',
  bg: '#F6F6F3',
  card: '#FFFFFF',
  ink: '#111512',
  sub: '#667068',
  hair: '#E8ECE6',
  tile: '#F1F2EF',
  gold: '#FFB547',
  amber: '#B45309',
  amberBg: '#FFF6E5',
  red: '#C2264B',
};

const W = 440;
const H = 956;
const RING = 766.5; // 2πr for r = 122
const display = '"Bricolage Grotesque", Inter, system-ui, sans-serif';
const ui = 'Manrope, Inter, system-ui, sans-serif';

const card: CSSProperties = {
  background: F.card,
  border: `1px solid ${F.hair}`,
  borderRadius: 22,
};

/* ── frame ── */
export function FreshPhone({
  state,
  progress = 0,
  width = 300,
}: {
  state: PhoneState;
  /* 0 → 1 across the five second placing window */
  progress?: number;
  width?: number;
}) {
  const scale = width / W;
  return (
    <div
      style={{ width, height: H * scale, position: 'relative', flex: 'none' }}
      role="img"
      aria-label={LABELS[state]}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: W,
          height: H,
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
          borderRadius: 58,
          overflow: 'hidden',
          background: F.bg,
          color: F.ink,
          fontFamily: ui,
          boxShadow: '0 0 0 11px #070908, 0 0 0 12px #333a36, 0 50px 90px -30px rgba(0,0,0,.7)',
          isolation: 'isolate',
        }}
      >
        <StatusBar />
        <Screen state={state} progress={progress} />
        <div
          style={{
            position: 'absolute',
            bottom: 9,
            left: '50%',
            width: 144,
            height: 5,
            marginLeft: -72,
            borderRadius: 3,
            background: F.ink,
            zIndex: 89,
          }}
        />
      </div>
    </div>
  );
}

const LABELS: Record<PhoneState, string> = {
  placing: 'Placing screen: ring and five second countdown around the delivery address',
  'edit-address': 'Edit address sheet over the placing screen, countdown paused',
  'edit-items': 'Edit items sheet over the placing screen, countdown paused',
  cancelled: 'Order cancelled inside the free window, nothing charged',
  sent: 'Countdown finished, order sending to the restaurant',
  burst: 'Success burst: bag pops in with confetti',
  placed: 'Order placed: arrival time, savings and receipt, tracking opens in 5 seconds',
  late: 'Live tracking with a running late notice and wallet credit',
  scheduled: 'Scheduled order confirmed for tomorrow, charged later',
};

function StatusBar() {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: '50%',
          width: 126,
          height: 37,
          marginLeft: -63,
          background: '#000',
          borderRadius: 20,
          zIndex: 90,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '6px 34px 0 50px',
          font: `700 17px ${ui}`,
          zIndex: 89,
          color: F.ink,
        }}
      >
        <span>19:15</span>
        <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ width: 18, height: 11, borderRadius: 2, background: F.ink, opacity: 0.9 }} />
          <span style={{ width: 26, height: 12, borderRadius: 4, border: `2px solid ${F.ink}`, opacity: 0.9 }} />
        </span>
      </div>
    </>
  );
}

/* ── screens ── */
function Screen({ state, progress }: { state: PhoneState; progress: number }) {
  switch (state) {
    case 'placing':
      return <Placing progress={progress} />;
    case 'edit-address':
      return (
        <>
          <Placing progress={0.36} paused dim />
          <AddressSheet />
        </>
      );
    case 'edit-items':
      return (
        <>
          <Placing progress={0.52} paused dim />
          <ItemsSheet />
        </>
      );
    case 'cancelled':
      return <Cancelled />;
    case 'sent':
      return <Placing progress={1} sent />;
    case 'burst':
      return <Burst />;
    case 'placed':
      return <Placed />;
    case 'scheduled':
      return <Placed scheduled />;
    case 'late':
      return <Late />;
  }
}

function Glow({ strong }: { strong?: boolean }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: -60,
        top: -40,
        width: 560,
        height: 560,
        borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(205,235,215,.95), rgba(246,246,243,0))',
        opacity: strong ? 1 : 0.7,
      }}
    />
  );
}

function Disc({ faded }: { faded?: boolean }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: -110,
        top: -110,
        width: 220,
        height: 220,
        borderRadius: '50%',
        overflow: 'hidden',
        background: `#E9EEE8 url(${IMG}/map.webp) 54% 44%/330px auto no-repeat`,
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.04)',
        opacity: faded ? 0.35 : 1,
        transform: faded ? 'scale(.85)' : undefined,
      }}
    >
      <motion.span
        animate={{ scale: [0.5, 1.6], opacity: [1, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 90,
          height: 90,
          margin: '-45px 0 0 -45px',
          borderRadius: '50%',
          background: 'rgba(31,157,99,.22)',
        }}
      />
      <motion.span
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 52,
          height: 52,
          margin: '-26px 0 0 -26px',
          borderRadius: '50%',
          background: F.deep,
          border: '3px solid #fff',
          display: 'grid',
          placeItems: 'center',
          boxShadow: '0 8px 16px -4px rgba(0,0,0,.35)',
        }}
      >
        <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 8l7-4 7 4v8l-7 4-7-4z" />
          <path d="M5 8l7 4 7-4M12 12v8" />
        </svg>
      </motion.span>
    </div>
  );
}

function Ring({ progress }: { progress: number }) {
  return (
    <svg
      viewBox="0 0 256 256"
      style={{ position: 'absolute', left: -128, top: -128, width: 256, height: 256, transform: 'rotate(-90deg)' }}
    >
      <defs>
        <linearGradient id="fresh-rg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2DBE78" />
          <stop offset="1" stopColor={F.deep} />
        </linearGradient>
      </defs>
      <circle cx="128" cy="128" r="122" fill="none" strokeWidth={8} stroke="#E1E8E2" />
      <circle
        cx="128"
        cy="128"
        r="122"
        fill="none"
        strokeWidth={8}
        stroke="url(#fresh-rg)"
        strokeLinecap="round"
        strokeDasharray={RING}
        strokeDashoffset={RING * (1 - Math.max(0.04, progress))}
      />
    </svg>
  );
}

function EditPill() {
  return (
    <span
      style={{
        height: 30,
        padding: '0 12px',
        borderRadius: 99,
        background: F.mint,
        color: F.deep,
        font: `800 13px ${ui}`,
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      Edit
    </span>
  );
}

function Tick({ size = 28 }: { size?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: F.mint,
        display: 'grid',
        placeItems: 'center',
        flex: 'none',
      }}
    >
      <svg viewBox="0 0 24 24" width={size * 0.54} height={size * 0.54} fill="none" stroke={F.green} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12l5 5 9-10" />
      </svg>
    </span>
  );
}

function OrderSummary({ top, receipt, scheduled }: { top: number; receipt?: boolean; scheduled?: boolean }) {
  return (
    <div
      style={{
        ...card,
        position: 'absolute',
        left: 20,
        right: 20,
        top,
        display: 'grid',
        gridTemplateColumns: '44px minmax(0,1fr) auto',
        gap: 12,
        alignItems: 'center',
        padding: 14,
      }}
    >
      <span
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          background: '#F4F1EC',
          display: 'grid',
          placeItems: 'center',
          overflow: 'hidden',
        }}
      >
        <img src={`${IMG}/spaghetti.webp`} alt="" style={{ width: 40 }} />
      </span>
      <span>
        <b style={{ display: 'block', font: `800 14px ${ui}` }}>Vapiano · 3 items</b>
        <small style={{ font: `700 12.5px ${ui}`, color: F.sub }}>
          {scheduled ? '$24.19 · charged at 12:00 tomorrow' : '$24.19 paid · Apple Pay'}
        </small>
      </span>
      {receipt ? (
        <span style={{ font: `800 13px ${ui}`, color: F.deep }}>Receipt</span>
      ) : (
        <EditPill />
      )}
    </div>
  );
}

function PlaceText({
  eyebrow,
  title,
  sub,
  top = 432,
  edit,
}: {
  eyebrow: string;
  title: string;
  sub: string;
  top?: number;
  edit?: boolean;
}) {
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top, textAlign: 'center' }}>
      <div style={{ font: `700 15.5px ${ui}`, color: F.sub }}>{eyebrow}</div>
      <h2 style={{ margin: '2px 0 0', font: `800 38px/1.1 ${display}`, letterSpacing: '-.025em', color: F.deep }}>
        {title}
      </h2>
      <p
        style={{
          margin: '6px 0 0',
          font: `700 13.5px ${ui}`,
          color: F.sub,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {sub}
        {edit && <EditPill />}
      </p>
    </div>
  );
}

function Placing({
  progress,
  paused,
  dim,
  sent,
}: {
  progress: number;
  paused?: boolean;
  dim?: boolean;
  sent?: boolean;
}) {
  const s = Math.ceil(5 * (1 - progress));
  const label = sent || s <= 0 ? 'Sending to Vapiano' : paused ? 'Paused while you edit' : `Cancel for free in the next ${s}s`;
  return (
    <div style={{ position: 'absolute', inset: 0, filter: dim ? 'brightness(.62)' : undefined }}>
      <Glow />
      <div style={{ position: 'absolute', left: '50%', top: 280 }}>
        <Disc />
        <Ring progress={progress} />
      </div>
      <PlaceText
        eyebrow={sent ? 'Sending your order to' : 'Placing your order to'}
        title="Home"
        sub="24 Mercer St, Apt 5 · New York"
        edit={!sent}
      />
      <OrderSummary top={560} />
      {sent ? (
        <div
          style={{
            ...card,
            position: 'absolute',
            left: 20,
            right: 20,
            bottom: 30,
            padding: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Tick size={34} />
          <span>
            <b style={{ display: 'block', font: `800 15px ${ui}` }}>Sent to Vapiano</b>
            <small style={{ font: `700 12.5px ${ui}`, color: F.sub }}>The kitchen has your order</small>
          </span>
        </div>
      ) : (
        <div style={{ ...card, position: 'absolute', left: 20, right: 20, bottom: 30, padding: '16px 18px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>
              <b style={{ display: 'block', font: `800 15px ${ui}` }}>Changed your mind?</b>
              <small style={{ font: `700 12.5px ${ui}`, color: F.sub }}>{label}</small>
            </span>
            <span
              style={{
                marginLeft: 'auto',
                height: 42,
                padding: '0 18px',
                borderRadius: 99,
                border: '1px solid #F1C9D2',
                background: '#fff',
                color: F.red,
                font: `800 14px ${ui}`,
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Cancel
            </span>
          </div>
          <div style={{ height: 5, borderRadius: 3, background: '#ECEFEB', marginTop: 12, overflow: 'hidden' }}>
            <i
              style={{
                display: 'block',
                height: '100%',
                width: '100%',
                background: paused ? F.gold : F.green,
                transformOrigin: '0 50%',
                transform: `scaleX(${1 - progress})`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Sheet({ children, title, sub }: { children: ReactNode; title: string; sub: string }) {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        background: '#fff',
        borderRadius: '30px 30px 0 0',
        padding: '12px 20px 34px',
        boxShadow: '0 -20px 40px -20px rgba(0,0,0,.3)',
        zIndex: 20,
      }}
    >
      <div style={{ width: 40, height: 5, borderRadius: 3, background: '#DADDD7', margin: '0 auto 16px' }} />
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 12px',
          borderRadius: 99,
          background: F.amberBg,
          color: '#6A3D00',
          font: `800 12.5px ${ui}`,
          marginBottom: 12,
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: 2, background: F.amber }} />
        Clock paused · your order is held
      </div>
      <h3 style={{ margin: 0, font: `800 26px/1.15 ${display}`, letterSpacing: '-.02em' }}>{title}</h3>
      <p style={{ margin: '4px 0 16px', font: `700 13.5px ${ui}`, color: F.sub }}>{sub}</p>
      {children}
    </motion.div>
  );
}

function Cta({ children, light }: { children: ReactNode; light?: boolean }) {
  return (
    <div
      style={{
        height: 56,
        borderRadius: 16,
        background: light ? '#fff' : F.deep,
        color: light ? F.deep : '#fff',
        border: light ? '1px solid #DADDD7' : undefined,
        font: `800 16px ${ui}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: light ? undefined : '0 12px 22px -12px rgba(16,63,45,.55)',
      }}
    >
      {children}
    </div>
  );
}

const ADDRESSES = [
  { n: 'Home', a: '24 Mercer St, Apt 5', on: false },
  { n: 'Work · Northwind Studio', a: 'Floor 4 · team allowance applies', on: true },
  { n: 'Gym', a: '12 Baker Ave', on: false },
];

function AddressSheet() {
  return (
    <Sheet title="Deliver somewhere else?" sub="Change it now, before the kitchen starts. Same order, no new payment.">
      <div style={{ display: 'grid', gap: 10, marginBottom: 18 }}>
        {ADDRESSES.map((a) => (
          <div
            key={a.n}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              borderRadius: 18,
              border: `${a.on ? 2 : 1}px solid ${a.on ? F.green : F.hair}`,
              background: a.on ? F.mint : '#fff',
            }}
          >
            <span>
              <b style={{ display: 'block', font: `800 15px ${ui}` }}>{a.n}</b>
              <small style={{ font: `700 12.5px ${ui}`, color: F.sub }}>{a.a}</small>
            </span>
            <span
              style={{
                marginLeft: 'auto',
                width: 22,
                height: 22,
                borderRadius: '50%',
                border: `2px solid ${a.on ? F.green : '#C9D3CD'}`,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              {a.on && <span style={{ width: 10, height: 10, borderRadius: '50%', background: F.green }} />}
            </span>
          </div>
        ))}
      </div>
      <Cta>Deliver to Work</Cta>
    </Sheet>
  );
}

const ITEMS = [
  { n: 'Spaghetti pomodoro', p: '$11.50', img: 'spaghetti', q: 1 },
  { n: 'NY cheesecake', p: '$6.50', img: 'cheesecake', q: 1, changed: true },
  { n: 'Side salad', p: '$4.20', img: 'salad', q: 1, added: true },
];

function ItemsSheet() {
  return (
    <Sheet title="Fix your items" sub="Spotted a wrong quantity? Change it here. The same order carries on.">
      <div style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
        {ITEMS.map((it) => (
          <div
            key={it.n}
            style={{ display: 'grid', gridTemplateColumns: '52px minmax(0,1fr) auto', gap: 12, alignItems: 'center' }}
          >
            <span
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: '#F4F1EC',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <img src={`${IMG}/${it.img}.webp`} alt="" style={{ width: 46, height: 46, objectFit: 'contain' }} />
            </span>
            <span>
              <b style={{ display: 'block', font: `800 14.5px ${ui}` }}>{it.n}</b>
              <small style={{ font: `700 12.5px ${ui}`, color: it.changed || it.added ? F.green : F.sub }}>
                {it.changed ? 'Was 2, now 1' : it.added ? 'Added' : it.p}
              </small>
            </span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                border: '1px solid #DADDD7',
                borderRadius: 12,
                height: 36,
                padding: '0 10px',
                font: `800 14px ${ui}`,
                color: F.deep,
              }}
            >
              <span>−</span>
              <span style={{ minWidth: 14, textAlign: 'center', color: F.ink }}>{it.q}</span>
              <span>+</span>
            </span>
          </div>
        ))}
      </div>
      <Cta>Save changes</Cta>
    </Sheet>
  );
}

function Cancelled() {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Glow />
      <div style={{ position: 'absolute', left: '50%', top: 280 }}>
        <Disc faded />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        style={{ position: 'absolute', left: 24, right: 24, top: 420, textAlign: 'center' }}
      >
        <h2 style={{ margin: 0, font: `800 30px/1.1 ${display}`, letterSpacing: '-.02em' }}>Order cancelled</h2>
        <p style={{ margin: '10px auto 26px', font: `700 14.5px/1.5 ${ui}`, color: F.sub, maxWidth: 300 }}>
          Nothing was charged. Your cart is saved exactly as you left it.
        </p>
        <Cta>Back to checkout</Cta>
      </motion.div>
    </div>
  );
}

const CONFETTI = Array.from({ length: 26 }, (_, i) => {
  const a = (i / 26) * Math.PI * 2;
  const r = 150 + ((i * 37) % 90);
  return {
    x: Math.cos(a) * r,
    y: Math.sin(a) * r - 40,
    rot: (i * 47) % 360,
    c: ['#1F9D63', '#5FE0A2', '#FFB547', '#103F2D'][i % 4],
    w: i % 3 === 0 ? 8 : 12,
  };
});

function Bag({ size, top }: { size: number; top: number }) {
  return (
    <img
      src={`${IMG}/placed_bag.webp`}
      alt=""
      style={{
        position: 'absolute',
        left: '50%',
        top,
        width: size,
        height: size,
        marginLeft: -size / 2,
        filter: 'drop-shadow(0 22px 26px rgba(16,63,45,.22))',
      }}
    />
  );
}

function Burst() {
  const reduced = useReducedMotion();
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Glow strong />
      <div style={{ position: 'absolute', left: '50%', top: 270 }}>
        {CONFETTI.map((p, i) => (
          <motion.span
            key={i}
            initial={reduced ? false : { x: 0, y: 0, opacity: 0, rotate: 0 }}
            animate={{ x: p.x, y: p.y, opacity: [0, 1, 1, 0.85], rotate: p.rot }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
            style={{
              position: 'absolute',
              width: p.w,
              height: p.w * 0.5,
              borderRadius: 2,
              background: p.c,
            }}
          />
        ))}
      </div>
      <motion.div
        initial={reduced ? false : { scale: 0.25, opacity: 0 }}
        animate={{ scale: [0.25, 1.12, 1], opacity: 1 }}
        transition={{ duration: 0.65, times: [0, 0.6, 1], ease: [0.34, 1.56, 0.64, 1] }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Bag size={300} top={110} />
      </motion.div>
      <PlaceText eyebrow="Order placed for" title="Home" sub="24 Mercer St, Apt 5 · New York" />
      <OrderSummary top={560} receipt />
    </div>
  );
}

function Placed({ scheduled }: { scheduled?: boolean }) {
  const reduced = useReducedMotion();
  const rise = (i: number) => ({
    initial: reduced ? false : { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 0.2 + i * 0.09, ease: [0.2, 0.8, 0.2, 1] as const },
  });
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Glow strong />
      <Bag size={216} top={84} />
      <PlaceText
        eyebrow={scheduled ? 'Order scheduled for' : 'Order placed for'}
        title={scheduled ? 'Tomorrow 12:30' : 'Home'}
        sub="24 Mercer St, Apt 5 · New York"
        top={312}
      />
      <div style={{ position: 'absolute', left: 20, right: 20, top: 432, display: 'grid', gap: 12 }}>
        <motion.div {...rise(0)} style={{ ...card, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>
              <b style={{ display: 'block', font: `800 25px/1.1 ${display}`, letterSpacing: '-.02em' }}>
                {scheduled ? 'Arrives 12:30 tomorrow' : 'Arrives 19:45'}
              </b>
              <small style={{ font: `700 13px ${ui}`, color: F.green }}>
                {scheduled ? 'We will remind you at 12:00' : 'in about 30 min'}
              </small>
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginTop: 14 }}>
            {[0, 1, 2, 3].map((i) => (
              <i key={i} style={{ height: 5, borderRadius: 3, background: i === 0 && !scheduled ? F.green : '#E3E8E2' }} />
            ))}
          </div>
          <div style={{ marginTop: 6, font: `800 11px ${ui}`, color: F.green }}>
            {scheduled ? 'Scheduled' : 'Confirmed'}
          </div>
        </motion.div>
        <motion.div
          {...rise(1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 14px 10px 10px',
            borderRadius: 22,
            background: 'linear-gradient(120deg,#103F2D,#1B6A47)',
            color: '#fff',
            boxShadow: '0 16px 26px -16px rgba(16,63,45,.8)',
          }}
        >
          <img src={`${IMG}/gift.webp`} alt="" style={{ width: 70, height: 70, objectFit: 'contain' }} />
          <span>
            <b style={{ display: 'block', font: `800 16px ${ui}` }}>You saved $4.00</b>
            <small style={{ font: `700 12.5px ${ui}`, color: '#CFE8D9' }}>1 scratch card waiting, tap to reveal</small>
          </span>
          <span
            style={{
              marginLeft: 'auto',
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: F.gold,
              display: 'grid',
              placeItems: 'center',
              color: '#3A2600',
              font: `800 18px ${ui}`,
            }}
          >
            ›
          </span>
        </motion.div>
      </div>
      <OrderSummary top={688} receipt scheduled={scheduled} />
      <motion.div {...rise(3)} style={{ position: 'absolute', left: 20, right: 20, bottom: 30 }}>
        <div style={{ textAlign: 'center', font: `700 12.5px ${ui}`, color: F.sub, marginBottom: 10 }}>
          {scheduled ? 'We will open tracking when Vapiano starts cooking' : 'Opening live tracking in 5s'}
        </div>
        <Cta>Track your order</Cta>
      </motion.div>
    </div>
  );
}

function Late() {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: 520,
          background: `#E9EEE8 url(${IMG}/map.webp) center/cover no-repeat`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          top: 430,
          background: '#fff',
          borderRadius: '30px 30px 0 0',
          padding: '12px 20px 30px',
          boxShadow: '0 -20px 40px -20px rgba(0,0,0,.25)',
        }}
      >
        <div style={{ width: 40, height: 5, borderRadius: 3, background: '#DADDD7', margin: '0 auto 14px' }} />
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          style={{
            display: 'flex',
            gap: 12,
            padding: '14px 16px',
            borderRadius: 18,
            background: F.amberBg,
            color: '#6A3D00',
            marginBottom: 18,
          }}
        >
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              border: `2px solid ${F.amber}`,
              flex: 'none',
              marginTop: 2,
            }}
          />
          <span style={{ font: `700 13.5px/1.45 ${ui}` }}>
            <b style={{ display: 'block', font: `800 15px ${ui}`, color: '#4A2A00' }}>Running about 8 min late</b>
            Heavy traffic on Canal St. We added $3.00 credit to your wallet.
          </span>
        </motion.div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <b style={{ font: `800 22px ${display}`, letterSpacing: '-.02em' }}>Preparing your food</b>
          <span style={{ font: `800 15px ${ui}`, color: F.green }}>Now 19:53</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginTop: 14 }}>
          {['Confirmed', 'Preparing', 'On the way', 'Delivered'].map((l, i) => (
            <div key={l} style={{ font: `800 11px ${ui}`, color: i < 2 ? F.green : F.sub }}>
              <i style={{ display: 'block', height: 5, borderRadius: 3, background: i < 2 ? F.green : '#E3E8E2', marginBottom: 6 }} />
              {l}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Cta light>Message</Cta>
          <Cta light>Call rider</Cta>
        </div>
      </div>
    </div>
  );
}

/* ── the M1 sequence ─────────────────────────────────
   Loops the full motion: 5s ring and countdown, the "sent"
   tick, the burst, then the settled screen. Used where the
   film is not available and as the K1 use case. */
const SEQUENCE: { state: PhoneState; ms: number }[] = [
  { state: 'placing', ms: 5000 },
  { state: 'sent', ms: 900 },
  { state: 'burst', ms: 1100 },
  { state: 'placed', ms: 4200 },
];

export function useOrderPlacedLoop(enabled = true, only?: PhoneState) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(reduced ? 0.4 : 0);

  useEffect(() => {
    if (!enabled || reduced) return;
    let raf = 0;
    let t0 = performance.now();
    let i = 0;
    const steps = only ? SEQUENCE.filter((s) => s.state === only) : SEQUENCE;
    setStep(SEQUENCE.indexOf(steps[0]));
    const tick = (now: number) => {
      const cur = steps[i];
      const p = Math.min(1, (now - t0) / cur.ms);
      if (cur.state === 'placing') setProgress(p);
      if (p >= 1) {
        i = (i + 1) % steps.length;
        t0 = now;
        setStep(SEQUENCE.indexOf(steps[i]));
        if (steps[i].state === 'placing') setProgress(0);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled, reduced, only]);

  return { state: SEQUENCE[step].state, progress };
}

/* A phone that plays the sequence by itself. */
export function LoopingPhone({ width = 300, only }: { width?: number; only?: PhoneState }) {
  const { state, progress } = useOrderPlacedLoop(true, only);
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={state === 'placing' || state === 'sent' ? 'placing' : state}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <FreshPhone state={state} progress={progress} width={width} />
      </motion.div>
    </AnimatePresence>
  );
}
