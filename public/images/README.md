# Section Image Folders

Each subfolder maps 1:1 to a website section. Drop your image files in the
matching folder and they will resolve at `/images/<section>/<filename>`
(the Vite `public/` folder is served from the root URL).

## How to customize

1. Open the target folder (e.g. `public/images/case-studies/`).
2. Read its `README.md` — it lists every image slot, what it represents,
   the recommended dimensions, and the filename the code expects.
3. Drop your file in with that exact name (or update the path in the
   matching component file — each component has an `IMAGES` block at the top).

## Folders

| Folder                 | Section component                  | Used for                          |
| ---------------------- | ---------------------------------- | --------------------------------- |
| `case-studies/`        | `components/Projects.tsx`          | Sticky stack case-study cards     |
| `case-study-detail/`   | `components/CaseStudyDetail.tsx`   | Full case-study deep-dive page    |
| `work-language/`       | `components/WorkLanguage.tsx`      | "How I work" visual storytelling  |
| `features/`            | `components/Features.tsx`          | Feature grid visuals              |
| `proof-of-presence/`   | `components/ProofOfPresence.tsx`   | Presence mosaic                   |
| `articles/`            | `components/Articles.tsx`          | Article thumbnails                |
| `testimonials/`        | `components/Testimonials.tsx`      | Author avatars                    |
| `brands/`              | `components/BrandsStats.tsx`       | Brand logos (defaults to Clearbit)|

## File format tips

- **JPG** for photographic content — keep under ~250 KB, width ≥ 1200 px.
- **PNG** for logos / transparency — keep under ~80 KB.
- **WebP / AVIF** is ideal for modern browsers if you can generate them.
- **SVG** for scalable logos and line art.

## Why `public/` and not `src/`

Files in `public/` are copied to the build output as-is and referenced by
absolute URL, which is perfect for hero images and per-section art that
doesn't need Vite's import pipeline. Use `src/assets/` only when you want
hashed filenames + tree-shaking (e.g. icon sets).
