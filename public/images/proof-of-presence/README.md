# Proof of Presence — Presence mosaic

**Component:** `components/ProofOfPresence.tsx`
**URL prefix:** `/images/proof-of-presence/`

Six images arranged in an editorial mosaic — workshops, stage talks,
mentorship, and hands-on design work.

## Image slots

| # | Config key    | Role in grid         | Suggested filename        |
|---|---------------|----------------------|---------------------------|
| 1 | `inTheRoom`   | HERO — 16:10 large   | `01-in-the-room.jpg`      |
| 2 | `craft`       | Small (stacked top)  | `02-craft.jpg`            |
| 3 | `onStage`     | Small (stacked bot.) | `03-on-stage.jpg`         |
| 4 | `teamRoom`    | Medium — 4:3         | `04-team-room.jpg`        |
| 5 | `mentorship`  | Tall — 3:4           | `05-mentorship.jpg`       |
| 6 | `reviewMode`  | Medium — 4:3         | `06-review-mode.jpg`      |

## Specs

- **Aspect ratios:** hero is 16:10; small cards fill flex column; row 2 uses
  4:3, 3:4, 4:3 for editorial rhythm.
- **Width:** ≥ 1200 px.
- **Format:** JPG/WebP, < 250 KB each.
- Choose candid, editorial shots for a documentary feel. Images render darker
  (brightness 0.8) until hovered.

## How to swap

Update the `PROOF_IMAGES` block at the top of `components/ProofOfPresence.tsx`:

```ts
inTheRoom: '/images/proof-of-presence/01-in-the-room.jpg',
```
