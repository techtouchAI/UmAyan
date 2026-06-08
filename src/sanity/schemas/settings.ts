import { defineField, defineType } from 'sanity';

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'floatingButton',
      title: 'Floating Button Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'iconType',
          title: 'Icon Type (e.g. phone, whatsapp)',
          type: 'string',
        }),
        defineField({
          name: 'linkOrPhone',
          title: 'Link or Phone Number',
          type: 'string',
        }),
        defineField({
          name: 'enabled',
          title: 'Enabled',
          type: 'boolean',
          initialValue: true,
        }),
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'platformName', title: 'Platform Name', type: 'string' }),
            defineField({ name: 'link', title: 'Link', type: 'url' }),
            defineField({ name: 'icon', title: 'Icon (e.g. facebook, twitter)', type: 'string' }),
          ],
        },
      ],
    }),
  ],
});
