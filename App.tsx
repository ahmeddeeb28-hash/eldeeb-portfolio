import { Navigation } from './components/Navigation';
import { PremiumHero } from './components/PremiumHero';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { WorkLanguage } from './components/WorkLanguage';
import { Projects } from './components/Projects';
import { Mentorship } from './components/Mentorship';
import { LeadershipStrategy } from './components/LeadershipStrategy';
import { BrandsStats } from './components/BrandsStats';
import { HowILead } from './components/HowILead';
import { Results } from './components/Results';
import { Testimonials } from './components/Testimonials';
import { ProofOfPresence } from './components/ProofOfPresence';
import { Articles } from './components/Articles';
import { Footer } from './components/Footer';
import { CASE_STUDY_REGISTRY, HIDDEN_PROJECTS } from './components/case-studies/registry';
import { AnimatePresence } from 'motion/react';
import { useRef, useState, useEffect, lazy, Suspense } from 'react';

/* The Director's Cut is the heaviest view on the site and only opens
   on demand, so it ships as its own chunk. */
const AboutPage = lazy(() => import('./components/AboutPage').then((m) => ({ default: m.AboutPage })));

/* ── Routing ──────────────────────────────────────────
   The overlays used to be pure state, and every pushState call
   omitted its third argument, so the address bar never moved.
   Copying the URL from an open case study handed someone the
   home page. Each view now owns a real path:

     /                      home
     /about                 the Director's Cut
     /work/<case-study-id>  a single case study

   vercel.json already rewrites every path to index.html, so
   these survive a cold load, a refresh, and a shared link. */
type Route =
  | { view: 'home' }
  | { view: 'about' }
  | { view: 'case'; id: string };

function parseRoute(pathname: string): Route {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/about') return { view: 'about' };
  const match = path.match(/^\/work\/([A-Za-z0-9._-]+)$/);
  /* An unknown slug resolves to home rather than rendering an
     empty overlay; the mount effect then corrects the URL. */
  if (match && CASE_STUDY_REGISTRY[match[1]]) return { view: 'case', id: match[1] };
  return { view: 'home' };
}

function routeToPath(route: Route): string {
  if (route.view === 'about') return '/about';
  if (route.view === 'case') return `/work/${route.id}`;
  return '/';
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.pathname));
  const containerRef = useRef<HTMLDivElement>(null);
  /* Counts only the entries this app pushed, so closing an overlay
     can tell whether going back stays inside the site. Someone who
     opened a shared /work/... link in a fresh tab has nothing to go
     back to, and history.back() would send them off-site. */
  const pushedEntries = useRef(0);

  const activeProjectId = route.view === 'case' ? route.id : null;
  const aboutPageOpen = route.view === 'about';
  const overlayOpen = Boolean(activeProjectId) || aboutPageOpen;


  /* Normalise the address bar once on load, so a trailing slash or
     an unknown slug cannot leave the URL describing a page that is
     not on screen. */
  useEffect(() => {
    const canonical = routeToPath(route);
    if (window.location.pathname !== canonical) {
      window.history.replaceState({ view: route.view }, '', canonical);
    }
  }, []);

  /* Browser and hardware back/forward now derive the view from the
     URL instead of blindly closing whatever is open, so forward
     works as well as back. */
  useEffect(() => {
    const handlePopState = () => {
      pushedEntries.current = Math.max(0, pushedEntries.current - 1);
      setRoute(parseRoute(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (next: Route) => {
    window.history.pushState({ view: next.view }, '', routeToPath(next));
    pushedEntries.current += 1;
    setRoute(next);
  };

  const goHome = () => {
    if (pushedEntries.current > 0) {
      window.history.back();
      return;
    }
    window.history.replaceState({ view: 'home' }, '', '/');
    setRoute({ view: 'home' });
  };

  const openProject = (id: string) => navigate({ view: 'case', id });
  const closeProject = goHome;
  const openAboutPage = () => navigate({ view: 'about' });
  const closeAboutPage = goHome;

  const ActiveCase = activeProjectId ? CASE_STUDY_REGISTRY[activeProjectId] : null;
  const goToNextCase = () => {
    if (!activeProjectId) return;
    const keys = Object.keys(CASE_STUDY_REGISTRY).filter((k) => !HIDDEN_PROJECTS.has(k));
    const nextKey = keys[(keys.indexOf(activeProjectId) + 1) % keys.length];
    navigate({ view: 'case', id: nextKey });
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#0A0A0A] selection:bg-[#4AF2E5] selection:text-[#0A0A0A]" style={{ position: 'relative', overflowX: 'clip' }}>
      {/* A case study sits outside AnimatePresence on purpose. It owns
          dozens of motion children, so the exit orchestration never
          finished: the outgoing overlay stayed mounted at opacity 0 while
          the incoming one queued behind it, and pressing Next left a black
          screen. Mounting on the project id gives each case a clean fade-in
          and lets the old one leave immediately. */}
      <Suspense fallback={null}>
        {ActiveCase && (
          <ActiveCase
            key={activeProjectId}
            onBack={closeProject}
            onNext={goToNextCase}
          />
        )}

        <AnimatePresence>
          {aboutPageOpen && <AboutPage key="about-page" onBack={closeAboutPage} />}
        </AnimatePresence>
      </Suspense>

      {/* Dynamic Background Parallax Layers */}
      {/* Two faint teal glows. Plain gradients, no blur filter and no
          scroll-linked motion: a blurred full-screen fixed layer that
          moves on scroll is repainted every frame, which made phones
          stutter and iOS Safari reload the page. */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 45% 40% at 20% 10%, rgba(74,242,229,0.035) 0%, transparent 70%), radial-gradient(ellipse 40% 35% at 90% 65%, rgba(74,242,229,0.02) 0%, transparent 70%)',
        }}
      />

      {/* Under an open case study or the About page the homepage fades out
          and then goes invisible, so the browser stops painting it, and
          the Projects card animations pause. */}
      <main
        className={`relative z-10 transition-[opacity,visibility] duration-500 ${
          overlayOpen ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible'
        }`}
      >
        <Navigation onOpenAboutPage={openAboutPage} />
        <PremiumHero />
        <BrandsStats />
        <HowILead />
        <Projects onProjectClick={openProject} paused={overlayOpen} />
        {/* Hidden but preserved — restore by uncommenting the line below */}
        {false && <WorkLanguage />}
        <LeadershipStrategy />
        {/* Hidden but preserved — restore by flipping the guard below, and
            uncomment the Mentorship links in Navigation.tsx and Footer.tsx */}
        {false && <Mentorship />}
        <ProofOfPresence />
        {/* Hidden but preserved — restore by flipping the guard below */}
        {false && <Features />}
        <Results />
        <Articles />
        <Footer onOpenAboutPage={openAboutPage} />
      </main>
    </div>
  );
}
