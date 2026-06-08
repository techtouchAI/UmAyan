import { SiteSettings, Category, Post } from './types';
import fs from 'fs';
import path from 'path';

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

const postsDirectory = path.join(process.cwd(), 'content/posts');

export async function getSiteSettings(): Promise<SiteSettings> {
  return mockSiteSettings;
}

export async function getCategories(): Promise<Category[]> {
  return mockCategories;
}

export async function getPosts(): Promise<Post[]> {
  try {
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }
    const fileNames = fs.readdirSync(postsDirectory);
    const posts: Post[] = fileNames
      .filter((fileName) => fileName.endsWith('.json'))
      .map((fileName) => {
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        return JSON.parse(fileContents) as Post;
      });
    return posts;
  } catch (error) {
    console.error("Error reading posts:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.json`);
    if (!fs.existsSync(fullPath)) {
      return undefined;
    }
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(fileContents) as Post;
  } catch (error) {
    console.error("Error reading post by slug:", error);
    return undefined;
  }
}
