import { motion } from 'motion/react';
import type { Chapter } from './types';

/* ── Cinematic Chapter Divider — title sequence with letterbox frame ──
   Letterbox bars open · slate stamp ("SCENE / TAKE") fades in · teal
   hairline draws across · letters cascade with blur-to-sharp · italic
   beat closes the sequence. Subtle film-grain overlay throughout.

   Total chapters defaults to 6 (the standard cinematic spine) but a
   project with a custom chapter array can pass its own total so the
   "I / VI" frame counter stays accurate. */
export function ChapterTitle({
  chapter,
  tone = 'white',
  total = 'VI',
}: {
  chapter: Chapter;
  tone?: 'white' | 'teal' | 'red';
  total?: string;
}) {
  const accent =
    tone === 'teal' ? '#4AF2E5' : tone === 'red' ? '#FF5F5F' : 'rgba(255,255,255,0.55)';
  const letters = chapter.label.toUpperCase().split('');
  // Stagger anchors
  const T_LETTERBOX = 0.0;
  const T_SLATE = 0.25;
  const T_HAIRLINE = 0.45;
  const T_EYEBROW = 0.6;
  const T_LETTERS = 0.75;
  const T_BEAT = T_LETTERS + letters.length * 0.04 + 0.25;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-15% 0px' }}
      variants={{ hidden: {}, visible: {} }}
      className="relative py-24 md:py-32 mb-12 overflow-hidden"
    >
      {/* Letterbox bars — open like a curtain rising */}
      <motion.div
        variants={{ hidden: { scaleY: 1 }, visible: { scaleY: 0.18 } }}
        transition={{ delay: T_LETTERBOX, duration: 0.85, ease: [0.65, 0, 0.35, 1] }}
        className="absolute top-0 left-0 right-0 h-12 bg-black origin-top z-10 border-b border-white/10"
      />
      <motion.div
        variants={{ hidden: { scaleY: 1 }, visible: { scaleY: 0.18 } }}
        transition={{ delay: T_LETTERBOX, duration: 0.85, ease: [0.65, 0, 0.35, 1] }}
        className="absolute bottom-0 left-0 right-0 h-12 bg-black origin-bottom z-10 border-t border-white/10"
      />

      {/* Film grain overlay — subtle, mix-blend so it sits on top */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.8 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Slate stamp (top-left) — pulsing dot + scene/take */}
      <motion.div
        variants={{ hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0 } }}
        transition={{ delay: T_SLATE, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-3 z-20"
      >
        <span className="relative flex w-2 h-2">
          <span
            className="absolute inset-0 rounded-full opacity-60 animate-ping"
            style={{ background: accent }}
          />
          <span className="relative w-2 h-2 rounded-full" style={{ background: accent }} />
        </span>
        <span className="text-white/55 text-[9px] font-black tracking-[0.3em]">
          SCENE {chapter.num}
        </span>
        <span className="text-white/15 text-[9px] font-black">·</span>
        <span className="text-white/35 text-[9px] font-black tracking-[0.3em]">TAKE I</span>
      </motion.div>

      {/* Frame counter (top-right) */}
      <motion.div
        variants={{ hidden: { opacity: 0, x: 8 }, visible: { opacity: 1, x: 0 } }}
        transition={{ delay: T_SLATE + 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center gap-2 z-20"
      >
        <span className="text-white/35 text-[9px] font-black tracking-[0.3em]">
          {chapter.roman}
        </span>
        <span className="text-white/15 text-[9px] font-black">/</span>
        <span className="text-white/35 text-[9px] font-black tracking-[0.3em]">{total}</span>
      </motion.div>

      {/* Center stack */}
      <div className="relative z-0 flex flex-col items-center gap-6 md:gap-7 text-center pt-8 md:pt-10">
        {/* Hairline draws in */}
        <motion.span
          variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
          transition={{ delay: T_HAIRLINE, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="block w-24 md:w-32 h-px origin-center"
          style={{ background: accent, opacity: 0.7 }}
        />

        {/* Eyebrow */}
        <motion.span
          variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
          transition={{ delay: T_EYEBROW, duration: 0.5 }}
          className="text-[10px] font-black uppercase tracking-[0.5em]"
          style={{ color: accent }}
        >
          Chapter {chapter.num}
        </motion.span>

        {/* Title — letter cascade with blur-to-sharp */}
        <h2
          className="font-black tracking-tight leading-[0.9] flex flex-wrap justify-center"
          style={{
            fontSize: 'clamp(56px, 9vw, 120px)',
            color: '#ffffff',
            letterSpacing: '0.02em',
          }}
          aria-label={chapter.label}
        >
          {letters.map((ch, i) => (
            <motion.span
              key={`${chapter.id}-${i}`}
              aria-hidden="true"
              variants={{
                hidden: { opacity: 0, y: 36, filter: 'blur(10px)' },
                visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
              }}
              transition={{
                delay: T_LETTERS + i * 0.04,
                duration: 0.75,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block"
              style={{ marginRight: '0.18em' }}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </motion.span>
          ))}
        </h2>

        {/* Beat — italic, fades in last */}
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ delay: T_BEAT, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="italic text-base md:text-lg max-w-md flex items-center gap-3 mt-1"
          style={{
            fontFamily: 'Fraunces, Georgia, serif',
            color: 'rgba(255,255,255,0.55)',
          }}
        >
          <span
            className="block w-6 h-px"
            style={{ background: 'rgba(255,255,255,0.3)' }}
          />
          {chapter.beat}
        </motion.p>
      </div>
    </motion.div>
  );
}
