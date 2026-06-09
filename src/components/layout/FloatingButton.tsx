"use client";

import React from 'react';
import { Phone, MessageCircle, Send, ArrowUp } from 'lucide-react';
import { SiteSettings } from '@/lib/types';
import { useState, useEffect } from 'react';

interface FloatingButtonProps {
  settings: SiteSettings;
}

export function FloatingButton({ settings }: FloatingButtonProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getContactLink = () => {
    const type = settings.floatingButton.iconType.toLowerCase();
    const link = settings.floatingButton.linkOrPhone;

    if (type === 'whatsapp') {
      return `https://wa.me/${link}`;
    } else if (type === 'telegram') {
      // Intent URL scheme fallback to play store/app store if not installed
      // For a web fallback, we can use t.me
      return `https://t.me/${link.replace('@', '')}`;
    }
    return `tel:${link}`;
  };

  const getContactIcon = () => {
    const type = settings.floatingButton.iconType.toLowerCase();
    if (type === 'whatsapp') return <MessageCircle className="w-6 h-6" />;
    if (type === 'telegram') return <Send className="w-6 h-6" />;
    return <Phone className="w-6 h-6" />;
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3">
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`p-3 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        aria-label="الرجوع للأعلى"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* Contact Button */}
      {settings.floatingButton.enabled && (
        <a
          href={getContactLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-full bg-primary text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-[pulse_2s_infinite]"
          aria-label="تواصل معنا"
        >
          {getContactIcon()}
        </a>
      )}
    </div>
  );
}
