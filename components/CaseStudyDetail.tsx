const image_65ae2194b2d7fc6509211a2c41e96e314419ffcb = 'https://images.unsplash.com/photo-1553484771-371a605b060b?auto=format&fit=crop&q=80&w=1200';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Calendar, Building, User, CheckCircle2, X, Maximize2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useEffect, useState } from 'react';

export interface CaseStudyData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cover: string;
  role: string;
  company: string;
  duration: string;
  context: string;
  problem: string;
  goals: string[];
  approach: string;
  solution: string;
  impact: string[];
  learnings: string[];
  // New/Updated Sections
  metricSnapshot?: { label: string; before: string; after: string }[];
  investigation?: { title: string; tool: string; insight: string }[];
  visualSummary?: { url: string; caption: string }[];
  collaboration?: { teams: string[]; outcome: string };
  expertDecisions?: { decision: string; rationale: string; rejected?: string }[];
  mockups?: { url: string; note: string }[];
  outcomeSummary?: string;
  whatThisProves?: string;
}

interface CaseStudyDetailProps {
  project: CaseStudyData;
  onBack: () => void;
  onNext?: () => void;
}

export function CaseStudyDetail({ project, onBack, onNext }: CaseStudyDetailProps) {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project.id]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#0A0A0A] overflow-y-auto"
    >
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 px-6 py-6 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-[#4AF2E5] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Projects</span>
          </button>
          
          <div className="text-white/20 text-[10px] font-bold uppercase tracking-[0.2em]">
            Case Study / {project.title}
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        {/* Hero: The Problem & Business Impact */}
        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[#4AF2E5] text-[10px] font-bold uppercase tracking-[0.4em] mb-6">
              Executive Case Study / {project.company}
            </p>
            <h1 className="text-white text-5xl md:text-7xl font-black mb-10 leading-[1] tracking-tight max-w-4xl">
              {project.subtitle}
            </h1>
            
            {/* Project Overview Metadata */}
            <div className="flex flex-wrap gap-x-12 gap-y-8 py-10 border-y border-white/10 mb-16">
              <div className="flex flex-col gap-2">
                <span className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">Role</span>
                <span className="text-white font-bold text-sm tracking-tight">{project.role}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">Duration</span>
                <span className="text-white font-bold text-sm tracking-tight">{project.duration}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">Focus</span>
                <span className="text-white font-bold text-sm tracking-tight">Retention & AOV</span>
              </div>
            </div>

            {/* Metric Snapshot */}
            {project.metricSnapshot && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                {project.metricSnapshot.map((metric, i) => {
                  const displayLabel = {
                    "Retention Rate": "Repeat Customers",
                    "Avg Order Value": "Order Value",
                    "Suggestion CTR": "Recommendation Engagement"
                  }[metric.label] || metric.label;

                  return (
                    <motion.div
                      key={i}
                      whileHover={{ y: -4 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="group relative p-8 md:p-10 min-h-[220px] rounded-[40px] flex flex-col justify-between overflow-hidden border border-white/5 transition-all duration-500"
                      style={{
                        background: 'radial-gradient(circle at center, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0) 100%), #0D0D0D',
                        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05), 0 0 40px rgba(74,242,229,0.03)'
                      }}
                    >
                      {/* Top Accent Line */}
                      <div className="absolute top-0 left-10 w-12 h-[2px] bg-[#4AF2E5] rounded-full opacity-60 group-hover:w-20 group-hover:opacity-100 transition-all duration-500" />
                      
                      {/* Interactive Glow */}
                      <div className="absolute -inset-px bg-gradient-to-b from-[#4AF2E5]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[40px]" />
                      
                      {/* Label (Top) */}
                      <p className="relative z-10 text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                        {displayLabel}
                      </p>
                      
                      {/* Value & Trend */}
                      <div className="relative z-10 flex flex-col gap-1">
                        <div className="flex items-center gap-4">
                          <span className="text-white text-5xl md:text-6xl font-black tracking-[-0.04em] leading-none transition-transform duration-500 group-hover:scale-[1.02] origin-left">
                            {metric.after}
                          </span>
                          
                          {/* Trend Indicator */}
                          <motion.div 
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#4AF2E5]/10 border border-[#4AF2E5]/20"
                            whileHover={{ scale: 1.1 }}
                          >
                            <motion.div
                              animate={{ y: [0, -2, 0] }}
                              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            >
                              <ArrowRight className="w-5 h-5 text-[#4AF2E5] -rotate-45" />
                            </motion.div>
                          </motion.div>
                        </div>
                        
                        {/* Baseline Context */}
                        <div className="flex items-center gap-2 mt-4">
                          <span className="text-white/10 text-[10px] font-black uppercase tracking-widest">Baseline</span>
                          <span className="text-white/20 text-sm font-bold line-through">{metric.before}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            <div className="aspect-[16/10] rounded-[40px] overflow-hidden bg-[#121212] mb-20 shadow-[0_0_80px_rgba(0,0,0,0.5)] border border-white/5">
              <ImageWithFallback
                src={project.cover}
                alt={project.title}
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
              />
            </div>
          </motion.div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
          <div className="md:col-span-8 space-y-32">
            {/* The Problem */}
            <section>
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#FF5F5F]/10 border border-[#FF5F5F]/20 text-[#FF5F5F] text-[10px] font-black uppercase tracking-widest mb-8">
                The Problem
              </div>
              <h2 className="text-white text-4xl font-black mb-8 leading-tight tracking-tight">
                Why customers were buying once then disappearing.
              </h2>
              <p className="text-white/60 text-xl leading-relaxed font-medium mb-12">
                {project.problem}
              </p>
              
              {/* Baseline Impact */}
              <div className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5">
                <h3 className="text-white text-sm font-black uppercase tracking-widest mb-8 text-white/40">Baseline Impact</h3>
                <div className="space-y-6">
                  {project.impact.slice(0, 2).map((imp, i) => (
                    <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                      <span className="text-white font-bold">{imp.split(': ')[1]}</span>
                      <span className="text-[#FF5F5F] font-black tracking-tighter text-xl">Critical Drop</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Investigation & Discovery */}
            {project.investigation && (
              <section className="relative">
                <div className="flex flex-col gap-6 mb-12">
                  <div className="flex items-center gap-4">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-[#4AF2E5]/10 border border-[#4AF2E5]/20 text-[#4AF2E5] text-[10px] font-black uppercase tracking-widest">
                      Investigation & Discovery
                    </div>
                    <span className="text-white/30 text-[10px] font-black uppercase tracking-widest">How we uncovered why customers weren’t coming back</span>
                  </div>
                  
                  <h2 className="text-white text-5xl font-black leading-tight tracking-tight max-w-3xl">
                    What We Saw When We Looked Closely at User Behavior
                  </h2>
                  <p className="text-white/50 text-xl leading-relaxed max-w-2xl">
                    We knew customers were buying once — but not returning. To understand why, we reviewed real user behavior across key moments after checkout.
                  </p>

                  {/* Evidence Snapshot Strip */}
                  <div className="flex gap-4 mt-4 overflow-x-auto pb-4 no-scrollbar">
                    {[
                      { label: "Flow Drop-off", icon: "📊" },
                      { label: "Session Hesitation", icon: "🖱️" },
                      { label: "Segment Mismatch", icon: "🧩" }
                    ].map((snap, i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/5 shrink-0">
                        <span className="text-lg">{snap.icon}</span>
                        <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">{snap.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-8">
                  {project.investigation.map((inv, i) => {
                    const humanLabels = [
                      { 
                        title: "Post-Checkout Engagement Gap", 
                        insight: "Checkout completion is treated as a terminal state rather than a relationship milestone. Users are not guided toward repeat ordering or procurement workflows.",
                        metric: "68–75%", 
                        submetric: "of B2B users exit after order confirmation without follow-up action",
                        img: image_65ae2194b2d7fc6509211a2c41e96e314419ffcb,
                        caption: "Operational Exit: Buyers leave once procurement is 'done'."
                      },
                      { 
                        title: "Low Recommendation Engagement", 
                        insight: "Recommendations are visible but lack contextual relevance. In B2B, discovery without procurement logic (price tier, contract, MOQ) is ignored.",
                        metric: "3–7%", 
                        submetric: "interaction rate with recommendations during browsing or purchase flows",
                        img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
                        caption: "Context Gap: Discovery requires operational framing, not inspiration."
                      },
                      { 
                        title: "Account–Product Misalignment", 
                        insight: "Personalization is surface-level. The system optimizes for catalog exposure instead of account context, resulting in noise rather than value.",
                        metric: "45–60%", 
                        submetric: "misalignment with account business type, order history, or pricing tiers",
                        img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800",
                        caption: "Contract Friction: Relevance depends on account-specific industry logic."
                      }
                    ];
                    
                    const cardData = humanLabels[i] || { 
                      title: inv.title, 
                      insight: inv.insight, 
                      metric: "Data", 
                      submetric: "Point", 
                      img: "", 
                      caption: "" 
                    };

                    return (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="group relative bg-[#0D0D0D] border border-white/5 rounded-[48px] overflow-hidden hover:border-[#4AF2E5]/20 transition-all duration-500"
                        style={{
                          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.02)'
                        }}
                      >
                        <div className="p-12 md:p-14 flex flex-col">
                          {/* Zone 1: Context */}
                          <div className="flex flex-col gap-3 mb-12">
                            <h3 className="text-white text-2xl font-black leading-tight group-hover:text-[#4AF2E5] transition-colors">
                              {cardData.title}
                            </h3>
                            <p className="text-white/40 text-base leading-relaxed max-w-xl">
                              {cardData.insight}
                            </p>
                          </div>

                          {/* Zone 2: Signal (Metric Anchor) */}
                          <div className="flex flex-col gap-2 mb-14">
                            <span className="text-white text-8xl md:text-[100px] font-black tracking-tighter leading-none">
                              {cardData.metric}
                            </span>
                            <span className="text-white/50 text-[11px] font-black uppercase tracking-[0.3em]">
                              {cardData.submetric}
                            </span>
                          </div>

                          {/* Zone 3: Evidence */}
                          <div className="relative rounded-[32px] overflow-hidden aspect-[16/6] bg-white/[0.02]">
                            <ImageWithFallback 
                              src={cardData.img} 
                              alt={cardData.title} 
                              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                            />
                            {/* Quiet Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-80" />
                            
                            {/* Insight Chip / Caption */}
                            <div className="absolute bottom-8 left-8">
                              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#4AF2E5]" />
                                <span className="text-white/70 text-[10px] font-black uppercase tracking-widest">
                                  {cardData.caption}
                                </span>
                              </div>
                            </div>

                            {/* Verification Footnote */}
                            <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-40 transition-opacity">
                              <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em]">Verified via {inv.tool}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Strategy & Key Decisions */}
            <section>
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest mb-8">
                Strategy
              </div>
              <h2 className="text-white text-4xl font-black mb-8 leading-tight tracking-tight">
                Making upselling earn its place.
              </h2>
              <p className="text-white/60 text-xl leading-relaxed font-medium mb-12">
                {project.approach}
              </p>

              {project.expertDecisions && (
                <div className="space-y-6 mt-16">
                  <h3 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-8 text-white/30">Expert Decisions & Trade-Offs</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {project.expertDecisions.map((item, i) => (
                      <div key={i} className="p-10 rounded-[32px] bg-white/[0.01] border border-white/5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <span className="text-[#4AF2E5] text-[9px] font-black uppercase tracking-widest block mb-4">Selected Logic</span>
                            <p className="text-white text-lg font-bold mb-2">{item.decision}</p>
                            <p className="text-white/40 text-sm leading-relaxed">{item.rationale}</p>
                          </div>
                          {item.rejected && (
                            <div className="md:border-l border-white/5 md:pl-8">
                              <span className="text-[#FF5F5F] text-[9px] font-black uppercase tracking-widest block mb-4">Rejected Option</span>
                              <p className="text-white/30 text-lg font-bold line-through">{item.rejected.split(': ')[0]}</p>
                              <p className="text-white/20 text-sm leading-relaxed italic">{item.rejected.split(': ')[1]}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Execution: High-Density Visual Proof */}
            {project.mockups && project.mockups.length > 0 && (
              <section className="space-y-24">
                <div className="-mx-6 md:-mx-20">
                  {/* Section Header */}
                  <div className="px-6 md:px-20 mb-16">
                    <div className="inline-block w-fit px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest mb-4">
                      Execution & Visual Proof
                    </div>
                    <h3 className="text-white text-4xl font-black tracking-tight">Intervention & Transformation</h3>
                  </div>
                  
                  <div className="space-y-16">
                    {/* 1. BEFORE / AFTER Visuals (Side-by-Side Full-Bleed) */}
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Before View */}
                        <button 
                          onClick={() => setZoomedImage(project.mockups![1]?.url || project.mockups![0].url)}
                          className="relative group w-full aspect-video md:aspect-[16/10] overflow-hidden bg-[#0D0D0D] border border-white/5 cursor-zoom-in rounded-[24px]"
                        >
                          <div className="absolute top-6 left-6 z-10">
                            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-[#0E0E0E]/90 backdrop-blur-xl border border-white/10 shadow-2xl">
                              <div className="w-1 h-1 rounded-full bg-white/20" />
                              <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em]">
                                Before / Baseline
                              </span>
                            </div>
                          </div>
                          <ImageWithFallback 
                            src={project.mockups![1]?.url || project.mockups![0].url} 
                            alt="Before state" 
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000" 
                          />
                        </button>

                        {/* After View */}
                        <button 
                          onClick={() => setZoomedImage(project.mockups![0].url)}
                          className="relative group w-full aspect-video md:aspect-[16/10] overflow-hidden bg-[#0D0D0D] border border-[#4AF2E5]/20 cursor-zoom-in rounded-[24px]"
                        >
                          <div className="absolute top-6 left-6 z-10">
                            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-[#0E0E0E]/90 backdrop-blur-xl border border-[#4AF2E5]/20 shadow-2xl">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#4AF2E5] shadow-[0_0_8px_rgba(74,242,229,0.4)]" />
                              <span className="text-[#4AF2E5] text-[9px] font-black uppercase tracking-[0.3em]">
                                After / Intervention
                              </span>
                            </div>
                          </div>
                          <ImageWithFallback 
                            src={project.mockups![0].url} 
                            alt="After state" 
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-[2000ms]" 
                          />
                        </button>
                      </div>

                      {/* Full-Width Evidence Visual */}
                      {project.mockups![2] && (
                        <button 
                          onClick={() => setZoomedImage(project.mockups![2].url)}
                          className="relative group w-full aspect-video md:aspect-[21/9] overflow-hidden bg-[#0D0D0D] border border-white/5 cursor-zoom-in rounded-[24px]"
                        >
                          <div className="absolute top-6 left-6 z-10">
                            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-[#0E0E0E]/90 backdrop-blur-xl border border-white/10 shadow-2xl">
                              <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                              <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em]">
                                Evidence / Full Context
                              </span>
                            </div>
                          </div>
                          <ImageWithFallback 
                            src={project.mockups![2].url} 
                            alt="Evidence context" 
                            className="w-full h-auto object-contain group-hover:scale-[1.01] transition-transform duration-[2000ms]" 
                          />
                        </button>
                      )}
                      
                      <div className="text-center pt-2">
                        <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] opacity-60">
                          Click any screen to inspect detail
                        </span>
                      </div>
                    </div>

                    {/* Content Stack Below Visuals */}
                    <div className="px-6 md:px-20 space-y-20">
                      {/* 2. Highlighted Design Decision */}
                      <div className="max-w-3xl py-12 border-y border-white/5">
                        <span className="text-[#4AF2E5] text-[10px] font-black uppercase tracking-[0.4em] block mb-6">Core Design Decision</span>
                        <h4 className="text-white text-3xl font-black leading-tight tracking-tight">
                          Contextualize analytics around user intent rather than raw session metrics.
                        </h4>
                      </div>

                      {/* 3. Comparison Grid (Full Width) */}
                      <div className="w-full">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-white/5">
                              <th className="py-8 text-white/20 text-[10px] font-black uppercase tracking-widest w-1/4">Aspect</th>
                              <th className="py-8 text-white/20 text-[10px] font-black uppercase tracking-widest">Before</th>
                              <th className="py-8 text-[#4AF2E5]/40 text-[10px] font-black uppercase tracking-widest">After</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {[
                              { aspect: "Data Structure", before: "Raw session metrics", after: "Intent-based grouping" },
                              { aspect: "User Effort", before: "Manual interpretation", after: "Immediate clarity" },
                              { aspect: "Default View", before: "Historical charts", after: "Action-first metrics" },
                              { aspect: "Decision Speed", before: "Slower / Passive", after: "Faster / Proactive" }
                            ].map((row, i) => (
                              <tr key={i} className="group hover:bg-white/[0.01] transition-colors">
                                <td className="py-8 text-white/40 text-xs font-black uppercase tracking-widest">{row.aspect}</td>
                                <td className="py-8 text-white/40 text-base font-medium">{row.before}</td>
                                <td className="py-8 text-white text-base font-bold">{row.after}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* 4. Outcome Summary */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 pt-12">
                        <div className="flex flex-col gap-2">
                          <span className="text-[#4AF2E5] text-5xl font-black tracking-tighter leading-none">+18% Engagement</span>
                          <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
                            Quantifiable shift in decision efficiency
                          </span>
                        </div>
                        <div className="max-w-md">
                          <p className="text-white/40 text-sm leading-relaxed italic">
                            Teams could immediately understand what to act on and why, reducing reliance on manual data exports and external analysis while increasing velocity.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Narrative Reflection */}
                {project.outcomeSummary && (
                  <div className="p-12 md:p-16 rounded-[48px] bg-white/[0.02] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 left-12 w-24 h-[1px] bg-[#4AF2E5] opacity-40 group-hover:w-48 transition-all duration-700" />
                    <div className="flex flex-col md:flex-row gap-12 items-start">
                      <div className="shrink-0">
                        <span className="text-[#4AF2E5] text-[10px] font-black uppercase tracking-[0.4em]">Impact Reflection</span>
                      </div>
                      <div className="space-y-8">
                        <p className="text-white/70 text-2xl md:text-3xl font-medium leading-tight tracking-tight">
                          This intervention taught us that in B2B, checkout is a transition moment, not a terminal state. Designing for "what's next" increased repeat engagement by clarifying post-purchase intent.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Impact & Results */}
            <section className="relative">
              <div className="absolute -inset-10 bg-[#4AF2E5]/5 blur-[120px] rounded-full pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-block px-4 py-1.5 rounded-full bg-[#4AF2E5]/10 border border-[#4AF2E5]/20 text-[#4AF2E5] text-[10px] font-black uppercase tracking-widest mb-12">
                  Results
                </div>
                <div className="grid grid-cols-2 gap-8">
                  {project.impact.map((item, i) => (
                    <div key={i} className="flex flex-col gap-2 p-8 rounded-[32px] bg-[#121212] border border-[#4AF2E5]/10">
                      <span className="text-[#4AF2E5] text-4xl md:text-5xl font-black tracking-tighter">{item.split(': ')[0]}</span>
                      <span className="text-white/40 text-xs font-bold uppercase tracking-widest">{item.split(': ')[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* What This Proves */}
            {project.whatThisProves && (
              <section className="p-12 rounded-[48px] bg-white text-black">
                <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-10 opacity-40">What This Proves</h2>
                <p className="text-2xl md:text-3xl font-bold leading-tight tracking-tight">
                  {project.whatThisProves}
                </p>
              </section>
            )}
          </div>

          <aside className="md:col-span-4">
            <div className="sticky top-32 space-y-12">
              <div className="p-8 rounded-[32px] border border-white/10 bg-white/[0.02]">
                <h3 className="text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8 opacity-40">Collaboration</h3>
                <div className="space-y-6">
                  {project.collaboration?.teams.map((team, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#4AF2E5]" />
                      <span className="text-white font-bold text-sm">{team}</span>
                    </div>
                  ))}
                  <p className="text-white/30 text-xs leading-relaxed pt-4 border-t border-white/5">
                    {project.collaboration?.outcome}
                  </p>
                </div>
              </div>

              <div className="p-8 rounded-[32px] border border-[#4AF2E5]/20 bg-[#4AF2E5]/5">
                <h3 className="text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-[#4AF2E5]">Success Criteria</h3>
                <ul className="space-y-4">
                  {project.goals.map((goal, i) => (
                    <li key={i} className="flex gap-3 text-white/70 text-xs font-medium leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[#4AF2E5] shrink-0 mt-0.5" />
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>

        {/* 9. Next / Navigation */}
        <footer className="max-w-5xl mx-auto px-6 py-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <button 
            onClick={onBack}
            className="text-white/40 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors"
          >
            ← Back to Projects
          </button>
          
          {onNext && (
            <button 
              onClick={onNext}
              className="group flex items-center gap-4 bg-white text-black px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform"
            >
              Next Case Study
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </footer>
      </div>

      {/* Full-screen Image Modal */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 md:p-12"
          >
            <button 
              onClick={() => setZoomedImage(null)}
              className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="relative w-full max-w-7xl aspect-video overflow-hidden rounded-2xl border border-white/10">
              <ImageWithFallback 
                src={zoomedImage} 
                alt="Zoomed view" 
                className="w-full h-full object-contain"
              />
              
              {/* Modal Toggle: Before / After */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 p-1 rounded-full bg-black/80 backdrop-blur-3xl border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center min-w-[240px]">
                <button 
                  onClick={() => setZoomedImage(project.mockups![1]?.url || project.mockups![0].url)}
                  className={`relative flex-1 px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-2 group/btn ${
                    zoomedImage === (project.mockups![1]?.url || project.mockups![0].url) 
                    ? "text-white" 
                    : "text-white/20 hover:text-white/40"
                  }`}
                >
                  {zoomedImage === (project.mockups![1]?.url || project.mockups![0].url) && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white/5 rounded-full border border-white/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className={`w-1 h-1 rounded-full transition-all duration-500 ${
                    zoomedImage === (project.mockups![1]?.url || project.mockups![0].url) 
                    ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] scale-110" 
                    : "bg-white/10"
                  }`} />
                  <span className="relative z-10">Before</span>
                </button>
                
                <button 
                  onClick={() => setZoomedImage(project.mockups![0].url)}
                  className={`relative flex-1 px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-2 group/btn ${
                    zoomedImage === project.mockups![0].url 
                    ? "text-[#4AF2E5]" 
                    : "text-white/20 hover:text-white/40"
                  }`}
                >
                  {zoomedImage === project.mockups![0].url && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[#4AF2E5]/5 rounded-full border border-[#4AF2E5]/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className={`w-1 h-1 rounded-full transition-all duration-500 ${
                    zoomedImage === project.mockups![0].url 
                    ? "bg-[#4AF2E5] shadow-[0_0_10px_rgba(74,242,229,0.6)] scale-110" 
                    : "bg-white/10"
                  }`} />
                  <span className="relative z-10">After</span>
                </button>
              </div>
            </div>
            
            <div className="mt-8 text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">
              High-Fidelity Transformation View
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}