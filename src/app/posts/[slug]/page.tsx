import { getPostBySlug, getPosts } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { ArrowRight } from "lucide-react";
import { fontsMap } from "@/lib/fonts";

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
          className="inline-flex items-center gap-2 text-slate-900 hover:text-primary dark:text-white dark:hover:text-primary transition-colors font-medium bg-slate-100 dark:bg-slate-800/50 py-2 px-4 rounded-full"
        >
          <ArrowRight className="w-4 h-4" />
          <span>رجوع</span>
        </Link>
      </div>

      {/* Title Container */}
      <div className="bg-white dark:bg-slate-800/80 shadow-sm border border-slate-100 dark:border-slate-700/50 rounded-3xl p-6 sm:p-10 mb-8 backdrop-blur-sm">
        <h1
          className={`text-center text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight ${post.titleColor === 'red' ? 'text-red-600 dark:text-red-400' : post.titleColor === 'cyan' ? 'text-cyan-600 dark:text-cyan-400' : post.titleColor === 'gold' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}
          style={{ fontFamily: fontsMap[post.titleFont || 'Amiri'] }}
        >
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
        <div
          className="prose prose-slate dark:prose-invert prose-p:leading-loose prose-p:mb-8 prose-headings:mb-6 prose-h1:text-3xl sm:prose-h1:text-4xl lg:prose-h1:text-5xl prose-h2:text-2xl sm:prose-h2:text-3xl lg:prose-h2:text-4xl prose-h3:text-xl sm:prose-h3:text-2xl lg:prose-h3:text-3xl prose-a:text-primary hover:prose-a:text-primary/80 prose-a:underline prose-a:underline-offset-4 prose-a:transition-colors max-w-none text-base sm:text-lg leading-loose mb-10 text-slate-900 dark:text-white"
          style={{ fontFamily: fontsMap[post.contentFont || 'Amiri'] }}
        >
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>{post.bodyContent}</ReactMarkdown>
        </div>
        {post.subSections && post.subSections.length > 0 && (
          <div className="space-y-10 mb-10 border-t border-slate-100 dark:border-slate-700 pt-8 mt-8">
            {post.subSections.map((section, index) => {
              const colorClass = section.color === "red" ? "color-red" :
                                 section.color === "cyan" ? "color-cyan" :
                                 section.color === "gold" ? "color-gold" : "text-slate-900 dark:text-white";

              return (
                <div key={index} className="flex flex-col gap-4">
                  {section.title && (
                    <h2
                      className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${colorClass} transition-colors`}
                      style={{ fontFamily: fontsMap[post.titleFont || 'Amiri'] }}
                    >
                      {section.title}
                    </h2>
                  )}
                  <div
                    className="prose prose-slate dark:prose-invert prose-p:leading-loose prose-p:mb-8 prose-headings:mb-6 prose-h1:text-3xl sm:prose-h1:text-4xl lg:prose-h1:text-5xl prose-h2:text-2xl sm:prose-h2:text-3xl lg:prose-h2:text-4xl prose-h3:text-xl sm:prose-h3:text-2xl lg:prose-h3:text-3xl prose-a:text-primary hover:prose-a:text-primary/80 prose-a:underline prose-a:underline-offset-4 prose-a:transition-colors max-w-none text-base sm:text-lg leading-loose text-slate-900 dark:text-white"
                    style={{ fontFamily: fontsMap[post.contentFont || 'Amiri'] }}
                  >
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>{section.content}</ReactMarkdown>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {post.conclusion && (
        <div
          className="bg-white dark:bg-slate-800/80 shadow-sm border border-slate-100 dark:border-slate-700/50 rounded-3xl p-6 sm:p-10 mb-10"
          style={{ fontFamily: fontsMap[post.contentFont || 'Amiri'] }}
        >
          <p className="text-slate-900 dark:text-white font-medium text-base sm:text-lg leading-relaxed">
            {post.conclusion}
          </p>
        </div>
      )}

      {post.links && post.links.length > 0 && <RelatedLinks links={post.links} />}

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
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-primary transition-colors">
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
