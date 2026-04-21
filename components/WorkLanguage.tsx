/* ────────────────────────────────────────────────────────────────────────
 * WORK LANGUAGE IMAGES
 * Drop files in `public/images/work-language/` — see README there.
 * Swap a value to a local path like '/images/work-language/01-principle.jpg'
 * once your file is placed.
 * ──────────────────────────────────────────────────────────────────────── */
const WORK_LANGUAGE_IMAGES = {
  // Card 1 — "Customer Journey Mapping"
  journeyMapping:
    'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&q=80&w=1200',
  // Card 2 — "Purpose, Positioning, Placement"
  positioningPlacement:
    'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1200',
  // Card 3 — "Functional Framework"
  functionalFramework:
    'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&q=80&w=1200',
  // Card 4 — "Systemic Scaling"
  systemicScaling:
    'https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?auto=format&fit=crop&q=80&w=1080',
} as const;
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

const CAPABILITIES = [
  "Decision Architecture",
  "XFN Alignment",
  "Systemic Scaling"
];

export function WorkLanguage() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.05, 0.9, 1], [1, 1, 1, 0]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.6;
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section ref={containerRef} className="relative py-24 md:py-48 bg-[#0A0A0A]">
      <div className="container mx-auto px-6 max-w-[1240px] flex flex-col">
        {/* Top Section */}
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-12 lg:gap-16">
          <div className="lg:w-7/12">
            <motion.div 
              style={{ opacity: headerOpacity }}
              className="space-y-12 lg:space-y-16"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-[2px] bg-[#4AF2E5]" />
                  <span className="text-[#4AF2E5] text-[11px] font-black tracking-[0.4em] uppercase">
                    Work Language
                  </span>
                </div>
                
                <div className="space-y-1">
                  <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] uppercase">
                    Strategy
                  </h2>
                  <h2 className="text-6xl md:text-8xl font-black text-white/20 tracking-tighter leading-[0.85] uppercase">
                    that ships
                  </h2>
                </div>

                <p className="text-white/80 text-xl md:text-2xl leading-relaxed max-w-[620px] font-medium tracking-tight">
                  I lead cross-functional teams to turn complex systems into clear decisions, scalable frameworks, and measurable outcomes.
                </p>
              </div>

              {/* Capabilities */}
              <div className="flex flex-wrap gap-x-12 gap-y-4 pt-8 border-t border-white/5">
                {CAPABILITIES.map((capability, i) => (
                  <div 
                    key={i} 
                    className="flex items-baseline gap-3"
                  >
                    <span className="text-[#4AF2E5] text-[10px] font-black tracking-widest uppercase">0{i + 1}</span>
                    <span className="text-white/50 text-base font-bold tracking-tight uppercase">
                      {capability}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Gallery Controls */}
          <div className="flex items-center gap-6 pb-4">
            <button 
              onClick={() => scroll('left')}
              className="group relative w-14 h-14 flex items-center justify-center cursor-pointer outline-none"
            >
              <svg width="56" height="56" viewBox="0 0 56 56" className="absolute transform -rotate-90">
                <defs>
                  <linearGradient id="grad-left" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4AF2E5" />
                    <stop offset="50%" stopColor="#6EE7B7" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
                <circle 
                  cx="28" cy="28" r="26" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  className="text-white/5"
                />
                <motion.circle 
                  cx="28" cy="28" r="26" 
                  fill="none" 
                  stroke="url(#grad-left)" 
                  strokeWidth="2"
                  strokeDasharray="163"
                  initial={{ strokeDashoffset: 163 }}
                  whileHover={{ strokeDashoffset: 0 }}
                  transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
                />
              </svg>
              <div className="relative z-10 text-white group-hover:text-[#4AF2E5] transition-all duration-300 group-hover:scale-110">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M15 18L9 12L15 6" />
                </svg>
              </div>
            </button>

            <button 
              onClick={() => scroll('right')}
              className="group relative w-14 h-14 flex items-center justify-center cursor-pointer outline-none"
            >
              <svg width="56" height="56" viewBox="0 0 56 56" className="absolute transform -rotate-90">
                <defs>
                  <linearGradient id="grad-right" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#4AF2E5" />
                  </linearGradient>
                </defs>
                <circle 
                  cx="28" cy="28" r="26" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  className="text-white/5"
                />
                <motion.circle 
                  cx="28" cy="28" r="26" 
                  fill="none" 
                  stroke="url(#grad-right)" 
                  strokeWidth="2"
                  strokeDasharray="163"
                  initial={{ strokeDashoffset: 163 }}
                  whileHover={{ strokeDashoffset: 0 }}
                  transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
                />
              </svg>
              <div className="relative z-10 text-white group-hover:text-[#4AF2E5] transition-all duration-300 group-hover:scale-110">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 6L15 12L9 18" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Horizontal Artifact Gallery - Independent Layers for Manual Replacement */}
        <div 
          ref={scrollContainerRef}
          className="mt-16 lg:mt-24 -mx-6 px-6 lg:-mx-12 lg:px-12 overflow-x-auto scroll-smooth touch-pan-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div className="flex gap-8 lg:gap-12 pb-8 w-max">
            {/* Card 1: Journey Mapping */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0, ease: [0.23, 1, 0.32, 1] }}
              viewport={{ once: true }}
              className="w-[75vw] md:w-[50vw] lg:w-[560px] shrink-0 space-y-5"
            >
              <div className="relative aspect-[16/10] w-full bg-[#1A1A1A] overflow-hidden">
                <img 
                  src={WORK_LANGUAGE_IMAGES.journeyMapping}
                  alt="Customer Journey Mapping"
                  className="w-full h-full object-cover img-journey-mapping"
                />
              </div>
              <div className="space-y-2 pr-8">
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-none uppercase">
                  Customer Journey Mapping
                </h3>
                <p className="text-white/60 text-base md:text-lg leading-snug max-w-lg font-medium">
                  Mapping end-to-end user journeys to uncover friction points, behavioral patterns, and opportunity areas—ensuring each touchpoint supports clarity, continuity, and conversion.
                </p>
              </div>
            </motion.div>

            {/* Card 2: Positioning & Placement */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
              viewport={{ once: true }}
              className="w-[75vw] md:w-[50vw] lg:w-[560px] shrink-0 space-y-5"
            >
              <div className="relative aspect-[16/10] w-full bg-[#1A1A1A] overflow-hidden">
                <img 
                  src={WORK_LANGUAGE_IMAGES.positioningPlacement}
                  alt="Purpose, Positioning, Placement"
                  className="w-full h-full object-cover img-positioning-placement"
                />
              </div>
              <div className="space-y-2 pr-8">
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-none uppercase">
                  Purpose, Positioning, Placement
                </h3>
                <p className="text-white/60 text-base md:text-lg leading-snug max-w-lg font-medium">
                  Defining why a feature exists, how it should be perceived, and where it belongs—aligning user intent, business goals, and product hierarchy into a coherent experience.
                </p>
              </div>
            </motion.div>

            {/* Card 3: Functional Logic */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
              viewport={{ once: true }}
              className="w-[75vw] md:w-[50vw] lg:w-[560px] shrink-0 space-y-5"
            >
              <div className="relative aspect-[16/10] w-full bg-[#1A1A1A] overflow-hidden">
                <img 
                  src={WORK_LANGUAGE_IMAGES.functionalFramework} 
                  alt="Functional Framework"
                  className="w-full h-full object-cover img-functional-logic"
                />
              </div>
              <div className="space-y-2 pr-8">
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-none uppercase">
                  Functional Framework
                </h3>
                <p className="text-white/60 text-base md:text-lg leading-snug max-w-lg font-medium">
                  Designing structured systems that translate complex logic into clear, scalable interactions—balancing usability, consistency, and long-term product evolution.
                </p>
              </div>
            </motion.div>

            {/* Card 4: Systemic Scaling */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
              viewport={{ once: true }}
              className="w-[75vw] md:w-[50vw] lg:w-[560px] shrink-0 space-y-5"
            >
              <div className="relative aspect-[16/10] w-full bg-[#1A1A1A] overflow-hidden">
                <img 
                  src={WORK_LANGUAGE_IMAGES.systemicScaling}
                  alt="Systemic Scaling"
                  className="w-full h-full object-cover img-systemic-scaling"
                />
              </div>
              <div className="space-y-2 pr-8">
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-none uppercase">
                  Systemic Scaling
                </h3>
                <p className="text-white/60 text-base md:text-lg leading-snug max-w-lg font-medium">
                  Building the connective tissue between design vision and engineering execution, ensuring patterns remain robust across high-density product environments.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Background Ambient Detail */}
      <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4AF2E5]/5 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
}
