import { StubCaseStudy } from './_shared/StubCaseStudy';
import type { CaseStudyComponentProps } from './_shared/types';

/* ── Health Ladder ───────────────────────────────────
   Bespoke component scaffold. Replace StubCaseStudy with
   a CaseShell composition once the narrative is ready —
   this project will get its own chapter set, behavioral-
   cohort lane, and intervention-flow visualizations. */
export function HealthLadderCaseStudy(props: CaseStudyComponentProps) {
  return (
    <StubCaseStudy
      title="Behavior-Driven Retention"
      company="Health Ladder"
      year="2023"
      category="Growth · Retention"
      accent="rgba(190,100,80,0.85)"
      {...props}
    />
  );
}
