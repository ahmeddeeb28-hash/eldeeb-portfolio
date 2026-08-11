import { defineType, defineField } from 'sanity';

export const collaboration = defineType({
  name: 'collaboration',
  title: 'Collaboration',
  type: 'object',
  fields: [
    defineField({
      name: 'teams',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (R) => R.min(1),
    }),
    defineField({
      name: 'outcome',
      type: 'text',
      rows: 3,
      validation: (R) => R.required(),
    }),
  ],
});
