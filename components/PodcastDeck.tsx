import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Disc3, Headphones, Pause, Play, RotateCcw, RotateCw } from 'lucide-react';

/* ── Podcasts and talks: a playable deck ──
   Each episode plays right here, on a record player (the record spins,
   the tone arm drops in and travels with the episode) or in a headphones
   view (cups glow, a level meter moves). The audio is the episode's own
   public MP3 from its podcast feed; nothing is downloaded until play.
   Add an entry to EPISODES and it appears in the list. */

type Episode = {
  id: string;
  show: string;
  label: string;
  title: string;
  titleEn: string;
  date: string;
  length: number; // seconds
  topics: string[];
  audio: string;
  art: string;
  link: string;
};

const EPISODES: Episode[] = [
  {
    id: 'ask-designer-s3e2',
    show: 'Ask Designer',
    label: 'Season 3 · Episode 2',
    title: 'حلقة مع احمد الديب عن التيم ليدر وأولويات التواصل بين التيم والشركة',
    titleEn: 'Team leads, and the communication priorities between a team and its company',
    date: '2 Jul 2023',
    length: 3624,
    topics: ['My path into product', 'Asking effective questions', 'Setting priorities', 'Taking initiative with your team'],
    audio:
      'https://anchor.fm/s/85e3e74/podcast/play/72871596/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2023-6-1%2Fe588654c-869c-fc54-affc-8a157b216003.mp3',
    art: '/images/podcasts/ask-designer.webp',
    link: 'https://podcasts.apple.com/us/podcast/id1472945887?i=1000619024450',
  },
];

const GOLD = 'rgba(220,190,140,0.85)';
const TEAL = '#4AF2E5';
const SPEEDS = [1, 1.25, 1.5, 2];

const clock = (s: number) => {
  s = Math.max(0, Math.floor(s));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
};

/* ── Record player, seen from above ── */
function RecordPlayer({ ep, playing, progress, onToggle }: { ep: Episode; playing: boolean; progress: number; onToggle: () => void }) {
  const reduced = useReducedMotion();
  // tone arm: parked off the record, then drops in and travels toward the label
  const arm = playing || progress > 0 ? 23 + progress * 21 : 0;
  return (
    <div className="relative w-full aspect-square max-w-[460px] mx-auto rounded-[28px] p-[7%]"
      style={{
        background: 'linear-gradient(145deg, #2A2119 0%, #17120D 60%, #0F0C09 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255,235,200,0.08), 0 40px 80px -40px rgba(0,0,0,0.9)',
      }}
    >
      {/* platter */}
      <div className="relative w-[86%] aspect-square rounded-full" style={{ background: '#0B0B0B', boxShadow: '0 0 0 6px #1C1712, 0 20px 40px -10px rgba(0,0,0,0.8)' }}>
        <button
          type="button"
          onClick={onToggle}
          aria-label={playing ? 'Pause the episode' : 'Play the episode'}
          className="absolute inset-[2%] rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
          style={{ outlineColor: TEAL }}
        >
          <span
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'repeating-radial-gradient(circle at 50% 50%, #121212 0px, #121212 2px, #1B1B1B 3px, #121212 4px), radial-gradient(circle at 50% 50%, #222 0%, #0d0d0d 70%)',
              animation: reduced ? 'none' : 'pd-spin 1.8s linear infinite',
              animationPlayState: playing ? 'running' : 'paused',
            }}
          >
            {/* light catching the grooves */}
            <span className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(from 20deg, transparent 0deg, rgba(255,255,255,0.07) 30deg, transparent 70deg, transparent 180deg, rgba(255,255,255,0.05) 210deg, transparent 250deg)' }} />
            {/* label: the episode art */}
            <span className="absolute inset-[31%] rounded-full overflow-hidden" style={{ boxShadow: '0 0 0 3px #0B0B0B' }}>
              <img src={ep.art} alt="" className="w-full h-full object-cover" draggable={false} />
            </span>
            <span className="absolute left-1/2 top-1/2 w-[3%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: 'radial-gradient(circle, #d9d9d9, #7a7a7a)' }} />
          </span>
          {/* progress, drawn as a ring on the platter edge */}
          <svg viewBox="0 0 100 100" className="absolute inset-[-3%] w-[106%] h-[106%] -rotate-90 pointer-events-none" aria-hidden>
            <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
            <circle cx="50" cy="50" r="49" fill="none" stroke={TEAL} strokeWidth="0.8" strokeLinecap="round" pathLength={1} strokeDasharray={`${progress} 1`} />
          </svg>
        </button>
      </div>

      {/* tone arm, pivoting at the top right: parked at 0°, the needle meets
          the outer groove at 23° and reaches the label at 44° */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
        <defs>
          <linearGradient id="pd-arm" x1="0" x2="1">
            <stop offset="0" stopColor="#8d8479" /><stop offset=".5" stopColor="#e2ddd5" /><stop offset="1" stopColor="#8d8479" />
          </linearGradient>
        </defs>
        <circle cx="88" cy="12" r="7.5" fill="#2a241e" />
        <circle cx="88" cy="12" r="5.2" fill="#4a4139" />
        <g style={{ transform: `rotate(${arm}deg)`, transformOrigin: '88px 12px', transformBox: 'view-box', transition: 'transform .9s cubic-bezier(.22,1,.36,1)' }}>
          <rect x="85.6" y="2" width="4.8" height="6" rx="1.4" fill="#3a332c" />
          <rect x="87.2" y="8" width="1.6" height="62" rx=".8" fill="url(#pd-arm)" />
          <rect x="85.2" y="69" width="5.6" height="9" rx="1.2" fill="#2b2520" stroke={GOLD} strokeWidth=".35" />
        </g>
        <circle cx="88" cy="12" r="2" fill="#bdb5aa" />
      </svg>

      {/* speed light */}
      <span className="absolute left-[7%] bottom-[6%] flex items-center gap-2 text-[11px] font-semibold" style={{ color: 'rgba(255,240,215,0.55)' }}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: playing ? TEAL : 'rgba(255,255,255,0.2)', boxShadow: playing ? `0 0 10px ${TEAL}` : 'none' }} />
        33⅓
      </span>
    </div>
  );
}

/* ── Headphones view ── */
function HeadphonesView({ ep, playing, onToggle }: { ep: Episode; playing: boolean; onToggle: () => void }) {
  const reduced = useReducedMotion();
  const bars = Array.from({ length: 28 }, (_, i) => i);
  return (
    <div className="relative w-full aspect-square max-w-[460px] mx-auto rounded-[28px] overflow-hidden grid place-items-center"
      style={{ background: 'radial-gradient(circle at 50% 42%, rgba(74,242,229,0.10) 0%, transparent 55%), linear-gradient(160deg, #141617 0%, #0B0C0D 100%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}
    >
      <div className="relative w-[78%] aspect-square">
        {/* headband */}
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" aria-hidden>
          <path d="M34 112 C34 40, 166 40, 166 112" fill="none" stroke="#2B2E30" strokeWidth="13" strokeLinecap="round" />
          <path d="M34 112 C34 40, 166 40, 166 112" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeLinecap="round" transform="translate(0,-4)" />
        </svg>
        {/* ear cups */}
        {[0, 1].map((side) => (
          <span key={side} className="absolute top-[47%] w-[22%] h-[34%] rounded-[40%]"
            style={{
              [side ? 'right' : 'left']: '6%',
              background: 'linear-gradient(180deg, #2F3335, #16191A)',
              boxShadow: playing ? `0 0 0 2px rgba(74,242,229,0.55), 0 0 30px rgba(74,242,229,0.35)` : '0 0 0 2px rgba(255,255,255,0.06)',
              transition: 'box-shadow .6s',
            }}
          />
        ))}
        {/* the episode in the middle */}
        <button type="button" onClick={onToggle} aria-label={playing ? 'Pause the episode' : 'Play the episode'}
          className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[44%] aspect-square rounded-full overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
          style={{ outlineColor: TEAL, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.8)' }}
        >
          <img src={ep.art} alt="" className="w-full h-full object-cover" draggable={false} />
          <span className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
            {playing ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white fill-white" />}
          </span>
        </button>
        {/* level meter */}
        <div className="absolute left-[12%] right-[12%] bottom-[2%] h-[12%] flex items-end justify-between" aria-hidden>
          {bars.map((i) => (
            <span key={i} className="w-[2.2%] rounded-full origin-bottom"
              style={{
                height: '100%',
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

export function PodcastDeck() {
  const [cur, setCur] = useState(0);
  const ep = EPISODES[cur];
  const audio = useRef<HTMLAudioElement>(null);
  const [view, setView] = useState<'record' | 'headphones'>('record');
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(ep.length);
  const [speed, setSpeed] = useState(1);
  const [loading, setLoading] = useState(false);

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
  const choose = (i: number) => {
    const a = audio.current;
    if (a) { a.pause(); a.removeAttribute('src'); a.load(); }
    setCur(i); setTime(0); setDur(EPISODES[i].length); setPlaying(false);
  };

  const progress = dur ? time / dur : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-[32px] border overflow-hidden"
      style={{ borderColor: 'rgba(220,190,140,0.16)', background: 'linear-gradient(180deg, rgba(220,190,140,0.05), rgba(255,255,255,0.01))', marginBottom: 96 }}
      aria-label="Podcasts and talks"
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
        {/* the instrument */}
        <div className="min-w-0">
          <div role="tablist" aria-label="Player view" className="flex gap-2 mb-6 justify-center lg:justify-start">
            {([['record', 'Record', Disc3], ['headphones', 'Headphones', Headphones]] as const).map(([k, l, I]) => (
              <button key={k} type="button" role="tab" aria-selected={view === k} onClick={() => setView(k)}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors"
                style={{ background: view === k ? 'rgba(220,190,140,0.16)' : 'transparent', color: view === k ? '#F3E6CF' : 'rgba(255,255,255,0.5)', border: '1px solid rgba(220,190,140,0.18)' }}
              >
                <I className="w-4 h-4" /> {l}
              </button>
            ))}
          </div>
          {view === 'record'
            ? <RecordPlayer ep={ep} playing={playing} progress={progress} onToggle={toggle} />
            : <HeadphonesView ep={ep} playing={playing} onToggle={toggle} />}
        </div>

        {/* the episode and the controls */}
        <div className="min-w-0">
          <p className="text-sm font-semibold" style={{ color: GOLD }}>Podcasts and talks</p>
          <p className="mt-3 text-white/50 text-sm">{ep.show} · {ep.label} · {ep.date} · {Math.round(ep.length / 60)} min · Arabic</p>
          <h3 dir="rtl" lang="ar" className="mt-4 text-white text-2xl sm:text-3xl font-bold leading-[1.35] text-right lg:text-right" style={{ fontFamily: "'Noto Kufi Arabic', 'Geeza Pro', 'Segoe UI', Tahoma, sans-serif" }}>
            {ep.title}
          </h3>
          <p className="mt-3 text-white/70 text-base leading-relaxed">{ep.titleEn}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {ep.topics.map((t) => (
              <li key={t} className="rounded-full px-3 py-1 text-[13px] text-white/70" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>{t}</li>
            ))}
          </ul>

          {/* transport */}
          <div className="mt-8 rounded-[20px] p-5" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)' }}>
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
              <button type="button" onClick={cycleSpeed} aria-label={`Playback speed ${speed}x`} className="w-14 rounded-full py-1.5 text-xs font-bold tabular-nums text-white/70 hover:text-white" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
                {speed}x
              </button>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => skip(-15)} aria-label="Back 15 seconds" className="text-white/70 hover:text-white p-2"><RotateCcw className="w-5 h-5" /></button>
                <button type="button" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}
                  className="grid place-items-center w-14 h-14 rounded-full transition-transform hover:scale-105 active:scale-95"
                  style={{ background: TEAL, color: '#04211F', boxShadow: playing ? `0 0 0 6px rgba(74,242,229,0.15)` : 'none' }}
                >
                  {loading && playing ? <span className="w-5 h-5 rounded-full border-2 border-[#04211F]/30 border-t-[#04211F] animate-spin" /> : playing ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                </button>
                <button type="button" onClick={() => skip(30)} aria-label="Forward 30 seconds" className="text-white/70 hover:text-white p-2"><RotateCw className="w-5 h-5" /></button>
              </div>
              <a href={ep.link} target="_blank" rel="noopener noreferrer" aria-label="Open in Apple Podcasts" className="w-14 grid place-items-center rounded-full py-1.5 text-white/70 hover:text-white" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {EPISODES.length > 1 && (
            <ol className="mt-6 grid gap-2">
              {EPISODES.map((e, i) => (
                <li key={e.id}>
                  <button type="button" onClick={() => choose(i)} className="w-full flex items-center gap-3 rounded-2xl p-2 text-left transition-colors" style={{ background: i === cur ? 'rgba(220,190,140,0.1)' : 'transparent' }}>
                    <img src={e.art} alt="" className="w-11 h-11 rounded-lg object-cover" />
                    <span className="min-w-0"><span className="block text-white text-sm font-semibold truncate">{e.titleEn}</span><span className="block text-white/45 text-xs">{e.show} · {e.date}</span></span>
                  </button>
                </li>
              ))}
            </ol>
          )}
          <p className="mt-5 text-xs text-white/40">Plays here. Open in Apple Podcasts to listen on your phone.</p>
        </div>
      </div>
    </motion.div>
  );
}
