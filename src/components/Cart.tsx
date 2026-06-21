'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { CartProps } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Minus, X, Info, Leaf, CarProfile, Lightning, ShoppingBag, 
  Desktop, MagnifyingGlass, Sparkle, Wind, AirplaneTilt, Train, ChartLineUp
} from '@phosphor-icons/react';

// ────────────────────────────────────────────────────────────
// Preset data — grouped by category, with unit labels
// ────────────────────────────────────────────────────────────
interface Preset {
  name: string;
  category: string;
  baseCo2: number; // kg CO₂ per unit
  unit: string;    // descriptive unit label
  icon: React.ReactNode;
}

const PRESETS: Preset[] = [
  // ── Food & Diet ──────────────────────────────────────────
  { name: 'Beef (grain-fed)', category: 'Food', baseCo2: 27.0,  unit: 'per kg',     icon: <Leaf weight="duotone" /> },
  { name: 'Lamb',             category: 'Food', baseCo2: 39.2,  unit: 'per kg',     icon: <Leaf weight="duotone" /> },
  { name: 'Pork',             category: 'Food', baseCo2: 12.1,  unit: 'per kg',     icon: <Leaf weight="duotone" /> },
  { name: 'Chicken',          category: 'Food', baseCo2: 6.9,   unit: 'per kg',     icon: <Leaf weight="duotone" /> },
  { name: 'Farmed Salmon',    category: 'Food', baseCo2: 11.9,  unit: 'per kg',     icon: <Leaf weight="duotone" /> },
  { name: 'Eggs',             category: 'Food', baseCo2: 4.8,   unit: 'per dozen',  icon: <Leaf weight="duotone" /> },
  { name: 'Dairy Milk',       category: 'Food', baseCo2: 3.2,   unit: 'per litre',  icon: <Leaf weight="duotone" /> },
  { name: 'Cheese',           category: 'Food', baseCo2: 13.5,  unit: 'per kg',     icon: <Leaf weight="duotone" /> },
  { name: 'Oat Milk',         category: 'Food', baseCo2: 0.9,   unit: 'per litre',  icon: <Leaf weight="duotone" /> },
  { name: 'Tofu',             category: 'Food', baseCo2: 3.0,   unit: 'per kg',     icon: <Leaf weight="duotone" /> },
  { name: 'Lentils',          category: 'Food', baseCo2: 0.9,   unit: 'per kg',     icon: <Leaf weight="duotone" /> },
  { name: 'Coffee',           category: 'Food', baseCo2: 17.0,  unit: 'per kg',     icon: <Leaf weight="duotone" /> },
  { name: 'Dark Chocolate',   category: 'Food', baseCo2: 18.7,  unit: 'per kg',     icon: <Leaf weight="duotone" /> },
  { name: 'Rice',             category: 'Food', baseCo2: 4.0,   unit: 'per kg',     icon: <Leaf weight="duotone" /> },
  { name: 'Bread (wheat)',    category: 'Food', baseCo2: 1.4,   unit: 'per kg',     icon: <Leaf weight="duotone" /> },
  { name: 'Tomatoes',         category: 'Food', baseCo2: 1.1,   unit: 'per kg',     icon: <Leaf weight="duotone" /> },
  { name: 'Avocado',          category: 'Food', baseCo2: 2.5,   unit: 'per kg',     icon: <Leaf weight="duotone" /> },

  // ── Transport ────────────────────────────────────────────
  { name: 'Petrol Car',       category: 'Transport', baseCo2: 0.21,   unit: 'per km',    icon: <CarProfile weight="duotone" /> },
  { name: 'Diesel Car',       category: 'Transport', baseCo2: 0.17,   unit: 'per km',    icon: <CarProfile weight="duotone" /> },
  { name: 'Electric Car',     category: 'Transport', baseCo2: 0.07,   unit: 'per km',    icon: <CarProfile weight="duotone" /> },
  { name: 'Motorbike',        category: 'Transport', baseCo2: 0.11,   unit: 'per km',    icon: <CarProfile weight="duotone" /> },
  { name: 'Bus',              category: 'Transport', baseCo2: 0.10,   unit: 'per km',    icon: <CarProfile weight="duotone" /> },
  { name: 'Coach / Long-distance Bus', category: 'Transport', baseCo2: 0.027, unit: 'per km', icon: <CarProfile weight="duotone" /> },
  { name: 'Electric Train',   category: 'Transport', baseCo2: 0.02,   unit: 'per km',    icon: <Train weight="duotone" /> },
  { name: 'Domestic Flight',  category: 'Transport', baseCo2: 0.255,  unit: 'per km',    icon: <AirplaneTilt weight="duotone" /> },
  { name: 'Long-haul Flight', category: 'Transport', baseCo2: 0.195,  unit: 'per km',    icon: <AirplaneTilt weight="duotone" /> },
  { name: 'Private Jet Flight (1hr)', category: 'Transport', baseCo2: 2500, unit: 'per hour',  icon: <AirplaneTilt weight="duotone" /> },

  // ── Energy & Home ────────────────────────────────────────
  { name: 'Home Electricity (grid-avg)', category: 'Energy', baseCo2: 0.23,  unit: 'per kWh',    icon: <Lightning weight="duotone" /> },
  { name: 'Home Electricity (renewable)', category: 'Energy', baseCo2: 0.03, unit: 'per kWh',    icon: <Lightning weight="duotone" /> },
  { name: 'Natural Gas Heating',    category: 'Energy', baseCo2: 2.0,   unit: 'per m³',     icon: <Wind weight="duotone" /> },
  { name: 'Diesel Generator (1 hr)', category: 'Energy', baseCo2: 2.7,  unit: 'per hour',   icon: <Lightning weight="duotone" /> },
  { name: 'Air Conditioning (1 hr)', category: 'Energy', baseCo2: 0.67, unit: 'per hour',   icon: <Wind weight="duotone" /> },
  { name: 'LED Bulb (on)',           category: 'Energy', baseCo2: 0.009, unit: 'per hour',  icon: <Lightning weight="duotone" /> },
  { name: 'Laptop (running)',        category: 'Energy', baseCo2: 0.02,  unit: 'per hour',  icon: <Desktop weight="duotone" /> },

  // ── Goods & Shopping ─────────────────────────────────────
  { name: 'Smartphone (new)',        category: 'Goods', baseCo2: 70.0,  unit: 'per device', icon: <ShoppingBag weight="duotone" /> },
  { name: 'Laptop (new)',            category: 'Goods', baseCo2: 400.0, unit: 'per device', icon: <ShoppingBag weight="duotone" /> },
  { name: 'T-Shirt (cotton)',        category: 'Goods', baseCo2: 8.0,   unit: 'per item',   icon: <ShoppingBag weight="duotone" /> },
  { name: 'Jeans (denim)',           category: 'Goods', baseCo2: 33.4,  unit: 'per pair',   icon: <ShoppingBag weight="duotone" /> },
  { name: 'Sneakers',               category: 'Goods', baseCo2: 13.6,  unit: 'per pair',   icon: <ShoppingBag weight="duotone" /> },

  // ── Digital & Services ───────────────────────────────────
  { name: 'Video Streaming HD (1 hr)', category: 'Digital', baseCo2: 0.036, unit: 'per hour', icon: <Desktop weight="duotone" /> },
  { name: 'Video Call (1 hr)',          category: 'Digital', baseCo2: 0.15,  unit: 'per hour', icon: <Desktop weight="duotone" /> },
  { name: 'Email (standard)',          category: 'Digital', baseCo2: 0.004, unit: 'per email', icon: <Desktop weight="duotone" /> },
  { name: 'AI Model Inference (1 req)', category: 'Digital', baseCo2: 0.002, unit: 'per request', icon: <Desktop weight="duotone" /> },
];

const CATEGORIES = ['All', 'Food', 'Transport', 'Energy', 'Goods', 'Digital'];

// Sleek monochromatic badges instead of rainbow colors
const CATEGORY_COLORS: Record<string, string> = {
  All:       'text-zinc-400 border-white/10',
  Food:      'text-zinc-300 border-white/10',
  Transport: 'text-zinc-300 border-white/10',
  Energy:    'text-zinc-300 border-white/10',
  Goods:     'text-zinc-300 border-white/10',
  Digital:   'text-zinc-300 border-white/10',
};

const ACTIVE_CATEGORY_COLORS: Record<string, string> = {
  All:       'bg-white text-zinc-950 border-white',
  Food:      'bg-zinc-200 text-zinc-950 border-zinc-200',
  Transport: 'bg-zinc-200 text-zinc-950 border-zinc-200',
  Energy:    'bg-zinc-200 text-zinc-950 border-zinc-200',
  Goods:     'bg-zinc-200 text-zinc-950 border-zinc-200',
  Digital:   'bg-zinc-200 text-zinc-950 border-zinc-200',
};

// ────────────────────────────────────────────────────────────
// Cart Component
// ────────────────────────────────────────────────────────────
export const Cart: React.FC<CartProps> = React.memo(({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateQuantity,
  isCalculating,
  onCalculate,
  customPrompt,
  onUpdateCustomPrompt,
}) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState('Food');
  const [customCo2, setCustomCo2] = useState('1.0');



  const filteredPresets = useMemo(() => {
    return PRESETS.filter((p) => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleAddPreset = useCallback((preset: Preset) => {
    onAddItem({
      name: preset.name,
      category: preset.category,
      quantity: 1,
      baseCo2: preset.baseCo2,
    });
  }, [onAddItem]);

  const handleAddCustom = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    onAddItem({
      name: customName.trim(),
      category: customCategory,
      quantity: 1,
      baseCo2: parseFloat(customCo2) || 0,
    });
    setCustomName('');
    setCustomCo2('1.0');
  }, [onAddItem, customName, customCategory, customCo2]);

  const totalCo2 = useMemo(
    () => items.reduce((acc, item) => acc + item.baseCo2 * item.quantity, 0),
    [items]
  );

  return (
    <div className="space-y-6 pt-16">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Preset Browser + Form */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Preset Browser */}
          <section
            className="p-8 bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] shadow-xl relative overflow-hidden"
          >
            <div className="absolute inset-0 border border-white/5 rounded-[2.5rem] pointer-events-none shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
              <h2 className="text-xl font-medium tracking-tight text-white flex items-center gap-2">
                <Leaf size={20} className="text-emerald-400" aria-hidden="true" />
                Library
                <span className="text-xs font-mono text-zinc-500 ml-1">v1.0</span>
              </h2>

              <div className="relative">
                <MagnifyingGlass className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
                <label htmlFor="preset-search" className="sr-only">Search carbon presets</label>
                <input
                  id="preset-search"
                  type="text"
                  aria-label="Search carbon presets"
                  placeholder="Query parameters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full sm:w-64 bg-zinc-950/80 border border-white/10 rounded-full text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6 relative z-10" role="tablist" aria-label="Filter presets by category">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  id={`tab-${cat}`}
                  role="tab"
                  aria-selected={activeCategory === cat}
                  aria-controls="preset-panel"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 outline-none ${
                    activeCategory === cat
                      ? ACTIVE_CATEGORY_COLORS[cat]
                      : CATEGORY_COLORS[cat] + ' hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div
              id="preset-panel"
              role="tabpanel"
              aria-labelledby={`tab-${activeCategory}`}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto custom-scrollbar relative z-10 pr-2"
            >
              <AnimatePresence>
                {filteredPresets.map((preset, idx) => (
                  <motion.button
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    key={`${preset.name}-${idx}`}
                    aria-label={`Add preset action: ${preset.name}`}
                    onClick={() => handleAddPreset(preset)}
                    className="flex items-center gap-4 p-4 bg-zinc-950/60 border border-white/5 hover:border-emerald-500/40 rounded-2xl transition-all duration-300 hover:shadow-[0_4px_12px_rgba(16,185,129,0.05)] text-left outline-none"
                  >
                    <div className="w-10 h-10 flex-shrink-0 bg-zinc-800/80 rounded-xl flex items-center justify-center text-zinc-400">
                      {preset.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-zinc-200 truncate">
                        {preset.name}
                      </span>
                      <span className="block text-xs font-mono text-zinc-500 mt-1">
                        {preset.baseCo2}kg {preset.unit}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
              {filteredPresets.length === 0 && (
                <div className="col-span-full py-8 text-center text-zinc-500 text-sm">
                  No vectors matched your query.
                </div>
              )}
            </div>
          </section>

          {/* Custom Activity Form */}
          <section className="p-8 bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 border border-white/5 rounded-[2.5rem] pointer-events-none shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" />
            <h2 className="text-xl font-medium tracking-tight text-white mb-6 flex items-center gap-2 relative z-10">
              <Plus size={20} className="text-zinc-400" aria-hidden="true" />
              Manual Override
            </h2>
            <form onSubmit={handleAddCustom} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end relative z-10">
              <div className="md:col-span-5">
                <label htmlFor="custom-name" className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Identifier</label>
                <input
                  id="custom-name"
                  type="text"
                  required
                  placeholder="Custom vector name..."
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950/80 border border-white/10 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="md:col-span-3">
                <label htmlFor="custom-category" className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Classification</label>
                <select
                  id="custom-category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950/80 border border-white/10 rounded-xl text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 appearance-none"
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-4">
                <label htmlFor="custom-co2" className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">CO₂ Index (kg)</label>
                <div className="flex gap-2">
                  <input
                    id="custom-co2"
                    type="number"
                    step="0.001"
                    min="0"
                    value={customCo2}
                    onChange={(e) => setCustomCo2(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-950/80 border border-white/10 rounded-xl text-sm font-mono text-zinc-200 focus:outline-none focus:border-emerald-500/50"
                  />
                  <button
                    type="submit"
                    aria-label="Add custom carbon activity"
                    className="flex-shrink-0 px-4 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 font-medium rounded-xl transition-transform active:scale-95 outline-none"
                  >
                    Add
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>

        {/* Right Column: Telemetry Array (Cart) */}
        <div className="lg:col-span-5">
          <section className="h-full p-8 bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] shadow-xl relative flex flex-col">
            <div className="absolute inset-0 border border-white/5 rounded-[2.5rem] pointer-events-none shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h2 className="text-xl font-medium tracking-tight text-white flex items-center gap-2">
                <ChartLineUp size={20} className="text-zinc-400" aria-hidden="true" />
                Telemetry Array
              </h2>
              <div className="text-right">
                <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Aggregate</span>
                <span className="block font-mono text-emerald-400 text-lg tracking-tight">
                  {totalCo2.toFixed(3)} kg
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 pr-2 space-y-3 min-h-[250px]">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-3"
                  >
                    <Info size={32} weight="duotone" className="opacity-50" aria-hidden="true" />
                    <p className="text-sm">Awaiting payload configuration.</p>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 250, damping: 25 }}
                      key={item.id}
                      className="p-4 bg-zinc-950/60 border border-white/5 rounded-2xl flex flex-col gap-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-white">{item.name}</h3>
                          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full mt-1.5 inline-block">
                            {item.category}
                          </span>
                        </div>
                        <button
                          aria-label={`Remove ${item.name} from telemetry array`}
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors outline-none"
                        >
                          <X size={16} weight="bold" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 pt-3">
                        <div className="flex items-center gap-1 bg-zinc-900/80 rounded-lg p-1 border border-white/5">
                          <button
                            aria-label={`Decrease quantity of ${item.name}`}
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                          >
                            <Minus size={14} weight="bold" />
                          </button>
                          <span className="w-8 text-center font-mono text-white text-sm">
                            {item.quantity}
                          </span>
                          <button
                            aria-label={`Increase quantity of ${item.name}`}
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                          >
                            <Plus size={14} weight="bold" />
                          </button>
                        </div>
                        <span className="font-mono text-sm text-zinc-300">
                          {(item.baseCo2 * item.quantity).toFixed(3)}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 relative z-10">
              <label htmlFor="contextual-params" className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                Contextual Parameters
              </label>
              <textarea
                id="contextual-params"
                value={customPrompt}
                onChange={(e) => onUpdateCustomPrompt(e.target.value)}
                placeholder="Append natural language context for the generative engine..."
                className="w-full h-24 px-4 py-3 bg-zinc-950/80 border border-white/10 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 resize-none"
              />
              <button
                onClick={onCalculate}
                aria-label="Analyze carbon footprint with AI"
                disabled={isCalculating || items.length === 0}
                className="w-full mt-4 px-6 py-4 bg-zinc-100 hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-950 font-medium rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[0.98] active:scale-[0.95] disabled:transform-none disabled:cursor-not-allowed outline-none"
              >
                {isCalculating ? (
                  <span className="animate-pulse flex items-center gap-2">Processing Telemetry...</span>
                ) : (
                  <>
                    <Sparkle weight="fill" aria-hidden="true" /> Execute Model
                  </>
                )}
              </button>
            </div>

          </section>
        </div>

      </div>
    </div>
  );
});

Cart.displayName = 'Cart';
