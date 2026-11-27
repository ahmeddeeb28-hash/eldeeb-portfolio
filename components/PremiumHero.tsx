import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useLang } from '../lib/i18n';

export function PremiumHero() {
  const { tr } = useLang();

  /* A plain, human first screen: who I am in one sentence, the proof a
     recruiter looks for, and a real photo. No glows, floating stickers
     or effects, so nothing reads as generated. */
  return (
    <section data-track-area="hero" className="relative min-h-screen flex items-center bg-black">
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 md:px-10 lg:px-14 grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-12 lg:gap-20 items-center pt-32 pb-24 lg:pt-28 lg:pb-16">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-white/55 text-base md:text-lg mb-6"
          >
            {tr('Ahmad Eldeeb, Lead Product Designer', 'أحمد الديب، قائد تصميم المنتجات')}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            className="text-white font-semibold tracking-[-0.035em] leading-[1.06] mb-7"
            style={{ fontSize: 'clamp(2.3rem, 4.6vw, 4.1rem)' }}
          >
            {tr('I don’t design screens. I design what makes people buy.', 'أقود فرق التصميم، ولا أترك القلم حين تصعب المهمة.')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
            className="text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl mb-10"
          >
            {tr(
              'E-commerce, fintech, SaaS, AI and games. I lead design teams, I still design the hard parts myself, and I make products people come back to and pay for. If that’s what your product needs, I can help.',
              'عشر سنوات بين التجارة الإلكترونية والتقنية المالية ومنصات الأعمال والذكاء الاصطناعي والألعاب.',
            )}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.38 }}
            className="flex flex-wrap items-center gap-6"
          >
            <a
              href="mailto:ahmeddeeb28@gmail.com?subject=Hiring%3A%20Lead%20Product%20Designer"
              className="group inline-flex items-center gap-2.5 h-12 px-7 rounded-full bg-white text-black text-[15px] font-semibold transition-colors hover:bg-white/90"
            >
              {tr('Email me', 'راسلني')}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100" />
            </a>
            <a href="#selected-work-section-lock" onClick={(e) => { const el = document.getElementById('selected-work-section-lock'); if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); } }} className="text-white/70 hover:text-white text-[15px] font-medium transition-colors">
              {tr('See the work', 'شاهد الأعمال')}
            </a>
          </motion.div>
        </div>

        <motion.figure
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-[340px] lg:max-w-[420px] lg:ms-auto lg:me-0"
        >
          <img src="/images/profile.jpg" alt="Ahmad Eldeeb" className="w-full aspect-[4/5] object-cover rounded-[20px]" />
        </motion.figure>
      </div>
    </section>
  );
}
