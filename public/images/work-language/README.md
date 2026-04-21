# Work Language — "How I Work" carousel cards

**Component:** `components/WorkLanguage.tsx`
**URL prefix:** `/images/work-language/`

Four cards in a horizontal scroll strip. Each has its own image.

## Image slots

| # | Config key             | Card title                         | Suggested filename           |
|---|------------------------|------------------------------------|------------------------------|
| 1 | `journeyMapping`       | Customer Journey Mapping           | `01-journey-mapping.jpg`     |
| 2 | `positioningPlacement` | Purpose, Positioning, Placement    | `02-positioning-placement.jpg`|
| 3 | `functionalFramework`  | Functional Framework               | `03-functional-framework.jpg`|
| 4 | `systemicScaling`      | Systemic Scaling                   | `04-systemic-scaling.jpg`    |

## Specs

- **Aspect ratio:** 16:10 (the card box is `aspect-[16/10]`).
- **Width:** ≥ 1200 px.
- **Format:** JPG/WebP, < 250 KB each.
- Keep tones cohesive — desaturated, warm neutrals pair best with the
  site's dark background.

## How to swap

Replace the URL values in the `WORK_LANGUAGE_IMAGES` block at the top of
`components/WorkLanguage.tsx`, e.g.:

```ts
journeyMapping: '/images/work-language/01-journey-mapping.jpg',
```
