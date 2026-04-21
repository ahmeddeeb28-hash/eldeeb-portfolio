import { motion } from 'motion/react';
import { ArrowRight, Calendar } from 'lucide-react';

/* ────────────────────────────────────────────────────────────────────────
 * ARTICLE IMAGES
 * Drop files in `public/images/articles/` — see README there.
 * ──────────────────────────────────────────────────────────────────────── */
const ARTICLE_IMAGES = {
  // Article 1 — "Design Critique Fundamentals"
  designCritique:
    'https://images.unsplash.com/photo-1676276374429-3902f2666824',
  // Article 2 — "Mastering the Art of Asking Targeted Questions"
  targetedQuestions:
    'https://images.unsplash.com/photo-1713942590288-1468a2d88ee4',
  // Article 3 — "Redefining Design Leadership"
  designLeadership:
    'https://images.unsplash.com/photo-1624555130296-e551faf8969b',
} as const;

export function Articles() {
  return (
    <section id="articles-activities" className="bg-[#0A0A0A] py-[88px] border-t border-white/[0.03]">
      <div className="container mx-auto px-10 max-w-[1560px]">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-4 mb-6 opacity-40">
              <div className="w-8 h-[1px] bg-[#4AF2E5]" />
              <span className="text-[#4AF2E5] text-[10px] font-black tracking-[0.5em] uppercase">
                Perspectives
              </span>
            </div>
            <h2 
              className="text-white uppercase leading-[0.95] tracking-[-0.05em]"
              style={{ 
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                fontWeight: '900'
              }}
            >
              Articles &<br />
              <span className="text-white/20 italic">Activities.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center gap-6"
          >
            <button className="text-white/40 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest border-b border-white/10 pb-1">
              View All Insights
            </button>
          </motion.div>
        </div>

        {/* Articles Grid - Editorial Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Article 1 */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="group flex flex-col h-full cursor-pointer"
            onClick={() => window.open('https://medium.com/@ahmedmohammedeldeeb/design-critique-fundamentals-part-1-1fc08a15674', '_blank')}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] mb-8 bg-[#111] border border-white/[0.08]">
              <img
                src={ARTICLE_IMAGES.designCritique}
                alt="Design Critique Fundamentals"
                className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 ease-[0.22, 1, 0.36, 1]"
                loading="lazy"
              />
              <div className="absolute bottom-6 left-6 z-10">
                <span className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-[#4AF2E5] text-[10px] font-black uppercase tracking-widest">
                  Critique
                </span>
              </div>
            </div>

            <div className="flex flex-col flex-grow">
              <div className="flex items-center gap-4 mb-4 text-white/40 text-[10px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Medium</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span>Part 1</span>
              </div>
              <h3 className="text-white text-2xl md:text-3xl font-black uppercase leading-tight tracking-tighter mb-4 group-hover:text-[#4AF2E5] transition-colors duration-500">
                Design Critique Fundamentals
              </h3>
              <p className="text-white/40 text-lg leading-relaxed font-medium mb-8 flex-grow">
                A deep dive into the foundations of effective design critique — how to give, receive, and structure feedback that elevates the entire team's output.
              </p>
              <div className="pt-6 border-t border-white/[0.05] flex items-center justify-between group-hover:border-[#4AF2E5]/20 transition-colors">
                <span className="text-white/20 group-hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
                  Read Full Article
                </span>
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transform group-hover:translate-x-2 group-hover:border-[#4AF2E5]/40 transition-all duration-500">
                  <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white" />
                </div>
              </div>
            </div>
          </motion.article>

          {/* Article 2 */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="group flex flex-col h-full cursor-pointer"
            onClick={() => window.open('https://medium.com/design-bootcamp/mastering-the-art-of-asking-targeted-questions-c6e5fd2f5b87', '_blank')}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] mb-8 bg-[#111] border border-white/[0.08]">
              <img
                src={ARTICLE_IMAGES.targetedQuestions}
                alt="Mastering the Art of Asking Targeted Questions"
                className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 ease-[0.22, 1, 0.36, 1]"
                loading="lazy"
              />
              <div className="absolute bottom-6 left-6 z-10">
                <span className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-[#4AF2E5] text-[10px] font-black uppercase tracking-widest">
                  Research
                </span>
              </div>
            </div>

            <div className="flex flex-col flex-grow">
              <div className="flex items-center gap-4 mb-4 text-white/40 text-[10px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Design Bootcamp</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span>Medium</span>
              </div>
              <h3 className="text-white text-2xl md:text-3xl font-black uppercase leading-tight tracking-tighter mb-4 group-hover:text-[#4AF2E5] transition-colors duration-500">
                Mastering the Art of Asking Targeted Questions
              </h3>
              <p className="text-white/40 text-lg leading-relaxed font-medium mb-8 flex-grow">
                How precise, intentional questioning unlocks deeper user insights and drives more impactful design decisions across product teams.
              </p>
              <div className="pt-6 border-t border-white/[0.05] flex items-center justify-between group-hover:border-[#4AF2E5]/20 transition-colors">
                <span className="text-white/20 group-hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
                  Read Full Article
                </span>
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transform group-hover:translate-x-2 group-hover:border-[#4AF2E5]/40 transition-all duration-500">
                  <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white" />
                </div>
              </div>
            </div>
          </motion.article>

          {/* Article 3 */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="group flex flex-col h-full cursor-pointer"
            onClick={() => window.open('https://medium.com/@ahmedmohammedeldeeb/redefining-design-leadership-navigating-uncharted-responsibilities-114c5ce3ba0c', '_blank')}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] mb-8 bg-[#111] border border-white/[0.08]">
              <img
                src={ARTICLE_IMAGES.designLeadership}
                alt="Redefining Design Leadership"
                className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 ease-[0.22, 1, 0.36, 1]"
                loading="lazy"
              />
              <div className="absolute bottom-6 left-6 z-10">
                <span className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-[#4AF2E5] text-[10px] font-black uppercase tracking-widest">
                  Leadership
                </span>
              </div>
            </div>

            <div className="flex flex-col flex-grow">
              <div className="flex items-center gap-4 mb-4 text-white/40 text-[10px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Medium</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span>Leadership</span>
              </div>
              <h3 className="text-white text-2xl md:text-3xl font-black uppercase leading-tight tracking-tighter mb-4 group-hover:text-[#4AF2E5] transition-colors duration-500">
                Redefining Design Leadership: Navigating Uncharted Responsibilities
              </h3>
              <p className="text-white/40 text-lg leading-relaxed font-medium mb-8 flex-grow">
                Exploring the evolving role of design leaders — from craft to strategy, mentorship, and navigating responsibilities that no one prepared you for.
              </p>
              <div className="pt-6 border-t border-white/[0.05] flex items-center justify-between group-hover:border-[#4AF2E5]/20 transition-colors">
                <span className="text-white/20 group-hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
                  Read Full Article
                </span>
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transform group-hover:translate-x-2 group-hover:border-[#4AF2E5]/40 transition-all duration-500">
                  <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white" />
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}