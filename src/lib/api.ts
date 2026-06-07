import fs from 'fs';
import path from 'path';
import { SiteSettings, Category, Post } from '../cms/schemas';

const contentDir = path.join(process.cwd(), 'content');

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const filePath = path.join(contentDir, 'settings', 'general.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent) as SiteSettings;
  } catch {
    // Fallback if not found
    return {
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
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const categoriesDir = path.join(contentDir, 'categories');
    const fileNames = fs.readdirSync(categoriesDir);
    return fileNames
      .filter(fileName => fileName.endsWith('.json'))
      .map(fileName => {
        const filePath = path.join(categoriesDir, fileName);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent) as Category;
      });
  } catch {
    return [
      { title: "الكل", slug: "all" },
      { title: "قلق", slug: "anxiety" },
    ];
  }
}

export async function getPosts(): Promise<Post[]> {
  try {
    const postsDir = path.join(contentDir, 'posts');
    const fileNames = fs.readdirSync(postsDir);
    return fileNames
      .filter(fileName => fileName.endsWith('.json'))
      .map(fileName => {
        const filePath = path.join(postsDir, fileName);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent) as Post;
      });
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  try {
    const filePath = path.join(contentDir, 'posts', `${slug}.json`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent) as Post;
  } catch {
    return undefined;
  }
}
