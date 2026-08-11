/* TypeScript shapes for case studies AFTER prefetch resolves
   image references to CDN URL strings. The Vite app consumes
   `generated/case-studies.json` which conforms to `CaseStudy`. */

export interface MetricSnapshot {
  label: string;
  before: string;
  after: string;
}

export interface Investigation {
  title: string;
  tool?: string;
  insight: string;
}

export interface ExpertDecision {
  decision: string;
  rationale: string;
  rejected?: string;
}

export interface Mockup {
  url: string;
  note: string;
  caption?: string;
}

export interface Collaboration {
  teams: string[];
  outcome: string;
}

export interface CriticalPhase {
  n: string;
  name: string;
  action: string;
  question: string;
  methods: string[];
  output: string;
}

export interface Chapter {
  id: string;
  num: string;
  roman: string;
  label: string;
  beat: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  cover: string;
  role: string;
  company: string;
  duration: string;
  context?: string;
  problem?: string;
  approach?: string;
  whatThisProves?: string;
  impact?: string[];
  learnings?: string[];
  metricSnapshot?: MetricSnapshot[];
  investigation?: Investigation[];
  expertDecisions?: ExpertDecision[];
  mockups?: Mockup[];
  collaboration?: Collaboration;
  phases?: CriticalPhase[];
  chapters?: Chapter[];
}

export type CaseStudyMap = Record<string, CaseStudy>;
