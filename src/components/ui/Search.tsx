"use client";

import React, { useState, useEffect } from 'react';
import { SearchIcon } from 'lucide-react';

interface SearchProps {
  onSearch: (query: string) => void;
}

export function Search({ onSearch }: SearchProps) {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  return (
    <div className="relative w-full max-w-md mx-auto mb-8">
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <SearchIcon className="w-5 h-5 text-slate-400" />
      </div>
      <input
        type="text"
        className="block w-full p-4 pr-10 text-sm text-slate-900 border border-slate-200 rounded-full bg-white focus:ring-primary focus:border-primary dark:bg-slate-800 dark:border-slate-700 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary shadow-sm"
        placeholder="ابحث عن استشارة، مقال، موضوع..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}
