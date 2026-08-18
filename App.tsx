import { Navigation } from './components/Navigation';
import { PremiumHero } from './components/PremiumHero';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { AboutPage } from './components/AboutPage';
import { WorkLanguage } from './components/WorkLanguage';
import { Projects } from './components/Projects';
import { Mentorship } from './components/Mentorship';
import { BrandsStats } from './components/BrandsStats';
import { Results } from './components/Results';
import { Testimonials } from './components/Testimonials';
import { ProofOfPresence } from './components/ProofOfPresence';
import { Articles } from './components/Articles';
import { Footer } from './components/Footer';
import { CASE_STUDY_REGISTRY } from './components/case-studies/registry';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useRef, useState, useEffect } from 'react';

export default function App() {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [aboutPageOpen, setAboutPageOpen] = useState(false);
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
      if (aboutPageOpen) setAboutPageOpen(false);
    };
    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeProjectId, aboutPageOpen]);

  const openProject = (id: string) => {
    setActiveProjectId(id);
    window.history.pushState({ project: id }, '');
  };

  const closeProject = () => {
    setActiveProjectId(null);
    window.history.back();
  };

  const openAboutPage = () => {
    setAboutPageOpen(true);
    window.history.pushState({ about: true }, '');
  };

  const closeAboutPage = () => {
    setAboutPageOpen(false);
    window.history.back();
  };

  const ActiveCase = activeProjectId ? CASE_STUDY_REGISTRY[activeProjectId] : null;
  const goToNextCase = () => {
    if (!activeProjectId) return;
    const keys = Object.keys(CASE_STUDY_REGISTRY);
    const currentIndex = keys.indexOf(activeProjectId);
    const nextKey = keys[(currentIndex + 1) % keys.length];
    setActiveProjectId(nextKey);
    window.history.pushState({ project: nextKey }, '');
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#0A0A0A] selection:bg-[#4AF2E5] selection:text-[#0A0A0A]" style={{ position: 'relative', overflowX: 'clip' }}>
      <AnimatePresence>
        {ActiveCase && (
          <ActiveCase
            key={activeProjectId}
            onBack={closeProject}
            onNext={goToNextCase}
          />
        )}
        {aboutPageOpen && <AboutPage key="about-page" onBack={closeAboutPage} />}
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

      <main className={`relative z-10 transition-opacity duration-500 ${activeProjectId || aboutPageOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Navigation onOpenAboutPage={openAboutPage} />
        <PremiumHero />
        <BrandsStats />
        <Projects onProjectClick={openProject} />
        {/* Hidden but preserved — restore by uncommenting the line below */}
        {false && <WorkLanguage />}
        <Mentorship />
        <ProofOfPresence />
        {/* Hidden but preserved — restore by flipping the guard below */}
        {false && <Features />}
        <Results />
        <Articles />
        <Footer />
      </main>
    </div>
  );
}
