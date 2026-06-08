"use client";

import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { fetchGithubPosts, saveGithubPost, deleteGithubPost } from "@/lib/github";
import type { CMSPost } from "@/lib/github";
import Login from "@/components/cms/Login";
import Dashboard from "@/components/cms/Dashboard";
import Editor from "@/components/cms/Editor";

export default function CMSPage() {
  const [token, setToken] = useState<string | null>(null);
  const [posts, setPosts] = useState<CMSPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingPost, setEditingPost] = useState<CMSPost | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Only set it on mount if not already set, avoiding direct sync triggers
    const savedToken = sessionStorage.getItem("github_token");
    if (savedToken && !token) {
      setTimeout(() => setToken(savedToken), 0);
    }
  }, [token]);

  const loadPosts = async (authToken: string) => {
    setIsLoading(true);
    try {
      const data = await fetchGithubPosts(authToken);
      setPosts(data);
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(error.message || "Failed to load posts");
      } else {
        toast.error("Failed to load posts");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      // Defer execution slightly to avoid synchronous setState trigger warning
      const timeoutId = setTimeout(() => loadPosts(token), 0);
      return () => clearTimeout(timeoutId);
    }
  }, [token]);

  const handleLogin = (newToken: string) => {
    sessionStorage.setItem("github_token", newToken);
    setToken(newToken);
    toast.success("Token saved successfully");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("github_token");
    setToken(null);
    setPosts([]);
    setEditingPost(null);
    toast.success("Logged out");
  };

  const handleSavePost = async (post: CMSPost) => {
    if (!token) return;

    setIsSaving(true);
    try {
      await saveGithubPost(token, post);
      toast.success("Post saved successfully!");
      setEditingPost(null);
      loadPosts(token);
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(error.message || "Failed to save post");
      } else {
        toast.error("Failed to save post");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePost = async (post: CMSPost) => {
    if (!token) return;
    if (!window.confirm(`Are you sure you want to delete ${post.title}?`)) return;

    try {
      await deleteGithubPost(token, post);
      toast.success("Post deleted successfully!");
      loadPosts(token);
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(error.message || "Failed to delete post");
      } else {
        toast.error("Failed to delete post");
      }
    }
  };

  if (!token) {
    return (
      <>
        <Toaster />
        <Login onLogin={handleLogin} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
      <Toaster />
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Custom CMS</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {editingPost ? (
          <Editor
            initialPost={editingPost}
            onSave={handleSavePost}
            onCancel={() => setEditingPost(null)}
            isSaving={isSaving}
          />
        ) : (
          <Dashboard
            posts={posts}
            isLoading={isLoading}
            onCreateNew={() => setEditingPost({
              title: "",
              slug: "",
              portraitImage: "",
              category: "",
              bodyContent: "",
              conclusion: "",
              seoMetaTitle: "",
              seoMetaDescription: "",
            })}
            onEdit={setEditingPost}
            onDelete={handleDeletePost}
          />
        )}
      </main>
    </div>
  );
}