import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

export type CriticalPhase = {
  n: string;
  name: string;
  action: string;
  question: string;
  methods: string[];
  output: string;
};

/* ── Critical Process — guided, interactive procedural spine ──
   Scroll-driven progress fill · active phase tracking · click-to-expand
   guiding-question + tools + output. Each project passes its own phases
   so the spine reads as bespoke domain narrative, not generic process. */
export function CriticalProcess({
  phases,
  handoffNote = 'The trade-offs below are the receipts of phase 04',
}: {
  phases: CriticalPhase[];
  handoffNote?: string;
}) {
  // Scroll-driven progress fill for the spine
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 70%', 'end 40%'],
  });
  const fillHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // Active-phase tracking via IntersectionObserver
  const phaseRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(0); // first one open by default

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    phaseRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIdx(i);
        },
        { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="relative" ref={sectionRef}>
      {/* Section label */}
      <div className="flex items-center gap-4 mb-8">
        <span className="text-[#4AF2E5] text-[10px] font-black uppercase tracking-[0.4em]">
          Critical Process
        </span>
        <span className="flex-1 h-px bg-gradient-to-r from-[#4AF2E5]/30 to-transparent" />
        <span className="text-white/25 text-[10px] font-black uppercase tracking-[0.3em]">
          {activeIdx + 1} / {phases.length}
        </span>
      </div>

      <div className="relative mt-12">
        {/* Vertical spine — base + scroll-driven fill */}
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-white/[0.06] md:left-[23px]" />
        <motion.div
          className="absolute left-[19px] top-2 w-px bg-gradient-to-b from-[#4AF2E5] via-[#4AF2E5]/60 to-[#4AF2E5]/0 md:left-[23px]"
          style={{ height: fillHeight }}
        />

        <ol className="space-y-6">
          {phases.map((p, i) => {
            const isActive = i === activeIdx;
            const isOpen = expanded === i;
            return (
              <motion.li
                key={p.n}
                ref={(el) => {
                  phaseRefs.current[i] = el;
                }}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ delay: i * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="relative pl-16 md:pl-20"
              >
                {/* Numbered node */}
                <div
                  className={`absolute left-0 top-0 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border bg-[#0A0A0A] text-[11px] font-black tracking-[0.1em] transition-all duration-500 ${
                    isActive
                      ? 'border-[#4AF2E5] text-[#4AF2E5] scale-110 shadow-[0_0_32px_rgba(74,242,229,0.45)]'
                      : 'border-white/15 text-white/50'
                  }`}
                >
                  {p.n}
                  {isActive && (
                    <span className="absolute inset-0 rounded-full border border-[#4AF2E5]/40 animate-ping" />
                  )}
                </div>

                {/* Active connector hairline */}
                {isActive && (
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="hidden md:block absolute left-12 top-6 origin-left h-px w-4 bg-[#4AF2E5]"
                  />
                )}

                {/* Clickable header row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : i)}
                  className="w-full text-left group/row cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-baseline gap-3 mb-3">
                    <span
                      className={`text-[10px] font-black uppercase tracking-[0.4em] transition-colors duration-500 ${
                        isActive ? 'text-[#4AF2E5]' : 'text-white/30'
                      }`}
                    >
                      Phase {p.n}
                    </span>
                    <span className="text-white/10 text-[10px] font-black tracking-[0.3em]">·</span>
                    <span
                      className={`text-base md:text-lg font-black uppercase tracking-[0.2em] transition-colors duration-500 ${
                        isActive ? 'text-white' : 'text-white/55'
                      }`}
                    >
                      {p.name}
                    </span>
                  </div>

                  <p
                    className={`text-lg md:text-xl font-bold leading-snug tracking-tight max-w-2xl mb-4 transition-colors duration-500 ${
                      isActive ? 'text-white' : 'text-white/65 group-hover/row:text-white'
                    }`}
                  >
                    {p.action}
                  </p>

                  {/* Expand affordance */}
                  <div className="flex items-center gap-2 text-white/35 text-[10px] font-black uppercase tracking-[0.25em]">
                    <span className="w-3 h-px bg-white/20" />
                    <span>{isOpen ? 'Hide details' : 'Open the move'}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-white/40"
                    >
                      →
                    </motion.span>
                  </div>
                </button>

                {/* Expandable depth panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="panel"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 grid md:grid-cols-12 gap-6 max-w-3xl">
                        {/* Question — italic Fraunces, the guiding prompt */}
                        <div className="md:col-span-12 relative pl-5 border-l border-[#4AF2E5]/40">
                          <span className="block text-[#4AF2E5] text-[9px] font-black uppercase tracking-[0.4em] mb-2">
                            Guiding question
                          </span>
                          <p
                            className="text-white/85 text-lg md:text-xl italic leading-snug"
                            style={{ fontFamily: 'Fraunces, Georgia, serif' }}
                          >
                            "{p.question}"
                          </p>
                        </div>

                        {/* Methods — chips */}
                        <div className="md:col-span-7">
                          <span className="block text-white/35 text-[9px] font-black uppercase tracking-[0.4em] mb-3">
                            Methods used
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {p.methods.map((m) => (
                              <span
                                key={m}
                                className="px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] text-white/70 text-[10px] font-black uppercase tracking-[0.18em]"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Output — what came out of this phase */}
                        <div className="md:col-span-5">
                          <span className="block text-white/35 text-[9px] font-black uppercase tracking-[0.4em] mb-3">
                            Output
                          </span>
                          <p className="text-white/70 text-sm leading-relaxed">{p.output}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ol>
      </div>

      {/* Hand-off line */}
      <div className="mt-14 flex items-center gap-4 pl-16 md:pl-20">
        <span className="w-8 h-px bg-[#4AF2E5]/40" />
        <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
          {handoffNote}
        </span>
      </div>
    </div>
  );
}
