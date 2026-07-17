import { BentoCard } from "@/components/BentoCard";
import dynamic from "next/dynamic";
const ChatInterface = dynamic(() => import("@/components/ChatInterface").then(mod => mod.ChatInterface), { ssr: false });
import { MapPin, Utensils, Train } from "lucide-react";
import Link from "next/link";

export default function Hub() {
  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 max-w-[1400px] mx-auto flex flex-col gap-6 w-full">
      <header className="mb-6 pt-4">
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white/95">
          Welcome to <span className="text-white">Stadium AI</span>
        </h1>
        <p className="font-sans text-neutral-400 mt-2 text-lg lg:text-xl font-medium">
          Your personal concierge for the FIFA World Cup 2026.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(240px,auto)] flex-1">
        
        {/* Main GenAI Concierge Card */}
        <BentoCard colSpan={4} rowSpan={2} delay={0.1} className="p-0 border-white/5 bg-neutral-950/60 shadow-2xl">
          <ChatInterface />
        </BentoCard>

        {/* Live Navigation Card */}
        <BentoCard colSpan={2} rowSpan={1} delay={0.2} className="p-0 border-white/5 bg-neutral-900/40 hover:bg-neutral-900/60 transition-colors group">
          <Link href="/navigation" className="w-full h-full flex flex-col justify-between p-6 md:p-8">
            <div className="flex items-start justify-between">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-white/90">Find My Seat</h2>
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform group-hover:bg-white/10">
                <MapPin className="text-white/80 w-6 h-6" />
              </div>
            </div>
            <div className="mt-8">
              <p className="text-neutral-500 font-sans text-sm font-semibold uppercase tracking-wider">Current Location: North Gate</p>
              <p className="text-white mt-1 text-xl font-medium">Section 104, Row G is a 4 min walk.</p>
            </div>
          </Link>
        </BentoCard>

        {/* Transport Out Card */}
        <BentoCard colSpan={1} rowSpan={1} delay={0.3} className="p-0 border-white/5 bg-neutral-900/40 hover:bg-neutral-900/60 transition-colors group">
          <Link href="/transit" className="w-full h-full flex flex-col justify-between p-6 md:p-8">
            <div className="flex items-start justify-between">
              <h2 className="font-display text-xl font-semibold tracking-tight text-white/90">Transit</h2>
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform group-hover:bg-white/10">
                <Train className="text-white/80 w-6 h-6" />
              </div>
            </div>
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></span>
                <p className="text-white text-base font-medium">Metro normal</p>
              </div>
              <p className="text-neutral-500 font-sans text-sm font-semibold uppercase tracking-wider">Next train in 6 mins</p>
            </div>
          </Link>
        </BentoCard>

        {/* Food & Amenities Card */}
        <BentoCard colSpan={1} rowSpan={1} delay={0.4} className="p-0 border-white/5 bg-neutral-900/40 hover:bg-neutral-900/60 transition-colors group">
          <Link href="/amenities" className="w-full h-full flex flex-col justify-between p-6 md:p-8">
            <div className="flex items-start justify-between">
              <h2 className="font-display text-xl font-semibold tracking-tight text-white/90">Amenities</h2>
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform group-hover:bg-white/10">
                <Utensils className="text-white/80 w-6 h-6" />
              </div>
            </div>
            <div className="mt-8">
              <p className="text-neutral-500 font-sans text-sm font-semibold uppercase tracking-wider">Nearest Restrooms</p>
              <p className="text-white mt-1 text-xl font-medium">50m • Level 1</p>
            </div>
          </Link>
        </BentoCard>

      </div>
    </main>
  );
}
