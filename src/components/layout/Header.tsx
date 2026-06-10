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
    <header
      className={`w-full border-b border-slate-100 dark:border-slate-800 relative ${settings.headerBackgroundColor && settings.headerBackgroundColor !== 'default' && settings.headerBackgroundColor !== 'black' ? '' : 'bg-white dark:bg-[#0a0a0a]'}`}
      style={settings.headerBackgroundColor && settings.headerBackgroundColor !== 'default' && settings.headerBackgroundColor !== 'black' ? { backgroundColor: settings.headerBackgroundColor } : undefined}
    >
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-row items-start pb-2 pt-0 text-start">
          {/* Profile Image (Overlapping, on the right in RTL) */}
          <div className="-mt-10 sm:-mt-14 relative z-20 mb-0 ms-4 shrink-0">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white dark:border-[#0a0a0a] bg-black shadow-md">
              <div className="relative w-full h-full rounded-full overflow-hidden bg-black">
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
          <div className="flex-1 pt-2 w-full px-0">
            <Link href="/">
              <h1
                className={`text-xl sm:text-2xl font-bold hover:opacity-80 transition-opacity mb-1 cursor-pointer ${settings.siteNameColor && settings.siteNameColor !== 'default' && !['red', 'cyan', 'gold'].includes(settings.siteNameColor) ? '' : settings.siteNameColor === 'red' ? 'text-red-600 dark:text-red-400' : settings.siteNameColor === 'cyan' ? 'text-cyan-600 dark:text-cyan-400' : settings.siteNameColor === 'gold' ? 'text-amber-600 dark:text-amber-400' : settings.headerBackgroundColor && settings.headerBackgroundColor !== 'default' && settings.headerBackgroundColor !== 'black' && settings.headerBackgroundColor !== '#ffffff' ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}
                style={settings.siteNameColor && settings.siteNameColor !== 'default' && !['red', 'cyan', 'gold'].includes(settings.siteNameColor) ? { color: settings.siteNameColor } : undefined}
              >
                {settings.siteName}
              </h1>
            </Link>
            <p className={`font-medium text-xs sm:text-sm w-full ${settings.headerBackgroundColor && settings.headerBackgroundColor !== 'default' && settings.headerBackgroundColor !== 'black' && settings.headerBackgroundColor !== '#ffffff' ? 'text-slate-200' : 'text-slate-900 dark:text-slate-100'}`}>
              {settings.siteDescription}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
