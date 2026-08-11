/* GROQ queries for the case study collection. */

export const ALL_CASE_STUDIES_QUERY = /* groq */ `
*[_type == "caseStudy"]{
  "id": id.current,
  title,
  subtitle,
  description,
  cover{ ..., asset->{ _id, url, metadata } },
  role,
  company,
  duration,
  context,
  problem,
  approach,
  whatThisProves,
  impact,
  learnings,
  metricSnapshot[]{ label, before, after },
  investigation[]{ title, tool, insight },
  expertDecisions[]{ decision, rationale, rejected },
  mockups[]{
    note,
    caption,
    image{ ..., asset->{ _id, url, metadata } }
  },
  collaboration{ teams, outcome },
  phases[]{ n, name, action, question, methods, output },
  chapters[]{ id, num, roman, label, beat }
}
`;

export const CASE_STUDY_BY_ID_QUERY = /* groq */ `
*[_type == "caseStudy" && id.current == $id][0]{
  "id": id.current,
  title,
  subtitle,
  description,
  cover{ ..., asset->{ _id, url, metadata } },
  role,
  company,
  duration,
  context,
  problem,
  approach,
  whatThisProves,
  impact,
  learnings,
  metricSnapshot[]{ label, before, after },
  investigation[]{ title, tool, insight },
  expertDecisions[]{ decision, rationale, rejected },
  mockups[]{
    note,
    caption,
    image{ ..., asset->{ _id, url, metadata } }
  },
  collaboration{ teams, outcome },
  phases[]{ n, name, action, question, methods, output },
  chapters[]{ id, num, roman, label, beat }
}
`;
