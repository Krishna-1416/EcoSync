'use client';

import React, { useState, useEffect } from 'react';
import { CartItem, EmissionResult, Settings } from '../../types';
import { Cart } from '../../components/Cart';
import { NudgeDisplay } from '../../components/NudgeDisplay';

export default function TrackerPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [settings, setSettings] = useState<Settings>({ reviewerApiKey: '' });
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [result, setResult] = useState<EmissionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

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

  const handleAddItem = (newItem: Omit<CartItem, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setItems((prev) => [...prev, { ...newItem, id }]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleCalculate = async () => {
    if (items.length === 0) return;
    setIsCalculating(true);
    setError(null);
    setResult(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (settings.reviewerApiKey) {
        headers['Authorization'] = `Bearer ${settings.reviewerApiKey}`;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({ items, customPrompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete analysis simulation.');
      }

      setResult(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during simulation.';
      setError(message);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="flex-1 relative bg-zinc-950 flex flex-col overflow-hidden">
      {/* Background Graphic Patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))]" />

      <div className="relative z-10 max-w-[80vw] mx-auto px-6 pt-32 pb-12 w-full space-y-6">
        <header className="space-y-4 text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400 leading-tight">
            Carbon Modeling Dashboard
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl leading-relaxed">
            Input carbon-producing items below. EcoSync AI will parse emission levels and formulate green micro-nudges.
          </p>
        </header>

        <div className="space-y-6">
          <Cart
            items={items}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onUpdateQuantity={handleUpdateQuantity}
            isCalculating={isCalculating}
            onCalculate={handleCalculate}
            customPrompt={customPrompt}
            onUpdateCustomPrompt={setCustomPrompt}
          />

          <NudgeDisplay
            result={result}
            error={error}
            isCalculating={isCalculating}
          />
        </div>
      </div>
    </div>
  );
}
