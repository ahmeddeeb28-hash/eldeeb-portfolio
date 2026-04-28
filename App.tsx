import { Navigation } from './components/Navigation';
import { PremiumHero } from './components/PremiumHero';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { About } from './components/About';
import { WorkLanguage } from './components/WorkLanguage';
import { Projects } from './components/Projects';
import { Mentorship } from './components/Mentorship';
import { BrandsStats } from './components/BrandsStats';
import { Results } from './components/Results';
import { Testimonials } from './components/Testimonials';
import { ProofOfPresence } from './components/ProofOfPresence';
import { Articles } from './components/Articles';
import { Footer } from './components/Footer';
import { CaseStudyDetail } from './components/CaseStudyDetail';
import { CASE_STUDIES } from './data/projects';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useRef, useState, useEffect } from 'react';

export default function App() {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax transforms for global background elements
  const bgY1 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const bgY2 = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const bgRotate = useTransform(scrollYProgress, [0, 1], [0, 15]);

  // Handle hardware back button / browser back
  useEffect(() => {
    const handlePopState = () => {
      if (activeProjectId) setActiveProjectId(null);
    };
    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeProjectId]);

  const openProject = (id: string) => {
    setActiveProjectId(id);
    window.history.pushState({ project: id }, '');
  };

  const closeProject = () => {
    setActiveProjectId(null);
    window.history.back();
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#0A0A0A] selection:bg-[#4AF2E5] selection:text-[#0A0A0A]" style={{ position: 'relative', overflowX: 'clip' }}>
      <AnimatePresence>
        {activeProjectId && CASE_STUDIES[activeProjectId] && (
          <CaseStudyDetail 
            project={CASE_STUDIES[activeProjectId]} 
            onBack={closeProject}
            onNext={() => {
              const keys = Object.keys(CASE_STUDIES);
              const currentIndex = keys.indexOf(activeProjectId);
              const nextKey = keys[(currentIndex + 1) % keys.length];
              openProject(nextKey);
            }}
          />
        )}
      </AnimatePresence>

      {/* Dynamic Background Parallax Layers */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          style={{ y: bgY1, rotate: bgRotate }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#4AF2E5]/[0.02] rounded-full blur-[160px]" 
        />
        <motion.div 
          style={{ y: bgY2 }}
          className="absolute top-[40%] -right-[15%] w-[50%] h-[50%] bg-[#4AF2E5]/[0.01] rounded-full blur-[140px]" 
        />
      </div>

      <main className={`relative z-10 transition-opacity duration-500 ${activeProjectId ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Navigation />
        <PremiumHero />
        <BrandsStats />
        <Projects onProjectClick={openProject} />
        <About />
        <WorkLanguage />
        <Mentorship />
        <ProofOfPresence />
        <Features />
        <Results />
        <Articles />
        <Footer />
      </main>
    </div>
  );
}