'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, ShieldCheck, ChartLineUp, Lightning } from '@phosphor-icons/react';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 },
  },
};

export default function Home() {
  return (
    <div className="relative flex-1 bg-zinc-950 flex flex-col overflow-hidden min-h-[100dvh]">
      {/* Premium ambient noise/grain (very subtle) */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />

      <main className="relative z-10 w-full max-w-[80vw] mx-auto px-6 pt-40 pb-24 flex-1">
        
        {/* Asymmetric Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20"
        >
          <div className="md:col-span-8 flex flex-col justify-end">
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter leading-[1.05] text-zinc-100 max-w-[14ch]">
              Decarbonize your infrastructure.
            </h1>
          </div>
          <div className="md:col-span-4 flex flex-col justify-end pb-2">
            <p className="text-zinc-400 text-lg leading-relaxed max-w-sm mb-8">
              EcoSync utilizes generative models to quantify carbon intensity and provide actionable, programmatic mitigation strategies.
            </p>
            <div>
              <Link
                href="/tracker"
                aria-label="Access carbon footprint analyzer"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-sm rounded-full transition-all duration-300 transform hover:scale-[0.98] active:scale-[0.95]"
              >
                Initialize Tracker
                <ArrowRight weight="bold" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Bento Grid Architecture */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-12 auto-rows-[240px] gap-6"
        >
          
          {/* Main Bento Item - Spans 8 columns, 2 rows */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-8 md:row-span-2 relative p-10 bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden group flex flex-col justify-between"
          >
            {/* Liquid glass inner refraction */}
            <div className="absolute inset-0 border border-white/5 rounded-[2.5rem] pointer-events-none shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" />
            
            <div className="relative z-10 w-14 h-14 bg-zinc-800/80 border border-zinc-700/50 rounded-2xl flex items-center justify-center text-zinc-300 mb-8">
              <ChartLineUp size={28} weight="duotone" />
            </div>
            
            <div className="relative z-10 max-w-md">
              <h2 className="text-2xl font-medium tracking-tight text-white mb-3">Live Telemetry</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Analyze your emission vectors in real-time. Our generative engine processes standard inputs into exact CO₂e metrics instantly.
              </p>
            </div>

            {/* Decorative background elements */}
            <div className="absolute -right-20 -bottom-20 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-1000" />
            
            {/* Abstract Background Chart */}
            <svg aria-hidden="true" className="absolute inset-0 w-full h-full opacity-[0.15] pointer-events-none z-0 transition-opacity duration-700 group-hover:opacity-[0.25]" preserveAspectRatio="none" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 150 C 50 140, 100 160, 150 110 C 200 60, 250 80, 300 40 C 350 0, 380 20, 400 10 L 400 200 L 0 200 Z" fill="url(#gradient-chart)" />
              <path d="M0 150 C 50 140, 100 160, 150 110 C 200 60, 250 80, 300 40 C 350 0, 380 20, 400 10" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 6" className="[animation:dash_30s_linear_infinite]" />
              <defs>
                <linearGradient id="gradient-chart" x1="200" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#10b981" stopOpacity="0.5" />
                  <stop offset="1" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* Secondary Top Right - Spans 4 cols, 1 row */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-4 md:row-span-1 relative p-8 bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute inset-0 border border-white/5 rounded-[2.5rem] pointer-events-none shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" />
            
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-zinc-800/80 border border-zinc-700/50 rounded-2xl flex items-center justify-center text-emerald-400">
                <Leaf size={24} weight="fill" />
              </div>
              <span className="text-xs font-mono text-zinc-500 px-3 py-1 bg-zinc-950/50 rounded-full border border-white/5">v1.2.0</span>
            </div>

            <div>
              <h2 className="text-lg font-medium tracking-tight text-white mb-1">Algorithmic Nudges</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Micro-interventions designed to naturally reduce your footprint.
              </p>
            </div>
          </motion.div>

          {/* Tertiary Bottom Right - Spans 4 cols, 1 row */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-4 md:row-span-1 relative p-8 bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col justify-between group"
          >
            <div className="absolute inset-0 border border-white/5 rounded-[2.5rem] pointer-events-none shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" />
            
            <div className="w-12 h-12 bg-zinc-800/80 border border-zinc-700/50 rounded-2xl flex items-center justify-center text-zinc-300">
              <ShieldCheck size={24} weight="duotone" />
            </div>

            <div>
              <h2 className="text-lg font-medium tracking-tight text-white mb-1">Sandboxed Processing</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                API keys remain entirely local. Zero persistent server tracking.
              </p>
            </div>
          </motion.div>

          {/* Bottom Left Small - Spans 4 cols, 1 row */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-4 md:row-span-1 relative p-8 bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden flex items-center justify-center"
          >
            <div className="absolute inset-0 border border-white/5 rounded-[2.5rem] pointer-events-none shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" />
            <div className="text-center">
              <p className="text-4xl font-mono text-white tracking-tighter mb-1">57+</p>
              <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">Verified Profiles</p>
            </div>
          </motion.div>

          {/* Bottom Center Large - Spans 8 cols, 1 row */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-8 md:row-span-1 relative p-8 bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden flex items-center justify-between"
          >
            <div className="absolute inset-0 border border-white/5 rounded-[2.5rem] pointer-events-none shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" />
            
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400">
                <Lightning size={32} weight="fill" />
              </div>
              <div>
                <h2 className="text-xl font-medium tracking-tight text-white mb-1">Instant Mitigation</h2>
                <p className="text-zinc-400 text-sm">
                  Run complex assessments with minimal latency.
                </p>
              </div>
            </div>

            <Link
              href="/tracker"
              className="hidden sm:flex w-12 h-12 bg-zinc-100 hover:bg-white text-zinc-950 rounded-full items-center justify-center transition-transform hover:scale-[0.95]"
              aria-label="Start Tracking"
            >
              <ArrowRight weight="bold" />
            </Link>
          </motion.div>
          
        </motion.div>

      </main>
    </div>
  );
}
