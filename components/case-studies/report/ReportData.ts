/* ── Sary usability performance report · data ────────
   Figures from the Q4 '22 Flagship report in Figma (Discover tab,
   campaigns and promotions). The board lists funnel counts as users
   who dropped; here they are turned into users who reached each
   step, so every rate reads "reached of 34,860". */

export const NAVY = '#1E3A8A';
export const TEAL = '#00C9B7';
export const SKY = '#4FA8E8';
export const VIOLET = '#5B21B6';
/* the report's pale blue, for accents on the dark page */
export const PAPER_INK = '#A9C7E8';

export const FUNNEL: { k: string; n: number; pct: number }[] = [
  { k: 'Catalogue viewed', n: 34860, pct: 100 },
  { k: 'Section sliders', n: 21999, pct: 63.1 },
  { k: 'Banners', n: 8122, pct: 23.3 },
  { k: 'Discover page', n: 3357, pct: 9.63 },
];

export type Quarter = 'Q3' | 'Q4';

export const TILES: {
  k: string;
  line: string;
  q: Record<Quarter, [number, string] | null>;
  best?: [string, number, string];
}[] = [
  {
    k: 'Banners',
    line: 'Shoppers who opened a campaign banner',
    q: { Q3: [15.5, '5,772 of 37,180'], Q4: [13.8, '4,789 of 34,630'] },
    best: ['Q2 · all-time best', 16.7, '7,157 of 42,773'],
  },
  {
    k: 'Announcement pop-up',
    line: 'Shoppers who acted on the pop-up',
    q: { Q3: [40.8, '15,169 of 37,180'], Q4: [39.2, '13,565 of 34,630'] },
  },
  {
    k: 'Section sliders',
    line: 'Catalogue visitors who used a slider',
    q: { Q3: null, Q4: [63.1, '21,999 of 34,860'] },
  },
];

export const HEAT: { img: string; t: string; d: string; fx: number; fy: number }[] = [
  { img: 'heat-1', t: 'Home', d: 'Clicks gather on the search bar, the banner and the basket. The promo banner draws attention but few taps.', fx: 50, fy: 30 },
  { img: 'heat-2', t: 'Discover', d: 'Few clicks beyond the categories: the page offered nothing the catalogue did not.', fx: 70, fy: 22 },
  { img: 'heat-3', t: 'Catalogue', d: 'A dense scroll path through the new sections, plus some random taps.', fx: 60, fy: 55 },
  { img: 'heat-4', t: 'Product list', d: 'A good average of clicks on the carousel, and touches that show it is used.', fx: 55, fy: 20 },
];

export const FLOW = ['Cashback pop-up', 'Home banner', 'Discover categories', 'Favourites'];

export const INSIGHTS = [
  'Discover is new and already used to browse categories. More sections and a walkthrough should lift it.',
  'Banner conversion fell below Q2. Ramadan and Eid campaigns lifted the other quarters; Q4 had none.',
  'The pop-up hit its highest interaction yet, after campaigns were targeted by segment.',
];

export const ISSUES = [
  'Banners and ads looked alike, so the same shopper opened the same banner more than once.',
  'Copying a code from a banner gave no success message, and nothing changed in the basket.',
];

export const FIXES = [
  'Apply the banner code to the basket automatically, with a clear, festive success message.',
  'Hide brands with no products or offers, or move them to the end of the brand filter.',
  'Make Discover worth visiting: sections built from what shoppers search for and the ads they open.',
];
