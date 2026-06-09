import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { SiteSettings } from '@/lib/types';
import { ThemeToggle } from '../ui/ThemeToggle';

interface HeaderProps {
  settings: SiteSettings;
}

export function Header({ settings }: HeaderProps) {
  return (
    <header className="w-full mb-12 border-b border-slate-100 dark:border-slate-800 relative bg-white dark:bg-[#0a0a0a]">
      {/* Cover Image */}
      <div className="relative w-full h-24 md:h-32 bg-slate-200 dark:bg-slate-800">
        {settings.coverImage ? (
          <Image
            src={settings.coverImage}
            alt="صورة الغلاف"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700"></div>
        )}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/80 dark:bg-black/60 backdrop-blur-md rounded-full p-1 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
          <Link
            href="/"
            className="p-2 rounded-full text-slate-700 hover:text-primary hover:bg-slate-100 dark:text-slate-300 dark:hover:text-primary dark:hover:bg-slate-800 transition-colors"
            aria-label="الرئيسية"
          >
            <Home className="w-5 h-5" />
          </Link>
          <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-600"></div>
          <ThemeToggle />
        </div>
      </div>

      {/* Profile Info Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-end pb-6">
          {/* Profile Image (Overlapping, on the right in RTL) */}
          <div className="-mt-12 sm:-mt-16 relative z-10 ml-0 sm:ml-6 mb-3 sm:mb-0">
            <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white dark:border-[#0a0a0a] bg-white dark:bg-[#0a0a0a] shadow-md">
              <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                {settings.profileImage && (
                  <Image
                    src={settings.profileImage}
                    alt={settings.siteName || "الصورة الشخصية"}
                    fill
                    sizes="(max-width: 640px) 80px, 128px"
                    className="object-cover"
                    priority
                  />
                )}
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-start flex-1 pt-1 sm:pt-2">
            <Link href="/">
              <h1 className="text-xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 hover:text-primary transition-colors mb-1 sm:mb-2 cursor-pointer">
                {settings.siteName}
              </h1>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-2xl">
              {settings.siteDescription}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
