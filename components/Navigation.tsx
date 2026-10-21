import { useCallback, useEffect, useState } from 'react';
import { useScroll } from 'motion/react';
import { FloatingNav } from './FloatingNav';
import { SECTION_IDS, scrollToSection, scrollToTop } from '../lib/scrollToSection';

/* ── Landing-page navigation ─────────────────────────
   The floating pill (FloatingNav) wired to the window: progress
   through the page, the section links, and the page scroll lock
   while the menu is open. */

interface NavigationProps {
  onOpenAboutPage?: () => void;
}

export function Navigation({ onOpenAboutPage }: NavigationProps) {
  const { scrollYProgress } = useScroll();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sections: { label: string; targetId?: string; onClick?: () => void }[] = [
    { label: 'Work', targetId: SECTION_IDS.work },
    { label: 'My Story', onClick: onOpenAboutPage },
    // Hidden with the Mentorship section in App.tsx — restore together.
    // { label: 'Mentorship', targetId: SECTION_IDS.mentorship },
    { label: 'Speaking', targetId: SECTION_IDS.speaking },
    { label: 'Articles', targetId: SECTION_IDS.articles },
  ];

  // Highlight the section in view inside the menu
  useEffect(() => {
    const nodes = sections
      .map((i) => i.targetId && document.getElementById(i.targetId))
      .filter((n): n is HTMLElement => Boolean(n));
    if (!nodes.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActiveId(hit.target.id);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lock the page behind the open menu without moving it
  const lockScroll = useCallback(() => {
    const html = document.documentElement;
    const gap = window.innerWidth - html.clientWidth;
    const prev = { overflow: html.style.overflow, pad: html.style.paddingRight };
    html.style.overflow = 'hidden';
    if (gap > 0) html.style.paddingRight = `${gap}px`;
    return () => {
      html.style.overflow = prev.overflow;
      html.style.paddingRight = prev.pad;
    };
  }, []);

  return (
    <FloatingNav
      progress={scrollYProgress}
      logoLabel="Eldeeb, back to top"
      onLogo={scrollToTop}
      lockScroll={lockScroll}
      items={sections.map((s) => ({
        label: s.label,
        href: s.targetId ? `#${s.targetId}` : '/about',
        active: Boolean(s.targetId && activeId === s.targetId),
        onSelect: () => (s.onClick ? s.onClick() : s.targetId && scrollToSection(s.targetId)),
      }))}
    />
  );
}
