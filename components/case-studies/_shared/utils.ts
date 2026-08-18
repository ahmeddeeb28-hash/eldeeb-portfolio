/* ── Shared case-study utilities ───────────────────────────────── */

/* Ease-out cubic — used by the manual scroll animation below. */
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/* Smoothly scroll the case-study container so the chapter lands
   under the sticky tabs (offset accounts for header + tabs).

   Deliberately hand-rolled instead of `scrollTo({ behavior: 'smooth' })`:
   the native smooth-scroll can be silently truncated by the browser when
   the main thread is busy (e.g. sticky-header backdrop-filter repaints +
   concurrent whileInView IntersectionObservers firing as sections are
   scrolled past), which leaves the container short of its target and
   downstream scroll-triggered reveals permanently un-fired. Driving the
   scroll ourselves via rAF guarantees it always reaches `top`. */
export function scrollToChapter(
  rootEl: HTMLElement | null,
  id: string,
  offset = 120
) {
  if (!rootEl) return;
  const el = rootEl.querySelector(`#${id}`) as HTMLElement | null;
  if (!el) return;

  const startTop = rootEl.scrollTop;
  const maxScroll = rootEl.scrollHeight - rootEl.clientHeight;
  const targetTop = Math.max(0, Math.min(el.offsetTop - offset, maxScroll));
  const distance = targetTop - startTop;
  if (Math.abs(distance) < 1) return;

  const duration = 600; // ms
  const startTime = performance.now();

  function step(now: number) {
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / duration);
    rootEl!.scrollTop = startTop + distance * easeOutCubic(t);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* Mockups data convention: index 0 = After (intervention),
   1 = Before (baseline), 2 = Full context. Reorders to a clean
   story sequence: Before → After → In context, attaching captions. */
export function orderedMockups(
  mockups: { url: string; note: string }[]
): { url: string; note: string; caption: string }[] {
  const after = mockups[0];
  const before = mockups[1];
  const ctx = mockups[2];

  const seq: { url: string; note: string; caption: string }[] = [];
  if (before) {
    seq.push({
      url: before.url,
      note: before.note || 'The starting state — what users were stuck with.',
      caption: 'Before',
    });
  }
  if (after) {
    seq.push({
      url: after.url,
      note: after.note || 'The intervention — where the change earned its place.',
      caption: 'After',
    });
  }
  if (ctx) {
    seq.push({
      url: ctx.url,
      note: ctx.note || 'Full context — how it lives in the product.',
      caption: 'In context',
    });
  }
  return seq;
}
