"use client";

import React, { useState } from "react";
import type { CMSPost } from "@/lib/github";

interface EditorProps {
  initialPost: CMSPost;
  onSave: (post: CMSPost) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

export default function Editor({ initialPost, onSave, onCancel, isSaving }: EditorProps) {
  const [post, setPost] = useState<CMSPost>(initialPost);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(post);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{post.sha ? "Edit Post" : "Create New Post"}</h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          Cancel
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              required
              type="text"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              required
              type="text"
              value={post.slug}
              disabled={!!post.sha}
              onChange={(e) => setPost({ ...post, slug: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              required
              type="text"
              value={post.category}
              onChange={(e) => setPost({ ...post, category: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Portrait Image URL</label>
            <input
              required
              type="url"
              value={post.portraitImage}
              onChange={(e) => setPost({ ...post, portraitImage: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Body Content (Markdown)</label>
            <textarea
              required
              rows={8}
              value={post.bodyContent}
              onChange={(e) => setPost({ ...post, bodyContent: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 font-mono text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Conclusion</label>
            <textarea
              rows={3}
              value={post.conclusion}
              onChange={(e) => setPost({ ...post, conclusion: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SEO Title</label>
            <input
              type="text"
              value={post.seoMetaTitle}
              onChange={(e) => setPost({ ...post, seoMetaTitle: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SEO Description</label>
            <input
              type="text"
              value={post.seoMetaDescription}
              onChange={(e) => setPost({ ...post, seoMetaDescription: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700"
            />
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Post"}
          </button>
        </div>
      </form>
    </div>
  );
}