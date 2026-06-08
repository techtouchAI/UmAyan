"use client";

import React from "react";
import type { CMSPost } from "@/lib/github";

interface DashboardProps {
  posts: CMSPost[];
  isLoading: boolean;
  onCreateNew: () => void;
  onEdit: (post: CMSPost) => void;
  onDelete: (post: CMSPost) => void;
}

export default function Dashboard({ posts, isLoading, onCreateNew, onEdit, onDelete }: DashboardProps) {
  return (
    <div dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">إدارة المنشورات</h2>
        <button
          onClick={onCreateNew}
          className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          إضافة منشور جديد
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">جاري تحميل المنشورات...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400">لا توجد منشورات حالياً.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.slug} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-full">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2 flex-grow">{post.title}</h3>
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex gap-2 items-center">
                <span className="inline-block bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                  {post.category || 'غير مصنف'}
                </span>
                <span className="inline-block py-1 truncate text-xs" title={post.fileName} dir="ltr">
                  {post.fileName}
                </span>
              </div>
              <div className="flex justify-end gap-3 mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => onEdit(post)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  تعديل
                </button>
                <button
                  onClick={() => onDelete(post)}
                  className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
