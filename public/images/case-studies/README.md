# Case Studies — Sticky stack cards

**Component:** `components/Projects.tsx`
**URL prefix:** `/images/case-studies/`

These images appear as the hero visual of each case-study card in the
progressively-stacking scroll section. Each card's accent color, glow, and
noise overlay are tuned per project in `Projects.tsx`, so choose images
whose mood complements the assigned accent.

## Image slots

| # | Filename                        | Card title                             | Accent     | Notes                                       |
|---|---------------------------------|----------------------------------------|------------|---------------------------------------------|
| 1 | `01-repeat-purchase.jpg`        | Repeat Purchase Engine for B2B Retail  | Amber      | Commerce, retail, merchant mood             |
| 2 | `02-health-ladder.jpg`          | Behavior-Driven Retention Strategy     | Rust red   | Data / analysis / "aha-moment" mood         |
| 3 | `03-shorefield-saas.jpg`        | Lifecycle-Based Upsell System for SaaS | Lavender   | Calm, editorial, reading / learning         |
| 4 | `04-global-payments.jpg`        | Frictionless Global Payments Flow      | Warm gold  | Global / transaction / speed                |

## Recommended specs

- **Aspect ratio:** 3:4 (portrait) to 4:3 (landscape) — the card auto-fits.
- **Minimum width:** 1200 px (cards render up to ~960 px wide on large displays).
- **Format:** JPG or WebP. Keep each file < 250 KB if possible.
- **Subject placement:** keep the focal point near center-left — the right
  side is sometimes overlapped by the giant project-number watermark.

## How to swap

1. Place your files in this folder with the filenames above.
2. That's it — `components/Projects.tsx` already points here.

To change the filename or point to a different path, edit the `CASE_STUDY_IMAGES`
block at the top of `components/Projects.tsx`.
