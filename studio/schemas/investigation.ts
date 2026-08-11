import { defineType, defineField } from 'sanity';

export const investigation = defineType({
  name: 'investigation',
  title: 'Investigation Card',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'tool',
      type: 'string',
      description: 'e.g. Amplitude, FullStory, Internal BI',
    }),
    defineField({ name: 'insight', type: 'text', rows: 4, validation: (R) => R.required() }),
  ],
  preview: { select: { title: 'title', subtitle: 'tool' } },
});
