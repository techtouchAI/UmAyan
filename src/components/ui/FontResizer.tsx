"use client";

import React, { useState, useEffect } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";

interface FontResizerProps {
  onResize: (scale: number) => void;
}

export function FontResizer({ onResize }: FontResizerProps) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    onResize(scale);
  }, [scale, onResize]);

  const handleIncrease = () => {
    setScale((prev) => Math.min(prev + 0.1, 1.5));
  };

  const handleDecrease = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.8));
  };

  return (
    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 py-1.5 px-3 rounded-full border border-slate-200 dark:border-slate-700">
      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1">Aa</span>
      <button
        onClick={handleIncrease}
        disabled={scale >= 1.5}
        className="p-1 rounded-full text-slate-700 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
        aria-label="تكبير الخط"
        title="تكبير الخط"
      >
        <ZoomIn className="w-4 h-4" />
      </button>
      <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-600"></div>
      <button
        onClick={handleDecrease}
        disabled={scale <= 0.8}
        className="p-1 rounded-full text-slate-700 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
        aria-label="تصغير الخط"
        title="تصغير الخط"
      >
        <ZoomOut className="w-4 h-4" />
      </button>
    </div>
  );
}
