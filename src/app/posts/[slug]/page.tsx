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
    <article className="max-w-3xl mx-auto w-full px-4 sm:px-6 relative">
      <div className="mb-6 inline-flex">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors font-medium bg-slate-100 dark:bg-slate-800/50 py-2 px-4 rounded-full"
        >
          <ArrowRight className="w-4 h-4" />
          <span>رجوع</span>
        </Link>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-8 leading-tight">
        {post.title}
      </h1>

      <div className="relative w-full aspect-[4/5] max-w-lg mx-auto mb-10 overflow-hidden rounded-xl shadow-md">
        <Image
          src={post.portraitImage}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 500px"
          className="object-cover"
          priority
        />
      </div>

      <div className="prose prose-slate dark:prose-invert prose-a:text-primary hover:prose-a:text-primary/80 prose-a:no-underline prose-a:transition-colors max-w-none text-lg leading-relaxed mb-10">
        <ReactMarkdown>{post.bodyContent}</ReactMarkdown>
      </div>

      {post.subSections && post.subSections.length > 0 && (
        <div className="space-y-8 mb-10">
          {post.subSections.map((section, index) => {
            const colorClass = section.color === "red" ? "color-red" :
                               section.color === "cyan" ? "color-cyan" :
                               section.color === "gold" ? "color-gold" : "";

            return (
              <div key={index} className="flex flex-col gap-3">
                {section.title && (
                  <h2 className={`text-2xl font-bold ${colorClass} transition-colors`}>
                    {section.title}
                  </h2>
                )}
                <div className="prose prose-slate dark:prose-invert prose-a:text-primary hover:prose-a:text-primary/80 prose-a:no-underline max-w-none leading-relaxed">
                  <ReactMarkdown>{section.content}</ReactMarkdown>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {post.conclusion && (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-100 dark:border-slate-800 mb-10">
          <p className="text-slate-800 dark:text-slate-200 font-medium">
            {post.conclusion}
          </p>
        </div>
      )}

      {post.links && post.links.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-100 dark:border-slate-800 mb-10 space-y-4">
          <h3 className="text-xl font-bold mb-4">روابط ذات صلة</h3>
          <ul className="space-y-2">
            {post.links.map((link, index) => (
              <li key={index}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 font-medium underline transition-colors"
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
                <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors line-clamp-2">
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
