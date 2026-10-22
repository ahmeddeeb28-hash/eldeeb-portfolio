---
name: screens-gallery-motion
description: Build a case study's "Screens" gallery (staggered columns of app screens drifting up and down on their own clock) and its "Motion" playground (a coded screen people can tap through). Use when adding or changing a gallery of screens or an interactive prototype section in a case study.
---

# Screens gallery and Motion playground

Two pieces, used together in a case study (see `components/case-studies/SaryCaseStudy.tsx`, chapters 04 Screens and 06 Motion):

1. **Screens gallery**: `components/case-studies/_shared/MarqueeGallery.tsx`
2. **Motion playground**: `SaryAddAllPlay` in `components/case-studies/sary/SaryPhone.tsx`

---

## 1. Screens gallery

### What it looks like
A full-width band, 68 to 86vh tall, with columns of screens side by side. Even columns drift up and odd columns drift down, each at a slightly different speed, so the band feels alive without anyone scrolling. Screens enter and leave through the top and bottom edges, which fade out; the outer columns are cut by the sides.

### How to organise the screens
- Pass `columns: Screen[][]`, one array per column. A `Screen` is a function `(width, live) => ReactNode` that draws one screen at a fixed width.
- Use **3 screens per column** and **6 columns**. The gallery repeats columns when there are fewer than it needs.
- **Never put the same screen side by side** in neighbouring columns at the same height. Rotate the order per column (home, review, routine / hub, order, live / added, home, review ...).
- Mix **1 or 2 live (animated) screens** among the still ones, in different columns, never at the same height. More than that gets busy.
- Use real screens: coded components (`<SaryPhone state="hub" />`) or exported Figma frames. All screens in one gallery must share one aspect ratio, passed as `aspect` (for example `390 / 844`).
- Always give a `label` that describes the whole band. The band is one image to screen readers.

```tsx
const ph = (state: SaryState): Screen => (w) => <SaryPhone state={state} width={w} />;
const live: Screen = (w, on) => <SaryAddAllLoop width={w} playing={on} />;
const SCREENS: Screen[][] = [
  [ph('home'), ph('review'), ph('routine')],
  [ph('hub'), ph('order'), live],
  [ph('added'), ph('home'), ph('review')],
  [live, ph('routine'), ph('hub')],
  [ph('order'), ph('added'), ph('home')],
  [ph('review'), ph('hub'), ph('added')],
];
<MarqueeGallery columns={SCREENS} aspect={390 / 844} label="All the Buy Again screens, scrolling in columns" />
```

### How the motion works
- **The seamless loop:** each column renders its sequence **twice**. CSS keyframes move it by exactly **-50%** (one sequence, gaps included), so the end lines up with the start and there is never a jump or a hole.
  - `mg-up`: `translate3d(0,0,0)` → `translate3d(0,-50%,0)`
  - `mg-down`: the reverse
- **Speed:** duration = `sequenceHeight / speed`, multiplied by `1 + (i % 3) * 0.12`, so neighbouring columns never move in lockstep.
- **Stagger:** each column starts partway through its loop, with a negative `animationDelay` of `-(i * 0.37 % 1) * duration`. The columns are offset from the very first frame.
- **Sizes step down with the band width** (measured with a ResizeObserver):

  | Band width | Columns | Screen width | Gap | Speed |
  |---|---|---|---|---|
  | 1024px and up | 6 | 260px | 40px | 24px/s |
  | 640px and up | 4 | 210px | 32px | 20px/s |
  | Phones | 3 | 150px | 18px | 14px/s |

- **Edges:** a vertical mask fades the band out over the top and bottom 9%. The band clips its overflow, so the outer columns are cut by the sides.

### Performance and accessibility rules
- Animate **only `transform`**, with `will-change: transform`. Every screen is drawn at a fixed size, so nothing reflows.
- **Pause off screen:** `useInView` sets `animationPlayState: paused` when the band is out of view, and live screens get `live = false` so their own loops stop.
- **Reduced motion:** no animation. Columns sit still at their staggered offsets, so the layout is the same.
- The motion runs on its own clock, not on page scroll. That keeps it smooth inside the case study's own scroll container and Lenis.

---

## 2. Motion playground

### What it looks like
One coded phone screen inside a framed panel. The header reads "Interactive prototype" with a pulsing "Live · tap to try" pill, so it looks like something to try before anyone taps. A short hint under the phone says what to do next.

### How it is organised
- **One state object of knobs.** For Sary these are `pressed`, `flying`, `added`, `badge`, `cartBar`, `sheet`, `routineOn` and `toast`. The phone component draws itself from those knobs, so the same component serves the still screens, the looping version and the playable version.
- **A stage machine:** `idle → playing → sheet → done`. Each stage has one hint line:
  - idle: "Tap Add all to cart"
  - sheet: "Turn on the Sunday reminder, then View cart"
  - done: "Added. Start over to try it again"
- **One click handler on the wrapper.** Tappable parts carry `data-act="add" | "routine" | "close"`. The handler reads `closest('[data-act]')` and acts only if the current stage allows it, so stray taps do nothing.
- **Timed beats for the animated part**, through a `later(ms, fn)` helper that stores every timer and clears them all on reset or unmount:
  - pressed at 0ms
  - items fly to the cart at 220ms
  - added, with the cart badge and bar, at 1040ms
  - the routine sheet opens at 1740ms
- **The visual motion lives in CSS keyed off data attributes** (`data-stage`, `data-routine`). React only flips state, and CSS does the transitions.
- **Start over** calls `reset()`: clear the timers, empty the knobs, return to `idle`.

### Rules
- Use one real flow from the project, end to end. Don't invent screens.
- Make every step answer a tap within 100 to 200ms (the pressed state), then play the longer beat.
- Keep exactly one thing to do at each stage, and say it in the hint.
- Use the looping version (`SaryAddAllLoop`, the same beats on a timer) in the gallery and the card, and the playable one in the Motion chapter.
- Under reduced motion, keep the steps but drop the flying and sliding: show each end state directly.

---

## Checklist before shipping
- [ ] Every screen is real and shares one aspect ratio.
- [ ] No identical screens side by side.
- [ ] One or two live screens at most.
- [ ] The band pauses off screen and stands still under reduced motion.
- [ ] The playground has one action per stage, a hint per stage, and Start over.
- [ ] Every timer is cleared on reset and unmount.
- [ ] Checked at 1440px, 1024px, 768px and 390px: the loop shows no gaps and no horizontal scroll.
