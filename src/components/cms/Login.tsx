"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

interface LoginProps {
  onLogin: (token: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [inputToken, setInputToken] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputToken.trim()) {
      toast.error("Please enter a token");
      return;
    }
    onLogin(inputToken.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-6">
          CMS Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              GitHub Personal Access Token
            </label>
            <input
              id="token"
              type="password"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              placeholder="ghp_..."
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-900 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}