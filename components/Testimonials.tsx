import { motion } from 'motion/react';
import { SectionHeader } from './SectionHeader';

/* ────────────────────────────────────────────────────────────────────────
 * TESTIMONIAL AVATARS
 * Drop files in `public/images/testimonials/` — see README there.
 * 1:1 square, ~400×400 px recommended.
 * ──────────────────────────────────────────────────────────────────────── */
const TESTIMONIAL_AVATARS = {
  // Testimonial 1 — Jameson Thorne, Head of Product
  jamesonThorne:
    'https://images.unsplash.com/photo-1589668944320-409833e5ba10?auto=format&fit=crop&q=80&w=200',
  // Testimonial 2 — Elena Rodriguez, Engineering Manager
  elenaRodriguez:
    'https://images.unsplash.com/photo-1704627363842-a169b9743309?auto=format&fit=crop&q=80&w=200',
  // Testimonial 3 — Marcus Chen
  marcusChen:
    'https://images.unsplash.com/photo-1661983228690-048b2434c4fb?auto=format&fit=crop&q=80&w=200',
} as const;

export function Testimonials() {
  return (
    <section className="bg-[#0A0A0A] py-[88px] overflow-hidden border-t border-white/[0.03]">
      <div className="container mx-auto px-10 max-w-[1560px] min-h-[80vh] flex flex-col justify-center py-24">

        <SectionHeader
          eyebrow="Verbatim"
          title="Client success"
          flourish="perspective."
          subtitle="What teams say after shipping work together — unscripted."
        />

        {/* 3-Column Editorial Grid - Fixed 32px Spacing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="flex flex-col h-full">
            <div className="relative h-full bg-[#151515]/40 backdrop-blur-2xl p-10 md:p-12 flex flex-col border border-white/10 rounded-[40px] shadow-2xl overflow-hidden group hover:bg-[#151515]/60 transition-all duration-700">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
              
              <div className="relative z-10 flex items-center gap-3 mb-12">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4AF2E5]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4AF2E5]/70">
                  Work is outstanding...!
                </span>
              </div>

              <blockquote className="relative z-10 flex flex-col h-full">
                <div className="border-l-2 pl-8 mb-16 border-white/10">
                  <motion.p 
                    className="text-[#E6E6E6] leading-[1.6] italic opacity-80 group-hover:opacity-100 group-hover:text-white transition-all duration-700 cursor-default"
                    style={{ 
                      fontFamily: 'Georgia, serif',
                      fontSize: '21px',
                    }}
                    whileHover={{ 
                      x: 10,
                      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
                    }}
                  >
                    "Alex has been instrumental to our product vision, always producing innovative and user-centric designs. I strongly recommend them for exceptional creative work."
                  </motion.p>
                </div>
                
                <footer className="mt-auto pt-10 border-t border-white/[0.05] flex items-center gap-5">
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-full overflow-hidden grayscale bg-[#151515] ring-1 ring-white/10 transition-all duration-500 group-hover:grayscale-0">
                      <img
                        src={TESTIMONIAL_AVATARS.jamesonThorne}
                        alt="Jameson Thorne"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="relative inline-block">
                      <cite className="not-italic text-white font-black text-base tracking-tight uppercase block">
                        Jameson Thorne
                      </cite>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] mt-1 text-[#4AF2E5]">
                      Head of Product
                    </span>
                    <span className="text-white/20 text-[9px] font-bold uppercase tracking-widest mt-1">
                      Global SaaS
                    </span>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="flex flex-col h-full">
            <div className="relative h-full bg-[#151515]/40 backdrop-blur-2xl p-10 md:p-12 flex flex-col border border-white/10 rounded-[40px] shadow-2xl overflow-hidden group hover:bg-[#151515]/60 transition-all duration-700">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
              
              <div className="relative z-10 flex items-center gap-3 mb-12">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4AF2E5]/70">
                  Absolute pleasure to work with
                </span>
              </div>

              <blockquote className="relative z-10 flex flex-col h-full">
                <div className="border-l-2 pl-8 mb-16 border-[#4AF2E5]/40">
                  <motion.p 
                    className="text-[#E6E6E6] leading-[1.6] italic opacity-80 group-hover:opacity-100 group-hover:text-white transition-all duration-700 cursor-default"
                    style={{ 
                      fontFamily: 'Georgia, serif',
                      fontSize: '21px',
                    }}
                    whileHover={{ 
                      x: 10,
                      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
                    }}
                  >
                    "Alex brings both innovation and a deep understanding of user needs—an essential part of our creative success. I wholeheartedly endorse their work."
                  </motion.p>
                </div>
                
                <footer className="mt-auto pt-10 border-t border-white/[0.05] flex items-center gap-5">
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-full overflow-hidden grayscale bg-[#151515] ring-1 ring-white/10 transition-all duration-500 group-hover:grayscale-0">
                      <img
                        src={TESTIMONIAL_AVATARS.elenaRodriguez}
                        alt="Elena Rodriguez"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="relative inline-block">
                      <cite className="not-italic text-white font-black text-base tracking-tight uppercase block">
                        Elena Rodriguez
                      </cite>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] mt-1 text-white/30">
                      Engineering Manager
                    </span>
                    <span className="text-white/20 text-[9px] font-bold uppercase tracking-widest mt-1">
                      Fintech Platform
                    </span>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="flex flex-col h-full">
            <div className="relative h-full bg-[#151515]/40 backdrop-blur-2xl p-10 md:p-12 flex flex-col border border-white/10 rounded-[40px] shadow-2xl overflow-hidden group hover:bg-[#151515]/60 transition-all duration-700">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
              
              <div className="relative z-10 flex items-center gap-3 mb-12">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4AF2E5]/70">
                  Strategy that actually ships
                </span>
              </div>

              <blockquote className="relative z-10 flex flex-col h-full">
                <div className="border-l-2 pl-8 mb-16 border-white/10">
                  <motion.p 
                    className="text-[#E6E6E6] leading-[1.6] italic opacity-80 group-hover:opacity-100 group-hover:text-white transition-all duration-700 cursor-default"
                    style={{ 
                      fontFamily: 'Georgia, serif',
                      fontSize: '21px',
                    }}
                    whileHover={{ 
                      x: 10,
                      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
                    }}
                  >
                    "The impact wasn't just visual. We saw better prioritization, faster execution, and fewer cycles of rework across the entire engineering team."
                  </motion.p>
                </div>
                
                <footer className="mt-auto pt-10 border-t border-white/[0.05] flex items-center gap-5">
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-full overflow-hidden grayscale bg-[#151515] ring-1 ring-white/10 transition-all duration-500 group-hover:grayscale-0">
                      <img
                        src={TESTIMONIAL_AVATARS.marcusChen}
                        alt="Marcus Chen"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="relative inline-block">
                      <cite className="not-italic text-white font-black text-base tracking-tight uppercase block">
                        Marcus Chen
                      </cite>
                      <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#4AF2E5]/60" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] mt-1 text-white/30">
                      Product Director
                    </span>
                    <span className="text-white/20 text-[9px] font-bold uppercase tracking-widest mt-1">
                      Enterprise Corp
                    </span>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}