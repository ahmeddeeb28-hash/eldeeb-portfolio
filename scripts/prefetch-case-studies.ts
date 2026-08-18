/* Build-time prefetch.
   Queries every published caseStudy doc, resolves image refs to CDN
   URLs, and writes generated/case-studies.json keyed by `id`.
   Vercel runs this before `vite build`; locally `npm run dev` runs
   it before `vite`. The Vite bundle imports the JSON directly. */

import './_loadEnv';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { CaseStudy, CaseStudyMap } from '../lib/sanity/types';
import { FALLBACK_CASE_STUDIES } from '../lib/sanity/fallbackCaseStudies';

const projectId = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET || 'production';
const token = process.env.SANITY_READ_TOKEN; // optional; only required for private datasets

function writeMap(map: CaseStudyMap) {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const outDir = resolve(__dirname, '..', 'generated');
  const outFile = resolve(outDir, 'case-studies.json');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, JSON.stringify(map, null, 2), 'utf8');
  return outFile;
}

if (!projectId) {
  console.warn(
    '[prefetch] SANITY_PROJECT_ID not set — writing generated/case-studies.json from the ' +
      'local fallback (lib/sanity/fallbackCaseStudies.ts). Set VITE_SANITY_PROJECT_ID in ' +
      '.env.local once Sanity is configured to author real content there instead.',
  );
  writeMap(FALLBACK_CASE_STUDIES);
  process.exit(0);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: !token,
  token,
  perspective: 'published',
});

const builder = imageUrlBuilder({ projectId, dataset });
const resolveImage = (source: any, width = 1600): string | undefined => {
  if (!source) return undefined;
  try {
    return builder.image(source).width(width).quality(85).auto('format').url();
  } catch {
    return undefined;
  }
};

const QUERY = /* groq */ `
*[_type == "caseStudy"]{
  "id": id.current,
  title,
  subtitle,
  description,
  cover,
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
  mockups[]{ note, caption, image },
  collaboration{ teams, outcome },
  phases[]{ n, name, action, question, methods, output },
  chapters[]{ id, num, roman, label, beat }
}
`;

interface RawMockup {
  image: any;
  note: string;
  caption?: string;
}
interface RawCaseStudy extends Omit<CaseStudy, 'cover' | 'mockups'> {
  cover: any;
  mockups?: RawMockup[];
}

async function main() {
  console.log(`[prefetch] Fetching caseStudy docs from ${projectId}/${dataset}…`);
  const docs = (await client.fetch<RawCaseStudy[]>(QUERY)) || [];

  const map: CaseStudyMap = {};
  for (const doc of docs) {
    if (!doc.id) {
      console.warn('[prefetch] Skipping doc without id:', doc.title);
      continue;
    }

    const cover = resolveImage(doc.cover, 2000);
    if (!cover) {
      console.warn(`[prefetch] Skipping "${doc.id}" — cover image could not be resolved.`);
      continue;
    }

    const mockups = (doc.mockups || [])
      .map((m) => {
        const url = resolveImage(m.image, 1600);
        if (!url) return null;
        return { url, note: m.note, caption: m.caption };
      })
      .filter((x): x is { url: string; note: string; caption?: string } => Boolean(x));

    map[doc.id] = {
      ...doc,
      cover,
      mockups,
    } as CaseStudy;

    console.log(`[prefetch]   ✓ ${doc.id} — ${doc.title}`);
  }

  writeMap(map);

  console.log(
    `[prefetch] Wrote ${Object.keys(map).length} case stud${
      Object.keys(map).length === 1 ? 'y' : 'ies'
    } to generated/case-studies.json`,
  );
}

main().catch((err) => {
  console.error('[prefetch] Failed:', err);
  process.exit(1);
});
