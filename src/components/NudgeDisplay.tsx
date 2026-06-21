'use client';

import React from 'react';
import { NudgeDisplayProps } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, WarningCircle, Sparkle, ChatCircleText, ChartLineUp } from '@phosphor-icons/react';

export const NudgeDisplay: React.FC<NudgeDisplayProps> = React.memo(({ result, error, isCalculating }) => {
  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        {/* Error State */}
        {error && (
          <motion.div
            key="error"
            role="alert"
            aria-label="Carbon analysis error alert"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl"
          >
            <div className="flex items-start gap-3 text-red-400">
              <WarningCircle size={24} className="mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold mb-1">System Error</h3>
                <p className="text-sm text-red-400/80 leading-relaxed">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {isCalculating && !error && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-10 bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] relative overflow-hidden"
          >
            <div className="absolute inset-0 border border-white/5 rounded-[2.5rem] pointer-events-none shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" />
            
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 bg-zinc-800/80 rounded-2xl flex items-center justify-center animate-pulse">
                <Sparkle size={32} className="text-emerald-500/50" />
              </div>
              <div className="space-y-3 flex-1">
                <div className="h-5 bg-zinc-800/80 rounded w-1/3 animate-pulse" />
                <div className="h-4 bg-zinc-800/80 rounded w-2/3 animate-pulse" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Success State */}
        {result && !isCalculating && !error && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 border border-white/5 rounded-[2.5rem] pointer-events-none shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" />
            
            {/* Soft background glow */}
            <div className="absolute -left-32 -top-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl opacity-50 pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
              
              {/* Metric Callout */}
              <div className="md:col-span-5">
                <div className="flex items-center gap-2 mb-4">
                  <ChartLineUp size={20} className="text-zinc-500" />
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Calculated Output</span>
                </div>
                
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-6xl md:text-8xl font-mono tracking-tighter text-white leading-none">
                    {result.co2_kg}
                  </span>
                  <span className="text-xl text-emerald-400 font-medium">kg CO₂</span>
                </div>
                
                <div className="p-5 bg-zinc-950/60 border border-white/5 rounded-2xl">
                  <p className="text-sm leading-relaxed text-zinc-300">
                    <strong className="text-white block mb-1">Scale Comparison</strong>
                    {result.relatable_comparison}
                  </p>
                </div>
              </div>

              {/* Nudge Output */}
              <div className="md:col-span-7 h-full flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <Leaf size={20} className="text-emerald-400" />
                  <span className="text-xs font-mono text-emerald-400/80 uppercase tracking-widest">Algorithmic Nudge</span>
                </div>
                
                <div className="relative">
                  <ChatCircleText size={32} className="absolute -left-1 -top-2 text-white/5" weight="fill" />
                  <p className="text-xl md:text-2xl leading-relaxed text-white font-medium pl-6 relative z-10 border-l-2 border-emerald-500/30">
                    {result.micro_nudge}
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

NudgeDisplay.displayName = 'NudgeDisplay';
