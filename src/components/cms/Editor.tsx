"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import type { CMSPost } from "@/lib/github";
import { uploadGithubFile, fetchGithubSettings, encodeBase64Unicode } from "@/lib/github";
import type { PostLink } from "@/lib/types";
import imageCompression from "browser-image-compression";

interface EditorProps {
  initialPost: CMSPost;
  onSave: (post: CMSPost) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
  token?: string; // Optional because initially it wasn't there, but we need it for upload
}

export default function Editor({ initialPost, onSave, onCancel, isSaving, token }: EditorProps) {
  const [post, setPost] = useState<CMSPost>(initialPost);
  const [isUploading, setIsUploading] = useState(false);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // Initialize links and subSections arrays if they don't exist
  useEffect(() => {
    setPost((prev) => ({
      ...prev,
      links: prev.links || [],
      subSections: prev.subSections || []
    }));
  }, []);

  // Load existing categories from settings if possible, or provide defaults
  useEffect(() => {
    const loadCategories = async () => {
      if (token) {
        try {
          const data = await fetchGithubSettings(token);
          if (data?.settings.categories) {
            setExistingCategories(data.settings.categories);
          } else {
            // Default categories if settings doesn't have them
            setExistingCategories(["استشارات أسرية", "قلق", "اكتئاب", "تطوير الذات"]);
          }
        } catch (e) {
          console.error("Failed to fetch categories", e);
          setExistingCategories(["استشارات أسرية", "قلق", "اكتئاب", "تطوير الذات"]);
        }
      }
    };
    loadCategories();
  }, [token]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(post);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) {
        if (!token) toast.error("تحتاج إلى تسجيل الدخول أولاً لرفع الصور.");
        return;
    }

    setIsUploading(true);
    const toastId = toast.loading("جاري رفع الصورة...");

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/webp"
      };
      const compressedFile = await imageCompression(file, options);

      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
      });

      const fileName = `post-${Date.now()}.webp`;
      const path = `public/uploads/${fileName}`;

      const url = await uploadGithubFile(
        token,
        path,
        base64Data,
        `CMS: Upload post image ${fileName}`
      );

      setPost(prev => ({ ...prev, portraitImage: url }));
      toast.success("تم رفع الصورة بنجاح!", { id: toastId });
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير معروف";
      toast.error(`فشل في رفع الصورة: ${errorMessage}`, { id: toastId });
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  const addLink = () => {
    setPost(prev => ({
      ...prev,
      links: [...(prev.links || []), { title: "", url: "" }]
    }));
  };

  const updateLink = (index: number, field: keyof PostLink, value: string) => {
    const newLinks = [...(post.links || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setPost({ ...post, links: newLinks });
  };

  const addSubSection = () => {
    setPost({
      ...post,
      subSections: [...(post.subSections || []), { title: "", color: "default", content: "" }],
    });
  };

  const removeSubSection = (index: number) => {
    const newSections = [...(post.subSections || [])];
    newSections.splice(index, 1);
    setPost({ ...post, subSections: newSections });
  };

  const updateSubSection = (index: number, field: "title" | "color" | "content", value: string) => {
    const newSections = [...(post.subSections || [])];
    newSections[index] = { ...newSections[index], [field]: value };
    setPost({ ...post, subSections: newSections });
  };

  const removeLink = (index: number) => {
    setPost(prev => ({
      ...prev,
      links: (prev.links || []).filter((_, i) => i !== index)
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "ADD_NEW") {
      setIsAddingNewCategory(true);
      setPost({ ...post, category: "" });
    } else {
      setIsAddingNewCategory(false);
      setPost({ ...post, category: val });
    }
  };

  const confirmNewCategory = async () => {
    const trimmed = newCategory.trim();
    if (trimmed) {
      const updatedCategories = [...existingCategories, trimmed];
      setExistingCategories(updatedCategories);
      setPost({ ...post, category: trimmed });
      setNewCategory("");
      setIsAddingNewCategory(false);

      if (token) {
        try {
          const data = await fetchGithubSettings(token);
          if (data) {
            const currentSettings = data.settings;
            // Prevent duplicates
            const currentCats = currentSettings.categories || [];
            if (!currentCats.includes(trimmed)) {
                await uploadGithubFile(
                  token,
                  "content/settings.json",
                  encodeBase64Unicode(JSON.stringify({
                      ...currentSettings,
                      categories: [...currentCats, trimmed]
                  }, null, 2)),
                  `CMS: Added new category '${trimmed}'`
                );
            }
          }
        } catch (e) {
          console.error("Failed to save new category globally", e);
          // Non-blocking: we still updated the local state for this post
        }
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{post.sha ? "تعديل المنشور" : "إضافة منشور جديد"}</h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          إلغاء
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="md:col-span-2 space-y-2">
             <label className="block text-sm font-medium">صورة المنشور</label>
             <div className="flex flex-col sm:flex-row gap-2">
                <input
                    required
                    type="url"
                    value={post.portraitImage}
                    onChange={(e) => setPost({ ...post, portraitImage: e.target.value })}
                    className="flex-1 px-4 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none"
                    placeholder="رابط الصورة أو ارفع صورة جديدة"
                />
                <label className="cursor-pointer w-full sm:w-auto bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 flex items-center justify-center min-w-[120px] transition-colors">
                    {isUploading ? "جاري الرفع..." : "رفع صورة"}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading || !token} />
                </label>
             </div>
             {post.portraitImage && (
                 <img src={post.portraitImage} alt="Preview" className="h-40 object-cover rounded-lg mt-2" />
             )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <label className="block text-sm font-medium mb-1">العنوان</label>
              <input
                required
                type="text"
                value={post.title}
                onChange={(e) => setPost({ ...post, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1">لون العنوان</label>
              <select
                value={post.titleColor || "default"}
                onChange={(e) => setPost({ ...post, titleColor: e.target.value as any })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="default">الافتراضي</option>
                <option value="red">أحمر (#E0353E)</option>
                <option value="cyan">سماوي تركواز (#3AD2D6)</option>
                <option value="gold">ذهبي أصفر (#EDCF5F)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">الرابط اللطيف (Slug)</label>
            <input
              required
              type="text"
              value={post.slug}
              disabled={!!post.sha}
              onChange={(e) => setPost({ ...post, slug: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 disabled:opacity-50 focus:ring-2 focus:ring-primary outline-none"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">الفئة</label>
            {!isAddingNewCategory ? (
                <select
                  required
                  value={existingCategories.includes(post.category) ? post.category : (post.category ? "ADD_NEW" : "")}
                  onChange={handleCategoryChange}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="" disabled>اختر فئة</option>
                  {existingCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                  ))}
                  {post.category && !existingCategories.includes(post.category) && (
                      <option value={post.category}>{post.category}</option>
                  )}
                  <option value="ADD_NEW" className="font-bold text-primary">+ إضافة فئة جديدة</option>
                </select>
            ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="اسم الفئة الجديدة"
                        className="flex-1 px-4 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none"
                        autoFocus
                    />
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button type="button" onClick={confirmNewCategory} className="flex-1 sm:flex-none bg-primary text-white px-4 py-2 rounded-lg">تأكيد</button>
                      <button type="button" onClick={() => setIsAddingNewCategory(false)} className="flex-1 sm:flex-none bg-slate-200 dark:bg-slate-700 px-4 py-2 rounded-lg">إلغاء</button>
                    </div>
                </div>
            )}
          </div>

          <div className="md:col-span-2 relative">
            <label className="block text-sm font-medium mb-1">محتوى المقال (Markdown)</label>
            <textarea
              required
              rows={6}
              value={post.bodyContent}
              onChange={(e) => setPost({ ...post, bodyContent: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 font-mono text-sm focus:ring-2 focus:ring-primary outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600"
              placeholder="شرح توضيحي للمارك داون:&#10;# لكتابة عنوان رئيسي استخدم الهاشتاج قبل النص (مثال: # عنوان رئيسي)&#10;## لكتابة عنوان فرعي استخدم علامتي هاشتاج (مثال: ## عنوان فرعي)&#10;** لجعل النص عريضاً ضعه بين نجمتين (مثال: **نص مهم جداً**)&#10;* لإنشاء قائمة نقطية استخدم نجمة ثم مسافة (مثال: * النقطة الأولى)&#10;[نص الرابط](رابط الموقع) لإضافة رابط تشعبي&#10;> لإضافة اقتباس مميز"
              dir="auto"
            />
          </div>

          {/* مدير العناوين الفرعية والمحتوى الإضافي */}
          <div className="md:col-span-2 space-y-4 border-t border-slate-200 dark:border-slate-700 pt-6 mt-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
              <label className="block text-sm font-bold">العناوين الفرعية الإضافية والمحتوى</label>
              <button
                type="button"
                onClick={addSubSection}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-sm font-medium py-2 sm:py-1 px-3 rounded transition-colors"
              >
                + إضافة عنوان فرعي جديد
              </button>
            </div>

            {(post.subSections || []).map((section, index) => (
              <div key={index} className="flex flex-col gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 relative">
                <button
                  type="button"
                  onClick={() => removeSubSection(index)}
                  className="absolute top-2 left-2 text-red-500 hover:text-red-700 bg-white dark:bg-slate-900 rounded-full p-1 shadow-sm"
                  title="حذف هذا القسم"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </button>

                <div className="flex flex-col md:flex-row gap-4 w-full pr-8 md:pr-0">
                  <div className="flex-1">
                    <label className="block text-xs font-medium mb-1 text-slate-500">العنوان الفرعي</label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSubSection(index, "title", e.target.value)}
                      className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-primary outline-none text-sm"
                      placeholder="اكتب العنوان الفرعي هنا..."
                    />
                  </div>
                  <div className="md:w-1/3">
                    <label className="block text-xs font-medium mb-1 text-slate-500">لون العنوان</label>
                    <select
                      value={section.color}
                      onChange={(e) => updateSubSection(index, "color", e.target.value)}
                      className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-primary outline-none text-sm"
                    >
                      <option value="default">الافتراضي (أسود/أبيض)</option>
                      <option value="red">أحمر (#E0353E)</option>
                      <option value="cyan">سماوي تركواز (#3AD2D6)</option>
                      <option value="gold">ذهبي أصفر (#EDCF5F)</option>
                    </select>
                  </div>
                </div>

                <div>
                   <label className="block text-xs font-medium mb-1 text-slate-500">محتوى القسم (يدعم Markdown)</label>
                   <textarea
                     rows={5}
                     value={section.content}
                     onChange={(e) => updateSubSection(index, "content", e.target.value)}
                     className="w-full px-3 py-2 border rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 font-mono text-sm focus:ring-2 focus:ring-primary outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600"
                     placeholder="استخدم أوامر المارك داون هنا أيضاً...&#10;**نص عريض**، * قائمة، # عنوان"
                     dir="auto"
                   />
                </div>
              </div>
            ))}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">الخاتمة</label>
            <textarea
              rows={3}
              value={post.conclusion}
              onChange={(e) => setPost({ ...post, conclusion: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          {/* مدير الروابط المتعددة */}
          <div className="md:col-span-2 space-y-4 border-t border-slate-200 dark:border-slate-700 pt-6 mt-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
              <label className="block text-sm font-bold">الروابط المرفقة للمنشور (Dynamic Links)</label>
              <button
                type="button"
                onClick={addLink}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-sm font-medium py-2 sm:py-1 px-3 rounded transition-colors"
              >
                + إضافة رابط جديد
              </button>
            </div>

            {(post.links || []).map((link, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 relative">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-slate-500">عنوان الرابط (النص الظاهر)</label>
                    <input
                      type="text"
                      value={link.title}
                      onChange={(e) => updateLink(index, "title", e.target.value)}
                      className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-primary outline-none text-sm"
                      placeholder="مثال: اضغط هنا للتحميل"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-slate-500">مسار الرابط (URL)</label>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateLink(index, "url", e.target.value)}
                      className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-primary outline-none text-sm"
                      placeholder="https://..."
                      required
                      dir="ltr"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  className="w-full sm:w-auto text-red-500 hover:text-red-700 sm:p-2 sm:mt-5 text-sm sm:text-base border border-red-200 dark:border-red-900 sm:border-none rounded py-2 sm:py-0 bg-red-50 dark:bg-red-900/20 sm:bg-transparent"
                  title="حذف الرابط"
                >
                  حذف
                </button>
              </div>
            ))}
            {(!post.links || post.links.length === 0) && (
              <p className="text-sm text-slate-500 text-center py-2">لا توجد روابط مرفقة.</p>
            )}
          </div>

          <div className="md:col-span-2 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-bold mb-4">إعدادات تحسين محركات البحث (SEO)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">عنوان SEO</label>
                    <input
                    type="text"
                    value={post.seoMetaTitle}
                    onChange={(e) => setPost({ ...post, seoMetaTitle: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">وصف SEO</label>
                    <input
                    type="text"
                    value={post.seoMetaDescription}
                    onChange={(e) => setPost({ ...post, seoMetaDescription: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none"
                    />
                </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-6 border-t border-slate-200 dark:border-slate-700 mt-6">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-medium py-3 sm:py-2.5 px-8 rounded-lg transition-colors disabled:opacity-50 text-lg sm:text-base"
          >
            {isSaving ? "جاري الحفظ..." : "حفظ المنشور"}
          </button>
        </div>
      </form>
    </div>
  );
}
