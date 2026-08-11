/* One-time migration: pushes the original Sary case study into Sanity.
   Idempotent — re-running replaces the doc with id `sary-repeat-customers`.
   Requires SANITY_WRITE_TOKEN (Editor token) in .env.local. */

import './_loadEnv';
import { createClient } from '@sanity/client';

const projectId = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) {
  console.error('[migrate:sary] Missing SANITY_PROJECT_ID. Set it in .env.local.');
  process.exit(1);
}
if (!token) {
  console.error(
    '[migrate:sary] Missing SANITY_WRITE_TOKEN. Create an Editor token in Sanity manage → API → Tokens.',
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

/* ── Source data — copied verbatim from the original
   SaryCaseStudy.tsx so the migration is self-contained. ── */

const SOURCE_IMAGES = {
  cover: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1600',
  mockup1: 'https://images.unsplash.com/photo-1553484771-371a605b060b?auto=format&fit=crop&q=80&w=1600',
  mockup2: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&q=80&w=1600',
  mockup3: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600',
};

const SARY_NARRATIVE = {
  title: 'Sary',
  subtitle: 'Turning One-Time Buyers into Repeat Customers',
  description:
    'Rethinking upselling placement and personalization to unlock real business impact.',
  role: 'Product / Innovation Designer',
  company: 'Sary',
  duration: '2024',
  context:
    'Sary is a leading B2B marketplace. While surface numbers looked good, a deeper look revealed a quiet failure: customers were buying once then disappearing. I led the effort to understand and fix this retention gap.',
  problem:
    'The buying cycle was breaking after checkout. Customers completed their orders and left, rarely exploring additional products. Upselling existed, but it felt irrelevant and generic—café owners were being shown household essentials instead of bulk coffee or equipment.',
  approach:
    'I moved beyond surface metrics to behavioral evidence. The goal wasn’t to show more products, but to show the right products at the right time. We shifted from a one-size-fits-all model to a segment-driven upselling strategy focused on high-intent moments.',
  whatThisProves:
    'The biggest wins don’t always come from big redesigns. Sometimes, they come from looking past surface metrics, understanding intent over clicks, and treating upselling as a service rather than a promotional tactic.',
  impact: [
    '+28%: Repeat Purchases',
    '+27%: Average Order Value',
    '+42%: Interaction Engagement',
    '+20%: Auto-reorder Habit',
  ],
  learnings: [
    'The biggest wins often come from small, strategic changes in placement and logic rather than massive redesigns.',
    'Treating upselling as a service rather than a promotional tactic transforms customer perception and builds trust.',
  ],
  metricSnapshot: [
    { label: 'Retention Rate', before: '14%', after: '28%' },
    { label: 'Avg Order Value', before: '$142', after: '$181' },
    { label: 'Suggestion CTR', before: '4.2%', after: '12.8%' },
  ],
  investigation: [
    {
      title: 'Path Analytics Audit',
      tool: 'Amplitude',
      insight:
        'Identified that 85% of users dropped off immediately after clicking "Confirm Order," ignoring the generic "You might also like" sidebar.',
    },
    {
      title: 'Friction Point Observation',
      tool: 'FullStory',
      insight:
        "Session replays showed users hovering over recommendations but closing the app before engagement because content didn't match their segment needs.",
    },
    {
      title: 'Segment Delta Analysis',
      tool: 'Internal BI',
      insight:
        'Discovered that "Cafe" owners had the highest latent AOV potential but were being served 60% irrelevant product categories.',
    },
  ],
  expertDecisions: [
    {
      decision: 'High-Intent Confirmation Placement',
      rationale:
        'Moving recommendations to the confirmation screen caught users in an "active buying" state, reducing the friction of starting a new search.',
      rejected:
        'Cart-Level Pushes: Often led to cart abandonment due to choice overload and increased cognitive friction during checkout.',
    },
    {
      decision: 'Vertical-Specific Recommendation Engine',
      rationale:
        'Ensured a Restaurant only saw commercial-grade supplies, transforming upselling into a helpful service rather than a generic ad.',
      rejected:
        'Global Trending Logic: Was statistically easier to implement but yielded 40% lower CTR in pilot tests with professional buyers.',
    },
  ],
  collaboration: {
    teams: ['Product Marketing', 'Product Content', 'Data Engineering', 'Stakeholders'],
    outcome:
      'Aligned promotions with seasonal segments, changing the tone from "Buy more" to "This might help," ensuring upselling became a valuable part of the journey.',
  },
};

const SARY_PHASES = [
  {
    n: '01',
    name: 'Frame',
    action: 'The buying cycle was breaking after checkout.',
    question: 'Where, exactly, is the value leaking — and for whom?',
    methods: ['Stakeholder alignment', 'Data audit', 'Cycle mapping'],
    output: 'A shared definition of the leak — agreed by product, data, and leadership.',
  },
  {
    n: '02',
    name: 'Investigate',
    action: 'Triangulated 3 friction layers across behavior, segments, and signals.',
    question: 'What separates buyers who return from those who churn after checkout?',
    methods: ['Amplitude', 'FullStory', 'Internal BI'],
    output: '3 evidence-backed friction patterns, mapped to specific cycle moments.',
  },
  {
    n: '03',
    name: 'Hypothesize',
    action:
      'Reframed the surface as a behavioral system, not a UI patch — show the right products at the right time.',
    question: "What if the real problem isn't visibility — it's timing and intent?",
    methods: ['Behavioral framing', 'Intent modeling', 'Service-design lens'],
    output: SARY_NARRATIVE.approach,
  },
  {
    n: '04',
    name: 'Decide',
    action: 'High-Intent Confirmation Placement',
    question: 'Which lever earns its place — and what gets sacrificed for it?',
    methods: ['Trade-off matrix', 'Rejection criteria', 'Stakeholder review'],
    output: '2 high-stakes trade-offs resolved with explicit rationale.',
  },
  {
    n: '05',
    name: 'Ship & Measure',
    action: 'Shipped the intervention, instrumented for honest measurement.',
    question: 'Did the bet land — and where did reality push back?',
    methods: ['Live monitoring', 'A/B validation', 'Honest retros'],
    output: '3 business metrics tracked end-to-end, 2 lessons logged for the next loop.',
  },
];

const MOCKUP_NOTES = [
  { src: SOURCE_IMAGES.mockup1, note: 'Contextual Dashboard UI' },
  { src: SOURCE_IMAGES.mockup2, note: 'Behavioral Trigger Logic' },
  { src: SOURCE_IMAGES.mockup3, note: 'Post-Checkout High-Intent Placement' },
];

/* ── Helpers ── */

async function uploadFromUrl(url: string, label: string) {
  console.log(`[migrate:sary] Uploading "${label}" from ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const asset = await client.assets.upload('image', buf, {
    filename: `${label}.jpg`,
    contentType: 'image/jpeg',
  });
  return asset._id;
}

const imageRef = (assetId: string, alt: string) => ({
  _type: 'image',
  asset: { _type: 'reference', _ref: assetId },
  alt,
});

/* ── Main ── */

async function main() {
  console.log(`[migrate:sary] Target: ${projectId}/${dataset}`);

  const coverId = await uploadFromUrl(SOURCE_IMAGES.cover, 'sary-cover');
  const mockupAssets = await Promise.all(
    MOCKUP_NOTES.map((m, i) => uploadFromUrl(m.src, `sary-mockup-${i + 1}`)),
  );

  const docId = 'sary-repeat-customers';

  const doc = {
    _id: docId,
    _type: 'caseStudy',
    id: { _type: 'slug', current: docId },
    ...SARY_NARRATIVE,
    cover: imageRef(coverId, SARY_NARRATIVE.title),
    mockups: MOCKUP_NOTES.map((m, i) => ({
      _key: `mockup-${i + 1}`,
      _type: 'mockup',
      image: imageRef(mockupAssets[i], m.note),
      note: m.note,
    })),
    metricSnapshot: SARY_NARRATIVE.metricSnapshot.map((m, i) => ({
      _key: `metric-${i + 1}`,
      _type: 'metricSnapshot',
      ...m,
    })),
    investigation: SARY_NARRATIVE.investigation.map((m, i) => ({
      _key: `inv-${i + 1}`,
      _type: 'investigation',
      ...m,
    })),
    expertDecisions: SARY_NARRATIVE.expertDecisions.map((m, i) => ({
      _key: `dec-${i + 1}`,
      _type: 'expertDecision',
      ...m,
    })),
    phases: SARY_PHASES.map((p) => ({ _key: `phase-${p.n}`, _type: 'criticalPhase', ...p })),
    impact: SARY_NARRATIVE.impact,
    learnings: SARY_NARRATIVE.learnings,
    collaboration: { _type: 'collaboration', ...SARY_NARRATIVE.collaboration },
  };

  const result = await client.createOrReplace(doc);
  console.log(`[migrate:sary] ✓ Created/replaced ${result._id}`);
  console.log(
    `[migrate:sary] Done. Open the Studio to verify: https://${projectId}.sanity.studio/`,
  );
}

main().catch((err) => {
  console.error('[migrate:sary] Failed:', err);
  process.exit(1);
});
