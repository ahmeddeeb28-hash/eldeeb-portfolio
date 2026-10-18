import { motion, AnimatePresence } from 'motion/react';
import { useRef, useState, type ReactNode } from 'react';
import { Play, Volume2 } from 'lucide-react';

/* ── Shared case-study pieces ────────────────────────
   The film player, the use-case explorer and two small
   helpers used by the product case studies (fresh, Sary). */

export const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10% 0px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

export function Eyebrow({ children, tone }: { children: ReactNode; tone: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: tone }} />
      <span className="text-[10px] font-black uppercase tracking-[0.32em]" style={{ color: tone, opacity: 0.8 }}>
        {children}
      </span>
      <span className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
    </div>
  );
}

/* ── Film ──
   Plays the case film muted on loop with a "Watch the film"
   button that restarts it with sound. If the file is missing,
   `fallback` (a live phone sequence) shows instead. */
export function CaseFilm({
  src,
  poster,
  length,
  accent,
  buttonTint,
  background,
  fallback,
  fallbackText,
}: {
  src: string;
  poster?: string;
  length: string;
  accent: string;
  buttonTint: string;
  background: string;
  fallback: ReactNode;
  fallbackText: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [hasFilm, setHasFilm] = useState(true);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = false;
    v.currentTime = 0;
    v.controls = true;
    void v.play();
    setPlaying(true);
  };

  return (
    <div className="relative aspect-[16/9] rounded-[32px] overflow-hidden border border-white/5" style={{ background }}>
      {hasFilm ? (
        <>
          <video
            ref={ref}
            src={src}
            poster={poster}
            muted
            loop={!playing}
            autoPlay
            playsInline
            preload="metadata"
            onError={() => setHasFilm(false)}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {!playing && (
            <button
              type="button"
              onClick={play}
              className="absolute inset-0 flex items-end justify-start p-6 md:p-8 bg-gradient-to-t from-black/60 via-transparent to-transparent group"
              aria-label="Play the film with sound"
            >
              <span className="flex items-center gap-3 rounded-full bg-white text-black pl-2 pr-5 py-2 text-sm font-bold group-hover:scale-[1.03] transition-transform">
                <span className="w-9 h-9 rounded-full text-white grid place-items-center" style={{ background: buttonTint }}>
                  <Play className="w-4 h-4 fill-current" />
                </span>
                Watch the film
                <span className="flex items-center gap-1 text-black/50 font-semibold">
                  <Volume2 className="w-3.5 h-3.5" /> {length}
                </span>
              </span>
            </button>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center gap-10 px-6">
          <div className="scale-[0.5] sm:scale-75 md:scale-100 origin-center">{fallback}</div>
          <div className="hidden md:block max-w-[260px]">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: accent }}>
              Live preview
            </p>
            <p className="text-white/70 text-sm leading-relaxed">{fallbackText}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Use-case explorer ──
   Chips across the top, the selected case's story on the left
   and its screen on the right. `code` is the storyboard frame
   (K1, 03…); cases without one read as "Extra case". */
export type UseCase = {
  id: string;
  code?: string;
  title: string;
  what: string;
  why: string;
  shown: string;
  measured: string;
};

export function UseCaseExplorer<T extends UseCase>({
  cases,
  accent,
  renderPhone,
}: {
  cases: T[];
  accent: string;
  renderPhone: (c: T) => ReactNode;
}) {
  const [active, setActive] = useState(0);
  const c = cases[active];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-10 items-start">
      <div>
        <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Use cases">
          {cases.map((u, i) => (
            <button
              key={u.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-colors border ${
                i === active
                  ? 'bg-white text-black border-white'
                  : 'border-white/10 text-white/60 hover:text-white hover:border-white/30'
              }`}
            >
              {u.code && <span className={i === active ? 'text-black/40' : 'text-white/30'}>{u.code} </span>}
              {u.title}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: accent }}>
              {c.code ?? 'Extra case'} · {String(active + 1).padStart(2, '0')} / {String(cases.length).padStart(2, '0')}
            </p>
            <h3 className="text-white text-3xl md:text-4xl font-black tracking-tight mb-4">{c.title}</h3>
            <p className="text-white/60 text-base md:text-lg leading-relaxed mb-8 max-w-xl">{c.what}</p>

            <dl className="grid gap-px rounded-2xl overflow-hidden border border-white/10 bg-white/10 max-w-xl">
              {[
                ['Why it exists', c.why],
                ['Shown to', c.shown],
                ['Measured by', c.measured],
              ].map(([k, v]) => (
                <div key={k} className="bg-[#0D0D0D] px-5 py-4 grid grid-cols-[110px_1fr] gap-4">
                  <dt className="text-white/35 text-[10px] font-black uppercase tracking-[0.2em] pt-0.5">{k}</dt>
                  <dd className="text-white/85 text-sm leading-relaxed">{v}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center lg:sticky lg:top-40">
        <AnimatePresence mode="wait">
          <motion.div
            key={c.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
          >
            {renderPhone(c)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
