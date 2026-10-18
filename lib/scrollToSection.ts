/* Smooth-scrolls to a landing-page section, leaving room for the
   floating nav pill so the section heading is not tucked under it.
   Shared by the nav, the hero CTA and the footer so every in-page
   link lands in the same place. */
export const SECTION_IDS = {
  work: 'selected-work-section-lock',
  mentorship: 'mentorship',
  speaking: 'proof-of-presence-section-lock',
  articles: 'articles-activities',
} as const;

const NAV_OFFSET = 96;

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  window.scrollTo({ top: y, behavior: 'smooth' });
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
