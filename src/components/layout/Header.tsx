import React from 'react';
import Image from 'next/image';
import { SiteSettings } from '@/lib/types';
import { ThemeToggle } from '../ui/ThemeToggle';

interface HeaderProps {
  settings: SiteSettings;
}

export function Header({ settings }: HeaderProps) {
  return (
    <header className="w-full mb-12 border-b border-slate-100 dark:border-slate-800 relative bg-white dark:bg-[#0a0a0a]">
      {/* Cover Image */}
      <div className="relative w-full h-48 md:h-64 bg-slate-200 dark:bg-slate-800">
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
        <div className="absolute top-4 left-4 z-10">
          <ThemeToggle />
        </div>
      </div>

      {/* Profile Info Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-end pb-6">
          {/* Profile Image (Overlapping, on the right in RTL) */}
          <div className="-mt-16 sm:-mt-20 relative z-10 sm:ml-6 mb-4 sm:mb-0">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white dark:border-[#0a0a0a] bg-white dark:bg-[#0a0a0a] shadow-md">
              <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                {settings.profileImage && (
                  <Image
                    src={settings.profileImage}
                    alt={settings.siteName || "الصورة الشخصية"}
                    fill
                    sizes="(max-width: 640px) 96px, 128px"
                    className="object-cover"
                    priority
                  />
                )}
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center sm:text-right flex-1 pt-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              {settings.siteName}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto sm:mx-0">
              {settings.siteDescription}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
