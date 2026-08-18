# Beyond the Screen — Image Slots

Drop your photos in this folder and match the filenames referenced in
`components/ProofOfPresence.tsx` (or edit the paths there).

## Slot spec

| Slot | Filename                         | Aspect  | Purpose                        |
| ---- | -------------------------------- | ------- | ------------------------------ |
| 01   | `01-hero-talk.jpg`               | 4:5     | Hero — on-stage / keynote      |
| 02   | `02-workshop.jpg`                | 4:3     | Workshop room / whiteboard     |
| 03   | `03-panel.jpg`                   | 1:1     | Panel discussion               |
| 04   | `04-community-meetup.jpg`        | 4:3     | Community meetup / audience    |
| 05   | `05-mentoring-session.jpg`       | 3:4     | Small mentoring group          |
| 06   | `06-closing-applause.jpg`        | 16:10   | Closing applause / wide room   |

## Tips

- Aim for a warm, cinematic feel — golden-hour, stage lighting, or crowd blur.
- The layout expects portraits at slot 01 and 05, landscapes elsewhere.
- Compress to ~1600px on the long edge, quality 80 — the component uses
  `object-cover` so exact dimensions aren't critical, but aspect ratio drives
  the grid rhythm.
