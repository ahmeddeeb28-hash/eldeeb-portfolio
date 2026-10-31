import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface StickyNoteData {
  id: string;
  value: string;
  label: string;
  rotate: number;
  style: React.CSSProperties;
  floatDuration: number;
  floatDelay: number;
  bg: string;
  ink: string;
}

function StickyNote({
  note,
  index,
  hovered,
  onHoverStart,
  onHoverEnd,
}: {
  note: StickyNoteData;
  index: number;
  hovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  return (
    <motion.div
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      initial={{ opacity: 0, scale: 0.3, rotate: note.rotate * 3 }}
      animate={{
        opacity: 1,
        scale: hovered ? 1.06 : 1,
        rotate: hovered ? 0 : [note.rotate - 1.5, note.rotate + 1.5, note.rotate - 1.5],
        y: hovered ? -8 : [0, -6, 0],
      }}
      whileTap={{ scale: 0.95, rotate: 0 }}
      transition={{
        opacity: { duration: 0.5, delay: 0.7 + index * 0.12 },
        scale: hovered
          ? { type: 'spring', stiffness: 420, damping: 16 }
          : { type: 'spring', stiffness: 260, damping: 12, delay: 0.7 + index * 0.12 },
        rotate: hovered
          ? { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
          : { duration: note.floatDuration, repeat: Infinity, ease: 'easeInOut', delay: note.floatDelay },
        y: hovered
          ? { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
          : { duration: note.floatDuration * 0.9, repeat: Infinity, ease: 'easeInOut', delay: note.floatDelay },
      }}
      className="absolute z-20 cursor-pointer select-none"
      style={note.style}
    >
      <div
        style={{
          position: 'relative',
          padding: '16px 20px 18px',
          borderRadius: '20px',
          minWidth: '154px',
          background: note.bg,
          boxShadow: hovered
            ? '0 22px 40px rgba(0,0,0,0.4), 0 2px 0 rgba(255,255,255,0.15) inset'
            : '0 14px 28px rgba(0,0,0,0.28), 0 2px 0 rgba(255,255,255,0.12) inset',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        <div
          style={{
            fontFamily: "'Fredoka', sans-serif",
            fontWeight: 600,
            fontSize: '1.2rem',
            lineHeight: 1.15,
            color: note.ink,
            marginBottom: '3px',
          }}
        >
          {note.value}
        </div>
        <div
          style={{
            fontFamily: "'Fredoka', sans-serif",
            fontWeight: 500,
            fontSize: '0.8rem',
            lineHeight: 1.2,
            color: note.ink,
            opacity: 0.72,
          }}
        >
          {note.label}
        </div>

        {/* Decorative CTA badge */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            right: '-7px',
            bottom: '-7px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#141414',
            boxShadow: '0 6px 14px rgba(0,0,0,0.35)',
          }}
        >
          <ArrowUpRight className="w-3.5 h-3.5" style={{ color: note.bg }} />
        </div>
      </div>
    </motion.div>
  );
}

export function PremiumHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const activeView = 0; // one cool accent now that the persona tabs are gone
  const [ctaOffset, setCtaOffset] = useState({ x: 0, y: 0 });
  const [photoFailed, setPhotoFailed] = useState(false);
  const [hoveredNote, setHoveredNote] = useState<string | null>(null);

  const heroViews = [
    {
      label: 'The Leader',
      index: '01',
      headline: 'Teams that grow.',
      description: 'Four years leading multinational design teams across e-commerce, SaaS and fintech, with teams in Europe and the Gulf. At Sary I managed 8 designers across 3 squads. I run design reviews, keep the bar high and help senior designers grow.',
      // cool silver and graphite, matching the floating nav
      accent: '#B4BAC6',
      accentDim: 'rgba(140, 150, 170, 0.32)',
      gradient: 'linear-gradient(135deg, #FFE9C7 0%, #F5C78A 50%, #E7A868 100%)',
      words: ['leadership', 'mentoring', 'design reviews', 'quality', 'alignment', 'growth'],
    },
    {
      label: 'The Maker',
      index: '02',
      headline: 'Hands on the hard problems.',
      description: 'I still do the design work myself: complex flows, design systems and data-heavy dashboards, from early exploration to shipped features, tracked after launch.',
      accent: 'rgba(74, 242, 229, 1)',
      accentDim: 'rgba(74, 242, 229, 0.5)',
      gradient: 'linear-gradient(135deg, #B8FFF5 0%, #7EF0DF 50%, #4AF2E5 100%)',
      words: ['execution', 'delivery', 'scalability', 'velocity', 'precision', 'craft'],
    },
    {
      label: 'The AI Builder',
      index: '03',
      headline: 'AI in the workflow.',
      description: 'I find practical places for AI in the design process and build new workflows around it with the team. On Sampo I built the working prototype with Claude and tested it before handoff.',
      accent: 'rgba(180, 100, 255, 1)',
      accentDim: 'rgba(180, 100, 255, 0.5)',
      gradient: 'linear-gradient(135deg, #E4D8FF 0%, #BFA8F5 50%, #9A86E8 100%)',
      words: ['innovation', 'research', 'exploration', 'AI', 'emerging tech', 'possibility'],
    },
  ];

  const currentView = heroViews[activeView];

  const stickyNotes: StickyNoteData[] = [
    {
      id: 'years',
      value: '10+ Years',
      label: 'Shaping products',
      rotate: -7,
      style: { top: '4%', left: '-13%' },
      floatDuration: 5.5,
      floatDelay: 0,
      bg: '#F5C89B',
      ink: '#4A2C12',
    },
    {
      id: 'launches',
      value: '4 Years',
      label: 'Leading design teams',
      rotate: 6,
      style: { bottom: '32%', right: '-14%' },
      floatDuration: 6.2,
      floatDelay: 0.6,
      bg: '#8FCFEA',
      ink: '#0F3548',
    },
    {
      id: 'industries',
      value: 'EU · Gulf',
      label: 'Multinational teams',
      rotate: -5,
      style: { bottom: '2%', left: '-10%' },
      floatDuration: 5.8,
      floatDelay: 1.2,
      bg: '#C9B8F0',
      ink: '#2E1F52',
    },
  ];

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.35, 0.65]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);


  const handleCtaMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.35;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
    setCtaOffset({ x, y });
  };

  return (
    <section
      ref={heroRef}
      data-track-area="hero"
      className="relative min-h-screen overflow-hidden flex items-center"
      style={{ backgroundColor: '#0A0A0A' }}
    >
      {/* Living Background Atmosphere */}
      <motion.div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ y: bgY }}>
        {/* Aurora glow: one full-bleed layer of soft gradients, no shapes.
            Each gradient fades to nothing well inside the hero, so no
            edge can show, and the whole layer drifts slowly (a cheap
            transform). Replaces blurred blobs, whose 100–140px filters
            were heavy on phones and whose edges showed without them. */}
        <motion.div
          animate={{ x: ['-2%', '2%', '-2%'], y: ['-1.5%', '1.5%', '-1.5%'] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: '-8%',
            background: [
              `radial-gradient(ellipse 55% 60% at 22% 28%, color-mix(in srgb, ${currentView.accentDim} 55%, transparent) 0%, color-mix(in srgb, ${currentView.accentDim} 22%, transparent) 40%, transparent 72%)`,
              'radial-gradient(ellipse 50% 55% at 82% 80%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 42%, transparent 72%)',
              `radial-gradient(ellipse 35% 40% at 52% 48%, color-mix(in srgb, ${currentView.accentDim} 25%, transparent) 0%, transparent 70%)`,
            ].join(', '),
          }}
        />

        {/* Cursor-reactive spotlight (desktop only) */}
        <div
          className="hidden lg:block"
          style={{
            position: 'absolute',
            left: mousePosition.x - 260,
            top: mousePosition.y - 260,
            width: '520px',
            height: '520px',
            background: 'radial-gradient(closest-side, rgba(255,255,255,0.04) 0%, transparent 100%)',
            transition: 'left 0.4s ease-out, top 0.4s ease-out',
          }}
        />

        {/* Vignette */}
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: overlayOpacity,
            background:
              'radial-gradient(ellipse at center, transparent 0%, rgba(10,10,10,0.4) 55%, rgba(10,10,10,0.9) 100%)',
          }}
        />

        {/* Film grain */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            mixBlendMode: 'overlay',
          }}
        />
      </motion.div>

      {/* Fade the hero into the next section. Outside the parallax layer
          above so it stays pinned to the hero's bottom edge. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[30%] pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(10,10,10,0) 0%, rgba(10,10,10,0.85) 70%, #0A0A0A 100%)' }}
      />

      {/* Content Grid */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 w-full max-w-[1360px] mx-auto px-6 md:px-10 lg:px-14 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-14 lg:gap-12 items-center pt-32 pb-28 lg:pt-24 lg:pb-16"
      >
        {/* Left — kinetic typography column */}
        <div>
          {/* Who I am, in a formal sans: the greeting carries the accent */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 'clamp(2.4rem, 5vw, 4.4rem)',
              fontWeight: 600,
              lineHeight: 1.06,
              letterSpacing: '-0.035em',
              color: '#FFFFFF',
              marginBottom: '1.6rem',
            }}
          >
            <span style={{ color: currentView.accent }}>Hello, I’m Ahmad.</span> Lead Product Designer.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            className="text-white/70 text-lg md:text-xl leading-relaxed max-w-xl mb-10"
          >
            I lead product design teams and still design the hard parts myself. Ten years across e-commerce, SaaS, fintech,
            AI and gaming, with teams in Europe and the Gulf.
          </motion.p>
          {/* the facts a recruiter scans for first, matching the CV */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="flex flex-col items-start gap-4 mb-10 -mt-3"
          >
            <p className="inline-flex items-center gap-2.5 sm:gap-3 rounded-full border border-white/[0.12] bg-white/[0.04] pl-3 pr-3.5 sm:pl-3.5 sm:pr-4 py-2 text-[13px] sm:text-sm md:text-[15px] whitespace-nowrap">
              <span className="relative flex w-2 h-2" aria-hidden>
                <span className="absolute inset-0 rounded-full bg-[#34D399] opacity-60 motion-safe:animate-ping" />
                <span className="relative w-2 h-2 rounded-full bg-[#34D399]" />
              </span>
              <span className="text-white/90">Open to remote &amp; relocation</span>
              <span aria-hidden className="h-3.5 w-px bg-white/20" />
              <span className="text-white/55">Based in Egypt</span>
            </p>
            <ul aria-label="Focus" className="flex flex-wrap items-center gap-x-4 sm:gap-x-0 gap-y-2 text-[13px] sm:text-sm md:text-[15px] text-white/60">
              {['AI product builder', 'Design systems', 'Design leadership'].map((f, i) => (
                <li key={f} className={i ? 'sm:pl-4 sm:ml-4 sm:border-l border-white/15 leading-none' : 'leading-none'}>
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center gap-8"
          >
            <motion.a
              href="mailto:ahmeddeeb28@gmail.com?subject=Hiring%3A%20Lead%20Product%20Designer"
              onMouseMove={handleCtaMove}
              onMouseLeave={() => setCtaOffset({ x: 0, y: 0 })}
              animate={{
                x: ctaOffset.x,
                y: ctaOffset.y,
                boxShadow: [
                  '0 2px 20px rgba(220,190,140,0.2)',
                  '0 4px 40px rgba(220,190,140,0.5)',
                  '0 2px 20px rgba(220,190,140,0.2)',
                ],
              }}
              transition={{
                x: { type: 'spring', stiffness: 200, damping: 18 },
                y: { type: 'spring', stiffness: 200, damping: 18 },
                boxShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              }}
              whileTap={{ scale: 0.96 }}
              className="group relative flex items-center gap-3 px-9 py-4 rounded-full font-semibold"
              style={{
                background: '#fff',
                color: '#0A0A0A',
                fontSize: '14px',
                border: '1px solid rgba(220,190,140,0.6)',
              }}
            >
              <span className="relative z-10">Hire me</span>
              <ArrowRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.a>

            <a
              href="mailto:ahmeddeeb28@gmail.com"
              className="group flex items-center gap-2"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.02em',
                color: 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.95)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
            >
              Say hello
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>
        </div>

        {/* Right — personal photo with floating annotations */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[360px] lg:max-w-none lg:mx-0"
          style={{ aspectRatio: '4 / 5' }}
        >
          {/* Persona-tinted glow behind the frame */}
          <motion.div
            animate={{ background: `radial-gradient(closest-side at 50% 42%, ${currentView.accentDim} 0%, transparent 100%)` }}
            transition={{ duration: 1 }}
            className="absolute pointer-events-none"
            style={{ inset: '-12%', opacity: 0.55 }}
          />

          <div
            className="relative w-full h-full overflow-hidden"
            style={{
              borderRadius: '6px 64px 6px 64px',
              border: '1px solid rgba(220,190,140,0.28)',
              boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 30px 80px -24px rgba(0,0,0,0.65), 0 0 60px -12px ${currentView.accentDim}`,
              transition: 'box-shadow 1s ease',
            }}
          >
            {photoFailed ? (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                style={{ background: 'linear-gradient(160deg, #18150F 0%, #0A0A0A 75%)' }}
              >
                <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
                  <circle cx="44" cy="31" r="16" stroke="rgba(220,190,140,0.32)" strokeWidth="1.5" />
                  <path
                    d="M12 80 C 12 57, 26 47, 44 47 C 62 47, 76 57, 76 80"
                    stroke="rgba(220,190,140,0.32)"
                    strokeWidth="1.5"
                  />
                </svg>
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'rgba(220,190,140,0.5)',
                  }}
                >
                  Add your photo
                </span>
              </div>
            ) : (
              <img
                src="/images/profile.jpg"
                alt="Ahmad Eldeeb"
                onError={() => setPhotoFailed(true)}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Persona-tinted duotone wash for continuity with the left column */}
            <motion.div
              animate={{ background: `linear-gradient(165deg, ${currentView.accentDim} 0%, transparent 55%)` }}
              transition={{ duration: 1 }}
              className="absolute inset-0 pointer-events-none"
              style={{ opacity: 0.4, mixBlendMode: 'overlay' }}
            />

            {/* Film grain for texture cohesion with the hero background */}
            <div
              className="absolute inset-0 opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
                mixBlendMode: 'overlay',
              }}
            />

            {/* Name caption scrim */}
            <div
              className="absolute inset-x-0 bottom-0 pointer-events-none flex flex-col justify-end"
              style={{
                height: '150px',
                padding: '0 26px 22px',
                background: 'linear-gradient(0deg, rgba(10,10,10,0.88) 0%, transparent 65%)',
              }}
            >
              <div
                style={{
                  fontFamily: "'Fraunces', 'Times New Roman', serif",
                  fontStyle: 'italic',
                  fontSize: '1.2rem',
                  color: '#fff',
                  marginBottom: '3px',
                }}
              >
                Ahmad Eldeeb
              </div>
              <div
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.5)',
                }}
              >
                Lead Product Designer
              </div>
            </div>
          </div>

          {/* Floating stat cards — desktop only, they use off-canvas offsets */}
          <div className="hidden lg:block">
            {stickyNotes.map((note, i) => (
              <StickyNote
                key={note.id}
                note={note}
                index={i}
                hovered={hoveredNote === note.id}
                onHoverStart={() => setHoveredNote(note.id)}
                onHoverEnd={() => setHoveredNote((current) => (current === note.id ? null : current))}
              />
            ))}
          </div>

          {/* Gold corner seal echoing the nav identity */}
          <div
            style={{
              position: 'absolute',
              top: '-14px',
              right: '-14px',
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              border: '1px solid rgba(220,190,140,0.4)',
              background: 'linear-gradient(160deg, rgba(240,217,168,0.16), rgba(201,168,118,0.05))',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.02em',
              zIndex: 30,
            }}
          >
            AE.
          </div>
        </motion.div>
      </motion.div>

    </section>
  );
}
