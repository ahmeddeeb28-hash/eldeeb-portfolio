import { motion } from 'motion/react';

/* ────────────────────────────────────────────────────────────────────────
 * FEATURE IMAGES
 * Drop files in `public/images/features/` — see README there.
 * ──────────────────────────────────────────────────────────────────────── */
const FEATURE_IMAGES = {
  // Feature 1 — "Rapid Execution"
  rapidExecution:
    'https://images.unsplash.com/photo-1699108160311-196876e29c5c?auto=format&fit=crop&q=80&w=1080',
  // Feature 2 — "Strategic Precision"
  strategicPrecision:
    'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=1080',
  // Feature 3 — "High-Impact Outcomes"
  highImpactOutcomes:
    'https://images.unsplash.com/photo-1744854185466-cf95c3064cec?auto=format&fit=crop&q=80&w=1080',
} as const;

export function Features() {
  const frameworkItems = [
    {
      title: "Rapid Execution",
      statement: "From insight to shipped work",
      description: "Turn research and requirements into clear plans. Align teams early and move fast without rework or noise.",
      image: FEATURE_IMAGES.rapidExecution,
      imgId: "image-rapid-execution"
    },
    {
      title: "Strategic Precision",
      statement: "Focus on what truly matters",
      description: "Use research, data, and documented insights to prioritize the right problems with intent and clarity.",
      image: FEATURE_IMAGES.strategicPrecision,
      imgId: "image-strategic-precision"
    },
    {
      title: "High-Impact Outcomes",
      statement: "Design that delivers results",
      description: "Link decisions to adoption, retention, and business impact—then iterate with purpose and measurable data.",
      image: FEATURE_IMAGES.highImpactOutcomes,
      imgId: "image-high-impact-outcomes"
    }
  ];

  return (
    <section className="relative w-full min-h-screen flex items-center bg-[#0A0A0A] overflow-hidden py-24 md:py-32">
      <div className="container mx-auto px-10 max-w-[1560px] w-full">
        {/* Editorial Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 md:mb-24 flex flex-col items-center text-center"
        >
          <div className="flex items-center gap-4 mb-8 opacity-40">
            <div className="w-8 h-[1px] bg-[#4AF2E5]" />
            <span className="text-[#4AF2E5] text-[10px] font-black tracking-[0.5em] uppercase">
              Leadership Spectrum
            </span>
            <div className="w-8 h-[1px] bg-[#4AF2E5]" />
          </div>
          
          <h2 
            className="uppercase leading-[0.95] tracking-[-0.05em] text-white max-w-4xl"
            style={{ 
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: '900'
            }}
          >
            Design Leadership<br />
            Framework.
          </h2>
        </motion.div>

        {/* Horizontal Scrollable Framework - Explicitly rendered for unique manual overrides */}
        <div 
          className="relative -mx-10 overflow-x-auto flex gap-12 md:gap-[48px] px-10 pb-8 scroll-smooth no-scrollbar"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {/* Block 01: Rapid Execution */}
          <div className="min-w-[340px] md:min-w-[580px] flex flex-col space-y-8 text-center items-center">
            <div className="relative aspect-video w-full overflow-hidden bg-[#111111]">
              <img 
                src={frameworkItems[0].image} 
                alt="Rapid Execution"
                className="w-full h-full object-cover grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all duration-1000 ease-in-out image-rapid-execution"
              />
            </div>
            <div className="space-y-4 flex flex-col items-center">
              <span className="text-[#4AF2E5] text-[10px] font-black tracking-[0.4em] uppercase">
                01 // Execution
              </span>
              <h3 className="text-white uppercase font-black tracking-tighter text-2xl md:text-3xl leading-none">
                {frameworkItems[0].title}
              </h3>
              <p className="text-white/40 text-base md:text-lg leading-relaxed font-medium max-w-lg mx-auto">
                {frameworkItems[0].description}
              </p>
            </div>
          </div>

          {/* Block 02: Strategic Precision */}
          <div className="min-w-[340px] md:min-w-[580px] flex flex-col space-y-8 text-center items-center">
            <div className="relative aspect-video w-full overflow-hidden bg-[#111111]">
              <img 
                src={frameworkItems[1].image} 
                alt="Strategic Precision"
                className="w-full h-full object-cover grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all duration-1000 ease-in-out image-strategic-precision"
              />
            </div>
            <div className="space-y-4 flex flex-col items-center">
              <span className="text-[#4AF2E5] text-[10px] font-black tracking-[0.4em] uppercase">
                02 // Precision
              </span>
              <h3 className="text-white uppercase font-black tracking-tighter text-2xl md:text-3xl leading-none">
                {frameworkItems[1].title}
              </h3>
              <p className="text-white/40 text-base md:text-lg leading-relaxed font-medium max-w-lg mx-auto">
                {frameworkItems[1].description}
              </p>
            </div>
          </div>

          {/* Block 03: High-Impact Outcomes */}
          <div className="min-w-[340px] md:min-w-[580px] flex flex-col space-y-8 text-center items-center">
            <div className="relative aspect-video w-full overflow-hidden bg-[#111111]">
              <img 
                src={frameworkItems[2].image} 
                alt="High-Impact Outcomes"
                className="w-full h-full object-cover grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all duration-1000 ease-in-out image-high-impact-outcomes"
              />
            </div>
            <div className="space-y-4 flex flex-col items-center">
              <span className="text-[#4AF2E5] text-[10px] font-black tracking-[0.4em] uppercase">
                03 // Outcomes
              </span>
              <h3 className="text-white uppercase font-black tracking-tighter text-2xl md:text-3xl leading-none">
                {frameworkItems[2].title}
              </h3>
              <p className="text-white/40 text-base md:text-lg leading-relaxed font-medium max-w-lg mx-auto">
                {frameworkItems[2].description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
