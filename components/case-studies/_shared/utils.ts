/* ── Shared case-study utilities ───────────────────────────────── */

/* Smoothly scroll the case-study container so the chapter lands
   under the sticky tabs (offset accounts for header + tabs). */
export function scrollToChapter(
  rootEl: HTMLElement | null,
  id: string,
  offset = 120
) {
  if (!rootEl) return;
  const el = rootEl.querySelector(`#${id}`) as HTMLElement | null;
  if (el) rootEl.scrollTo({ top: el.offsetTop - offset, behavior: 'smooth' });
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
