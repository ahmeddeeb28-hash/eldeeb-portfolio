import { motion } from 'motion/react';
import { ArrowUpRight, Download, Mail } from 'lucide-react';

/* ── Why hire me ─────────────────────────────────────
   The recruiter's thirty seconds: three strengths, each with one proof
   that already appears elsewhere on the site, a founder's words beside
   them, and the roles I'm open to with a way to reach me.

   Every figure here is from the case studies or the CV:
     12+ designers led, +40% design velocity  LeadershipCaseStudy
     +28% repeat purchases                    Sary Buy Again case
     +40% dashboard usage (pilot)             Sampo AI case
   The quote is quoted word for word from a LinkedIn recommendation
   (components/Testimonials.tsx). */

const CV_URL = '/cv/Ahmad_Eldeeb_Lead_Product_Designer_CV.pdf';
const MAIL = 'mailto:ahmeddeeb28@gmail.com?subject=Hiring%3A%20Lead%20Product%20Designer';
const DISPLAY = "'Inter Tight', Inter, system-ui, -apple-system, sans-serif";

const STRENGTHS: { proof: string; unit: string; title: string; line: string; link: string; cta: string }[] = [
  {
    proof: '12+',
    unit: 'designers led',
    title: 'I lead teams and still design the hard parts',
    line: 'One owner per objective, a steady weekly rhythm, one source of truth. Design velocity went up 40% at Sary and Lobah.',
    link: '/work/sary-design-leadership',
    cta: 'How I lead',
  },
  {
    proof: '+28%',
    unit: 'repeat purchases',
    title: 'I turn research into numbers that move',
    line: 'Store owners took 39 taps to restock. The Buy Again hub cut it to 3, and order value rose 27%.',
    link: '/work/sary-repeat-customers',
    cta: 'See the Sary case',
  },
  {
    proof: '+40%',
    unit: 'dashboard usage, pilot',
    title: 'I design AI products people trust',
    line: 'Sampo AI sets store prices with every strategy explained, previewed and reversible before it goes live.',
    link: '/work/sampo-ai-pricing',
    cta: 'See the Sampo case',
  },
];

export function WhyHire() {
  return (
    <section id="why-hire" aria-labelledby="why-hire-title" className="relative px-6 bg-[#0A0A0A]" style={{ paddingTop: 96, paddingBottom: 72 }}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-end mb-12">
          <div>
            <p className="text-sm font-medium text-white/45 mb-4">Why hire me</p>
            <h2 id="why-hire-title" className="text-white" style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(34px, 4.2vw, 58px)', lineHeight: 1.02, letterSpacing: '-0.042em', textWrap: 'balance' }}>
              A lead who ships, <span style={{ color: 'rgba(255,255,255,0.42)' }}>with numbers to show for it.</span>
            </h2>
          </div>

          {/* a founder's words, verbatim from LinkedIn */}
          <figure className="rounded-[22px] p-6" style={{ background: '#141414', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)' }}>
            <blockquote className="text-white/85 text-[17px] leading-relaxed" style={{ fontFamily: DISPLAY, letterSpacing: '-0.01em' }}>
              “His ability to distill complex data into actionable insights has been invaluable for our strategic decision-making.”
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <img src="/images/people/aldossary.webp" alt="" className="w-10 h-10 rounded-full object-cover" loading="lazy" />
              <span>
                <span className="block text-white text-sm font-semibold">Mohammed Aldossary</span>
                <span className="block text-white/50 text-[13px]">Co-founder &amp; CEO at Sary · Ex Careem</span>
              </span>
            </figcaption>
          </figure>
        </div>

        <ol className="grid gap-4 md:grid-cols-3">
          {STRENGTHS.map((s, k) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ delay: k * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <a
                href={s.link}
                className="group flex h-full flex-col rounded-[22px] p-7 transition-colors duration-300 hover:bg-[#1A1A1A] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                style={{ background: '#141414', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)' }}
              >
                <p className="flex items-baseline gap-2 text-white">
                  <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 48, lineHeight: 1, letterSpacing: '-0.05em' }}>{s.proof}</span>
                  <span className="text-white/50 text-sm font-medium">{s.unit}</span>
                </p>
                <h3 className="text-white mt-8 text-xl leading-snug">{s.title}</h3>
                <p className="text-white/55 text-[15px] leading-relaxed mt-3 flex-1">{s.line}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 group-hover:text-white">
                  {s.cta}
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            </motion.li>
          ))}
        </ol>

        {/* what I'm looking for, and the two ways to act on it */}
        <div className="mt-4 flex flex-col gap-5 rounded-[22px] p-6 md:flex-row md:items-center md:justify-between" style={{ background: '#141414', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)' }}>
          <p className="text-white/85 text-[15px] leading-relaxed">
            <span className="text-white font-semibold">Open to Lead and Principal Product Designer roles.</span>{' '}
            Remote, in the Gulf, or relocating to Europe.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={MAIL} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02]">
              <Mail className="w-4 h-4" /> Email me about a role
            </a>
            <a href={CV_URL} download className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/85 hover:text-white hover:border-white/30">
              <Download className="w-4 h-4" /> Download CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
