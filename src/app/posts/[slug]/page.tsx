import { getPostBySlug, getPosts } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { ArrowRight } from "lucide-react";

export async function generateStaticParams() {
  try {
    const posts = await getPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const post = await getPostBySlug(resolvedParams.slug);

    if (!post) {
      return {
        title: "Post Not Found",
      };
    }

    return {
      title: post.seoMetaTitle,
      description: post.seoMetaDescription,
      openGraph: {
        title: post.seoMetaTitle,
        description: post.seoMetaDescription,
        images: [
          {
            url: post.portraitImage,
            width: 400,
            height: 500,
            alt: post.title,
          },
        ],
      },
    };
  } catch {
    return { title: "Post Not Found" };
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;

  let post;
  let allPosts: Array<any> = [];
  try {
    post = await getPostBySlug(resolvedParams.slug);
    allPosts = await getPosts();
  } catch {
    post = undefined;
  }

  if (!post) {
    notFound();
  }

  const siteUrl = "https://example.com";
  const postUrl = `${siteUrl}/posts/${post.slug}`;

  // Get up to 5 random posts for the bottom section
  const otherPosts = allPosts.filter(p => p.slug !== post.slug);
  const randomPosts = [...otherPosts].sort(() => 0.5 - Math.random()).slice(0, 5);

  return (
    <article className="w-full relative">
      <div className="mb-6 inline-flex">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors font-medium bg-slate-100 dark:bg-slate-800/50 py-2 px-4 rounded-full"
        >
          <ArrowRight className="w-4 h-4" />
          <span>رجوع</span>
        </Link>
      </div>

      {/* Title Container */}
      <div className="bg-white dark:bg-slate-800/80 shadow-sm border border-slate-100 dark:border-slate-700/50 rounded-3xl p-6 sm:p-10 mb-8 backdrop-blur-sm">
        <h1 className={`text-center text-3xl sm:text-5xl font-extrabold leading-tight ${post.titleColor === 'red' ? 'color-red' : post.titleColor === 'cyan' ? 'color-cyan' : post.titleColor === 'gold' ? 'color-gold' : 'text-slate-900 dark:text-white'}`}>
          {post.title}
        </h1>
      </div>

      {/* Adaptive Image Container */}
      <div className="relative w-full mb-10 overflow-hidden rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700/50 flex justify-center bg-slate-50 dark:bg-[#0a0a0a]">
        <Image
          src={post.portraitImage}
          alt={post.title}
          width={1200}
          height={800}
          sizes="(max-width: 1024px) 100vw, 1200px"
          className="object-contain w-full h-auto max-h-[50vh]"
          priority
        />
      </div>

      {/* Main Content Container */}
      <div className="bg-white dark:bg-slate-800/80 shadow-sm border border-slate-100 dark:border-slate-700/50 rounded-3xl p-6 sm:p-10 mb-10">
        <div className="prose prose-slate dark:prose-invert prose-p:leading-loose prose-p:mb-8 prose-headings:mb-6 prose-a:text-primary hover:prose-a:text-primary/80 prose-a:underline prose-a:underline-offset-4 prose-a:transition-colors max-w-none text-base sm:text-lg leading-loose mb-10 text-slate-700 dark:text-slate-300">
          <ReactMarkdown>{post.bodyContent}</ReactMarkdown>
        </div>


      </div>

      {post.conclusion && (
        <div className="bg-white dark:bg-slate-800/80 shadow-sm border border-slate-100 dark:border-slate-700/50 rounded-3xl p-6 sm:p-10 mb-10">
          <p className="text-slate-800 dark:text-slate-200 font-medium text-base sm:text-lg leading-relaxed">
            {post.conclusion}
          </p>
        </div>
      )}

      {post.links && post.links.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-6 sm:p-8 mb-10">
          <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            مراجع ومصادر خارجية
          </h3>
          <ul className="space-y-3">
            {post.links.map((link, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0"></div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 font-medium text-sm sm:text-base transition-colors break-words underline underline-offset-4 decoration-primary/30 hover:decoration-primary/80"
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ShareButtons title={post.title} url={postUrl} />

      {randomPosts.length > 0 && (
        <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">اقرأ أيضاً</h3>
          <div className="flex flex-col gap-4">
            {randomPosts.map((rp) => (
              <Link
                key={rp.slug}
                href={`/posts/${rp.slug}`}
                className="flex items-center gap-4 group p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
              >
                <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 shadow-sm border border-slate-100 dark:border-slate-800">
                  <Image
                    src={rp.portraitImage}
                    alt={rp.title}
                    fill
                    sizes="80px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">
                  {rp.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
