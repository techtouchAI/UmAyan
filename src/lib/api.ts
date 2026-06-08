import { SiteSettings, Category, Post } from './types';
import fs from 'fs';
import path from 'path';

const postsDirectory = path.join(process.cwd(), 'content/posts');
const settingsFile = path.join(process.cwd(), 'content/settings.json');

const defaultSettings: SiteSettings = {
  profileImage: "",
  siteName: "الاستشارات النفسية",
  siteDescription: "منصة ويب متطورة لتقديم الاستشارات النفسية والتوجيه الأسري بأسلوب علمي ومريح.",
  floatingButton: {
    iconType: "whatsapp",
    linkOrPhone: "",
    enabled: false,
  },
  socialLinks: [],
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    if (fs.existsSync(settingsFile)) {
      const fileContents = fs.readFileSync(settingsFile, 'utf8');
      const settings = JSON.parse(fileContents);
      return {
        ...defaultSettings,
        ...settings,
        floatingButton: {
          ...defaultSettings.floatingButton,
          ...(settings.floatingButton || {})
        },
        socialLinks: settings.socialLinks || []
      };
    }
  } catch (error) {
    console.error("Error reading settings.json:", error);
  }
  return defaultSettings;
}

export async function getCategories(): Promise<Category[]> {
  const settings = await getSiteSettings();
  const cats = settings.categories || ["استشارات أسرية", "قلق", "اكتئاب", "تطوير الذات"];

  // Format to match the Category interface required by the frontend
  return [
    { title: "الكل", slug: "all" },
    ...cats.map(cat => ({ title: cat, slug: encodeURIComponent(cat).toLowerCase() }))
  ];
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
