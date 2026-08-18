import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';

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
  const [activeView, setActiveView] = useState(0); // 0: Strategist, 1: Builder, 2: Innovator
  const [ctaOffset, setCtaOffset] = useState({ x: 0, y: 0 });
  const [photoFailed, setPhotoFailed] = useState(false);
  const [hoveredNote, setHoveredNote] = useState<string | null>(null);

  const heroViews = [
    {
      label: 'The Strategist',
      index: '01',
      headline: 'Strategy that ships.',
      description: '9+ years building scalable product systems across gaming, AI, fintech, and SaaS platforms. Translating complex requirements into clarity, execution, and measurable business impact.',
      accent: 'rgba(255, 140, 100, 1)',
      accentDim: 'rgba(255, 140, 100, 0.5)',
      gradient: 'linear-gradient(135deg, #FFE9C7 0%, #F5C78A 50%, #E7A868 100%)',
      words: ['strategy', 'systems', 'frameworks', 'clarity', 'structure', 'focus'],
    },
    {
      label: 'The Builder',
      index: '02',
      headline: 'Building at scale.',
      description: 'From concept to launch, I build design systems and product experiences that teams can rally behind. Proven track record of delivering complex platforms on time and on spec.',
      accent: 'rgba(74, 242, 229, 1)',
      accentDim: 'rgba(74, 242, 229, 0.5)',
      gradient: 'linear-gradient(135deg, #B8FFF5 0%, #7EF0DF 50%, #4AF2E5 100%)',
      words: ['execution', 'delivery', 'scalability', 'velocity', 'precision', 'craft'],
    },
    {
      label: 'The Innovator',
      index: '03',
      headline: 'Innovating with AI.',
      description: 'Leading research-driven innovation in emerging technologies. Pushing boundaries at the intersection of design, artificial intelligence, and human-centered product thinking.',
      accent: 'rgba(180, 100, 255, 1)',
      accentDim: 'rgba(180, 100, 255, 0.5)',
      gradient: 'linear-gradient(135deg, #E4D8FF 0%, #BFA8F5 50%, #9A86E8 100%)',
      words: ['innovation', 'research', 'exploration', 'AI', 'emerging tech', 'possibility'],
    },
  ];

  const currentView = heroViews[activeView];
  const tickerWords = heroViews.flatMap((v) => v.words);

  const stickyNotes: StickyNoteData[] = [
    {
      id: 'years',
      value: '9+ Years',
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
      value: '30+ Launches',
      label: 'Shipped to millions',
      rotate: 6,
      style: { bottom: '32%', right: '-14%' },
      floatDuration: 6.2,
      floatDelay: 0.6,
      bg: '#8FCFEA',
      ink: '#0F3548',
    },
    {
      id: 'industries',
      value: '4 Industries',
      label: 'Gaming to fintech',
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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveView((prev) => (prev + 1) % heroViews.length);
    }, 5000);
    return () => clearInterval(interval);
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
      className="relative min-h-screen overflow-hidden flex items-center"
      style={{ backgroundColor: '#0A0A0A' }}
    >
      {/* Living Background Atmosphere */}
      <motion.div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ y: bgY }}>
        {/* Aurora glow field */}
        <motion.div
          animate={{
            x: ['-5%', '5%', '-5%'],
            y: ['-5%', '4%', '-5%'],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '-10%',
            left: '-8%',
            width: '55%',
            height: '65%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${currentView.accentDim} 0%, transparent 70%)`,
            filter: 'blur(120px)',
            opacity: 0.5,
            transition: 'background 1.2s ease',
          }}
        />
        <motion.div
          animate={{
            x: ['4%', '-6%', '4%'],
            y: ['3%', '-4%', '3%'],
          }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            bottom: '-15%',
            right: '-10%',
            width: '50%',
            height: '60%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(220,190,140,0.22) 0%, transparent 70%)',
            filter: 'blur(140px)',
          }}
        />
        <motion.div
          animate={{ opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '30%',
            left: '38%',
            width: '30%',
            height: '40%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${currentView.accentDim} 0%, transparent 75%)`,
            filter: 'blur(100px)',
            transition: 'background 1.2s ease',
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
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(220,190,140,0.08) 0%, transparent 70%)',
            filter: 'blur(20px)',
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

      {/* Content Grid */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 w-full max-w-[1360px] mx-auto px-6 md:px-10 lg:px-14 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-14 lg:gap-12 items-center pt-32 pb-28 lg:pt-24 lg:pb-16"
      >
        {/* Left — kinetic typography column */}
        <div>
          {/* Massive headline with staggered line reveal */}
          <h1
            style={{
              fontFamily: "'Fraunces', 'Times New Roman', serif",
              fontSize: 'clamp(2rem, 4.4vw, 3.6rem)',
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
              marginBottom: '2rem',
            }}
          >
            <motion.span
              initial={{ opacity: 0, y: 44 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              style={{ display: 'block', overflow: 'hidden' }}
            >
              Lead Product Designer with a Data Science background.
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 44 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}
              style={{ display: 'block', fontStyle: 'italic', color: 'rgba(255,255,255,0.4)' }}
            >
              Driving growth and AI.
            </motion.span>
          </h1>

          {/* Rotating persona headline */}
          <div style={{ minHeight: '3.2em', marginBottom: '1.75rem' }}>
            <AnimatePresence mode="wait">
              <motion.p
                key={activeView}
                initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: "'Fraunces', 'Times New Roman', serif",
                  fontSize: 'clamp(1.5rem, 2.6vw, 2.1rem)',
                  fontWeight: 500,
                  fontStyle: 'italic',
                  letterSpacing: '-0.01em',
                  background: currentView.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {currentView.headline}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Description */}
          <div style={{ minHeight: '5.6em', marginBottom: '2.25rem' }}>
            <AnimatePresence mode="wait">
              <motion.p
                key={activeView}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
                className="max-w-xl"
                style={{
                  fontSize: '15px',
                  color: 'rgba(255,255,255,0.65)',
                  fontWeight: 400,
                  lineHeight: 1.7,
                  letterSpacing: '0.005em',
                }}
              >
                {currentView.description}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Persona tab switcher */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-1 mb-10"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
          >
            {heroViews.map((view, i) => {
              const isActive = activeView === i;
              return (
                <button
                  key={view.label}
                  onClick={() => setActiveView(i)}
                  className="relative"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0 18px 14px 0',
                    marginRight: '8px',
                  }}
                  aria-label={view.label}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: isActive ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.35)',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    <span
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: isActive ? currentView.accent : 'rgba(255,255,255,0.25)',
                        transition: 'background 0.3s ease',
                      }}
                    />
                    {view.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="heroTabUnderline"
                      transition={{ type: 'spring', stiffness: 420, damping: 38 }}
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: '18px',
                        bottom: '-1px',
                        height: '2px',
                        background: currentView.accent,
                        borderRadius: '2px',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </motion.div>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center gap-8"
          >
            <motion.a
              href="#work"
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
              <span className="relative z-10">View Selected Work</span>
              <ArrowRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.a>

            <a
              href="mailto:hello@ahmadeldeeb.com"
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
              or say hello
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>
        </div>

        {/* Right — personal photo with floating annotations */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden lg:block"
          style={{ aspectRatio: '4 / 5' }}
        >
          {/* Persona-tinted glow behind the frame */}
          <motion.div
            animate={{ background: `radial-gradient(circle at 50% 40%, ${currentView.accentDim} 0%, transparent 70%)` }}
            transition={{ duration: 1 }}
            className="absolute pointer-events-none"
            style={{ inset: '-12%', opacity: 0.55, filter: 'blur(40px)' }}
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
                Product Design Lead
              </div>
            </div>
          </div>

          {/* Floating stat cards */}
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

      {/* Infinite marquee ticker */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'linear-gradient(180deg, transparent 0%, rgba(10,10,10,0.6) 40%, rgba(10,10,10,0.95) 100%)',
          paddingTop: '18px',
          paddingBottom: '20px',
        }}
      >
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
          className="flex items-center whitespace-nowrap"
          style={{ width: 'max-content' }}
        >
          {[...tickerWords, ...tickerWords].map((word, i) => (
            <span key={i} className="flex items-center">
              <span
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontStyle: 'italic',
                  fontSize: '1.1rem',
                  color: 'rgba(255,255,255,0.28)',
                  padding: '0 20px',
                }}
              >
                {word}
              </span>
              <span style={{ color: 'rgba(220,190,140,0.4)', fontSize: '0.6rem' }}>●</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
