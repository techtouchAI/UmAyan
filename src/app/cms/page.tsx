"use client";

import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { fetchGithubPosts, saveGithubPost, deleteGithubPost, fetchGithubSettings, saveGithubSettings } from "@/lib/github";
import type { CMSPost } from "@/lib/github";
import type { SiteSettings } from "@/lib/types";
import Login from "@/components/cms/Login";
import Dashboard from "@/components/cms/Dashboard";
import Editor from "@/components/cms/Editor";
import SettingsEditor from "@/components/cms/SettingsEditor";

export default function CMSPage() {
  const [token, setToken] = useState<string | null>(null);
  const [posts, setPosts] = useState<CMSPost[]>([]);
  const [settingsData, setSettingsData] = useState<{ settings: SiteSettings; sha: string } | null>(null);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [editingPost, setEditingPost] = useState<CMSPost | null>(null);
  const [isSavingPost, setIsSavingPost] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "settings">("posts");

  useEffect(() => {
    const savedToken = sessionStorage.getItem("github_token");
    if (savedToken && !token) {
      setTimeout(() => setToken(savedToken), 0);
    }
  }, [token]);

  const loadPosts = async (authToken: string) => {
    setIsLoadingPosts(true);
    try {
      const data = await fetchGithubPosts(authToken);
      setPosts(data);
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير معروف";
      toast.error(`فشل في تحميل المنشورات: ${errorMessage}`);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const loadSettings = async (authToken: string) => {
    setIsLoadingSettings(true);
    try {
      const data = await fetchGithubSettings(authToken);
      if (data) setSettingsData(data);
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير معروف";
      toast.error(`فشل في تحميل الإعدادات: ${errorMessage}`);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  useEffect(() => {
    if (token) {
      const timeoutId = setTimeout(() => {
        loadPosts(token);
        loadSettings(token);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [token]);

  const handleLogin = (newToken: string) => {
    sessionStorage.setItem("github_token", newToken);
    setToken(newToken);
    toast.success("تم تسجيل الدخول بنجاح");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("github_token");
    setToken(null);
    setPosts([]);
    setSettingsData(null);
    setEditingPost(null);
    toast.success("تم تسجيل الخروج");
  };

  const handleSavePost = async (post: CMSPost) => {
    if (!token) return;

    setIsSavingPost(true);
    try {
      await saveGithubPost(token, post);
      toast.success("تم حفظ المنشور بنجاح!");
      setEditingPost(null);
      loadPosts(token);
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير معروف";
      toast.error(`فشل في حفظ المنشور: ${errorMessage}`);
    } finally {
      setIsSavingPost(false);
    }
  };

  const handleDeletePost = async (post: CMSPost) => {
    if (!token) return;
    if (!window.confirm(`هل أنت متأكد من حذف ${post.title}؟`)) return;

    try {
      await deleteGithubPost(token, post);
      toast.success("تم حذف المنشور بنجاح!");
      loadPosts(token);
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير معروف";
      toast.error(`فشل في حذف المنشور: ${errorMessage}`);
    }
  };

  const handleSaveSettings = async (newSettings: SiteSettings) => {
    if (!token) return;
    try {
      await saveGithubSettings(token, newSettings, settingsData?.sha);
      toast.success("تم حفظ الإعدادات بنجاح!");
      loadSettings(token); // Reload to get new SHA
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير معروف";
      toast.error(`فشل في حفظ الإعدادات: ${errorMessage}`);
    }
  };

  if (!token) {
    return (
      <>
        <Toaster position="top-center" reverseOrder={false} />
        <Login onLogin={handleLogin} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white" dir="rtl">
      <Toaster position="top-center" reverseOrder={false} />
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
            <div className="flex justify-between items-center w-full sm:w-auto">
              <h1 className="text-xl font-bold text-primary">لوحة التحكم</h1>
              <button
                onClick={handleLogout}
                className="sm:hidden text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              >
                تسجيل الخروج
              </button>
            </div>
            <nav className="flex gap-2 sm:gap-4 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-hide">
              <button
                onClick={() => { setActiveTab("posts"); setEditingPost(null); }}
                className={`text-sm font-medium px-4 py-2 rounded-md transition-colors whitespace-nowrap flex-1 sm:flex-none ${
                  activeTab === "posts"
                    ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                المنشورات
              </button>
              <button
                onClick={() => { setActiveTab("settings"); setEditingPost(null); }}
                className={`text-sm font-medium px-4 py-2 rounded-md transition-colors whitespace-nowrap flex-1 sm:flex-none ${
                  activeTab === "settings"
                    ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                الإعدادات
              </button>
            </nav>
          </div>
          <button
            onClick={handleLogout}
            className="hidden sm:block text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors whitespace-nowrap"
          >
            تسجيل الخروج
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "posts" ? (
          editingPost ? (
            <Editor
              initialPost={editingPost}
              onSave={handleSavePost}
              onCancel={() => setEditingPost(null)}
              isSaving={isSavingPost}
              token={token}
            />
          ) : (
            <Dashboard
              posts={posts}
              isLoading={isLoadingPosts}
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
          )
        ) : (
          isLoadingSettings ? (
            <div className="text-center py-12">جاري تحميل الإعدادات...</div>
          ) : (
            <SettingsEditor
              initialSettings={settingsData?.settings || null}
              onSave={handleSaveSettings}
              token={token}
            />
          )
        )}
      </main>
    </div>
  );
}
