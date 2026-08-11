import { defineType, defineField } from 'sanity';

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  groups: [
    { name: 'meta', title: 'Meta', default: true },
    { name: 'narrative', title: 'Narrative' },
    { name: 'evidence', title: 'Evidence' },
    { name: 'process', title: 'Process' },
    { name: 'outcomes', title: 'Outcomes' },
    { name: 'structure', title: 'Structure' },
  ],
  fields: [
    /* ── Meta ── */
    defineField({
      name: 'id',
      type: 'slug',
      title: 'ID (matches the registry key)',
      group: 'meta',
      options: { source: 'title', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({ name: 'title', type: 'string', group: 'meta', validation: (R) => R.required() }),
    defineField({ name: 'subtitle', type: 'string', group: 'meta', validation: (R) => R.required() }),
    defineField({ name: 'description', type: 'text', rows: 3, group: 'meta' }),
    defineField({
      name: 'cover',
      type: 'image',
      group: 'meta',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          validation: (R) => R.required(),
        }),
      ],
      validation: (R) => R.required(),
    }),
    defineField({ name: 'role', type: 'string', group: 'meta', validation: (R) => R.required() }),
    defineField({ name: 'company', type: 'string', group: 'meta', validation: (R) => R.required() }),
    defineField({ name: 'duration', type: 'string', group: 'meta', validation: (R) => R.required() }),

    /* ── Narrative ── */
    defineField({ name: 'context', type: 'text', rows: 4, group: 'narrative' }),
    defineField({ name: 'problem', type: 'text', rows: 4, group: 'narrative' }),
    defineField({ name: 'approach', type: 'text', rows: 4, group: 'narrative' }),
    defineField({ name: 'whatThisProves', type: 'text', rows: 3, group: 'narrative' }),

    /* ── Evidence ── */
    defineField({
      name: 'metricSnapshot',
      title: 'Metric Snapshot',
      type: 'array',
      group: 'evidence',
      of: [{ type: 'metricSnapshot' }],
    }),
    defineField({
      name: 'investigation',
      title: 'Investigation Cards',
      type: 'array',
      group: 'evidence',
      of: [{ type: 'investigation' }],
    }),

    /* ── Process ── */
    defineField({
      name: 'expertDecisions',
      type: 'array',
      group: 'process',
      of: [{ type: 'expertDecision' }],
    }),
    defineField({
      name: 'phases',
      title: 'Critical Process Phases',
      type: 'array',
      group: 'process',
      of: [{ type: 'criticalPhase' }],
    }),
    defineField({
      name: 'mockups',
      type: 'array',
      group: 'process',
      of: [{ type: 'mockup' }],
    }),

    /* ── Outcomes ── */
    defineField({
      name: 'impact',
      type: 'array',
      group: 'outcomes',
      of: [{ type: 'string' }],
      description: 'Bullets — format "+28%: Repeat Purchases"',
    }),
    defineField({
      name: 'learnings',
      type: 'array',
      group: 'outcomes',
      of: [{ type: 'text', rows: 2 }],
    }),
    defineField({
      name: 'collaboration',
      type: 'collaboration',
      group: 'outcomes',
    }),

    /* ── Structure (optional override) ── */
    defineField({
      name: 'chapters',
      type: 'array',
      group: 'structure',
      of: [{ type: 'chapter' }],
      description:
        'Optional. Leave empty to use the default 6-chapter spine (Overview · Tension · Insight · The Move · Proof · Lesson).',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'company', media: 'cover' },
  },
});
