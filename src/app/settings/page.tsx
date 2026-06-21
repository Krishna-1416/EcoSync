'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Settings } from '../../types';
import { SettingsPanel } from '../../components/Settings';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({ reviewerApiKey: '' });

  // Load settings from localStorage on client side
  useEffect(() => {
    const saved = localStorage.getItem('ecosync_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
  }, []);

  const handleUpdateSettings = useCallback((newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem('ecosync_settings', JSON.stringify(newSettings));
  }, []);

  return (
    <div className="flex-1 relative bg-zinc-950 flex flex-col overflow-hidden">
      {/* Background Graphic Patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))]" />

      <div className="relative z-10 max-w-xl mx-auto px-6 py-12 w-full space-y-10">
        <header className="space-y-2 text-left">
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
            System Configuration
          </h1>
          <p className="text-zinc-400 text-sm">
            Configure local credentials and testing fallback values.
          </p>
        </header>

        <SettingsPanel
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
        />
      </div>
    </div>
  );
}
