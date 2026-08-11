import { defineType, defineField } from 'sanity';

export const criticalPhase = defineType({
  name: 'criticalPhase',
  title: 'Critical Process Phase',
  type: 'object',
  fields: [
    defineField({
      name: 'n',
      type: 'string',
      title: 'Phase Number',
      description: 'e.g. 01, 02',
      validation: (R) => R.required(),
    }),
    defineField({ name: 'name', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'action', type: 'text', rows: 3, validation: (R) => R.required() }),
    defineField({ name: 'question', type: 'text', rows: 2, validation: (R) => R.required() }),
    defineField({
      name: 'methods',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (R) => R.min(1),
    }),
    defineField({ name: 'output', type: 'text', rows: 3, validation: (R) => R.required() }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'n' },
    prepare: ({ title, subtitle }) => ({ title, subtitle: subtitle ? `Phase ${subtitle}` : '' }),
  },
});
