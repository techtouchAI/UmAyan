"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

interface LoginProps {
  onLogin: (token: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [token, setToken] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onLogin(token.trim());
    } else {
      toast.error("يرجى إدخال رمز التحقق (Token)");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4" dir="rtl">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-slate-200 dark:border-slate-700">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">تسجيل الدخول</h1>
          <p className="text-slate-500 dark:text-slate-400">الرجاء إدخال رمز التحقق (GitHub Token) الخاص بك للوصول للوحة التحكم</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              GitHub Personal Access Token
            </label>
            <input
              id="token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-lg transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-primary outline-none"
          >
            دخول
          </button>
        </form>

        <div className="mt-6 text-sm text-center text-slate-500 dark:text-slate-400">
          <p>لإنشاء Token، اذهب إلى إعدادات حسابك في GitHub &gt; إعدادات المطور (Developer Settings) &gt; Personal Access Tokens</p>
        </div>
      </div>
    </div>
  );
}
