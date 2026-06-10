"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Category, Post } from "@/lib/types";
import { Search } from "@/components/ui/Search";
import { CategoryTabs } from "@/components/ui/CategoryTabs";
import { PostCard } from "@/components/ui/PostCard";

interface HomePageClientProps {
  categories: Category[];
  initialPosts: Post[];
}

const POSTS_PER_PAGE = 20;

export function HomePageClient({ categories, initialPosts }: HomePageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  }, []);

  const handleSelectCategory = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentPage(1); // Reset to first page on new category
  };

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            JSON.stringify(post.bodyContent).toLowerCase().includes(searchQuery.toLowerCase());

      // Fix: decode the selectedCategory to match the raw post.category safely.
      let decodedSelectedCategory = selectedCategory;
      try {
        decodedSelectedCategory = decodeURIComponent(selectedCategory);
      } catch (e) {
        // Fallback in case of malformed URI
      }

      const matchesCategory = selectedCategory === "all" ||
                              post.category.trim().toLowerCase() === decodedSelectedCategory.trim().toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [initialPosts, searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="flex flex-col w-full">
      <Search onSearch={handleSearch} />
      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      {currentPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-900 dark:text-slate-100 font-medium">
          لا توجد منشورات تطابق بحثك.
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100 font-medium"
          >
            السابق
          </button>
          <span className="flex items-center text-sm text-slate-900 dark:text-slate-100 font-medium">
            صفحة {currentPage} من {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100 font-medium"
          >
            التالي
          </button>
        </div>
      )}
    </div>
  );
}
