Context
The current portfolio feels like a standard landing page with traditional section labeling, oversized hero, cluttered highlights, and disconnected sections. The goal is to transform it into a cinematic, story-driven experience with premium motion, seamless transitions, and a strong visual identity per section — while keeping the dark theme and data-driven architecture.
Content Authority
All content (text, headlines, descriptions, copy) and images remain under the user's full control. This plan only restructures HOW content is rendered/styled — not WHAT the content says. Existing text from site-content.js is preserved as-is. Image paths point to local /images/ placeholders that the user replaces with their own assets. The data model changes are structural (field names, organization) — not content rewrites.
Files to Modify

data/site-content.js — restructure data model
index.html — restructure HTML sections
style.css — complete visual overhaul
main.js — rewrite renderers + animations
case-study.html — fix nav links, minor footer update
/images/ — create SVG placeholders

Phase 1: Data Model (data/site-content.js)
Nav: Change CTA to "Let's Talk" → mailto:hello@ahmadeldeeb.com
Hero: Restructure fields (keep your existing text, just reorganize):

Split current headline into rotatingWords[] (first word variations you control) + headlineTemplate (rest of sentence)
Remove roles[] (rotating words move into the headline itself)
Remove gallery[], add compositionImages[] (4 local image paths you replace)

Work: Remove sectionLabel, add ghostText: 'WORK'
About: Restructure fields (keep your existing text, remove highlight system):

ghostText: 'ABOUT'
headline — uses your existing name/title info, you control the exact text
intro + philosophy — your existing paragraph text, just without the colored highlights
Keep stamp, industries, details unchanged

Services: Replace 3-card items[] with 4 numbered steps[]:

Each step has: number, title, description, tags[]
Content is derived from your existing services descriptions, restructured as process steps
You have full control to edit all step titles, descriptions, and tags in the data file

Testimonials: Add ghostText: 'VOICES'
Remove: torch and contact objects entirely
Footer: Expand with headline, subheadline, links[], availability, navLinks[]
Phase 2: HTML Structure (index.html)

Remove: torch section, contact section, hero gallery, hero stripe
Hero: Center content, add #heroComposition div for images, add hero__fade gradient div for seamless transition to next section
Work: Change work__cards → work__grid, add ghost text div
About/Services/Testimonials: Add ghost text divs
Services: Change services__grid → services__steps
Footer: Expand with footer__main + footer__bottom structure, add ghost text

Phase 3: CSS Overhaul (style.css)
Remove

.section__label + ::before (all section labels globally)
Hero gallery, stripe, eyebrow, roles styles
Torch section styles (~65 lines)
Contact section styles (~100 lines)
.about__highlight + all color variants
--highlight-amber, --highlight-pink vars
.work-card--reverse styles
Device frame styles (laptop/phone/tablet wrappers)

Add: Ghost Text System
css[class*="__ghost"] — absolute, centered, clamp(6rem, 15vw, 14rem),
  -webkit-text-stroke: 1px rgba(255,255,255,0.03), pointer-events: none
Add: Seamless Section Transitions

Each .section gets position: relative; overflow: hidden
Top gradient overlay fading from section background → transparent
Hero gets bottom fade gradient (hero__fade)

Redesign: Navigation (defolio reference)

Floating centered pill: top: 16px; left: 50%; transform: translateX(-50%)
grid-template-columns: auto 1fr auto (logo | centered links | CTA)
border-radius: var(--radius-full)
Glass on scroll: backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.06)
On mobile (768px): revert to full-width top bar

Redesign: Hero

Center all content: text-align: center; align-items: center
Reduce title: --text-hero: clamp(2.5rem, 5.5vw, 4.5rem)
Rotating word wrapper: inline-block, overflow hidden, 1.1em height
Composition images: 4-column grid below headline, max-width 700px
Bottom fade gradient for seamless transition

Redesign: Clients

container--clients { max-width: 800px } — narrower, centered

Redesign: Work (svarog reference)

2x2 grid: grid-template-columns: repeat(2, 1fr)
Vertical cards: image top, content bottom (no alternating reverse)
Hover: translateY(-8px) + deep shadow
Remove device frame wrappers, images fill visual area directly

Redesign: About

Remove all highlight color classes
Clean 2-column: stamp+details left, headline+text right
Strong headline styling

Redesign: Services (frontend-agency reference)

Numbered vertical stepper: grid-template-columns: 80px 1fr
Step numbers in --text-4xl, muted → accent on hover
Tags as pill chips below each description
Border-top on first, border-bottom on each step

Redesign: Footer (svarog reference)

Full-section closing scene with centered headline
Contact links as horizontal flex, availability badge
Bottom bar: nav links + copyright + note
Ghost text "LET'S TALK"

Responsive Updates

All 3 breakpoints (1024, 768, 480) updated for new layouts
Ghost text scales down on mobile
Nav pill → full-width bar on mobile
Work grid → single column on mobile
Services steps → single column on mobile

Phase 4: JS Render Functions + Animations (main.js)
Rewrite Renderers

renderHero() — rotating word inside h1, composition images, no gallery
renderWork() — 2x2 grid, ghost text, no reverse layout, no device frames
renderAbout() — strong headline, plain text, stamp, no colored highlights
renderServices() — numbered steps with tags
renderTestimonials() — add ghost text rendering
renderFooter() — premium footer with headline, links, availability, bottom bar
Delete: renderTorch(), renderContact()
Update renderAll() to remove torch/contact calls

Rewrite Animations
Hero rotating word (replaces old role rotation):

Every 3s: current word slides up + fades out (power3.in, 0.5s)
Next word slides up from below + fades in (power3.out, 0.5s, 0.15s delay)

Ghost text parallax: Each ghost element gets y: -30 → 30 scrub parallax
Work cards: Fade up with column-staggered delay, keep 3D tilt on hover
About text: Word-by-word color sweep on scroll (muted → secondary, scrub)
Services steps: Number slides from left, content fades up, staggered per step
Footer headline: Split-text word reveal on scroll
Preloader cascade: Update selectors (remove eyebrow, update for new hero structure)
Delete: initTorchEffect(), hero gallery parallax, hero stripe parallax, old device parallax, old services card stagger
Phase 5: Image Placeholders
Create SVG placeholders in:

/images/work/ — 4 files (nuvora-thumb.svg, finova-thumb.svg, meridian-thumb.svg, nexus-thumb.svg) at 800x500
/images/clients/ — 8 files matching client names at 160x60
/images/about/ — portrait.svg at 400x500
/images/case-studies/{nuvora,finova,meridian,nexus}/ — hero.svg at 1200x600 each
/images/case-studies/nuvora/ — before.svg, after.svg at 800x500

Update data files to reference /images/... paths instead of Unsplash URLs.
Phase 6: Case Study Page (case-study.html)

Update nav Contact link to mailto: or /#footer
Keep footer simple but remove old border-top style
Verify no regressions from global CSS changes (section__label removal affects case study sections that use that class — case-study.css has its own .section__label usage via the label field in case study data)

Verification

Run npm run dev and check all sections render correctly
Preview screenshot to verify overall cinematic feel
Test scroll animations (ghost text parallax, card reveals, text sweeps)
Test hero rotating word animation
Test nav glass effect on scroll
Test responsive at 1024px, 768px, 480px
Test case study page still works (?project=nuvora)
Verify no horizontal overflow from ghost text
Check prefers-reduced-motion still works
