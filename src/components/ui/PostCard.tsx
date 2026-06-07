import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/cms/schemas';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.slug}`} className="group block h-full">
      <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image
            src={post.portraitImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between">
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
            {post.title}
          </h3>
          <span className="inline-block mt-2 text-sm text-primary dark:text-primary font-medium">
            قراءة المزيد &larr;
          </span>
        </div>
      </div>
    </Link>
  );
}
