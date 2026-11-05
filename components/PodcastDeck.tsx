import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Disc3, Headphones, Pause, Play, RotateCcw, RotateCw } from 'lucide-react';

/* ── Podcasts and talks: a playable deck ──
   Every episode plays right here, on a record player (the record spins,
   the tone arm drops in and travels with the episode) or in a headphones
   view (cups glow, a level meter moves). Swipe the record, use the arrows
   or the arrow keys to move between episodes and shows. Audio is each
   episode's own public MP3 from its podcast feed; nothing loads until play.
   Titles are English translations; the episodes themselves are in Arabic.
   Blueprint episodes come from its Spotify for Creators (Anchor) feed. */

type Deck = { body: [string, string, string]; well: string; ink: string; ring: string; edge: string };
type Show = { name: string; blurb: string; tone: string; ink: string; mark: string; art: string; feed: string; deck: Deck };
const SHOWS: Record<'blueprint' | 'ask', Show> = {
  blueprint: { deck: { body: ['#3A4CF2', '#2633D6', '#1B25B0'], well: '#1720A3', ink: 'rgba(255,240,140,.75)', ring: '#121A86', edge: 'rgba(255,255,255,.35)' }, name: 'Blueprint', blurb: 'the product design podcast I co-host', tone: '#1428F5', ink: '#FFE600', mark: '/images/podcasts/blueprint-show.webp', art: '/images/podcasts/blueprint-show.webp', feed: 'https://creators.spotify.com/pod/profile/blueprintcast/' },
  ask: { deck: { body: ['#F7CF45', '#EDBB1E', '#D9A30C'], well: '#C98F06', ink: 'rgba(70,30,90,.7)', ring: '#B47F04', edge: 'rgba(255,255,255,.6)' }, name: 'Ask Designer', blurb: 'I was the guest', tone: '#F5B800', ink: '#2B1B00', mark: '/images/podcasts/ask-designer-face.webp', art: '/images/podcasts/ask-designer.webp', feed: 'https://podcasts.apple.com/us/podcast/id1472945887' },
};

type Episode = {
  id: string;
  show: keyof typeof SHOWS;
  label: string;
  cover?: string;
  title: string;
  note?: string;
  role: string;
  date: string;
  length: number; // seconds
  audio: string;
  link: string;
};


const BP = (id: string, file: string) => `https://anchor.fm/s/11e702c8/podcast/play/${id}/${encodeURIComponent('https://d3ctxlq1ktw2nl.cloudfront.net/staging/' + file)}`;
const BPL = 'https://creators.spotify.com/pod/profile/blueprintcast/episodes/';

const EPISODES: Episode[] = [
  ...([
    [5, 'Design decisions: from stuck to inspired', 'Why designers get stuck between too many ideas, or can’t decide at all, and ways of thinking that help you make the call.', '5 Jul 2024', 1911, '88869778', '2024-6-5/d86ca67f-8b33-6e4f-207c-121dadadaa46.mp3', '--Design-Decisions-From-Stuck-to-Inspired-e2lmjei', 'show'],
    [4, 'How to overcome burnout', 'The burnouts we’ve each been through at work, what caused them, and what helped us recover.', '19 Aug 2023', 2093, '74806264', '2023-7-19/343632767-44100-2-5aaf4150f9e3d.mp3', '--How-to-overcome-burnout-e289dho', 'ep4'],
    [3, 'Figma’s updates and the design process', 'Recorded right after Config: how Figma brought AI in to help designers, and the different design process models and why every project differs.', '10 Aug 2023', 2213, '74459630', '2023-7-10/b9683d5b-55b8-9ebb-91b3-a747e18489d9.mp3', '--e27ur1e', 'ep3'],
    [2, 'How to start in product design and find the right place', 'The courses and paths into product design, and how your own goals decide where to focus.', '24 Jun 2023', 2057, '72550836', '2023-5-24/5238e671-9eb7-26c2-fce9-64ff19fe80c2.mp3', '--e264ivk', 'ep2'],
    [1, 'The beginning', 'Why we started Blueprint and the topics and challenges we’ll take on together.', '16 Jun 2023', 601, '72229204', '2023-5-16/335450293-44100-2-deaed5ba4a5fc.m4a', 'ep-e25qosk', 'ep1'],
  ] as const).map(([n, title, note, date, length, id, file, slug, cover]): Episode => ({
    id: `blueprint-${n}`, show: 'blueprint', label: `Ep ${n}`, role: 'Co-host', title, note, date, length,
    cover: `/images/podcasts/blueprint-${cover}.webp`, audio: BP(id, file), link: BPL + slug,
  })),
  {
    id: 'ask-designer-s3e2', show: 'ask', label: 'S3 · E2', role: 'Guest',
    title: 'Team leads, and the communication priorities between a team and its company',
    note: 'My path into product, asking effective questions, setting priorities, and taking initiative with your team.',
    date: '2 Jul 2023', length: 3624,
    audio: 'https://anchor.fm/s/85e3e74/podcast/play/72871596/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2023-6-1%2Fe588654c-869c-fc54-affc-8a157b216003.mp3',
    link: 'https://podcasts.apple.com/us/podcast/id1472945887?i=1000619024450',
  },
];

/* A build can point the player at self-hosted copies of the audio
   (VITE_PODCAST_AUDIO_BASE=audio → audio/<episode id>.mp3), used for
   previews that can't reach the podcast hosts. Production streams from
   each episode's own feed. */
const AUDIO_BASE = import.meta.env.VITE_PODCAST_AUDIO_BASE as string | undefined;
const srcOf = (ep: Episode) => (AUDIO_BASE ? `${AUDIO_BASE}/${ep.id}.mp3` : ep.audio);

const GOLD = 'rgba(220,190,140,0.85)';
const TEAL = '#4AF2E5';

const clock = (s: number) => {
  s = Math.max(0, Math.floor(s));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
};
const mins = (s: number) => (s < 60 ? '1 min' : `${Math.round(s / 60)} min`);

/* the record label: show colour, its name around the edge, the episode at the foot */
function RecordLabel({ ep }: { ep: Episode }) {
  if (ep.cover) return <img src={ep.cover} alt="" className="w-full h-full object-cover" draggable={false} />;
  const s = SHOWS[ep.show];
  const uid = ep.id;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden>
      <defs>
        <path id={`top-${uid}`} d="M 14 50 A 36 36 0 0 1 86 50" />
        <path id={`bot-${uid}`} d="M 20 54 A 30 30 0 0 0 80 54" />
        <clipPath id={`clip-${uid}`}><circle cx="50" cy="50" r="22" /></clipPath>
      </defs>
      <circle cx="50" cy="50" r="50" fill={s.tone} />
      <circle cx="50" cy="50" r="46" fill="none" stroke={s.ink} strokeOpacity=".25" strokeWidth=".6" />
      <text fontFamily="Inter, system-ui, sans-serif" fontWeight="700" fontSize="8.2" letterSpacing=".6" fill={s.ink}>
        <textPath href={`#top-${uid}`} startOffset="50%" textAnchor="middle">{s.name}</textPath>
      </text>
      <text fontFamily="Inter, system-ui, sans-serif" fontWeight="600" fontSize="7" fill={s.ink} fillOpacity=".75">
        <textPath href={`#bot-${uid}`} startOffset="50%" textAnchor="middle">{ep.label} · 33⅓</textPath>
      </text>
      <image href={s.mark} x="28" y="28" width="44" height="44" clipPath={`url(#clip-${uid})`} preserveAspectRatio="xMidYMid slice" />
      <circle cx="50" cy="50" r="22" fill="none" stroke={s.ink} strokeOpacity=".2" strokeWidth=".6" />
    </svg>
  );
}

/* ── Record player: a vintage deck, seen from above ──
   Ivory body, a recessed well, an S-shaped tone arm, a speed slider and a
   volume knob. Parked, the needle rests off the record; playing, it drops
   onto the outer groove (15°) and travels to the inner groove (33.5°).
   The slider sets the playback speed, the knob the volume. */
function VSlider({ value, min, max, step, onChange, label, format }: { value: number; min: number; max: number; step: number; onChange: (v: number) => void; label: string; format: (v: number) => string }) {
  const ref = useRef<HTMLDivElement>(null);
  const set = (clientY: number) => {
    const r = ref.current!.getBoundingClientRect();
    const t = 1 - Math.min(1, Math.max(0, (clientY - r.top) / r.height));
    onChange(Math.round((min + t * (max - min)) / step) * step);
  };
  const pct = (value - min) / (max - min);
  return (
    <div
      ref={ref} role="slider" tabIndex={0} aria-label={label} aria-valuemin={min} aria-valuemax={max} aria-valuenow={value} aria-valuetext={format(value)}
      className="absolute cursor-ns-resize touch-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 rounded"
      style={{ left: '88.5%', top: '33%', width: '6%', height: '31%', outlineColor: TEAL }}
      onPointerDown={(e) => { e.stopPropagation(); (e.target as HTMLElement).setPointerCapture?.(e.pointerId); set(e.clientY); }}
      onPointerMove={(e) => { if (e.buttons) set(e.clientY); }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); onChange(Math.min(max, +(value + step).toFixed(2))); }
        if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); onChange(Math.max(min, +(value - step).toFixed(2))); }
      }}
    >
      <span className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[22%] rounded-full" style={{ background: 'linear-gradient(90deg,#2a2622,#4a443d)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,.6)' }} />
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className="absolute h-px" style={{ top: `${(i / 8) * 100}%`, left: '108%', width: i % 4 === 0 ? '32%' : '20%', background: 'rgba(60,50,40,.45)' }} />
      ))}
      <span className="absolute left-1/2 -translate-x-1/2 w-[120%] h-[11%] rounded-[3px] -translate-y-1/2 transition-[top] duration-150"
        style={{ top: `${(1 - pct) * 100}%`, background: 'linear-gradient(180deg,#f4f1ec,#bdb6ab)', boxShadow: '0 2px 4px rgba(0,0,0,.35), inset 0 1px 0 #fff' }}
      >
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[28%] h-[28%] rounded-full" style={{ background: '#D2452F' }} />
      </span>
    </div>
  );
}

function Knob({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const start = useRef<{ y: number; v: number } | null>(null);
  const angle = -135 + value * 270;
  return (
    <div
      role="slider" tabIndex={0} aria-label="Volume" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)}
      className="absolute rounded-full cursor-ns-resize touch-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
      style={{ left: '79%', top: '79%', width: '12%', height: '12%', outlineColor: TEAL }}
      onPointerDown={(e) => { e.stopPropagation(); (e.target as HTMLElement).setPointerCapture?.(e.pointerId); start.current = { y: e.clientY, v: value }; }}
      onPointerMove={(e) => { if (e.buttons && start.current) onChange(Math.min(1, Math.max(0, start.current.v + (start.current.y - e.clientY) / 120))); }}
      onPointerUp={() => { start.current = null; }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); onChange(Math.min(1, value + 0.1)); }
        if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); onChange(Math.max(0, value - 0.1)); }
      }}
    >
      <span className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 35% 30%, #fbfaf7, #c9c3b9 55%, #8f887d)', boxShadow: '0 4px 8px rgba(0,0,0,.35), inset 0 -2px 3px rgba(0,0,0,.2)' }} />
      <span className="absolute inset-[16%] rounded-full" style={{ background: 'repeating-conic-gradient(from 0deg, #d9d4cb 0deg 4deg, #c6c0b6 4deg 8deg)', transform: `rotate(${angle}deg)`, transition: 'transform .12s' }}>
        <span className="absolute left-1/2 top-[6%] -translate-x-1/2 w-[9%] h-[30%] rounded-full" style={{ background: '#3a332c' }} />
      </span>
    </div>
  );
}

function RecordPlayer({ ep, playing, progress, onToggle, speed, setSpeed, volume, setVolume, swapDir = 1 }: {
  swapDir?: number; ep: Episode; playing: boolean; progress: number; onToggle: () => void; speed: number; setSpeed: (v: number) => void; volume: number; setVolume: (v: number) => void;
}) {
  const reduced = useReducedMotion();
  const arm = playing || progress > 0 ? 15 + progress * 18.5 : 0;
  const d = SHOWS[ep.show].deck;
  const tint = { transition: 'fill .8s ease' };
  return (
    <div className="relative w-full aspect-square max-w-[460px] mx-auto rounded-[13%] select-none"
      style={{ background: `linear-gradient(160deg, ${d.body[0]} 0%, ${d.body[1]} 70%, ${d.body[2]} 100%)`, transition: 'background .8s ease', boxShadow: `inset 0 2px 0 ${d.edge}, inset 0 -3px 0 rgba(0,0,0,.18), 0 50px 90px -40px rgba(0,0,0,.95), 0 0 0 1px rgba(0,0,0,.25)` }}
    >
      {/* recessed well, flat on the left and round around the record */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
        <path d="M0 9 H43 A41 41 0 0 1 43 91 H0 Z" fill={d.well} style={tint} />
        <path d="M0 9 H43 A41 41 0 0 1 43 91 H0 Z" fill="none" stroke="rgba(0,0,0,.2)" strokeWidth=".5" />
        {/* maker plate */}
        <text x="66" y="95" fontFamily="'Fraunces', Georgia, serif" fontStyle="italic" fontSize="3.2" fill={d.ink}>Deeb · Model 33</text>
        <circle cx="94" cy="95" r="1.1" fill={playing ? TEAL : 'rgba(0,0,0,.3)'} style={{ filter: playing ? `drop-shadow(0 0 1.5px ${TEAL})` : 'none' }} />
        <text x="89.5" y="31" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="2.6" fill={d.ink}>Speed</text>
        <text x="80.5" y="77.5" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="2.6" fill={d.ink}>Volume</text>
      </svg>

      {/* the record */}
      <div className="absolute rounded-full" style={{ left: '7%', top: '14%', width: '72%', aspectRatio: '1', background: 'rgba(0,0,0,.28)', boxShadow: 'inset 0 2px 6px rgba(0,0,0,.35)' }} />
      <AnimatePresence initial={false} custom={swapDir}>
      <motion.div key={ep.id} custom={swapDir} className="absolute rounded-full"
        style={{ left: '7%', top: '14%', width: '72%', aspectRatio: '1', background: '#151413', boxShadow: '0 6px 14px rgba(0,0,0,.45)' }}
        variants={{
          enter: (d: number) => (reduced ? { opacity: 0 } : { x: d > 0 ? '70%' : '-70%', y: '-6%', rotate: d > 0 ? 160 : -160, scale: 0.92, opacity: 0 }),
          center: { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
          exit: (d: number) => (reduced ? { opacity: 0 } : { x: d > 0 ? '-70%' : '70%', y: '-6%', rotate: d > 0 ? -160 : 160, scale: 0.92, opacity: 0 }),
        }}
        initial="enter" animate="center" exit="exit"
        transition={{ type: 'spring', stiffness: 170, damping: 24, mass: 0.9 }}
      >
        <button type="button" onClick={onToggle} data-tap aria-label={playing ? 'Pause the episode' : 'Play the episode'}
          className="absolute inset-[2.5%] rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4" style={{ outlineColor: TEAL }}
        >
          <span className="absolute inset-0 rounded-full"
            style={{
              background: 'repeating-radial-gradient(circle at 50% 50%, #111 0px, #111 1.6px, #1d1d1d 2.4px, #111 3.2px)',
              animation: reduced ? 'none' : 'pd-spin 1.8s linear infinite',
              animationPlayState: playing ? 'running' : 'paused',
            }}
          >
            <span className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(from 25deg, transparent 0deg, rgba(255,255,255,.10) 28deg, transparent 62deg, transparent 185deg, rgba(255,255,255,.07) 212deg, transparent 245deg)' }} />
            <span className="absolute inset-[30%] rounded-full overflow-hidden" style={{ boxShadow: '0 0 0 2px #0c0c0c' }}>
              <RecordLabel ep={ep} />
            </span>
            <span className="absolute left-1/2 top-1/2 w-[3.2%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: 'radial-gradient(circle at 35% 35%, #fff, #8d877e)' }} />
          </span>
          <svg viewBox="0 0 100 100" className="absolute inset-[-2%] w-[104%] h-[104%] -rotate-90 pointer-events-none" aria-hidden>
            <circle cx="50" cy="50" r="49.3" fill="none" stroke={TEAL} strokeWidth="0.9" strokeLinecap="round" pathLength={1} strokeDasharray={`${progress} 1`} opacity=".9" />
          </svg>
        </button>
      </motion.div>
      </AnimatePresence>

      {/* S-shaped tone arm, pivot at the top right */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
        <defs>
          <linearGradient id="pd-steel" x1="0" x2="1"><stop offset="0" stopColor="#9a948b" /><stop offset=".5" stopColor="#f2efea" /><stop offset="1" stopColor="#9a948b" /></linearGradient>
          <radialGradient id="pd-base" cx=".4" cy=".35"><stop offset="0" stopColor="#ffffff" /><stop offset=".6" stopColor="#d3cdc3" /><stop offset="1" stopColor="#9d968b" /></radialGradient>
        </defs>
        <circle cx="84" cy="15" r="8.2" fill={d.ring} style={tint} />
        <circle cx="84" cy="15" r="6.6" fill="url(#pd-base)" stroke="rgba(0,0,0,.18)" strokeWidth=".3" />
        <g style={{ transform: `rotate(${arm}deg)`, transformOrigin: '84px 15px', transformBox: 'view-box', transition: 'transform 1s cubic-bezier(.22,1,.36,1)' }}>
          <rect x="81.8" y="2.6" width="4.4" height="7" rx="1.3" fill="url(#pd-steel)" stroke="rgba(0,0,0,.2)" strokeWidth=".25" />
          <path d="M84 15 C84 30, 78.5 38, 80 50 S 84 62, 84 66" fill="none" stroke="rgba(0,0,0,.25)" strokeWidth="2.2" strokeLinecap="round" transform="translate(.6,.8)" />
          <path d="M84 15 C84 30, 78.5 38, 80 50 S 84 62, 84 66" fill="none" stroke="url(#pd-steel)" strokeWidth="1.5" strokeLinecap="round" />
          <g transform="rotate(-14 84 66)">
            <rect x="81.6" y="65" width="4.8" height="8.5" rx="1" fill="#e9e5de" stroke="rgba(0,0,0,.25)" strokeWidth=".3" />
            <rect x="82.6" y="70.2" width="2.8" height="2.6" rx=".5" fill={TEAL} />
          </g>
        </g>
        <circle cx="84" cy="15" r="2.4" fill="#f4f1ec" stroke="rgba(0,0,0,.2)" strokeWidth=".3" />
      </svg>

      <VSlider value={speed} min={0.75} max={2} step={0.25} onChange={setSpeed} label="Playback speed" format={(v) => `${v}x`} />
      <Knob value={volume} onChange={setVolume} />
    </div>
  );
}

/* ── Headphones view ── */
function HeadphonesView({ ep, playing, onToggle }: { ep: Episode; playing: boolean; onToggle: () => void }) {
  const reduced = useReducedMotion();
  return (
    <div className="relative w-full aspect-square max-w-[460px] mx-auto rounded-[28px] overflow-hidden grid place-items-center"
      style={{ background: 'radial-gradient(circle at 50% 42%, rgba(74,242,229,0.10) 0%, transparent 55%), linear-gradient(160deg, #141617 0%, #0B0C0D 100%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}
    >
      <div className="relative w-[78%] aspect-square">
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" aria-hidden>
          <path d="M34 112 C34 40, 166 40, 166 112" fill="none" stroke="#2B2E30" strokeWidth="13" strokeLinecap="round" />
          <path d="M34 112 C34 40, 166 40, 166 112" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeLinecap="round" transform="translate(0,-4)" />
        </svg>
        {(['left', 'right'] as const).map((side) => (
          <span key={side} className="absolute top-[47%] w-[22%] h-[34%] rounded-[40%]"
            style={{
              [side]: '6%',
              background: 'linear-gradient(180deg, #2F3335, #16191A)',
              boxShadow: playing ? '0 0 0 2px rgba(74,242,229,0.55), 0 0 30px rgba(74,242,229,0.35)' : '0 0 0 2px rgba(255,255,255,0.06)',
              transition: 'box-shadow .6s',
            }}
          />
        ))}
        <button type="button" onClick={onToggle} data-tap aria-label={playing ? 'Pause the episode' : 'Play the episode'}
          className="group absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[44%] aspect-square rounded-full overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
          style={{ outlineColor: TEAL, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.8)' }}
        >
          <RecordLabel ep={ep} />
          <span className="absolute inset-0 grid place-items-center bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity">
            {playing ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white fill-white" />}
          </span>
        </button>
        <div className="absolute left-[12%] right-[12%] bottom-[2%] h-[12%] flex items-end justify-between" aria-hidden>
          {Array.from({ length: 28 }, (_, i) => (
            <span key={i} className="w-[2.2%] h-full rounded-full origin-bottom"
              style={{
                background: `linear-gradient(180deg, ${TEAL}, rgba(74,242,229,0.25))`,
                transform: playing ? undefined : 'scaleY(0.12)',
                animation: playing && !reduced ? `pd-eq ${0.7 + ((i * 37) % 9) / 10}s ease-in-out ${-(i * 0.13)}s infinite alternate` : 'none',
                opacity: 0.85,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PodcastDeck({ variant = 'band', lead }: { variant?: 'hero' | 'band' | 'closer'; lead?: React.ReactNode }) {
  const reduced = useReducedMotion();
  const [cur, setCur] = useState(0);
  const [dir, setDir] = useState(1);
  const ep = EPISODES[cur];
  const show = SHOWS[ep.show];
  const audio = useRef<HTMLAudioElement>(null);
  const [view, setView] = useState<'record' | 'headphones'>('record');
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(ep.length);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(0.9);
  useEffect(() => { if (audio.current) audio.current.volume = volume; }, [volume]);
  useEffect(() => { if (audio.current) audio.current.playbackRate = speed; }, [speed]);
  const [loading, setLoading] = useState(false);
  const dragged = useRef(false);

  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    const on = (e: string, f: () => void) => (a.addEventListener(e, f), () => a.removeEventListener(e, f));
    const offs = [
      on('timeupdate', () => setTime(a.currentTime)),
      on('loadedmetadata', () => a.duration && isFinite(a.duration) && setDur(a.duration)),
      on('play', () => setPlaying(true)),
      on('pause', () => setPlaying(false)),
      on('waiting', () => setLoading(true)),
      on('playing', () => setLoading(false)),
      on('ended', () => setPlaying(false)),
    ];
    return () => offs.forEach((f) => f());
  }, []);

  const toggle = () => {
    if (dragged.current) return;
    const a = audio.current;
    if (!a) return;
    if (a.paused) {
      if (!a.src) a.src = srcOf(ep);
      a.playbackRate = speed;
      setLoading(true);
      void a.play().catch(() => setLoading(false));
    } else a.pause();
  };
  const skip = (d: number) => {
    const a = audio.current;
    if (a && a.src) a.currentTime = Math.min(Math.max(0, a.currentTime + d), dur);
  };
  const seek = (v: number) => {
    const a = audio.current;
    if (!a) return;
    if (!a.src) a.src = srcOf(ep);
    a.currentTime = v;
    setTime(v);
  };
  const go = (i: number) => {
    const n = (i + EPISODES.length) % EPISODES.length;
    if (n === cur) return;
    const a = audio.current;
    if (a) { a.pause(); a.removeAttribute('src'); a.load(); }
    setDir(i > cur ? 1 : -1);
    setCur(n); setTime(0); setDur(EPISODES[n].length); setPlaying(false); setLoading(false);
  };
  const progress = dur ? time / dur : 0;
  // a tiny, pre-blurred copy of the cover: cheap to scale and animate
  const backdrop = (ep.cover ?? show.art).replace('/images/podcasts/', '/images/podcasts/bg/');
  const slide = reduced ? {} : { initial: { x: dir * 60, opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: -dir * 60, opacity: 0 } };

  const cardLike = variant !== 'hero';
  const keys = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).getAttribute('role') === 'slider' || (e.target as HTMLElement).tagName === 'INPUT') return;
    if (e.key === 'ArrowRight') go(cur + 1);
    if (e.key === 'ArrowLeft') go(cur - 1);
  };

  const glow = (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden
      style={variant === 'hero' ? undefined : { WebkitMaskImage: 'radial-gradient(closest-side, #000 30%, transparent 100%)', maskImage: 'radial-gradient(closest-side, #000 30%, transparent 100%)' }}
    >
      <AnimatePresence initial={false}>
        <motion.img
          key={backdrop} src={backdrop} alt=""
          initial={{ opacity: 0 }} animate={{ opacity: variant === 'hero' ? 0.9 : 0.55 }} exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
          className="absolute left-1/2 top-1/2 w-[140%] h-[140%] max-w-none object-cover"
          style={{
            transform: 'translate(-50%,-50%)', filter: 'blur(30px) saturate(1.3)', willChange: 'transform, opacity',
            animation: reduced ? 'none' : 'pd-drift 22s ease-in-out infinite alternate', animationPlayState: playing ? 'running' : 'paused',
          }}
        />
      </AnimatePresence>
      {variant === 'hero' && <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 90% 80% at 30% 50%, rgba(10,10,10,0.15) 0%, rgba(10,10,10,0.55) 100%)' }} />}
    </div>
  );

  const instrument = (
    <div className="relative min-w-0">
      <motion.div
        drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.25} dragSnapToOrigin
        onDragStart={() => { dragged.current = true; }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -60 || info.velocity.x < -400) go(cur + 1);
          else if (info.offset.x > 60 || info.velocity.x > 400) go(cur - 1);
          setTimeout(() => { dragged.current = false; }, 0);
        }}
        className={`cursor-grab active:cursor-grabbing touch-pan-y mx-auto ${variant === 'hero' ? 'max-w-[400px]' : 'max-w-[360px]'}`}
      >
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div key={view === 'record' ? 'record' : ep.id + view} {...(view === 'record' ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } } : slide)} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
            {view === 'record'
              ? <RecordPlayer ep={ep} swapDir={dir} playing={playing} progress={progress} onToggle={toggle} speed={speed} setSpeed={setSpeed} volume={volume} setVolume={setVolume} />
              : <HeadphonesView ep={ep} playing={playing} onToggle={toggle} />}
          </motion.div>
        </AnimatePresence>
      </motion.div>
      {/* the view switch: a small segmented toggle with a sliding thumb */}
      <div className="mt-4 flex justify-center">
        <div className="relative inline-grid grid-cols-2 rounded-full p-1" role="radiogroup" aria-label="Player view"
          style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <motion.span aria-hidden className="absolute top-1 bottom-1 left-1 rounded-full" style={{ width: 'calc(50% - 4px)', background: 'rgba(255,255,255,0.16)' }}
            animate={{ x: view === 'record' ? '0%' : '100%' }} transition={{ type: 'spring', stiffness: 500, damping: 36 }} />
          {([['record', 'Record player', Disc3], ['headphones', 'Headphones', Headphones]] as const).map(([k, l, I]) => (
            <button key={k} type="button" role="radio" onClick={() => setView(k)} aria-checked={view === k} aria-label={l} title={l}
              className="relative grid place-items-center w-11 h-8 rounded-full transition-colors"
              style={{ color: view === k ? '#fff' : 'rgba(255,255,255,0.5)' }}
            >
              <I className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const panel = (
    <div className="min-w-0">
      {/* 1. what this is, and my role */}
      <p className="text-[15px] leading-snug">
        <span className="font-semibold" style={{ color: GOLD }}>{show.name}</span>
        <span className="text-white/60"> · {show.blurb}</span>
      </p>
      {/* 2. the episode */}
      <div className="mt-3 lg:min-h-[96px]" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={ep.id} {...slide} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
            <h3 className="text-white text-[21px] sm:text-[28px] font-bold leading-[1.15] tracking-[-0.015em]" style={{ textWrap: 'balance' }}>{ep.title}</h3>
            <p className="mt-2 text-white/45 text-sm">
              {ep.label === 'S3 · E2' ? 'Season 3, episode 2' : `Episode ${ep.label.replace('Ep ', '')}`} · {mins(ep.length)} · In Arabic
              <a href={ep.link} target="_blank" rel="noopener noreferrer" className="inline-flex align-middle ml-2 hover:text-white" aria-label={`Open on ${ep.show === 'blueprint' ? 'Spotify' : 'Apple Podcasts'}`}>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      {/* 3. one primary action */}
      <div className="mt-6 flex items-center gap-4">
        <button type="button" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}
          className="grid place-items-center w-14 h-14 rounded-full flex-none transition-transform hover:scale-105 active:scale-95"
          style={{ background: '#F5F3EF', color: '#111', boxShadow: playing ? '0 0 0 6px rgba(255,255,255,0.14)' : '0 8px 20px -8px rgba(0,0,0,0.6)' }}
        >
          {loading && playing ? <span className="w-5 h-5 rounded-full border-2 border-black/20 border-t-black animate-spin" /> : playing ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
        </button>
        <div className="flex-1 min-w-0">
          <input
            type="range" min={0} max={Math.round(dur)} step={1} value={Math.round(time)}
            onChange={(e) => seek(+e.target.value)}
            aria-label="Position in the episode" aria-valuetext={`${clock(time)} of ${clock(dur)}`}
            className="pd-range" style={{ ['--p' as string]: `${progress * 100}%` }}
          />
          <div className="flex items-center justify-between text-xs text-white/45 tabular-nums">
            <span>{clock(time)}</span>
            <span className="flex items-center gap-1">
              <button type="button" onClick={() => skip(-15)} aria-label="Back 15 seconds" className="p-1.5 hover:text-white"><RotateCcw className="w-4 h-4" /></button>
              <button type="button" onClick={() => skip(30)} aria-label="Forward 30 seconds" className="p-1.5 hover:text-white"><RotateCw className="w-4 h-4" /></button>
            </span>
            <span>-{clock(dur - time)}</span>
          </div>
        </div>
      </div>
      {/* 4. browse: every episode as a small cover */}
      <div className="mt-7">
        <p className="text-xs text-white/40 mb-1">All episodes</p>
        <ol className="grid grid-cols-6 gap-1.5 sm:gap-2.5 max-w-[360px] pt-[8%]">
          {EPISODES.map((e, i) => {
            const on = i === cur;
            return (
              <li key={e.id} className="relative">
                {on && (
                  <motion.span layoutId="pd-sleeve-vinyl" aria-hidden
                    className="absolute left-[6%] right-[6%] aspect-square rounded-full pointer-events-none"
                    style={{ top: '-46%', zIndex: 0, background: 'repeating-radial-gradient(circle, #111 0 1.2px, #1f1f1f 1.8px 2.4px)', boxShadow: '0 0 0 1px rgba(255,255,255,.22), 0 2px 6px rgba(0,0,0,.5)' }}
                    transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 32 }}
                  >
                    <span className="absolute inset-[34%] rounded-full" style={{ background: SHOWS[e.show].tone }} />
                    <motion.span className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(from 20deg, transparent 0 30deg, rgba(255,255,255,.12) 40deg, transparent 70deg)' }}
                      animate={reduced || !playing ? { rotate: 0 } : { rotate: 360 }} transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }} />
                  </motion.span>
                )}
                <motion.button type="button" onClick={() => go(i)} aria-label={`${SHOWS[e.show].name}, ${e.title}`} aria-current={on} title={e.title}
                  className="relative block w-full aspect-square rounded-[8px] overflow-hidden"
                  style={{ zIndex: 1, boxShadow: on ? '0 6px 14px -4px rgba(0,0,0,.6), 0 0 0 1.5px rgba(255,255,255,.9)' : '0 0 0 1px rgba(255,255,255,0.12)' }}
                  animate={{ opacity: on ? 1 : 0.6, y: on ? -2 : 0 }}
                  whileHover={reduced ? undefined : { y: -3, opacity: 1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                >
                  <img src={e.cover ?? SHOWS[e.show].art} alt="" className="w-full h-full object-cover" loading="lazy" />
                </motion.button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );

  const styles = (
    <style>{`
      @keyframes pd-spin { to { transform: rotate(360deg) } }
      @keyframes pd-drift { from { transform: translate(-50%,-50%) scale(1) rotate(0deg) } to { transform: translate(-50%,-50%) scale(1.18) rotate(10deg) } }
      @keyframes pd-eq { 0% { transform: scaleY(.15) } 100% { transform: scaleY(1) } }
      .pd-range { -webkit-appearance: none; appearance: none; background: transparent; width: 100%; height: 22px; cursor: pointer }
      .pd-range::-webkit-slider-runnable-track { height: 4px; border-radius: 4px; background: linear-gradient(90deg, rgba(255,255,255,.9) var(--p), rgba(255,255,255,.18) var(--p)) }
      .pd-range::-moz-range-track { height: 4px; border-radius: 4px; background: rgba(255,255,255,.12) }
      .pd-range::-moz-range-progress { height: 4px; border-radius: 4px; background: rgba(255,255,255,.9) }
      .pd-range::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: #fff; margin-top: -5px; box-shadow: 0 0 0 4px rgba(255,255,255,.18) }
      .pd-range::-moz-range-thumb { width: 14px; height: 14px; border: 0; border-radius: 50%; background: #fff }
      .pd-range:focus-visible { outline: 2px solid #fff; outline-offset: 4px; border-radius: 6px }
      .pd-lead > * { margin-left: auto !important; margin-right: auto !important }
      .pd-lead > div { justify-content: center }
    `}</style>
  );

  /* A · hero: the turntable takes the portrait's place beside the headline */
  if (variant === 'hero') {
    return (
      <div style={{ isolation: 'isolate' }} onKeyDown={keys}>
        {styles}<audio ref={audio} preload="none" />
        {/* the section's own header, on its own row, so it never reads as the episode's title */}
        <div className="pd-lead max-w-3xl mx-auto text-center">{lead}</div>
        {/* the podcast, introduced by its own label below a hairline */}
        <section aria-label="Podcast" className="relative mt-14 lg:mt-16 rounded-[28px] overflow-hidden p-6 sm:p-10 lg:p-12 grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 lg:gap-14 items-center"
          style={{ border: '1px solid rgba(255,255,255,0.12)', background: '#0B0B0B', isolation: 'isolate' }}
        >
          {glow}
          <div>{instrument}</div>
          <div className="min-w-0">{panel}</div>
        </section>
      </div>
    );
  }

  /* B and C · a soft, borderless band: the glow fades into the section */
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto max-w-[1080px]"
      style={{ isolation: 'isolate', marginBottom: variant === 'closer' ? 0 : 96, marginTop: variant === 'closer' ? 96 : 0 }}
      aria-label="Podcast" onKeyDown={keys}
    >
      {styles}<audio ref={audio} preload="none" />
      {glow}
      {variant === 'closer' && <p className="text-center text-white/50 text-sm mb-8">Listen in</p>}
      <div className="grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-8 md:gap-14 items-center py-6 md:py-12">
        {instrument}
        {panel}
      </div>
    </motion.div>
  );
}
