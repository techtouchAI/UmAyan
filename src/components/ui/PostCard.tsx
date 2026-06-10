import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/types';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.slug}`} className="group block h-full">
      <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
        <div className="relative w-full overflow-hidden flex justify-center items-center">
          <Image
            src={post.portraitImage}
            alt={post.title}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white line-clamp-2">
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
