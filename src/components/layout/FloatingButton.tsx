"use client";

import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { SiteSettings } from '@/cms/schemas';

interface FloatingButtonProps {
  settings: SiteSettings;
}

export function FloatingButton({ settings }: FloatingButtonProps) {
  if (!settings.floatingButton.enabled) return null;

  const isWhatsApp = settings.floatingButton.iconType.toLowerCase() === 'whatsapp';

  return (
    <a
      href={isWhatsApp ? `https://wa.me/${settings.floatingButton.linkOrPhone}` : `tel:${settings.floatingButton.linkOrPhone}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 p-4 rounded-full bg-primary text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-[pulse_2s_infinite]"
      aria-label="تواصل معنا"
    >
      {isWhatsApp ? (
        <MessageCircle className="w-6 h-6" />
      ) : (
        <Phone className="w-6 h-6" />
      )}
    </a>
  );
}
