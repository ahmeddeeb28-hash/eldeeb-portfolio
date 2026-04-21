# Testimonials — Author avatars

**Component:** `components/Testimonials.tsx`
**URL prefix:** `/images/testimonials/`

Portrait avatar for each testimonial author.

## Image slots

| # | Config key        | Author            | Role                 | Suggested filename         |
|---|-------------------|-------------------|----------------------|----------------------------|
| 1 | `jamesonThorne`   | Jameson Thorne    | Head of Product      | `01-jameson-thorne.jpg`    |
| 2 | `elenaRodriguez`  | Elena Rodriguez   | Engineering Manager  | `02-elena-rodriguez.jpg`   |
| 3 | `marcusChen`      | Marcus Chen       | —                    | `03-marcus-chen.jpg`       |

## Specs

- **Aspect ratio:** 1:1 (square).
- **Size:** 400 × 400 px (rendered at ~56 px, 2× HiDPI safe).
- **Format:** JPG/WebP, < 60 KB each.
- Prefer tight head-and-shoulders crops. Images render grayscale by default
  and shift to full color on card hover.

## How to swap

Update the `TESTIMONIAL_AVATARS` block at the top of
`components/Testimonials.tsx`.
