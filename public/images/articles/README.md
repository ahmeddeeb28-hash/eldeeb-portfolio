# Articles — Perspectives thumbnails

**Component:** `components/Articles.tsx`
**URL prefix:** `/images/articles/`

Thumbnail image for each article card.

## Image slots

| # | Config key          | Article title                                            | Suggested filename         |
|---|---------------------|----------------------------------------------------------|----------------------------|
| 1 | `designCritique`    | Design Critique Fundamentals                             | `01-design-critique.jpg`   |
| 2 | `targetedQuestions` | Mastering the Art of Asking Targeted Questions           | `02-targeted-questions.jpg`|
| 3 | `designLeadership`  | Redefining Design Leadership                             | `03-design-leadership.jpg` |

## Specs

- **Aspect ratio:** 4:5 (portrait) — the card box is `aspect-[4/5]`.
- **Width:** ≥ 1200 px.
- **Format:** JPG/WebP, < 200 KB each.

Note: images render grayscale at 60% opacity by default and become full-color on
hover — editorial, moody photography works best.

## How to swap

Update the `ARTICLE_IMAGES` block at the top of `components/Articles.tsx`.
