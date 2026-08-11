import { defineType, defineField } from 'sanity';

export const metricSnapshot = defineType({
  name: 'metricSnapshot',
  title: 'Metric Snapshot',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'before', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'after', type: 'string', validation: (R) => R.required() }),
  ],
  preview: {
    select: { title: 'label', before: 'before', after: 'after' },
    prepare: ({ title, before, after }) => ({ title, subtitle: `${before} → ${after}` }),
  },
});
