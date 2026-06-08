"use client";

import React, { useState, useEffect } from "react";
import { uploadGithubFile } from "@/lib/github";
import type { SiteSettings } from "@/lib/types";

interface SettingsEditorProps {
  initialSettings: SiteSettings | null;
  onSave: (settings: SiteSettings) => Promise<void>;
  token: string;
}

const defaultSettings: SiteSettings = {
  profileImage: "",
  siteName: "",
  siteDescription: "",
  floatingButton: {
    iconType: "whatsapp",
    linkOrPhone: "",
    enabled: true,
  },
  socialLinks: [],
};

export default function SettingsEditor({ initialSettings, onSave, token }: SettingsEditorProps) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings || defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "cover" | "profile") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "cover") setIsUploadingCover(true);
    else setIsUploadingProfile(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const fileName = `${type}-${Date.now()}.${file.name.split('.').pop()}`;
        const path = `public/uploads/${fileName}`; // Keep images in public/uploads for direct access if possible or github relative

        const url = await uploadGithubFile(
          token,
          path,
          base64Data,
          `CMS: Upload ${type} image`
        );

        setSettings(prev => ({
          ...prev,
          [type === "cover" ? "coverImage" : "profileImage"]: url
        }));
      };
    } catch (error) {
      console.error(error);
      alert("فشل في رفع الصورة");
    } finally {
      if (type === "cover") setIsUploadingCover(false);
      else setIsUploadingProfile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(settings);
    } finally {
      setIsSaving(false);
    }
  };

  const addSocialLink = () => {
    setSettings(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platformName: "", link: "", icon: "Link" }]
    }));
  };

  const updateSocialLink = (index: number, field: string, value: string) => {
    const newLinks = [...settings.socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setSettings({ ...settings, socialLinks: newLinks });
  };

  const removeSocialLink = (index: number) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700" dir="rtl">
      <h2 className="text-2xl font-bold mb-6">إعدادات الموقع العامة</h2>

      {/* الصور */}
      <div className="space-y-4 border-b border-slate-200 dark:border-slate-700 pb-6">
        <h3 className="text-xl font-semibold">الصور</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">صورة الغلاف (Cover Image)</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={settings.coverImage || ""}
                onChange={(e) => setSettings({...settings, coverImage: e.target.value})}
                className="flex-1 px-4 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="رابط صورة الغلاف أو ارفع صورة"
              />
              <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 px-4 py-2 rounded border border-slate-300 dark:border-slate-600 flex items-center justify-center min-w-[100px]">
                {isUploadingCover ? "جاري الرفع..." : "رفع صورة"}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "cover")} disabled={isUploadingCover} />
              </label>
            </div>
            {settings.coverImage && (
              <img src={settings.coverImage} alt="Cover Preview" className="h-32 w-full object-cover rounded" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">الصورة الشخصية (Profile Image)</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={settings.profileImage}
                onChange={(e) => setSettings({...settings, profileImage: e.target.value})}
                className="flex-1 px-4 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="رابط الصورة الشخصية أو ارفع صورة"
                required
              />
              <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 px-4 py-2 rounded border border-slate-300 dark:border-slate-600 flex items-center justify-center min-w-[100px]">
                {isUploadingProfile ? "جاري الرفع..." : "رفع صورة"}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "profile")} disabled={isUploadingProfile} />
              </label>
            </div>
            {settings.profileImage && (
              <img src={settings.profileImage} alt="Profile Preview" className="h-24 w-24 object-cover rounded-full mx-auto" />
            )}
          </div>
        </div>
      </div>

      {/* النصوص الأساسية */}
      <div className="space-y-4 border-b border-slate-200 dark:border-slate-700 pb-6">
        <h3 className="text-xl font-semibold">معلومات الموقع</h3>

        <div>
          <label className="block text-sm font-medium mb-1">اسم الموقع</label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => setSettings({...settings, siteName: e.target.value})}
            className="w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="أدخل اسم الموقع"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">وصف الموقع</label>
          <textarea
            value={settings.siteDescription}
            onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
            rows={3}
            className="w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="أدخل وصف الموقع"
            required
          />
        </div>
      </div>

      {/* الزر العائم */}
      <div className="space-y-4 border-b border-slate-200 dark:border-slate-700 pb-6">
        <h3 className="text-xl font-semibold">الزر العائم للتواصل (Floating Button)</h3>

        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="floatingEnabled"
            checked={settings.floatingButton.enabled}
            onChange={(e) => setSettings({
              ...settings,
              floatingButton: { ...settings.floatingButton, enabled: e.target.checked }
            })}
            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="floatingEnabled" className="text-sm font-medium cursor-pointer">تفعيل الزر العائم</label>
        </div>

        {settings.floatingButton.enabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">نوع أيقونة الزر</label>
              <select
                value={settings.floatingButton.iconType}
                onChange={(e) => setSettings({
                  ...settings,
                  floatingButton: { ...settings.floatingButton, iconType: e.target.value }
                })}
                className="w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="phone">Phone</option>
                <option value="telegram">Telegram</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الرقم أو الرابط</label>
              <input
                type="text"
                value={settings.floatingButton.linkOrPhone}
                onChange={(e) => setSettings({
                  ...settings,
                  floatingButton: { ...settings.floatingButton, linkOrPhone: e.target.value }
                })}
                className="w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="أدخل رقم الواتساب أو الرابط"
                required={settings.floatingButton.enabled}
              />
            </div>
          </div>
        )}
      </div>

      {/* الروابط الاجتماعية */}
      <div className="space-y-4 pb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">روابط التواصل الاجتماعي (Footer)</h3>
          <button
            type="button"
            onClick={addSocialLink}
            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-sm font-medium py-1 px-3 rounded transition-colors"
          >
            + إضافة رابط جديد
          </button>
        </div>

        {settings.socialLinks.map((link, index) => (
          <div key={index} className="flex gap-2 items-start bg-slate-50 dark:bg-slate-800/50 p-4 rounded border border-slate-200 dark:border-slate-700">
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-500">اسم المنصة</label>
                  <input
                    type="text"
                    value={link.platformName}
                    onChange={(e) => updateSocialLink(index, "platformName", e.target.value)}
                    className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-primary outline-none text-sm"
                    placeholder="مثال: تويتر"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-500">الأيقونة (اختياري)</label>
                  <input
                    type="text"
                    value={link.icon}
                    onChange={(e) => updateSocialLink(index, "icon", e.target.value)}
                    className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-primary outline-none text-sm"
                    placeholder="مثال: Twitter, Facebook"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-500">الرابط / URL</label>
                <input
                  type="text"
                  value={link.link}
                  onChange={(e) => updateSocialLink(index, "link", e.target.value)}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-primary outline-none text-sm"
                  placeholder="https://..."
                  required
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeSocialLink(index)}
              className="text-red-500 hover:text-red-700 p-2"
              title="حذف الرابط"
            >
              ✕
            </button>
          </div>
        ))}
        {settings.socialLinks.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-4">لا توجد روابط مضافة حالياً.</p>
        )}
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          type="submit"
          disabled={isSaving}
          className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-medium py-2 px-8 rounded-lg transition-colors"
        >
          {isSaving ? "جاري الحفظ..." : "حفظ الإعدادات"}
        </button>
      </div>
    </form>
  );
}
