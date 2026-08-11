import { defineType, defineField } from 'sanity';

export const chapter = defineType({
  name: 'chapter',
  title: 'Chapter',
  type: 'object',
  fields: [
    defineField({ name: 'id', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'num', type: 'string', description: 'e.g. 01' }),
    defineField({ name: 'roman', type: 'string', description: 'e.g. I' }),
    defineField({ name: 'label', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'beat', type: 'string', description: 'Short italic beat under the title' }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'num' },
    prepare: ({ title, subtitle }) => ({ title, subtitle: subtitle ? `Chapter ${subtitle}` : '' }),
  },
});
