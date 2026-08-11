import { SaryCaseStudy } from './SaryCaseStudy';
import { HealthLadderCaseStudy } from './HealthLadderCaseStudy';
import { ShorefieldHolidaysCaseStudy } from './ShorefieldHolidaysCaseStudy';
import { GlobalPaymentsCaseStudy } from './GlobalPaymentsCaseStudy';
import type { CaseStudyComponentProps } from './_shared/types';

/* ── Case study registry ─────────────────────────────
   Maps each project id (the same id used by Projects.tsx
   cards) to its dedicated component. Each component owns
   its narrative data, chapter spine, and any bespoke lanes —
   the registry only resolves which one to render. */
export const CASE_STUDY_REGISTRY: Record<
  string,
  React.ComponentType<CaseStudyComponentProps>
> = {
  'sary-repeat-customers': SaryCaseStudy,
  'health-ladder': HealthLadderCaseStudy,
  'shorefield-holidays': ShorefieldHolidaysCaseStudy,
  'global-payments': GlobalPaymentsCaseStudy,
};

export type CaseStudyId = keyof typeof CASE_STUDY_REGISTRY;
