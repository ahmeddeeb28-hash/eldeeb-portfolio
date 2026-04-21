import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Achievement {
  company: string;
  items: string[];
}

interface ExperienceCardProps {
  role: string;
  company: string;
  domain: string;
  period: string;
  type: string;
  description: string;
  isPrimary?: boolean;
  isHistorical?: boolean;
  achievements?: Achievement[];
  tags?: string[];
}

function ExperienceCard({ role, company, domain, period, type, description, isPrimary, isHistorical, achievements, tags }: ExperienceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Extract the "Impact Hook" (first sentence)
  const firstSentence = description.split('. ')[0] + '.';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: isHistorical ? 0.6 : 1, y: 0 }}
      viewport={{ once: true }}
      className={`group relative p-8 md:p-10 rounded-[2.5rem] overflow-hidden border transition-all duration-500 w-full text-left
        ${isPrimary 
          ? 'border-white/[0.08] bg-[#0E0E0E] backdrop-blur-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]' 
          : 'border-white/[0.04] bg-[#0E0E0E]/40 backdrop-blur-xl hover:border-white/10 hover:opacity-100'
        }`}
    >
      {isPrimary && (
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#4AF2E5]/5 blur-[120px] rounded-full -mr-40 -mt-40 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-1000" />
      )}

      <div className="relative z-10">
        {/* Header Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className={`flex items-center gap-2.5 px-4 py-1.5 rounded-full border backdrop-blur-sm
            ${isPrimary 
              ? 'border-[#4AF2E5]/20 bg-[#4AF2E5]/5' 
              : 'border-white/10 bg-white/5'
            }`}>
            <span className={`w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] ${isPrimary ? 'bg-[#4AF2E5] animate-pulse' : 'bg-white/20'}`} />
            <span className={`text-[10px] font-black tracking-[0.2em] uppercase ${isPrimary ? 'text-[#4AF2E5]' : 'text-white/40'}`}>
              {type}
            </span>
          </div>
          <span className="text-white/20 font-mono text-[11px] tracking-[0.2em] uppercase">{period}</span>
        </div>

        {/* Content Stack: Role -> Company -> Description */}
        <div className="max-w-4xl">
          <h3 className={`font-black tracking-tighter mb-2 leading-[1.1] transition-colors
            ${isPrimary ? 'text-white text-3xl md:text-5xl' : 'text-white/80 text-2xl md:text-4xl group-hover:text-white'}
          `}>
            {role}
          </h3>
          
          <div className="flex items-center gap-3 text-lg font-bold mb-8">
            <span className={isPrimary ? 'text-[#4AF2E5]' : 'text-[#4AF2E5]/60'}>{company}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
            <span className="text-white/30 text-xs font-mono uppercase tracking-widest">{domain}</span>
          </div>

          <div className="relative">
            <div className="space-y-4">
              <p className={`text-base md:text-lg leading-[1.5] font-medium transition-all duration-500
                ${isPrimary ? 'text-white/60' : 'text-white/40'}
              `}>
                {!isExpanded ? firstSentence : description}
              </p>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    {tags && (
                      <div className="flex flex-wrap gap-2 mb-8 mt-2">
                        {tags.map(tag => (
                          <span key={tag} className="px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] text-[9px] font-black tracking-widest uppercase text-white/40">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {achievements && (
                      <div className="space-y-8 mt-6">
                        {achievements.map((group, idx) => (
                          <div key={idx} className="space-y-4">
                            <h4 className="text-[#4AF2E5] text-[10px] font-black tracking-[0.3em] uppercase opacity-80">
                              Impact at {group.company}
                            </h4>
                            <ul className="space-y-3">
                              {group.items.map((item, i) => (
                                <li key={i} className="flex gap-4 text-white/50 text-base leading-relaxed">
                                  <span className="mt-2.5 w-1 h-1 shrink-0 rounded-full bg-[#4AF2E5]/40" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-8 flex items-center gap-2 text-[#4AF2E5] hover:text-white transition-colors font-mono text-[10px] tracking-widest uppercase group/btn"
            >
              {isExpanded ? (
                <>Collapse Details <ChevronUp className="w-3 h-3 group-hover/btn:-translate-y-0.5 transition-transform" /></>
              ) : (
                <>Show More Achievements <ChevronDown className="w-3 h-3 group-hover/btn:translate-y-0.5 transition-transform" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function About() {
  const [showMore, setShowMore] = useState(false);
  return (
    <section id="about" className="relative px-6 py-32 bg-[#0A0A0A] overflow-hidden">
      {/* Premium Texture Overlay */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Editorial Header Section */}
        <div className="mb-24 flex flex-col md:flex-row md:items-start justify-between gap-12">
          <div className="max-w-3xl relative pl-8">
            {/* Vertical Accent Rule */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#4AF2E5]/40 to-transparent shadow-[0_0_12px_rgba(74,242,229,0.3)]" />
            
            <span className="text-[#4AF2E5] font-mono text-[11px] tracking-[0.4em] uppercase block mb-6">Decision → Execution → Impact</span>
            <h2 
              className="text-white font-black uppercase leading-[0.9] tracking-tighter mb-10"
              style={{ fontSize: 'clamp(3rem, 10vw, 6rem)' }}
            >
              Expertise<br />& Growth.
            </h2>
            
            <div className="space-y-6">
              <p className="text-[rgba(255,255,255,0.78)] text-base md:text-lg leading-[1.55] font-medium">
                Leading product design at the intersection of <span className="text-[#4AF2E5]">complex systems</span> and high-performance user experiences.
                Over <span className="text-[#4AF2E5]">9+ years</span>, I’ve led and scaled <span className="text-[#4AF2E5]">multinational design teams</span> across <span className="text-[#4AF2E5]">Europe and global markets</span>, driving clarity, execution, and measurable business impact across gaming, fintech, SaaS, and AI-driven platforms.
              </p>
            </div>
          </div>
          
          <div className="shrink-0 pt-8">
            <div className="relative group cursor-default">
              {/* Outer Ambient Glow */}
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.05, 0.15, 0.05]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-[#4AF2E5] blur-2xl pointer-events-none"
              />
              
              <div className="relative w-32 h-32 md:w-44 md:h-44 flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                {/* Rotating Circular Text Stamp */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 z-10"
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                    <defs>
                      <path
                        id="stampTextPath"
                        d="M 50, 50 m -43, 0 a 43,43 0 1,1 86,0 a 43,43 0 1,1 -86,0"
                      />
                    </defs>
                    <text className="text-[5px] uppercase font-black tracking-[0.38em] fill-[#4AF2E5]/60">
                      <textPath href="#stampTextPath" startOffset="0%">
                        Senior Product Leadership • Validated Impact • 9+ Years Experience • 
                      </textPath>
                    </text>
                  </svg>
                </motion.div>

                {/* Central Seal Architecture */}
                <div className="relative flex flex-col items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full border border-white/20 bg-gradient-to-br from-[#1A1A1A] via-[#0E0E0E] to-[#000000] shadow-[0_0_50px_-10px_rgba(0,0,0,0.8)] overflow-hidden z-20">
                  {/* Glass/Surface Highlight */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
                  
                  <span className="relative text-white font-black text-3xl md:text-5xl tracking-tighter leading-none mb-1 drop-shadow-2xl">9+</span>
                  <div className="relative flex flex-col items-center">
                    <div className="bg-[#4AF2E5]/20 px-2 py-0.5 rounded-full border border-[#4AF2E5]/30 mb-1 backdrop-blur-md">
                      <span className="text-[#4AF2E5] font-black text-[6px] md:text-[7px] tracking-widest uppercase block">Authenticated</span>
                    </div>
                    <span className="text-white/40 font-bold text-[6px] md:text-[7px] tracking-[0.25em] uppercase">Seniority Seal</span>
                  </div>

                  {/* Etched Insets */}
                  <div className="absolute inset-1.5 border border-white/10 rounded-full pointer-events-none" />
                  <div className="absolute inset-[3px] border border-white/5 rounded-full pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card-based Experience System */}
        <div className="flex flex-col gap-6 w-full">
          <ExperienceCard 
            role="Lead Game UI/UX Designer"
            company="Lobah Gaming"
            domain="Global Studio"
            period="2024 — PRESENT"
            type="Active Leadership"
            description="Directing UI/UX strategy for a global gaming studio, establishing scalable design systems and high-performance interfaces for a multi-title ecosystem. Established a unified game UI/UX system covering HUD, skills, progression, store, and live-ops features."
            isPrimary
            tags={["Leadership", "Gaming", "Systems Architecture"]}
            achievements={[
              {
                company: "Lobah Gaming",
                items: [
                  "Established a unified game UI/UX system covering HUD, skills, progression, store, and live-ops features.",
                  "Led and mentored the game UI/UX team, setting quality standards and review processes.",
                  "Designed core gameplay and combat interfaces used in live production.",
                  "Aligned UI logic with gameplay mechanics, improving clarity and player feedback.",
                  "Built reusable components and patterns to support future titles and scalability.",
                  "Drove cross-team alignment between design, game design, and engineering."
                ]
              }
            ]}
          />

          <ExperienceCard 
            role="Principal Product Designer"
            company="SAMPO AI Pricing Tool"
            domain="AI Architecture"
            period="2024 — PRESENT"
            type="Strategic Execution"
            description="Architecting complex AI-driven pricing and analytics platforms, translating deep algorithmic logic into intuitive enterprise-grade interfaces. Designed AI pricing and analytics interfaces for complex, data-dense enterprise use cases."
            tags={["AI/ML", "Enterprise SaaS", "Strategic Design"]}
            achievements={[
              {
                company: "SAMPO AI Pricing Tool",
                items: [
                  "Designed AI pricing and analytics interfaces for complex, data-dense enterprise use cases.",
                  "Translated algorithmic logic into transparent, auditable user flows.",
                  "Led design decisions across product discovery, iteration, and delivery.",
                  "Partnered closely with product and engineering on system architecture and UX trade-offs.",
                  "Defined interaction patterns for advanced pricing, insights, and recommendations.",
                  "Elevated product clarity and usability in high-risk decision environments."
                ]
              }
            ]}
          />

          <AnimatePresence>
            {showMore && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-6 overflow-hidden"
              >
                <ExperienceCard 
                  role="Product Design Lead"
                  company="Hakbah"
                  domain="Saudi Fintech"
                  period="2024"
                  type="Growth Lead"
                  description="Led product design for a leading Saudi fintech, optimizing core user journeys and establishing high-impact design workflows for rapid growth. Led the design function across key fintech product areas and growth initiatives."
                  isHistorical
                  tags={["Fintech", "Growth", "Leadership"]}
                  achievements={[
                    {
                      company: "Hakbah",
                      items: [
                        "Led the design function across key fintech product areas and growth initiatives.",
                        "Owned end-to-end user journeys across saving, engagement, and notification flows.",
                        "Established design workflows, documentation, and team alignment practices.",
                        "Balanced user needs with business goals to drive adoption and retention.",
                        "Collaborated with leadership and cross-functional teams on product strategy.",
                        "Supported scaling the product design practice during growth stages."
                      ]
                    }
                  ]}
                />

                <ExperienceCard 
                  role="Design Lead"
                  company="Sary"
                  domain="B2B E-commerce"
                  period="2021 — 2024"
                  type="Platform Ownership"
                  description="Drove product clarity and led design strategy across key procurement and engagement flows for a market-leading B2B marketplace. Scaled the design system from early-stage components to a comprehensive library supporting multi-platform mobile and web experiences."
                  isHistorical
                  tags={["Marketplace", "Scale", "B2B"]}
                  achievements={[
                    {
                      company: "Sary",
                      items: [
                        "Scaled the design system from early-stage components to a comprehensive library supporting multi-platform mobile and web experiences.",
                        "Led design strategy for high-conversion procurement flows, reducing checkout friction for thousands of B2B merchants.",
                        "Mentored junior designers and established standard operating procedures for the design-to-engineering handoff."
                      ]
                    }
                  ]}
                />

                <ExperienceCard 
                  role="Senior Product Designer"
                  company="Zyda"
                  domain="SaaS Infrastructure"
                  period="2019 — 2021"
                  type="Product Maturity"
                  description="Scaled design practices for a high-growth SaaS platform, establishing foundational standards for multi-product ecosystems. Redesigned B2B merchant dashboards and unified component libraries to accelerate feature delivery across distributed product teams."
                  isHistorical
                  tags={["SaaS", "B2B", "System Design"]}
                  achievements={[
                    {
                      company: "Zyda",
                      items: [
                        "Led the redesign of the B2B merchant dashboard, simplifying complex order management logic for 2,000+ active vendors.",
                        "Established a unified design system that reduced front-end development cycles by 25% across mobile and web platforms.",
                        "Architected the visual language for live-tracking delivery interfaces, increasing customer trust and retention rates."
                      ]
                    }
                  ]}
                />

                <ExperienceCard 
                  role="Senior Product Designer"
                  company="AqarMap"
                  domain="Real Estate Marketplace"
                  period="2019 — 2021"
                  type="Product Maturity"
                  description="Drove product maturity for a leading real estate marketplace, optimizing core search and discovery experiences. Established mobile-first frameworks and data visualization standards for property analytics."
                  isHistorical
                  tags={["Marketplace", "Search UX", "Data Viz"]}
                  achievements={[
                    {
                      company: "AqarMap",
                      items: [
                        "Optimized search and filtering UX for the largest real estate marketplace in the region, leading to a 15% increase in lead generation.",
                        "Collaborated with data science teams to design predictive pricing visualizations for real estate investors.",
                        "Developed a mobile-first UI framework that enhanced performance on low-bandwidth connections for regional accessibility."
                      ]
                    }
                  ]}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle Button */}
          <div className="flex justify-center mt-8">
            <button 
              onClick={() => setShowMore(!showMore)}
              className="group relative px-8 py-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <span className="text-white text-xs font-black uppercase tracking-[0.3em]">
                  {showMore ? 'View Less Experience' : 'Show All Historical Roles'}
                </span>
                {showMore ? (
                  <ChevronUp className="w-4 h-4 text-[#4AF2E5] group-hover:-translate-y-1 transition-transform" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#4AF2E5] group-hover:translate-y-1 transition-transform" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
