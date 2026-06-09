export interface SiteSettings {
  coverImage?: string;
  profileImage: string;
  siteName: string;
  siteNameColor?: 'red' | 'cyan' | 'gold' | 'default';
  siteDescription: string;
  categories?: string[];
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

export interface PostLink {
  title: string;
  url: string;
}

export interface SubSection {
  title: string;
  color: 'red' | 'cyan' | 'gold' | 'default';
  content: string;
}

export interface Post {
  portraitImage: string;
  title: string;
  titleColor?: 'red' | 'cyan' | 'gold' | 'default';
  slug: string;
  category: string;
  bodyContent: string;
  subSections?: SubSection[];
  conclusion: string;
  seoMetaTitle: string;
  seoMetaDescription: string;
  links?: PostLink[];
}
