import type { PortableTextBlock } from '@portabletext/types';

export interface SiteSettings {
  profileImage: string;
  siteName: string;
  siteDescription: string;
  floatingButton: {
    iconType: string;
    linkOrPhone: string;
    enabled: boolean;
  };
  socialLinks: {
    platformName: string;
    link: string;
    icon: string;
  }[];
}

export interface Category {
  title: string;
  slug: string;
}

export interface Post {
  portraitImage: string;
  title: string;
  slug: string;
  category: string;
  bodyContent: PortableTextBlock | PortableTextBlock[];
  conclusion: string;
  seoMetaTitle: string;
  seoMetaDescription: string;
}
