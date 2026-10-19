import { lazy } from 'react';
import type { CaseStudyComponentProps } from './_shared/types';

/* ── Case study registry ─────────────────────────────
   Maps each project id (the same id used by Projects.tsx
   cards) to its dedicated component. Each component owns
   its narrative data, chapter spine, and any bespoke lanes —
   the registry only resolves which one to render.

   Each one is lazy-loaded: the landing page is what most visitors
   see, so the case-study code is only fetched once one is opened.
   App.tsx wraps the active case in <Suspense>. */
const load = <K extends string>(
  importer: () => Promise<Record<K, React.ComponentType<CaseStudyComponentProps>>>,
  name: K,
) => lazy(() => importer().then((m) => ({ default: m[name] })));
export const CASE_STUDY_REGISTRY: Record<
  string,
  React.ComponentType<CaseStudyComponentProps>
> = {
  'sary-repeat-customers': load(() => import('./SaryCaseStudy'), 'SaryCaseStudy'),
  'health-ladder': load(() => import('./HealthLadderCaseStudy'), 'HealthLadderCaseStudy'),
  'shorefield-holidays': load(() => import('./ShorefieldHolidaysCaseStudy'), 'ShorefieldHolidaysCaseStudy'),
  'global-payments': load(() => import('./GlobalPaymentsCaseStudy'), 'GlobalPaymentsCaseStudy'),
  'fresh-order-placed': load(() => import('./FreshOrderPlacedCaseStudy'), 'FreshOrderPlacedCaseStudy'),
  'sampo-ai-pricing': load(() => import('./SampoCaseStudy'), 'SampoCaseStudy'),
};

export type CaseStudyId = keyof typeof CASE_STUDY_REGISTRY;
