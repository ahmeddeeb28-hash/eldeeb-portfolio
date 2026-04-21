const image_ee136c95ae21c58ad43892c9e0f0b0323bc0bbce = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200';
const image_65ae2194b2d7fc6509211a2c41e96e314419ffcb = 'https://images.unsplash.com/photo-1553484771-371a605b060b?auto=format&fit=crop&q=80&w=1200';
const image_f2f4a5d9b7c9d7a07aeab0b234a660226dbbcc1e = 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&q=80&w=1200';
const image_45bd6412af3dabcdcc8845dc6b281854187ee02c = 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200';
import { CaseStudyData } from '../components/CaseStudyDetail';

const MASTER_CASE_STUDY: CaseStudyData = {
  id: 'sary-repeat-customers',
  title: 'Sary',
  subtitle: 'Turning One-Time Buyers into Repeat Customers',
  description: 'Rethinking upselling placement and personalization to unlock real business impact.',
  cover: image_45bd6412af3dabcdcc8845dc6b281854187ee02c,
  role: 'Product / Innovation Designer',
  company: 'Sary',
  duration: '2024',
  context: 'Sary is a leading B2B marketplace. While surface numbers looked good, a deeper look revealed a quiet failure: customers were buying once then disappearing. I led the effort to understand and fix this retention gap.',
  problem: 'The buying cycle was breaking after checkout. Customers completed their orders and left, rarely exploring additional products. Upselling existed, but it felt irrelevant and generic—café owners were being shown household essentials instead of bulk coffee or equipment.',
  goals: [
    'Increase customer lifetime value and repeat purchase rates.',
    'Boost Average Order Value (AOV) through contextual discovery.',
    'Shift user behavior toward habitual buying and auto-reorders.'
  ],
  approach: 'I moved beyond surface metrics to behavioral evidence. The goal wasn’t to show more products, but to show the right products at the right time. We shifted from a one-size-fits-all model to a segment-driven upselling strategy focused on high-intent moments.',
  solution: 'We implemented segment-driven upselling (contextual to business types), behavioral triggers (e.g., coffee beans prompting milk frothers), and shifted placement to high-intent moments like the order confirmation screen.',
  impact: [
    '+28%: Repeat Purchases',
    '+27%: Average Order Value',
    '+42%: Interaction Engagement',
    '+20%: Auto-reorder Habit'
  ],
  metricSnapshot: [
    { label: 'Retention Rate', before: '14%', after: '28%' },
    { label: 'Avg Order Value', before: '$142', after: '$181' },
    { label: 'Suggestion CTR', before: '4.2%', after: '12.8%' }
  ],
  investigation: [
    { title: 'Path Analytics Audit', tool: 'Amplitude', insight: 'Identified that 85% of users dropped off immediately after clicking "Confirm Order," ignoring the generic "You might also like" sidebar.' },
    { title: 'Friction Point Observation', tool: 'FullStory', insight: 'Session replays showed users hovering over recommendations but closing the app before engagement because content didn\'t match their segment needs.' },
    { title: 'Segment Delta Analysis', tool: 'Internal BI', insight: 'Discovered that "Cafe" owners had the highest latent AOV potential but were being served 60% irrelevant product categories.' }
  ],
  expertDecisions: [
    { 
      decision: 'High-Intent Confirmation Placement', 
      rationale: 'Moving recommendations to the confirmation screen caught users in an "active buying" state, reducing the friction of starting a new search.',
      rejected: 'Cart-Level Pushes: Often led to cart abandonment due to choice overload and increased cognitive friction during checkout.'
    },
    { 
      decision: 'Vertical-Specific Recommendation Engine', 
      rationale: 'Ensured a Restaurant only saw commercial-grade supplies, transforming upselling into a helpful service rather than a generic ad.',
      rejected: 'Global Trending Logic: Was statistically easier to implement but yielded 40% lower CTR in pilot tests with professional buyers.'
    }
  ],
  mockups: [
    { url: image_65ae2194b2d7fc6509211a2c41e96e314419ffcb, note: 'Contextual Dashboard UI' },
    { url: image_f2f4a5d9b7c9d7a07aeab0b234a660226dbbcc1e, note: 'Behavioral Trigger Logic' },
    { url: image_ee136c95ae21c58ad43892c9e0f0b0323bc0bbce, note: 'Post-Checkout High-Intent Placement' },
    { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', note: 'Mobile Confirmation Flow' }
  ],
  whatThisProves: 'The biggest wins don’t always come from big redesigns. Sometimes, they come from looking past surface metrics, understanding intent over clicks, and treating upselling as a service rather than a promotional tactic.',
  collaboration: {
    teams: ['Product Marketing', 'Product Content', 'Data Engineering', 'Stakeholders'],
    outcome: 'Aligned promotions with seasonal segments, changing the tone from "Buy more" to "This might help," ensuring upselling became a valuable part of the journey.'
  },
  learnings: [
    'The biggest wins often come from small, strategic changes in placement and logic rather than massive redesigns.',
    'Treating upselling as a service rather than a promotional tactic transforms customer perception and builds trust.'
  ]
};

export const CASE_STUDIES: Record<string, CaseStudyData> = {
  'shorefield-holidays': { ...MASTER_CASE_STUDY, id: 'shorefield-holidays' },
  'health-ladder': { ...MASTER_CASE_STUDY, id: 'health-ladder' },
  'sary-repeat-customers': { ...MASTER_CASE_STUDY, id: 'sary-repeat-customers' }
};