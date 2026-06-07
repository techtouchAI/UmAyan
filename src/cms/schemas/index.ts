import { z } from 'zod';

export const SiteSettingsSchema = z.object({
  profileImage: z.string(),
  siteName: z.string(),
  siteDescription: z.string(),
  floatingButton: z.object({
    iconType: z.string(),
    linkOrPhone: z.string(),
    enabled: z.boolean(),
  }),
  socialLinks: z.array(z.object({
    platformName: z.string(),
    link: z.string(),
    icon: z.string(),
  })),
});

export const CategorySchema = z.object({
  title: z.string(),
  slug: z.string(),
});

export const PostSchema = z.object({
  portraitImage: z.string(),
  title: z.string(),
  slug: z.string(),
  category: z.string(), // slug of the category
  bodyContent: z.string(),
  conclusion: z.string(),
  seoMetaTitle: z.string(),
  seoMetaDescription: z.string(),
});

export type SiteSettings = z.infer<typeof SiteSettingsSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Post = z.infer<typeof PostSchema>;
