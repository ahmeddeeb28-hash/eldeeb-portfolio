import { createClient } from '@sanity/client';

const projectId =
  (typeof process !== 'undefined' && process.env?.SANITY_PROJECT_ID) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SANITY_PROJECT_ID) ||
  '';

const dataset =
  (typeof process !== 'undefined' && process.env?.SANITY_DATASET) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SANITY_DATASET) ||
  'production';

const token =
  (typeof process !== 'undefined' && (process.env?.SANITY_READ_TOKEN || process.env?.SANITY_WRITE_TOKEN)) ||
  undefined;

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: !token,
  token,
});

export const sanityProjectId = projectId;
export const sanityDataset = dataset;
