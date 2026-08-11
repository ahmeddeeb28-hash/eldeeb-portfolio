import { StubCaseStudy } from './_shared/StubCaseStudy';
import type { CaseStudyComponentProps } from './_shared/types';

/* ── Shorefield Holidays ─────────────────────────────
   Bespoke component scaffold. Will get its own lifecycle-
   based chapter set, milestone trigger lane, and an
   upgrade-curve visualization once the narrative is ready. */
export function ShorefieldHolidaysCaseStudy(props: CaseStudyComponentProps) {
  return (
    <StubCaseStudy
      title="Lifecycle Upsell System"
      company="Shorefield Holidays"
      year="2023"
      category="SaaS · Conversion"
      accent="rgba(140,110,180,0.85)"
      {...props}
    />
  );
}
