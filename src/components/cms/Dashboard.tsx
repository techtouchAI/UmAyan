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
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Posts</h2>
        <button
          onClick={onCreateNew}
          className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Create New Post
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400">No posts found.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.slug} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{post.title}</h3>
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex gap-2">
                <span className="inline-block bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                  {post.category}
                </span>
                <span className="inline-block py-1 truncate" title={post.fileName}>
                  {post.fileName}
                </span>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => onEdit(post)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(post)}
                  className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}