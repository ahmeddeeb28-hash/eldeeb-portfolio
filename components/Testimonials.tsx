import { motion, useReducedMotion } from 'motion/react';
import { useRef } from 'react';
import { ArrowLeft, ArrowRight, Linkedin } from 'lucide-react';

/* ── Recommendations ─────────────────────────────────
   What people say about working with me, word for word from their
   recommendations and LinkedIn: the CEO at Sary, a design director,
   a growth director, a designer I worked beside, and three designers
   who reported to me. Long LinkedIn texts end at the last full
   sentence shown there; the full versions live on LinkedIn.

   A row of cards that scrolls sideways (drag, trackpad, or the
   arrows), snapping to each card. Leadership voices come first. */

const LINKEDIN_URL = 'https://www.linkedin.com/in/el-deeb-39032b131/details/recommendations/';

type Quote = { text: string; name: string; role: string; relation: string; tint: string; photo: string };

const QUOTES: Quote[] = [
  {
    text: 'His ability to distill complex data into actionable insights has been invaluable for our strategic decision-making. He has fostered a culture of innovation within our design team, enhancing collaboration and elevating our deliverables.',
    name: 'Mohammed Aldossary',
    photo: '/images/people/aldossary.webp',
    role: 'Co-founder & CEO at Sary · Ex Careem',
    relation: 'Worked together at Sary',
    tint: '#2DD4BF',
  },
  {
    text: 'Ahmed has the capacity to come up with creative solutions to complex problems and takes sound decisions based on his communication with PMs and his understanding of his team members’ needs, and has a positive attitude towards trying new things and is always willing to explore new challenges.',
    name: 'Yasser Nazmy',
    photo: '/images/people/nazmy.webp',
    role: 'Design Director at HungerStation, Delivery Hero',
    relation: 'Worked together',
    tint: '#F5C451',
  },
  {
    text: 'Ahmad is an excellent lead, working with him was both comfortable and interesting! He is always attentive to detail, passionate about his work, and fully committed to everything he does! He has a great talent for organizing work, skillfully delegating tasks based on his team members’ individual strengths, while also fostering their professional growth, acting as a true mentor in the process.',
    name: 'Polina Kosheleva',
    photo: '/images/people/polina.webp',
    role: 'Senior Game UI Artist · UX Designer',
    relation: 'Reported to Ahmad directly',
    tint: '#8B85FF',
  },
  {
    text: 'Ahmed is an exceptional leader, and I feel incredibly fortunate to have been part of his team. Under his leadership, everything was well-organized, transparent, and clearly communicated. He created an environment where everyone felt supported, heard, and appreciated.',
    name: 'Sandra Mistal',
    photo: '/images/people/sandra.webp',
    role: 'UI Designer · 2D Artist, games',
    relation: 'Reported to Ahmad directly',
    tint: '#F472B6',
  },
  {
    text: 'Ahmad’s adept management of report rituals, coupled with his exceptional efforts in customizing reports to reflect product performance, showcases his skill in integrating new cultural dynamics between design and product growth.',
    name: 'Asad Ali Shah',
    photo: '/images/people/asad.webp',
    role: 'Director of Growth · Advisor, business development',
    relation: 'Worked together',
    tint: '#A78BFA',
  },
  {
    text: 'I have had the pleasure to work under Ahmed’s management for many months, and his attention to detail, positive attitude and knowledge of UX and UI design both in the game industry and outside of it cannot be highlighted enough. Ahmed is a serious designer and a great manager, he would be a great addition to any team.',
    name: 'Axel Xiberras',
    photo: '/images/people/axel.webp',
    role: 'UX UI Designer',
    relation: 'Reported to Ahmad directly',
    tint: '#60A5FA',
  },
  {
    text: 'Ahmed is one of those designers who gets to the heart of a problem and solves it elegantly and effectively. He didn’t just present findings; he defined what success looked like and showed exactly how our work would move the needle.',
    name: 'Mohamed Kamal',
    photo: '/images/people/kamal.webp',
    role: 'Senior Product Designer at HungerStation · ex-Sary',
    relation: 'Worked on the same team',
    tint: '#34D399',
  },
];

export function Testimonials() {
  const row = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const nudge = (dir: 1 | -1) => {
    const el = row.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-card]');
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 480) + 16), behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <section id="recommendations" aria-labelledby="recommendations-title" className="relative bg-[#0A0A0A] py-24 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10 md:mb-14">
          <div className="max-w-2xl">
            <h2 id="recommendations-title" className="text-white font-extrabold tracking-[-0.045em] leading-[0.95]" style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}>
              In their words.
            </h2>
            <p className="text-white/60 text-base md:text-xl leading-snug mt-4">
              From Sary’s CEO, design and growth directors, and the designers who reported to me.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 text-white/80 hover:text-white hover:border-white/30 text-sm font-medium px-4 py-2.5 mr-2 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              All on LinkedIn
            </a>
            <button type="button" onClick={() => nudge(-1)} aria-label="Previous recommendation" className="grid place-items-center w-11 h-11 rounded-full border border-white/15 text-white/80 hover:text-white hover:border-white/30 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => nudge(1)} aria-label="Next recommendation" className="grid place-items-center w-11 h-11 rounded-full border border-white/15 text-white/80 hover:text-white hover:border-white/30 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={row}
        role="list"
        aria-label="Recommendations"
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        // line the first card up with the heading, and keep snapping on that edge
        style={{ paddingInline: 'max(16px, calc((100vw - 1440px) / 2 + 24px))', scrollPaddingInline: 'max(16px, calc((100vw - 1440px) / 2 + 24px))' }}
      >
        {QUOTES.map((q, i) => (
          <motion.figure
            key={q.name}
            role="listitem"
            data-card
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.6, delay: Math.min(i, 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="snap-start flex-none w-[86vw] sm:w-[440px] md:w-[500px] min-h-[420px] rounded-[28px] bg-[#161618] border border-white/[0.07] p-7 md:p-9 flex flex-col"
          >
            <span aria-hidden className="text-5xl leading-none font-extrabold" style={{ color: q.tint }}>
              “
            </span>
            <blockquote className="mt-6 mb-8 flex-1 flex items-center">
              <p className="text-white text-lg md:text-[21px] leading-[1.45] tracking-[-0.01em]">{q.text}</p>
            </blockquote>
            <figcaption className="flex items-center gap-3.5">
              <img
                src={q.photo}
                alt=""
                aria-hidden
                loading="lazy"
                decoding="async"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover flex-none"
                style={{ boxShadow: `0 0 0 2px ${q.tint}` }}
              />
              <span className="min-w-0">
                <span className="block text-white font-semibold text-[15px]">{q.name}</span>
                <span className="block text-white/55 text-[13px] leading-snug">{q.role}</span>
                <span className="block text-white/40 text-[12px] mt-0.5">{q.relation}</span>
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
