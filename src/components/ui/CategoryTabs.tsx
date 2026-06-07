import React from 'react';
import { Category } from '@/cms/schemas';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export function CategoryTabs({ categories, selectedCategory, onSelectCategory }: CategoryTabsProps) {
  return (
    <div className="w-full overflow-x-auto hide-scrollbar mb-8">
      <div className="flex gap-2 min-w-max pb-2">
        {categories.map((category) => (
          <button
            key={category.slug}
            onClick={() => onSelectCategory(category.slug)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              selectedCategory === category.slug
                ? "bg-primary text-white dark:bg-primary/90"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            )}
          >
            {category.title}
          </button>
        ))}
      </div>
    </div>
  );
}
