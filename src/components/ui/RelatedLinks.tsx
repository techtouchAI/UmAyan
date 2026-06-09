import React from 'react';
import { PostLink } from '@/lib/types';

interface RelatedLinksProps {
  links: PostLink[];
}

export function RelatedLinks({ links }: RelatedLinksProps) {
  if (!links || links.length === 0) return null;

  return (
    <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-6 sm:p-8 mb-10">
      <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-200">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        مراجع ومصادر خارجية
      </h3>
      <ul className="space-y-3 list-disc list-outside ms-4 marker:text-slate-400 dark:marker:text-slate-500">
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-medium text-sm sm:text-base transition-colors break-words underline underline-offset-4 decoration-primary/30 hover:decoration-primary/80"
            >
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
