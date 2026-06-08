import { getPostBySlug, getPosts } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { Metadata } from "next";
import ReactMarkdown from "react-markdown";

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
  try {
    post = await getPostBySlug(resolvedParams.slug);
  } catch {
    post = undefined;
  }

  if (!post) {
    notFound();
  }

  const siteUrl = "https://example.com";
  const postUrl = `${siteUrl}/posts/${post.slug}`;

  return (
    <article className="max-w-3xl mx-auto w-full px-4 sm:px-6">
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
    </article>
  );
}
