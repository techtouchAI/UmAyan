import { client } from '../sanity/lib/client';
import { SiteSettings, Category, Post } from './types';

const mockSiteSettings: SiteSettings = {
  profileImage: "https://i.pravatar.cc/150?img=11",
  siteName: "الاستشارات النفسية",
  siteDescription: "منصة ويب متطورة لتقديم الاستشارات النفسية والتوجيه الأسري بأسلوب علمي ومريح.",
  floatingButton: {
    iconType: "phone",
    linkOrPhone: "+1234567890",
    enabled: true,
  },
  socialLinks: [
    { platformName: "Facebook", link: "https://facebook.com", icon: "facebook" },
    { platformName: "Twitter", link: "https://twitter.com", icon: "twitter" },
  ],
};

const mockCategories: Category[] = [
  { title: "الكل", slug: "all" },
  { title: "قلق", slug: "anxiety" },
  { title: "استشارات أسرية", slug: "family" },
  { title: "اكتئاب", slug: "depression" },
];

const mockPosts: Post[] = Array.from({ length: 25 }).map((_, i) => ({
  portraitImage: `https://picsum.photos/seed/${i + 1}/400/500`,
  title: `منشور تجريبي رقم ${i + 1} عن الصحة النفسية`,
  slug: `test-post-${i + 1}`,
  category: i % 3 === 0 ? "anxiety" : i % 2 === 0 ? "family" : "depression",
  bodyContent: [
    {
      _type: 'block',
      children: [{ _type: 'span', text: 'هذا محتوى المنشور التجريبي في Sanity Portable Text.' }],
    }
  ],
  conclusion: "في الختام، الصحة النفسية هي الأساس لبناء حياة متوازنة وسعيدة.",
  seoMetaTitle: `منشور تجريبي رقم ${i + 1}`,
  seoMetaDescription: `وصف موجز للمنشور التجريبي رقم ${i + 1} يظهر في محركات البحث.`,
}));

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your-project-id') {
    return mockSiteSettings;
  }
  try {
    const data = await client.fetch(`*[_type == "siteSettings"][0]{
      siteName,
      siteDescription,
      "profileImage": profileImage.asset->url,
      floatingButton,
      socialLinks
    }`);
    return data || mockSiteSettings;
  } catch {
    return mockSiteSettings;
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your-project-id') {
    return mockCategories;
  }
  try {
    const data = await client.fetch(`*[_type == "category"]{
      title,
      "slug": slug.current
    }`);
    return data?.length > 0 ? data : mockCategories;
  } catch {
    return mockCategories;
  }
}

export async function getPosts(): Promise<Post[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your-project-id') {
    return mockPosts;
  }
  try {
    const data = await client.fetch(`*[_type == "post"]{
      title,
      "slug": slug.current,
      "category": category->slug.current,
      "portraitImage": portraitImage.asset->url,
      bodyContent,
      conclusion,
      seoMetaTitle,
      seoMetaDescription
    }`);
    return data || mockPosts;
  } catch {
    return mockPosts;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your-project-id') {
    return mockPosts.find(p => p.slug === slug);
  }
  try {
    const data = await client.fetch(`*[_type == "post" && slug.current == $slug][0]{
      title,
      "slug": slug.current,
      "category": category->slug.current,
      "portraitImage": portraitImage.asset->url,
      bodyContent,
      conclusion,
      seoMetaTitle,
      seoMetaDescription
    }`, { slug });
    return data || mockPosts.find(p => p.slug === slug);
  } catch {
    return mockPosts.find(p => p.slug === slug);
  }
}
