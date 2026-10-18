# Case study films

| File | Used by |
| --- | --- |
| `fresh-order-placed.mp4` | fresh "Order placed" — the case study hero (plays with sound on click). The Projects card uses a live animation instead. |

Export as H.264 MP4, 1920×1080, under ~15 MB (e.g. `ffmpeg -i in.mp4 -c:v libx264 -crf 24 -preset slow -movflags +faststart -c:a aac -b:a 128k fresh-order-placed.mp4`).
Until the file exists, the case study hero plays the sequence live in code.
