import React from 'react';
import Image from 'next/image';
import { SiteSettings } from '@/cms/schemas';
import { ThemeToggle } from '../ui/ThemeToggle';

interface HeaderProps {
  settings: SiteSettings;
}

export function Header({ settings }: HeaderProps) {
  return (
    <header className="w-full pt-8 pb-12 px-4 flex flex-col items-center border-b border-slate-100 dark:border-slate-800 relative">
      <div className="absolute top-4 right-4 rtl:left-4 rtl:right-auto">
        <ThemeToggle />
      </div>

      <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-primary p-1">
        <div className="relative w-full h-full rounded-full overflow-hidden">
          <Image
            src={settings.profileImage}
            alt={settings.siteName}
            fill
            sizes="96px"
            className="object-cover"
            priority
          />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
        {settings.siteName}
      </h1>

      <p className="text-slate-500 dark:text-slate-400 text-sm text-center max-w-md">
        {settings.siteDescription}
      </p>
    </header>
  );
}
