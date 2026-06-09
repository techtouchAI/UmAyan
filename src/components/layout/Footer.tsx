import React from 'react';
import { SiteSettings } from '@/lib/types';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Send, MessageCircle, Link as LinkIcon } from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
}

const iconMap: Record<string, React.ReactNode> = {
  facebook: <Facebook className="w-5 h-5" />,
  twitter: <Twitter className="w-5 h-5" />,
  instagram: <Instagram className="w-5 h-5" />,
  linkedin: <Linkedin className="w-5 h-5" />,
  youtube: <Youtube className="w-5 h-5" />,
  telegram: <Send className="w-5 h-5" />,
  whatsapp: <MessageCircle className="w-5 h-5" />,
};

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-8 mt-12 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-6">
      <div className="flex gap-4">
        {settings.socialLinks.map((social, idx) => (
          <a
            key={idx}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-primary hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-primary transition-colors"
            aria-label={social.platformName}
          >
            {iconMap[social.icon.toLowerCase()] || <LinkIcon className="w-5 h-5" />}
          </a>
        ))}
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        &copy; {currentYear} {settings.siteName}. جميع الحقوق محفوظة.
      </p>
    </footer>
  );
}
