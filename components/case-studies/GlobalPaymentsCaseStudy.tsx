import { StubCaseStudy } from './_shared/StubCaseStudy';
import type { CaseStudyComponentProps } from './_shared/types';

/* ── Global Payments ─────────────────────────────────
   Bespoke component scaffold. Will get its own cross-
   border flow chapters, a financial scenarios calculator
   lane, and currency/regulation context blocks. */
export function GlobalPaymentsCaseStudy(props: CaseStudyComponentProps) {
  return (
    <StubCaseStudy
      title="Frictionless Global Payments"
      company="Global Payments"
      year="2024"
      category="Fintech · UX Research"
      accent="rgba(180,130,60,0.85)"
      {...props}
    />
  );
}
