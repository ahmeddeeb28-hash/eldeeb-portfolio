/* English versions of Sary's catalogue banners. Rebuilt in Figma from
   the Arabic originals on the "HoReCa Banners [Guidelines]" page:
   same art and backdrops, copy translated, layout mirrored to read
   left to right, set in Manrope. Exported at 3x (1140×540). */

export type Banner = { id: string; alt: string };

const B = (id: string, alt: string): Banner => ({ id, alt });

export const BANNERS = {
  fresh: B('fresh', 'Fresh produce is now on Sary'),
  veg: B('veg', '10% off all fruit and vegetables'),
  second: B('second', 'Place your 2nd order and get SAR 100 back'),
  mars: B('mars', 'Mars, now on Sary'),
  school: B('school', 'Back-to-school deals, up to 40% off'),
  coke: B('coke', 'Every Coca-Cola favourite, in stock now'),
  unilever: B('unilever', 'Unilever is now on Sary'),
  ramadan: B('ramadan', 'Ramadan Kareem: this week’s Ramadan deals'),
  cashback: B('cashback', '30% cashback on every order'),
  eid: B('eid', 'Eid deals: 20% off everything you need for Eid'),
  flash: B('flash', 'Save more with flash deals'),
  pulses: B('pulses', 'Plan your order: 20% off all pulses and beans'),
};

export const bannerSrc = (b: Banner) => `/images/case-studies/sary/banners/${b.id}.webp`;
export const BANNER_ASPECT = 1140 / 540;
