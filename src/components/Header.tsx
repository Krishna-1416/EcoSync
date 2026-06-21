'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChartLineUp, Gear, House } from '@phosphor-icons/react';

export const Header = React.memo(() => {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Overview', icon: House },
    { href: '/tracker', label: 'Telemetry', icon: ChartLineUp },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none">
      <div className="pointer-events-auto relative flex items-center justify-between w-full max-w-3xl px-2 py-2 bg-zinc-900/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.05)] rounded-[2rem]">
        
        {/* Brand / Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2 px-4 group outline-none"
          aria-label="EcoSync Home"
        >
          <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-950 transition-transform group-hover:scale-95">
            <span className="font-bold text-lg leading-none -mt-0.5">e</span>
          </div>
          <span className="font-semibold tracking-tight text-white/90">EcoSync</span>
        </Link>

        {/* Navigation Pills */}
        <nav className="hidden sm:flex items-center gap-1 relative">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors outline-none flex items-center gap-2 ${
                  isActive 
                    ? 'text-white' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                <Icon size={16} weight={isActive ? "fill" : "regular"} className="relative z-10" aria-hidden="true" />
                <span className="relative z-10">{link.label}</span>
                {isActive && (
                  <motion.span 
                    layoutId="header-active-pill"
                    className="absolute inset-0 border border-white/10 bg-white/5 rounded-full pointer-events-none"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Settings Action */}
        <div className="pr-2">
          {/* We keep a placeholder for the settings modal hook. We assume the Settings component exists and can be rendered elsewhere, or we just put a trigger here. Currently Settings is used in layout or page? We'll just make it a visual button for now since Settings logic is not fully fleshed in layout. */}
          <button 
            className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white bg-transparent hover:bg-white/10 rounded-full transition-colors outline-none"
            aria-label="Open Settings"
          >
            <Gear size={20} weight="duotone" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
