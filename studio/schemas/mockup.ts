import { defineType, defineField } from 'sanity';

export const mockup = defineType({
  name: 'mockup',
  title: 'Mockup',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
      validation: (R) => R.required(),
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          validation: (R) => R.required(),
        }),
      ],
    }),
    defineField({ name: 'note', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'caption',
      type: 'string',
      description: 'Optional short caption shown above the mockup',
    }),
  ],
  preview: {
    select: { title: 'note', media: 'image' },
  },
});
