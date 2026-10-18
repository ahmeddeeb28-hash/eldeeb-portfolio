/* ── Local fallback case studies ─────────────────────────────────
   Used by scripts/prefetch-case-studies.ts when no Sanity project
   is configured (no VITE_SANITY_PROJECT_ID). Keeps the site fully
   functional out of the box. Once Sanity is configured and case
   studies are authored there, live CMS content takes over — this
   file is only a bootstrap fallback, not the source of truth. */

import type { CaseStudyMap } from './types';

export const FALLBACK_CASE_STUDIES: CaseStudyMap = {
  'sary-repeat-customers': {
    id: 'sary-repeat-customers',
    title: 'Sary',
    subtitle: 'Turning One-Time Buyers into Repeat Customers',
    description:
      'Rethinking upselling placement and personalization to unlock real business impact.',
    cover:
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=2000',
    role: 'Product / Innovation Designer',
    company: 'Sary',
    duration: '2022',
    context:
      'Sary is a leading B2B marketplace. While surface numbers looked good, a deeper look revealed a quiet failure: customers were buying once then disappearing. I led the effort to understand and fix this retention gap.',
    problem:
      'The buying cycle was breaking after checkout. Customers completed their orders and left, rarely exploring additional products. Upselling existed, but it felt irrelevant and generic. Café owners were being shown household essentials instead of bulk coffee or equipment.',
    approach:
      'I moved beyond surface metrics to behavioral evidence. The goal wasn\u2019t to show more products, but to show the right products at the right time. We shifted from a one-size-fits-all model to a segment-driven upselling strategy focused on high-intent moments.',
    whatThisProves:
      'The biggest wins don\u2019t always come from big redesigns. Sometimes, they come from looking past surface metrics, understanding intent over clicks, and treating upselling as a service rather than a promotional tactic.',
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
          'Session replays showed users hovering over recommendations but closing the app before engagement because content didn\u2019t match their segment needs.',
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
    mockups: [
      {
        url: 'https://images.unsplash.com/photo-1553484771-371a605b060b?auto=format&fit=crop&q=80&w=1200',
        note: 'Contextual Dashboard UI',
      },
      {
        url: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&q=80&w=1200',
        note: 'Behavioral Trigger Logic',
      },
      {
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
        note: 'Post-Checkout High-Intent Placement',
      },
      {
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
        note: 'Mobile Confirmation Flow',
      },
    ],
    collaboration: {
      teams: ['Product Marketing', 'Product Content', 'Data Engineering', 'Stakeholders'],
      outcome:
        'Aligned promotions with seasonal segments, changing the tone from "Buy more" to "This might help," ensuring upselling became a valuable part of the journey.',
    },
  },
};
