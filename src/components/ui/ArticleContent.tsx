"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { FontResizer } from "./FontResizer";
import { fontsMap } from "@/lib/fonts";

interface SubSection {
  title: string;
  color: 'red' | 'cyan' | 'gold' | 'default';
  content: string;
}

interface ArticleContentProps {
  contentFont?: string;
  titleFont?: string;
  bodyContent: string;
  subSections?: SubSection[];
  conclusion?: string;
}

export function ArticleContent({
  contentFont,
  titleFont,
  bodyContent,
  subSections,
  conclusion
}: ArticleContentProps) {
  const [fontScale, setFontScale] = useState(1);

  // Helper style applying dynamic font scaling
  const dynamicStyle = {
    fontFamily: fontsMap[contentFont || 'Amiri'],
    fontSize: `${fontScale}rem`,
    lineHeight: fontScale > 1.2 ? '2.2' : '2'
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <FontResizer onResize={setFontScale} />
      </div>

      <div className="bg-white dark:bg-slate-800/80 shadow-sm border border-slate-100 dark:border-slate-700/50 rounded-3xl p-6 sm:p-10 mb-10">
        <div
          className="prose prose-slate dark:prose-invert prose-p:mb-8 prose-headings:mb-6 prose-h1:text-3xl sm:prose-h1:text-4xl lg:prose-h1:text-5xl prose-h2:text-2xl sm:prose-h2:text-3xl lg:prose-h2:text-4xl prose-h3:text-xl sm:prose-h3:text-2xl lg:prose-h3:text-3xl prose-a:text-primary hover:prose-a:text-primary/80 prose-a:underline prose-a:underline-offset-4 prose-a:transition-colors max-w-none mb-10 text-slate-900 dark:text-white"
          style={dynamicStyle}
        >
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>{bodyContent}</ReactMarkdown>
        </div>

        {subSections && subSections.length > 0 && (
          <div className="space-y-10 mb-10 border-t border-slate-100 dark:border-slate-700 pt-8 mt-8">
            {subSections.map((section, index) => {
              const colorClass = section.color === "red" ? "color-red" :
                                 section.color === "cyan" ? "color-cyan" :
                                 section.color === "gold" ? "color-gold" : "text-slate-900 dark:text-white";

              return (
                <div key={index} className="flex flex-col gap-4">
                  {section.title && (
                    <h2
                      className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${colorClass} transition-colors`}
                      style={{ fontFamily: fontsMap[titleFont || 'Amiri'] }}
                    >
                      {section.title}
                    </h2>
                  )}
                  <div
                    className="prose prose-slate dark:prose-invert prose-p:mb-8 prose-headings:mb-6 prose-h1:text-3xl sm:prose-h1:text-4xl lg:prose-h1:text-5xl prose-h2:text-2xl sm:prose-h2:text-3xl lg:prose-h2:text-4xl prose-h3:text-xl sm:prose-h3:text-2xl lg:prose-h3:text-3xl prose-a:text-primary hover:prose-a:text-primary/80 prose-a:underline prose-a:underline-offset-4 prose-a:transition-colors max-w-none text-slate-900 dark:text-white"
                    style={dynamicStyle}
                  >
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>{section.content}</ReactMarkdown>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {conclusion && (
        <div
          className="bg-white dark:bg-slate-800/80 shadow-sm border border-slate-100 dark:border-slate-700/50 rounded-3xl p-6 sm:p-10 mb-10"
          style={dynamicStyle}
        >
          <p className="text-slate-900 dark:text-white font-medium">
            {conclusion}
          </p>
        </div>
      )}
    </div>
  );
}
