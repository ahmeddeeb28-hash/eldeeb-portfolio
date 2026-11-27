# Case study films

| File | Used by |
| --- | --- |
| `sary-buy-again-film.mp4` | Sary Buy Again Hub: the case study hero (plays with sound on click). The Projects card uses a live animation instead. |
| `fresh-order-placed.mp4` | fresh "Order placed": the case study hero (plays with sound on click). The Projects card uses a live animation instead. |

Export as H.264 MP4, 1920×1080, under ~15 MB (e.g. `ffmpeg -i in.mp4 -c:v libx264 -crf 24 -preset slow -movflags +faststart -c:a aac -b:a 128k fresh-order-placed.mp4`).
If a file fails to load, its case study hero plays the sequence live in code instead.

Each film also has a `*-vertical.mp4` (720×1280) that the player uses on phones. They are recomposed from the 16:9 masters: the copy column stacked over an enlarged phone, wide scenes fitted over a blurred fill. Posters: `film-poster-vertical.webp` next to each case study's `film-poster.webp`.
