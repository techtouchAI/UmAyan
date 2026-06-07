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
import { SiteSettings, Category, Post } from '../cms/schemas';

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
  bodyContent: `
    <p>هذا هو محتوى المنشور التجريبي. يمكن أن يحتوي على <strong>نصوص غامقة</strong>، وقوائم، وعناوين فرعية.</p>
    <h2>عنوان فرعي</h2>
    <p>نص إضافي لتوضيح شكل المحتوى الطويل. <a href="#">هذا رابط تشعبي</a> داخل النص.</p>
    <ul>
      <li>عنصر قائمة أول</li>
      <li>عنصر قائمة ثاني</li>
    </ul>
  `,
  conclusion: "في الختام، الصحة النفسية هي الأساس لبناء حياة متوازنة وسعيدة.",
  seoMetaTitle: `منشور تجريبي رقم ${i + 1}`,
  seoMetaDescription: `وصف موجز للمنشور التجريبي رقم ${i + 1} يظهر في محركات البحث.`,
}));

export async function getSiteSettings(): Promise<SiteSettings> {
  return mockSiteSettings;
}

export async function getCategories(): Promise<Category[]> {
  return mockCategories;
}

export async function getPosts(): Promise<Post[]> {
  return mockPosts;
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  return mockPosts.find(p => p.slug === slug);
}
