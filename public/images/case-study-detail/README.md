# Case Study Detail — Deep-dive page

**Component:** `components/CaseStudyDetail.tsx`
**URL prefix:** `/images/case-study-detail/`

This is the full-page overlay that appears when a user clicks a case-study
card. It can host multiple images (hero, process shots, mid-page visuals).

## Suggested slots

| Filename                    | Purpose                                      |
|-----------------------------|----------------------------------------------|
| `hero.jpg`                  | Top-of-page hero visual                      |
| `process-01.jpg`            | Process shot 1 (early research / sketch)     |
| `process-02.jpg`            | Process shot 2 (wireframe / exploration)     |
| `outcome-01.jpg`            | Outcome 1 (final screen)                     |
| `outcome-02.jpg`            | Outcome 2 (final screen alt)                 |

## Specs

- **Hero:** 16:9 or 4:3, ≥ 1600 px wide.
- **Process & outcome shots:** 3:2 or 4:3, ≥ 1200 px wide.
- **Format:** JPG/WebP. Keep each < 300 KB.
- Match the case-study's accent mood (see `components/Projects.tsx` for the
  accent color assigned to each card).

## How to swap

Update the image constants at the top of `components/CaseStudyDetail.tsx`
to `/images/case-study-detail/<filename>`.
