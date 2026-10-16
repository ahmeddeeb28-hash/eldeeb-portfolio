import { motion } from 'motion/react';
import { ArrowRight, Calendar } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

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

/* Each card is a real anchor rather than a clickable <article> calling
   window.open, so it is reachable by keyboard, announced as a link,
   and supports middle-click / copy-link like any other link. */
const ARTICLES = [
  {
    href: 'https://medium.com/@ahmedmohammedeldeeb/design-critique-fundamentals-part-1-1fc08a15674',
    image: ARTICLE_IMAGES.designCritique,
    tag: 'Critique',
    meta: ['Medium', 'Part 1'],
    title: 'Design Critique Fundamentals',
    summary:
      "A deep dive into the foundations of effective design critique — how to give, receive, and structure feedback that elevates the entire team's output.",
  },
  {
    href: 'https://medium.com/design-bootcamp/mastering-the-art-of-asking-targeted-questions-c6e5fd2f5b87',
    image: ARTICLE_IMAGES.targetedQuestions,
    tag: 'Research',
    meta: ['Design Bootcamp', 'Medium'],
    title: 'Mastering the Art of Asking Targeted Questions',
    summary:
      'How precise, intentional questioning unlocks deeper user insights and drives more impactful design decisions across product teams.',
  },
  {
    href: 'https://medium.com/@ahmedmohammedeldeeb/redefining-design-leadership-navigating-uncharted-responsibilities-114c5ce3ba0c',
    image: ARTICLE_IMAGES.designLeadership,
    tag: 'Leadership',
    meta: ['Medium', 'Leadership'],
    title: 'Redefining Design Leadership: Navigating Uncharted Responsibilities',
    summary:
      'Exploring the evolving role of design leaders — from craft to strategy, mentorship, and navigating responsibilities that no one prepared you for.',
  },
] as const;

export function Articles() {
  return (
    <section id="articles-activities" className="bg-[#0A0A0A] py-[88px] border-t border-white/[0.03]">
      <div className="container mx-auto px-10 max-w-[1560px]">
        <SectionHeader
          eyebrow="Perspectives"
          title="Articles &"
          flourish="activities."
          subtitle="Essays and field notes on design critique, research, and what it takes to lead product teams through ambiguity."
        />

        {/* Articles Grid - Editorial Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {ARTICLES.map((article, i) => (
            <motion.a
              key={article.href}
              href={article.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="group flex flex-col h-full no-underline rounded-[32px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#4AF2E5]"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] mb-8 bg-[#111] border border-white/[0.08]">
                <img
                  src={article.image}
                  alt=""
                  className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 ease-[0.22, 1, 0.36, 1]"
                  loading="lazy"
                />
                <div className="absolute bottom-6 left-6 z-10">
                  <span className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-[#4AF2E5] text-[10px] font-black uppercase tracking-widest">
                    {article.tag}
                  </span>
                </div>
              </div>

              <div className="flex flex-col flex-grow">
                <div className="flex items-center gap-4 mb-4 text-white/40 text-[10px] font-black uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{article.meta[0]}</span>
                  </div>
                  <span className="w-1 h-1 rounded-full bg-white/10" />
                  <span>{article.meta[1]}</span>
                </div>
                <h3 className="text-white text-2xl md:text-3xl font-black uppercase leading-tight tracking-tighter mb-4 group-hover:text-[#4AF2E5] transition-colors duration-500">
                  {article.title}
                </h3>
                <p className="text-white/40 text-lg leading-relaxed font-medium mb-8 flex-grow">
                  {article.summary}
                </p>
                <div className="pt-6 border-t border-white/[0.05] flex items-center justify-between group-hover:border-[#4AF2E5]/20 transition-colors">
                  <span className="text-white/20 group-hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
                    Read Full Article
                    <span className="sr-only"> on Medium (opens in a new tab)</span>
                  </span>
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transform group-hover:translate-x-2 group-hover:border-[#4AF2E5]/40 transition-all duration-500">
                    <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white" />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
