'use client';

import React from 'react';
import { SettingsProps } from '../types';

export const SettingsPanel: React.FC<SettingsProps> = React.memo(({
  settings,
  onUpdateSettings,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateSettings({ reviewerApiKey: e.target.value });
  };

  return (
    <section 
      className="p-6 bg-zinc-900/60 backdrop-blur-md border border-emerald-500/20 rounded-2xl shadow-xl text-white mb-8"
      aria-label="Application settings"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold tracking-tight text-emerald-400 flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-400 animate-spin-slow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings & API Config
        </h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label 
            htmlFor="reviewer-api-key" 
            className="block text-sm font-semibold text-emerald-300 mb-1"
          >
            Reviewer API Key (Fallback)
          </label>
          <input
            id="reviewer-api-key"
            type="password"
            value={settings.reviewerApiKey}
            onChange={handleChange}
            placeholder="AI2zaSy..."
            className="w-full px-4 py-2 bg-zinc-950/80 border border-emerald-500/30 rounded-lg text-emerald-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            aria-label="Enter your fallback Reviewer API Key"
          />
          <p className="text-xs text-zinc-400 mt-1">
            If provided, this key will override the default server-side key for manual testing.
          </p>
        </div>
      </div>
    </section>
  );
});

SettingsPanel.displayName = 'SettingsPanel';
