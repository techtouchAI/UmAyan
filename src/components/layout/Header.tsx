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
    <header className="w-full border-b border-slate-100 dark:border-slate-800 relative bg-white dark:bg-[#0a0a0a]">
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
        <div className="fixed top-4 left-4 z-50 flex items-center gap-1.5 bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-full p-0.5 shadow-sm border border-slate-200/30 dark:border-slate-700/30">
          <Link
            href="/"
            className="p-1.5 rounded-full text-slate-700 hover:text-primary hover:bg-white/50 dark:text-slate-300 dark:hover:text-primary dark:hover:bg-black/50 transition-colors"
            aria-label="الرئيسية"
          >
            <Home className="w-4 h-4" />
          </Link>
          <div className="w-[1px] h-3 bg-slate-300/50 dark:bg-slate-600/50"></div>
          <div className="scale-75 origin-center -mx-1">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Profile Info Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-end pb-4 pt-0">
          {/* Profile Image (Overlapping, on the right in RTL) */}
          <div className="-mt-10 sm:-mt-14 relative z-10 ml-0 sm:ml-4 mb-2 sm:mb-0">
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
          <div className="text-start flex-1 pt-1">
            <Link href="/">
              <h1 className="text-lg sm:text-2xl font-bold hover:opacity-80 transition-opacity mb-0.5 cursor-pointer">
                <span className="color-red">{settings.siteName.split(' ')[0] || ''}</span>
                <span className="color-cyan"> {settings.siteName.split(' ')[1] || ''}</span>
                <span className="color-gold"> {settings.siteName.split(' ').slice(2).join(' ')}</span>
              </h1>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-2xl truncate">
              {settings.siteDescription}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
