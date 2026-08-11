import { defineType, defineField } from 'sanity';

export const expertDecision = defineType({
  name: 'expertDecision',
  title: 'Expert Decision',
  type: 'object',
  fields: [
    defineField({ name: 'decision', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'rationale', type: 'text', rows: 3, validation: (R) => R.required() }),
    defineField({
      name: 'rejected',
      type: 'text',
      rows: 3,
      description: 'Format: "Rejected name: explanation"',
    }),
  ],
  preview: {
    select: { title: 'decision', subtitle: 'rationale' },
    prepare: ({ title, subtitle }) => ({
      title,
      subtitle: subtitle ? subtitle.slice(0, 80) : '',
    }),
  },
});
