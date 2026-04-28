import { ArrowRight } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';

export function PremiumHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotation3D, setRotation3D] = useState({ rotateX: 0, rotateY: 0 });
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [activeView, setActiveView] = useState(0); // 0: Strategist, 1: Builder, 2: Innovator
  
  const switcherWords = [
    'strategy, systems,',
    'vision, execution,',
    'research, design,',
    'innovation, impact,',
    'clarity, velocity,'
  ];

  // Different views for each persona
  const heroViews = [
    {
      label: 'The Strategist',
      headline: ['Strategy that ships.'],
      description: '9+ years building scalable product systems across gaming, AI, fintech, and SaaS platforms. Translating complex requirements into clarity, execution, and measurable business impact.',
      accentColor: 'rgba(255, 140, 100, 0.6)',
      switcherWords: ['strategy, systems,', 'vision, frameworks,', 'planning, structure,', 'clarity, focus,']
    },
    {
      label: 'The Builder',
      headline: ['Building at scale.'],
      description: 'From concept to launch, I build design systems and product experiences that teams can rally behind. Proven track record of delivering complex platforms on time and on spec.',
      accentColor: 'rgba(100, 180, 255, 0.6)',
      switcherWords: ['execution, delivery,', 'systems, scalability,', 'quality, velocity,', 'precision, craft,']
    },
    {
      label: 'The Innovator',
      headline: ['Innovating with AI.'],
      description: 'Leading research-driven innovation in emerging technologies. Pushing boundaries at the intersection of design, artificial intelligence, and human-centered product thinking.',
      accentColor: 'rgba(180, 100, 255, 0.6)',
      switcherWords: ['innovation, research,', 'exploration, creativity,', 'AI, emerging tech,', 'future, possibility,']
    }
  ];

  const currentView = heroViews[activeView];

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Parallax transforms
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.4, 0.7]);

  // Track mouse movement for interactivity
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Calculate 3D rotation based on mouse position
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const rotateY = ((e.clientX - centerX) / centerX) * 15;
      const rotateX = -((e.clientY - centerY) / centerY) * 15;
      
      setRotation3D({ rotateX, rotateY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-switch words
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % switcherWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-cycle personas every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveView((prev) => (prev + 1) % heroViews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#0A0A0A' }}
    >
      {/* Cinematic Background Motion Layer */}
      <motion.div 
        className="absolute inset-0 overflow-hidden"
        style={{ y: bgY }}
      >
        {/* 3D Isometric Animated Shape */}
        <IsometricShape mousePosition={mousePosition} />
        
        {/* Dark Overlay with Vignette */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          style={{ 
            opacity: overlayOpacity,
            background: `
              radial-gradient(ellipse at center, transparent 0%, rgba(10, 10, 10, 0.5) 50%, rgba(10, 10, 10, 0.85) 100%),
              linear-gradient(180deg, rgba(10, 10, 10, 0.7) 0%, rgba(10, 10, 10, 0.4) 50%, rgba(10, 10, 10, 0.75) 100%)
            `
          }}
        />

        {/* Film Grain Texture */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            mixBlendMode: 'overlay'
          }}
        />
      </motion.div>

      {/* Foreground Content */}
      <motion.div 
        className="relative z-10 max-w-5xl mx-auto px-8 text-center"
        style={{ 
          y: contentY,
          perspective: '1200px'
        }}
      >
        {/* Main Headline with 3D Dynamic Text Switcher */}
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-8"
          style={{ 
            fontSize: 'clamp(1.5rem, 3.8vw, 3rem)',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontWeight: '900',
            letterSpacing: '-0.045em',
            color: '#FFFFFF',
            lineHeight: '1.2',
            textShadow: '0 4px 24px rgba(0, 0, 0, 0.5)',
            minHeight: '140px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.3em'
          }}
        >
          {/* Fixed Header - Never Changes */}
          <span style={{ 
            opacity: 0.95,
            fontWeight: '800'
          }}>
            Leading Product Designer
          </span>

          {/* 3D Rotating Dynamic Text Switcher - Only This Animates */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ 
                display: 'inline-block', 
                position: 'relative',
                minWidth: '100%'
              }}
            >
              <motion.span
                style={{
                  display: 'inline-block',
                  background: activeView === 0
                    ? 'linear-gradient(135deg, #FFE9C7 0%, #F5C78A 50%, #E7A868 100%)'
                    : activeView === 1
                    ? 'linear-gradient(135deg, #B8FFF5 0%, #7EF0DF 50%, #4AF2E5 100%)'
                    : 'linear-gradient(135deg, #E4D8FF 0%, #BFA8F5 50%, #9A86E8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: 'none',
                  filter: activeView === 0
                    ? 'drop-shadow(0 4px 24px rgba(231, 168, 104, 0.25))'
                    : activeView === 1
                    ? 'drop-shadow(0 4px 24px rgba(74, 242, 229, 0.28))'
                    : 'drop-shadow(0 4px 24px rgba(154, 134, 232, 0.25))',
                  fontStyle: 'italic',
                  fontFamily: "'Fraunces', 'Times New Roman', serif",
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                }}
              >
                {currentView.headline[0]}
              </motion.span>
            </motion.div>
          </AnimatePresence>
          
          {/* Warm Glow Behind Headline */}
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            animate={{
              background: activeView === 0
                ? 'radial-gradient(ellipse at center, rgba(255, 120, 80, 0.2) 0%, transparent 70%)'
                : activeView === 1
                ? 'radial-gradient(ellipse at center, rgba(100, 180, 255, 0.2) 0%, transparent 70%)'
                : 'radial-gradient(ellipse at center, rgba(180, 100, 255, 0.2) 0%, transparent 70%)'
            }}
            transition={{ duration: 0.8 }}
            style={{
              width: '500px',
              height: '250px',
              filter: 'blur(60px)',
              zIndex: -1
            }}
          />
        </motion.h1>

        {/* Supporting Text */}
        <AnimatePresence mode="wait">
          <motion.p 
            key={activeView}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="mx-auto mb-12 max-w-2xl"
            style={{ 
              fontSize: '15px',
              color: 'rgba(255, 255, 255, 0.85)',
              fontWeight: '500',
              lineHeight: '1.7',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
              letterSpacing: '0.01em'
            }}
          >
            {currentView.description}
          </motion.p>
        </AnimatePresence>

        {/* CTA Button */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
          className="flex justify-center"
        >
          <motion.a
            href="#work"
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="group relative overflow-hidden flex items-center gap-3 px-10 py-5 rounded-full font-semibold transition-all duration-400"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 1) 100%)',
              color: '#0A0A0A',
              fontSize: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(255, 120, 80, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            {/* Button Hover Glow */}
            <div 
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'radial-gradient(circle at center, rgba(255, 140, 100, 0.3), transparent 70%)',
                filter: 'blur(20px)'
              }}
            />
            <span className="relative z-10">View Selected Work</span>
            <ArrowRight className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Editorial Grid Guides - Right Side */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
        className="absolute right-0 top-0 h-full pointer-events-none"
        style={{
          width: '200px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 0'
        }}
      >
        {/* Top Right - Year/Date Stamp */}
        <div style={{
          position: 'absolute',
          top: '64px',
          right: '64px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '32px',
            height: '1px',
            backgroundColor: 'rgba(255, 140, 100, 0.3)'
          }} />
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '2px'
          }}>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: '600',
              letterSpacing: '0.2em',
              color: 'rgba(255, 140, 100, 0.5)',
              textTransform: 'uppercase'
            }}>
              Est. 2015
            </span>
            <span style={{
              fontSize: '0.6rem',
              fontWeight: '500',
              letterSpacing: '0.1em',
              color: 'rgba(255, 255, 255, 0.3)',
              textTransform: 'uppercase'
            }}>
              Portfolio
            </span>
          </div>
        </div>

        {/* Middle Right - Rotated Label */}
        <div style={{
          position: 'absolute',
          right: '48px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <span style={{
            transform: 'rotate(90deg)',
            transformOrigin: 'center',
            fontSize: '0.7rem',
            fontWeight: '600',
            letterSpacing: '0.2em',
            color: 'rgba(255, 140, 100, 0.5)',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap'
          }}>
            Product Leadership
          </span>
          
          {/* Connection line to edge */}
          <div style={{
            position: 'absolute',
            right: '-48px',
            width: '48px',
            height: '1px',
            backgroundColor: 'rgba(255, 140, 100, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
          }}>
            <div style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 140, 100, 0.6)'
            }} />
          </div>
        </div>

        {/* Bottom Right - Grid Reference */}
        <div style={{
          position: 'absolute',
          bottom: '88px',
          right: '64px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: '600',
              letterSpacing: '0.15em',
              color: 'rgba(255, 140, 100, 0.4)',
              textTransform: 'uppercase'
            }}>
              Hero_01
            </span>
            <div style={{
              width: '24px',
              height: '1px',
              backgroundColor: 'rgba(255, 140, 100, 0.3)'
            }} />
          </div>
          
          {/* Grid coordinate */}
          <span style={{
            fontSize: '0.6rem',
            fontWeight: '500',
            fontFamily: 'monospace',
            letterSpacing: '0.05em',
            color: 'rgba(255, 255, 255, 0.25)'
          }}>
            [12/12]
          </span>
        </div>
      </motion.div>

      {/* Editorial Grid Guides - Left Side */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.2 }}
        className="absolute left-0 top-0 h-full pointer-events-none"
        style={{
          width: '200px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 0'
        }}
      >
        {/* Top Left - Section Indicator */}
        <div style={{
          position: 'absolute',
          top: '64px',
          left: '64px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '4px'
          }}>
            <div style={{
              width: '24px',
              height: '2px',
              backgroundColor: 'rgba(255, 140, 100, 0.5)'
            }} />
            <span style={{
              fontSize: '0.6rem',
              fontWeight: '600',
              letterSpacing: '0.2em',
              color: 'rgba(255, 140, 100, 0.4)',
              textTransform: 'uppercase'
            }}>
              01
            </span>
          </div>
        </div>

        {/* Middle Left - Clean View Switcher */}
        <div style={{
          position: 'absolute',
          left: '64px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          pointerEvents: 'auto'
        }}>
          {/* Simple indicator count */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            style={{
              fontSize: '0.55rem',
              fontWeight: '600',
              letterSpacing: '0.15em',
              color: 'rgba(255, 255, 255, 0.3)',
              textTransform: 'uppercase',
              fontFamily: 'monospace'
            }}
          >
            {String(activeView + 1).padStart(2, '0')}/03
          </motion.span>

          {/* Glowing Orb Navigation - No Timeline */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '28px',
            position: 'relative'
          }}>
            {[0, 1, 2].map((i) => {
              const isActive = activeView === i;
              const orbColor = i === 0 
                ? 'rgba(255, 140, 100, 1)'
                : i === 1
                ? 'rgba(100, 180, 255, 1)'
                : 'rgba(180, 100, 255, 1)';
              
              const orbColorDim = i === 0 
                ? 'rgba(255, 140, 100, 0.6)'
                : i === 1
                ? 'rgba(100, 180, 255, 0.6)'
                : 'rgba(180, 100, 255, 0.6)';
              
              return (
                <motion.button
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1,
                    opacity: 1
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  transition={{ delay: 1.4 + i * 0.1, type: 'spring', stiffness: 300 }}
                  onClick={() => setActiveView(i)}
                  style={{
                    position: 'relative',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    padding: 0,
                    background: 'transparent',
                    border: 'none',
                    zIndex: 2
                  }}
                  aria-label={heroViews[i].label}
                >
                  {/* Outer radial glow - always visible but stronger when active */}
                  <motion.div
                    animate={{
                      opacity: isActive ? 0.4 : 0.15,
                      scale: isActive ? 1 : 0.7
                    }}
                    transition={{ duration: 0.5 }}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${orbColorDim}, transparent 70%)`,
                      filter: 'blur(20px)',
                      pointerEvents: 'none'
                    }}
                  />

                  {/* Middle glow ring */}
                  <motion.div
                    animate={{
                      opacity: isActive ? 0.6 : 0.2,
                      scale: isActive ? 1 : 0.8
                    }}
                    transition={{ duration: 0.5 }}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${orbColor.replace('1)', '0.8)')}, transparent 60%)`,
                      filter: 'blur(12px)',
                      pointerEvents: 'none'
                    }}
                  />

                  {/* Glassmorphic orb core */}
                  <motion.div
                    animate={{
                      scale: isActive ? 1 : 0.7,
                      opacity: isActive ? 1 : 0.5
                    }}
                    transition={{ duration: 0.4 }}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: isActive 
                        ? `linear-gradient(135deg, ${orbColor.replace('1)', '0.9)')}, ${orbColor.replace('1)', '0.7)')})`
                        : 'rgba(255, 255, 255, 0.1)',
                      border: isActive 
                        ? `2px solid ${orbColorDim}`
                        : '2px solid rgba(255, 140, 100, 0.2)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: isActive 
                        ? `0 0 20px ${orbColorDim}, inset 0 1px 1px rgba(255, 255, 255, 0.3)`
                        : 'inset 0 1px 1px rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.4s ease'
                    }}
                  >
                    {/* Glass highlight */}
                    <div style={{
                      position: 'absolute',
                      top: '2px',
                      left: '2px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.5), transparent)',
                      opacity: isActive ? 0.8 : 0.3
                    }} />
                  </motion.div>

                  {/* Pulsing ring animation on active */}
                  {isActive && (
                    <motion.div
                      animate={{
                        scale: [1, 2.2, 1],
                        opacity: [0.6, 0, 0.6]
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: `2px solid ${orbColor}`,
                        pointerEvents: 'none'
                      }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Minimal label below */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={activeView}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                style={{
                  fontSize: '0.6rem',
                  fontWeight: '700',
                  letterSpacing: '0.1em',
                  color: currentView.accentColor.replace('0.6', '0.8'),
                  textTransform: 'uppercase',
                  lineHeight: '1.2'
                }}
              >
                {heroViews[activeView].label.replace('The ', '')}
              </motion.span>
            </AnimatePresence>
            
            <div style={{
              width: '32px',
              height: '1px',
              backgroundColor: currentView.accentColor.replace('0.6', '0.3'),
              transition: 'background-color 0.5s ease'
            }} />
          </motion.div>
        </div>

        {/* Bottom Left - Minimal Scroll Indicator */}
        <div style={{
          position: 'absolute',
          bottom: '88px',
          left: '64px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          {/* Animated progress line */}
          <div style={{
            position: 'relative',
            width: '1px',
            height: '48px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)'
          }}>
            <motion.div
              animate={{
                height: ['0%', '60%', '0%']
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                backgroundColor: 'rgba(255, 140, 100, 0.4)'
              }}
            />
          </div>
          
          <span style={{
            fontSize: '0.55rem',
            fontWeight: '600',
            letterSpacing: '0.15em',
            color: 'rgba(255, 140, 100, 0.35)',
            textTransform: 'uppercase'
          }}>
            Scroll
          </span>
        </div>
      </motion.div>

      {/* Bottom Fade to Next Section */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(10, 10, 10, 0.8) 100%)'
        }}
      />
    </section>
  );
}

// 3D Isometric Animated Shape Component with Mouse Interaction
function IsometricShape({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredShape, setHoveredShape] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let time = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Mouse influence
    const mouseInfluenceX = ((mousePosition.x - centerX) / centerX) * 30;
    const mouseInfluenceY = ((mousePosition.y - centerY) / centerY) * 30;

    // Isometric projection helper
    const toIsometric = (x: number, y: number, z: number) => {
      const isoX = (x - y) * Math.cos(Math.PI / 6);
      const isoY = (x + y) * Math.sin(Math.PI / 6) - z;
      return { x: isoX, y: isoY };
    };

    // Creative shape types
    interface ShapeData {
      x: number;
      y: number;
      z: number;
      type: 'cube' | 'pyramid' | 'sphere' | 'torus';
      size: number;
      color: string;
      rotation: number;
      id: number;
    }

    const shapes: ShapeData[] = [];

    // Draw creative isometric shapes
    const drawIsoCube = (
      x: number, 
      y: number, 
      z: number, 
      size: number, 
      rotationY: number,
      colorTop: string,
      colorLeft: string,
      colorRight: string,
      opacity: number = 1,
      isHovered: boolean = false
    ) => {
      const s = size * (isHovered ? 1.2 : 1);
      
      const rotateY = (px: number, pz: number, angle: number) => {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return {
          x: px * cos - pz * sin,
          z: px * sin + pz * cos
        };
      };

      const v1 = rotateY(-s, -s, rotationY);
      const v2 = rotateY(s, -s, rotationY);
      const v3 = rotateY(s, s, rotationY);
      const v4 = rotateY(-s, s, rotationY);
      const v5 = rotateY(-s, -s, rotationY);
      const v6 = rotateY(s, -s, rotationY);
      const v7 = rotateY(s, s, rotationY);
      const v8 = rotateY(-s, s, rotationY);

      const p1 = toIsometric(x + v1.x, y, z + v1.z);
      const p2 = toIsometric(x + v2.x, y, z + v2.z);
      const p3 = toIsometric(x + v3.x, y, z + v3.z);
      const p4 = toIsometric(x + v4.x, y, z + v4.z);
      const p5 = toIsometric(x + v5.x, y + s * 2, z + v5.z);
      const p6 = toIsometric(x + v6.x, y + s * 2, z + v6.z);
      const p7 = toIsometric(x + v7.x, y + s * 2, z + v7.z);
      const p8 = toIsometric(x + v8.x, y + s * 2, z + v8.z);

      ctx.globalAlpha = opacity * (isHovered ? 1.2 : 1);

      // Top face with glow if hovered
      ctx.beginPath();
      ctx.moveTo(centerX + p5.x, centerY + p5.y);
      ctx.lineTo(centerX + p6.x, centerY + p6.y);
      ctx.lineTo(centerX + p7.x, centerY + p7.y);
      ctx.lineTo(centerX + p8.x, centerY + p8.y);
      ctx.closePath();
      ctx.fillStyle = colorTop;
      ctx.fill();
      if (isHovered) {
        ctx.shadowBlur = 30;
        ctx.shadowColor = colorTop;
      }
      ctx.strokeStyle = isHovered ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = isHovered ? 2 : 1;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Left face
      ctx.beginPath();
      ctx.moveTo(centerX + p1.x, centerY + p1.y);
      ctx.lineTo(centerX + p4.x, centerY + p4.y);
      ctx.lineTo(centerX + p8.x, centerY + p8.y);
      ctx.lineTo(centerX + p5.x, centerY + p5.y);
      ctx.closePath();
      ctx.fillStyle = colorLeft;
      ctx.fill();
      ctx.strokeStyle = isHovered ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = isHovered ? 2 : 1;
      ctx.stroke();

      // Right face
      ctx.beginPath();
      ctx.moveTo(centerX + p2.x, centerY + p2.y);
      ctx.lineTo(centerX + p3.x, centerY + p3.y);
      ctx.lineTo(centerX + p7.x, centerY + p7.y);
      ctx.lineTo(centerX + p6.x, centerY + p6.y);
      ctx.closePath();
      ctx.fillStyle = colorRight;
      ctx.fill();
      ctx.strokeStyle = isHovered ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = isHovered ? 2 : 1;
      ctx.stroke();

      ctx.globalAlpha = 1;
    };

    // Draw creative pyramid shape
    const drawPyramid = (
      x: number,
      y: number,
      z: number,
      size: number,
      rotationY: number,
      color: string,
      opacity: number = 1,
      isHovered: boolean = false
    ) => {
      const s = size * (isHovered ? 1.2 : 1);
      
      const rotateY = (px: number, pz: number, angle: number) => {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return { x: px * cos - pz * sin, z: px * sin + pz * cos };
      };

      const v1 = rotateY(-s, -s, rotationY);
      const v2 = rotateY(s, -s, rotationY);
      const v3 = rotateY(s, s, rotationY);
      const v4 = rotateY(-s, s, rotationY);
      const apex = { x: 0, y: s * 2.5 };

      const p1 = toIsometric(x + v1.x, y, z + v1.z);
      const p2 = toIsometric(x + v2.x, y, z + v2.z);
      const p3 = toIsometric(x + v3.x, y, z + v3.z);
      const p4 = toIsometric(x + v4.x, y, z + v4.z);
      const pApex = toIsometric(x, y + apex.y, z);

      ctx.globalAlpha = opacity * (isHovered ? 1.2 : 1);

      // Draw faces
      const faces = [
        [p1, p2, pApex],
        [p2, p3, pApex],
        [p3, p4, pApex],
        [p4, p1, pApex]
      ];

      faces.forEach((face, idx) => {
        ctx.beginPath();
        ctx.moveTo(centerX + face[0].x, centerY + face[0].y);
        ctx.lineTo(centerX + face[1].x, centerY + face[1].y);
        ctx.lineTo(centerX + face[2].x, centerY + face[2].y);
        ctx.closePath();
        
        const brightness = 1 - (idx * 0.15);
        ctx.fillStyle = color.replace(/[\d.]+\)$/, `${brightness * opacity})`);
        ctx.fill();
        
        if (isHovered) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = color;
        }
        ctx.strokeStyle = isHovered ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      ctx.globalAlpha = 1;
    };

    // Draw wireframe grid
    const drawWireframeGrid = (offsetX: number, offsetY: number, opacity: number) => {
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = 'rgba(255, 140, 100, 0.12)';
      ctx.lineWidth = 1;

      const gridSize = 80;
      const rows = 8;
      const cols = 8;

      for (let i = 0; i <= rows; i++) {
        for (let j = 0; j <= cols; j++) {
          const x = (j - cols / 2) * gridSize + offsetX + mouseInfluenceX * 0.2;
          const y = (i - rows / 2) * gridSize + offsetY + mouseInfluenceY * 0.2;
          const z = 0;

          const p = toIsometric(x, y, z);
          
          if (j < cols) {
            const p2 = toIsometric(x + gridSize, y, z);
            ctx.beginPath();
            ctx.moveTo(centerX + p.x, centerY + p.y);
            ctx.lineTo(centerX + p2.x, centerY + p2.y);
            ctx.stroke();
          }
          
          if (i < rows) {
            const p3 = toIsometric(x, y + gridSize, z);
            ctx.beginPath();
            ctx.moveTo(centerX + p.x, centerY + p.y);
            ctx.lineTo(centerX + p3.x, centerY + p3.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      time += 0.008;

      // Draw animated wireframe grid
      const gridOffset = Math.sin(time * 0.5) * 20;
      drawWireframeGrid(0, gridOffset, 0.25 + Math.sin(time) * 0.08);

      // Main central rotating shape with mouse influence
      const mainRotation = time * 0.5 + mouseInfluenceX * 0.01;
      const pulseScale = 1 + Math.sin(time * 2) * 0.1;
      
      // Center large cube
      drawIsoCube(
        Math.sin(time * 0.3) * 40 + mouseInfluenceX * 0.3,
        Math.cos(time * 0.2) * 30 + mouseInfluenceY * 0.3,
        0,
        50 * pulseScale,
        mainRotation,
        'rgba(255, 140, 100, 0.3)',
        'rgba(255, 120, 80, 0.25)',
        'rgba(255, 100, 60, 0.2)',
        0.85,
        hoveredShape === 0
      );

      // Orbiting creative shapes (mix of cubes and pyramids)
      const orbitRadius = 150;
      const shapeCount = 8;
      
      for (let i = 0; i < shapeCount; i++) {
        const angle = (time * 0.3) + (i * Math.PI * 2 / shapeCount) + mouseInfluenceX * 0.005;
        const orbitX = Math.cos(angle) * orbitRadius;
        const orbitZ = Math.sin(angle) * orbitRadius;
        const orbitY = Math.sin(time + i) * 30 + mouseInfluenceY * 0.2;
        const size = 25 + Math.sin(time * 2 + i) * 8;
        const opacity = 0.35 + Math.sin(time + i * 0.5) * 0.2;
        const isPyramid = i % 3 === 0;

        if (isPyramid) {
          drawPyramid(
            orbitX,
            orbitY,
            orbitZ,
            size * 0.8,
            -mainRotation + angle,
            `rgba(${255 - i * 10}, ${140 + i * 5}, ${100 + i * 10}, 0.25)`,
            opacity,
            hoveredShape === i + 1
          );
        } else {
          drawIsoCube(
            orbitX,
            orbitY,
            orbitZ,
            size,
            -mainRotation + angle,
            `rgba(255, ${120 + i * 10}, ${80 + i * 15}, 0.25)`,
            `rgba(255, ${100 + i * 10}, ${60 + i * 15}, 0.2)`,
            `rgba(${200 + i * 5}, ${80 + i * 10}, ${50 + i * 10}, 0.15)`,
            opacity,
            hoveredShape === i + 1
          );
        }
      }

      // Floating creative accent shapes
      for (let i = 0; i < 10; i++) {
        const floatX = Math.sin(time * 0.2 + i * 1.5) * 320 + mouseInfluenceX * 0.4;
        const floatY = Math.cos(time * 0.15 + i * 2) * 220 + mouseInfluenceY * 0.4;
        const floatZ = Math.sin(time * 0.1 + i) * 100;
        const floatSize = 15 + Math.sin(time + i) * 5;
        const floatOpacity = 0.18 + Math.sin(time * 0.5 + i) * 0.1;
        const isPyramid = i % 4 === 0;

        if (isPyramid) {
          drawPyramid(
            floatX,
            floatY,
            floatZ,
            floatSize * 0.7,
            time * 0.2 + i,
            `rgba(255, ${180 - i * 8}, ${140 - i * 5}, 0.18)`,
            floatOpacity,
            false
          );
        } else {
          drawIsoCube(
            floatX,
            floatY,
            floatZ,
            floatSize,
            time * 0.2 + i,
            `rgba(255, 160, 120, 0.18)`,
            `rgba(255, 140, 100, 0.12)`,
            `rgba(200, 100, 80, 0.1)`,
            floatOpacity,
            false
          );
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [mousePosition, hoveredShape]);

  // Handle mouse interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Simple hover detection for demo
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    
    if (distance < 100) {
      setHoveredShape(0);
      canvas.style.cursor = 'pointer';
    } else {
      setHoveredShape(null);
      canvas.style.cursor = 'default';
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      className="absolute inset-0 w-full h-full"
      style={{ 
        opacity: 0.75,
        filter: 'blur(0.5px) contrast(1.15)'
      }}
    />
  );
}