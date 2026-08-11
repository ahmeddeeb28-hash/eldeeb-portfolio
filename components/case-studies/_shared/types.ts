/* ── Shared case-study types ──────────────────────────────────────
   Per-project case-study components compose the cinematic spine
   from this folder. Each project owns its own narrative data and
   chooses which primitives to reuse. The shapes below are the
   structural contracts — projects can extend or replace them.
   ─────────────────────────────────────────────────────────────── */

export type Chapter = {
  id: string;
  num: string;
  roman: string;
  label: string;
  beat: string;
};

/* Default 6-chapter cinematic spine. Projects can pass their own
   array of Chapter objects to CaseShell to redefine the lanes. */
export const DEFAULT_CHAPTERS: Chapter[] = [
  { id: 'overview', num: '01', roman: 'I',   label: 'Overview', beat: 'Where this case started.' },
  { id: 'tension',  num: '02', roman: 'II',  label: 'Tension',  beat: 'What was quietly breaking.' },
  { id: 'insight',  num: '03', roman: 'III', label: 'Insight',  beat: 'Where the real problem lived.' },
  { id: 'move',     num: '04', roman: 'IV',  label: 'The Move', beat: 'The calls I had to defend.' },
  { id: 'proof',    num: '05', roman: 'V',   label: 'Proof',    beat: 'What actually changed.' },
  { id: 'lesson',   num: '06', roman: 'VI',  label: 'Lesson',   beat: 'What I carry forward.' },
];

/* Common shape for the structured Sary-style case study. Other
   projects may use this directly, extend it, or define their own
   data shape inline — the registry only cares about the rendered
   component, not its data contract. */
export interface CaseStudyData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cover: string;
  role: string;
  company: string;
  duration: string;
  context: string;
  problem: string;
  goals: string[];
  approach: string;
  solution: string;
  impact: string[];
  learnings: string[];
  metricSnapshot?: { label: string; before: string; after: string }[];
  investigation?: { title: string; tool: string; insight: string }[];
  visualSummary?: { url: string; caption: string }[];
  collaboration?: { teams: string[]; outcome: string };
  expertDecisions?: { decision: string; rationale: string; rejected?: string }[];
  mockups?: { url: string; note: string }[];
  outcomeSummary?: string;
  whatThisProves?: string;
}

/* Standard contract every per-project component implements so the
   registry/App.tsx can swap them without knowing internals. */
export interface CaseStudyComponentProps {
  onBack: () => void;
  onNext?: () => void;
}
