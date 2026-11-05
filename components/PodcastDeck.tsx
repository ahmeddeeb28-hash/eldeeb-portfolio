import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Disc3, Headphones, Pause, Play, RotateCcw, RotateCw } from 'lucide-react';

/* ── Podcasts and talks: a playable deck ──
   Every episode plays right here, on a record player (the record spins,
   the tone arm drops in and travels with the episode) or in a headphones
   view (cups glow, a level meter moves). Swipe the record, use the arrows
   or the arrow keys to move between episodes and shows. Audio is each
   episode's own public MP3 from its podcast feed; nothing loads until play.
   Titles are English translations; the episodes themselves are in Arabic.
   Blueprint episodes come from its Spotify for Creators (Anchor) feed. */

type Show = { name: string; tone: string; ink: string; mark: string; feed: string };
const SHOWS: Record<'blueprint' | 'ask' | 'living', Show> = {
  blueprint: { name: 'Blueprint', tone: '#1428F5', ink: '#FFE600', mark: '/images/podcasts/blueprint-show.webp', feed: 'https://creators.spotify.com/pod/profile/blueprintcast/' },
  ask: { name: 'Ask Designer', tone: '#F5B800', ink: '#2B1B00', mark: '/images/podcasts/ask-designer-face.webp', feed: 'https://podcasts.apple.com/us/podcast/id1472945887' },
  living: { name: 'Philosophy of Living', tone: '#E9F3E4', ink: '#1F5E2A', mark: '/images/podcasts/philosophy-emblem.webp', feed: 'https://podcasts.apple.com/us/podcast/id1539547101' },
};

type Episode = {
  id: string;
  show: keyof typeof SHOWS;
  label: string;
  cover?: string;
  title: string;
  note?: string;
  topics?: string[];
  role: string;
  date: string;
  length: number; // seconds
  audio: string;
  link: string;
};

const SPK = 'https://dts.podtrac.com/redirect.mp3/api.spreaker.com/download/episode/';
const APL = 'https://podcasts.apple.com/us/podcast/id1539547101?i=';

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
    topics: ['My path into product', 'Asking effective questions', 'Setting priorities', 'Taking initiative with your team'],
    date: '2 Jul 2023', length: 3624,
    audio: 'https://anchor.fm/s/85e3e74/podcast/play/72871596/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2023-6-1%2Fe588654c-869c-fc54-affc-8a157b216003.mp3',
    link: 'https://podcasts.apple.com/us/podcast/id1472945887?i=1000619024450',
  },
  ...([
    [17, 'Across the ages, it’s you', '', '22 Sep 2021', 107, '46641861/podcast_1632346565.mp3', '1000536326934'],
    [16, 'Consistency', '', '1 Sep 2021', 146, '46336428/podcast_1630537310.mp3', '1000534044434'],
    [15, 'The ideal day', '', '18 Aug 2021', 112, '46148330/podcast_1629325224.mp3', '1000532431046'],
    [14, 'The constant struggle', 'Work on yourself if you want to become someone great.', '14 Jul 2021', 144, '45699057/episode_45699057.mp3', '1000528904526'],
    [13, 'You have to be able to go deep', 'Don’t always live on the surface. Be ready to dive deep when it matters.', '4 Jul 2021', 493, '45573462/podcast_1625433153.mp3', '1000527810058'],
    [12, 'Why do you carry worries and sadness?', '', '28 Jun 2021', 673, '45472089/podcast_1624839907.mp3', '1000527058458'],
    [11, 'If your mind is what stops you, challenge it', '', '3 May 2021', 199, '44601144/imported_5bdc74e8_e1e0_4ef3_bff6_668a057c4bfa.mp3', '1000519855738'],
    [10, 'How to make sure you reach your goals', 'Your day comes from your dreams. Plan what fills it and keep doing it.', '15 Feb 2021', 219, '43467260/podcast_1613352012.mp3', '1000509039986'],
    [9, 'Don’t build an idol with your own hands', '', '19 Jan 2021', 124, '42999326/podcast_1611015294.mp3', '1000505762762'],
    [8, 'The fastest way to let go of everyday worries', '', '15 Nov 2020', 140, '41979795/podcast_1605400619.mp3', '1000498626961'],
    [7, 'Everything comes with practice', '', '14 Nov 2020', 118, '41969016/podcast_1605321470.mp3', '1000498545259'],
    [6, 'How to raise the productivity of your life', '', '13 Nov 2020', 115, '41951495/podcast_1605232695.mp3', '1000498419680'],
    [5, 'Protect the effort you put into your work', '', '12 Nov 2020', 84, '41931850/podcast_1605148799.mp3', '1000498245952'],
    [4, 'Break your problems into small pieces', '', '11 Nov 2020', 119, '41913552/podcast_1605057543.mp3', '1000498061922'],
    [3, 'Keep yourself busy with something', '', '10 Nov 2020', 98, '41892058/podcast_1604979779.mp3', '1000498024259'],
    [2, 'Bad thinking habits: an introduction', 'The start of a series on bad thinking habits and how to deal with them.', '30 Apr 2020', 904, '41868958/https_d3ctxlq1ktw2nl_cloudfront_net_production_2020_3_30_68821617_44100_2_e2a46be82ee14.mp3', '1000497859311'],
    [1, 'An introduction to the show', 'What Philosophy of Living is about.', '3 Mar 2020', 389, '41868959/https_d3ctxlq1ktw2nl_cloudfront_net_staging_2020_1_23_51896514_44100_2_5db7663cd9ded.mp3', '1000497859313'],
  ] as const).map(([n, title, note, date, length, file, id]): Episode => ({
    id: `living-${n}`, show: 'living', label: `Ep ${n}`, role: 'Host', title, note: note || undefined, date, length,
    audio: SPK + file, link: APL + id,
  })),
];

const GOLD = 'rgba(220,190,140,0.85)';
const TEAL = '#4AF2E5';
const SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2];

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

function RecordPlayer({ ep, playing, progress, onToggle, speed, setSpeed, volume, setVolume }: {
  ep: Episode; playing: boolean; progress: number; onToggle: () => void; speed: number; setSpeed: (v: number) => void; volume: number; setVolume: (v: number) => void;
}) {
  const reduced = useReducedMotion();
  const arm = playing || progress > 0 ? 15 + progress * 18.5 : 0;
  return (
    <div className="relative w-full aspect-square max-w-[460px] mx-auto rounded-[13%] select-none"
      style={{ background: 'linear-gradient(160deg, #F4EFE4 0%, #E6DDCB 70%, #DCD1BC 100%)', boxShadow: 'inset 0 2px 0 rgba(255,255,255,.8), inset 0 -3px 0 rgba(120,100,70,.18), 0 50px 90px -40px rgba(0,0,0,.95), 0 0 0 1px rgba(0,0,0,.25)' }}
    >
      {/* recessed well, flat on the left and round around the record */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
        <path d="M0 9 H43 A41 41 0 0 1 43 91 H0 Z" fill="#CFC5B2" />
        <path d="M0 9 H43 A41 41 0 0 1 43 91 H0 Z" fill="none" stroke="rgba(90,75,55,.25)" strokeWidth=".5" />
        {/* maker plate */}
        <text x="66" y="95" fontFamily="'Fraunces', Georgia, serif" fontStyle="italic" fontSize="3.2" fill="rgba(90,75,55,.55)">Deeb · Model 33</text>
        <circle cx="94" cy="95" r="1.1" fill={playing ? TEAL : 'rgba(90,75,55,.35)'} style={{ filter: playing ? `drop-shadow(0 0 1.5px ${TEAL})` : 'none' }} />
        <text x="89.5" y="31" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="2.6" fill="rgba(90,75,55,.6)">Speed</text>
        <text x="80.5" y="77.5" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="2.6" fill="rgba(90,75,55,.6)">Volume</text>
      </svg>

      {/* the record */}
      <div className="absolute rounded-full" style={{ left: '7%', top: '14%', width: '72%', aspectRatio: '1', background: '#151413', boxShadow: '0 6px 14px rgba(0,0,0,.45)' }}>
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
      </div>

      {/* S-shaped tone arm, pivot at the top right */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
        <defs>
          <linearGradient id="pd-steel" x1="0" x2="1"><stop offset="0" stopColor="#9a948b" /><stop offset=".5" stopColor="#f2efea" /><stop offset="1" stopColor="#9a948b" /></linearGradient>
          <radialGradient id="pd-base" cx=".4" cy=".35"><stop offset="0" stopColor="#ffffff" /><stop offset=".6" stopColor="#d3cdc3" /><stop offset="1" stopColor="#9d968b" /></radialGradient>
        </defs>
        <circle cx="84" cy="15" r="8.2" fill="#BDB4A2" />
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

function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on}
      className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors"
      style={{ background: on ? 'rgba(220,190,140,0.16)' : 'transparent', color: on ? '#F3E6CF' : 'rgba(255,255,255,0.5)', border: '1px solid rgba(220,190,140,0.18)' }}
    >
      {children}
    </button>
  );
}

export function PodcastDeck() {
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
      if (!a.src) a.src = ep.audio;
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
    if (!a.src) a.src = ep.audio;
    a.currentTime = v;
    setTime(v);
  };
  const cycleSpeed = () => {
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
    setSpeed(next);
    if (audio.current) audio.current.playbackRate = next;
  };
  const go = (i: number) => {
    const n = (i + EPISODES.length) % EPISODES.length;
    if (n === cur) return;
    const a = audio.current;
    if (a) { a.pause(); a.removeAttribute('src'); a.load(); }
    setDir(i > cur ? 1 : -1);
    setCur(n); setTime(0); setDur(EPISODES[n].length); setPlaying(false); setLoading(false);
  };
  const firstOf = (s: keyof typeof SHOWS) => EPISODES.findIndex((e) => e.show === s);
  const progress = dur ? time / dur : 0;
  const slide = reduced ? {} : { initial: { x: dir * 60, opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: -dir * 60, opacity: 0 } };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-[32px] border overflow-hidden"
      style={{ borderColor: 'rgba(220,190,140,0.16)', background: 'linear-gradient(180deg, rgba(220,190,140,0.05), rgba(255,255,255,0.01))', marginBottom: 96 }}
      aria-label="Podcasts and talks"
      onKeyDown={(e) => {
        if ((e.target as HTMLElement).tagName === 'INPUT') return;
        if (e.key === 'ArrowRight') go(cur + 1);
        if (e.key === 'ArrowLeft') go(cur - 1);
      }}
    >
      <style>{`
        @keyframes pd-spin { to { transform: rotate(360deg) } }
        @keyframes pd-eq { 0% { transform: scaleY(.15) } 100% { transform: scaleY(1) } }
        .pd-range { -webkit-appearance: none; appearance: none; background: transparent; width: 100%; height: 22px; cursor: pointer }
        .pd-range::-webkit-slider-runnable-track { height: 4px; border-radius: 4px; background: linear-gradient(90deg, ${TEAL} var(--p), rgba(255,255,255,.12) var(--p)) }
        .pd-range::-moz-range-track { height: 4px; border-radius: 4px; background: rgba(255,255,255,.12) }
        .pd-range::-moz-range-progress { height: 4px; border-radius: 4px; background: ${TEAL} }
        .pd-range::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: #fff; margin-top: -5px; box-shadow: 0 0 0 4px rgba(74,242,229,.25) }
        .pd-range::-moz-range-thumb { width: 14px; height: 14px; border: 0; border-radius: 50%; background: #fff }
        .pd-range:focus-visible { outline: 2px solid ${TEAL}; outline-offset: 4px; border-radius: 6px }
      `}</style>
      <audio ref={audio} preload="none" />

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 lg:gap-14 p-6 sm:p-10 lg:p-14 items-center">
        {/* the instrument: swipe it to change episode */}
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2 mb-6 justify-center lg:justify-start" role="group" aria-label="Player view">
            <Pill on={view === 'record'} onClick={() => setView('record')}><Disc3 className="w-4 h-4" /> Record</Pill>
            <Pill on={view === 'headphones'} onClick={() => setView('headphones')}><Headphones className="w-4 h-4" /> Headphones</Pill>
          </div>
          <motion.div
            drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.25} dragSnapToOrigin
            onDragStart={() => { dragged.current = true; }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60 || info.velocity.x < -400) go(cur + 1);
              else if (info.offset.x > 60 || info.velocity.x > 400) go(cur - 1);
              setTimeout(() => { dragged.current = false; }, 0);
            }}
            className="cursor-grab active:cursor-grabbing touch-pan-y"
          >
            <AnimatePresence mode="wait" initial={false} custom={dir}>
              <motion.div key={ep.id + view} {...slide} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                {view === 'record'
                  ? <RecordPlayer ep={ep} playing={playing} progress={progress} onToggle={toggle} speed={speed} setSpeed={setSpeed} volume={volume} setVolume={setVolume} />
                  : <HeadphonesView ep={ep} playing={playing} onToggle={toggle} />}
              </motion.div>
            </AnimatePresence>
          </motion.div>
          <div className="mt-5 flex items-center justify-center gap-4">
            <button type="button" onClick={() => go(cur - 1)} aria-label="Previous episode" className="grid place-items-center w-10 h-10 rounded-full text-white/70 hover:text-white" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-white/55 tabular-nums min-w-[9ch] text-center">{cur + 1} / {EPISODES.length}</span>
            <button type="button" onClick={() => go(cur + 1)} aria-label="Next episode" className="grid place-items-center w-10 h-10 rounded-full text-white/70 hover:text-white" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-white/35">Swipe the record to change episode</p>
        </div>

        {/* the episode and the controls */}
        <div className="min-w-0">
          <p className="text-sm font-semibold" style={{ color: GOLD }}>Podcasts and talks</p>
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Shows">
            {(Object.keys(SHOWS) as (keyof typeof SHOWS)[]).map((k) => (
              <Pill key={k} on={ep.show === k} onClick={() => go(firstOf(k))}>
                {SHOWS[k].name}
                <span className="text-xs opacity-60 tabular-nums">{EPISODES.filter((e) => e.show === k).length}</span>
              </Pill>
            ))}
          </div>
          <div className="mt-6 min-h-[230px]" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={ep.id} {...slide} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                <p className="text-white/50 text-sm">{show.name} · {ep.label} · {ep.role} · {ep.date} · {mins(ep.length)} · In Arabic</p>
                <h3 className="mt-3 text-white text-2xl sm:text-3xl font-bold leading-tight tracking-[-0.01em]" style={{ textWrap: 'balance' }}>{ep.title}</h3>
                {ep.note && <p className="mt-3 text-white/65 text-base leading-relaxed">{ep.note}</p>}
                {ep.topics && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {ep.topics.map((t) => (
                      <li key={t} className="rounded-full px-3 py-1 text-[13px] text-white/70" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>{t}</li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* transport */}
          <div className="mt-6 rounded-[20px] p-5" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <input
              type="range" min={0} max={Math.round(dur)} step={1} value={Math.round(time)}
              onChange={(e) => seek(+e.target.value)}
              aria-label="Position in the episode" aria-valuetext={`${clock(time)} of ${clock(dur)}`}
              className="pd-range" style={{ ['--p' as string]: `${progress * 100}%` }}
            />
            <div className="flex justify-between text-xs text-white/45 tabular-nums mt-1">
              <span>{clock(time)}</span><span>-{clock(dur - time)}</span>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <button type="button" onClick={cycleSpeed} aria-label={`Playback speed ${speed}x`} className="w-12 sm:w-14 rounded-full py-1.5 text-xs font-bold tabular-nums text-white/70 hover:text-white" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
                {speed}x
              </button>
              <div className="flex items-center gap-3 sm:gap-4">
                <button type="button" onClick={() => skip(-15)} aria-label="Back 15 seconds" className="text-white/70 hover:text-white p-2"><RotateCcw className="w-5 h-5" /></button>
                <button type="button" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}
                  className="grid place-items-center w-14 h-14 rounded-full transition-transform hover:scale-105 active:scale-95"
                  style={{ background: TEAL, color: '#04211F', boxShadow: playing ? '0 0 0 6px rgba(74,242,229,0.15)' : 'none' }}
                >
                  {loading && playing ? <span className="w-5 h-5 rounded-full border-2 border-[#04211F]/30 border-t-[#04211F] animate-spin" /> : playing ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                </button>
                <button type="button" onClick={() => skip(30)} aria-label="Forward 30 seconds" className="text-white/70 hover:text-white p-2"><RotateCw className="w-5 h-5" /></button>
              </div>
              <a href={ep.link} target="_blank" rel="noopener noreferrer" aria-label="Open in Apple Podcasts" className="w-12 sm:w-14 grid place-items-center rounded-full py-1.5 text-white/70 hover:text-white" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
          <p className="mt-5 text-xs text-white/40">Plays here. Titles are translated; the episodes are in Arabic.</p>
        </div>
      </div>
    </motion.div>
  );
}
