import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const CAPABILITIES = [
  "Decision Architecture",
  "XFN Alignment",
  "Systemic Scaling"
];

const ARTIFACTS = [
  {
    title: "Customer Journey Mapping",
    description: "Aligning stakeholders on end-to-end flows and prioritization using evidence-based workshops and journey models.",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Functional Logic & IA",
    description: "Defining system states, rules, and information hierarchy to bridge the gap between design and engineering.",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Product Ecosystem Alignment",
    description: "Mapping entry points and user intent across platforms for seamless long-term health.",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Design System Governance",
    description: "Scaling delivery through shared token architectures and component logic.",
    image: "https://images.unsplash.com/photo-1581291518062-c9a79415c6b9?q=80&w=1200&auto=format&fit=crop"
  }
];

/**
 * Alternate variant where the page scrolls normally (no inner scroll)
 * while keeping the left column sticky to the viewport.
 */
export function WorkLanguageStandard() {
  return (
    <section className="relative py-24 md:py-32 bg-[#0A0A0A]">
      <div className="container mx-auto px-6 max-w-[1240px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-[64px]">
          
          {/* Left Column: Sticky to the viewport while page scrolls */}
          <div className="lg:col-span-5 relative">
            <div className="lg:sticky lg:top-24 self-start space-y-8">
              <div className="space-y-4">
                <span className="text-[#4AF2E5] text-[10px] font-black tracking-[0.4em] uppercase">
                  Work Language
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1]">
                  Strategy that ships
                </h2>
                <p className="text-white/60 text-lg leading-relaxed max-w-[420px]">
                  I lead cross-functional teams across product, engineering, and business to turn complex systems into clear decisions, scalable frameworks, and measurable outcomes—across fintech, SaaS, and gaming.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {CAPABILITIES.map((chip, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1 rounded-full border border-[#4AF2E5]/20 text-[#4AF2E5] text-[10px] font-bold tracking-wider uppercase"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Normal vertical flow */}
          <div className="lg:col-span-7 space-y-32">
            {ARTIFACTS.map((artifact, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                viewport={{ once: true, margin: "-150px" }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h3 className="text-xl md:text-3xl font-bold text-white tracking-tight">
                    {artifact.title}
                  </h3>
                  <p className="text-white/40 text-sm md:text-base leading-relaxed max-w-xl">
                    {artifact.description}
                  </p>
                </div>

                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#111]">
                  <ImageWithFallback 
                    src={artifact.image} 
                    alt={artifact.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
