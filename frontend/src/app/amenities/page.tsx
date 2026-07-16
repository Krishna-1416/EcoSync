"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Utensils, Coffee, Pizza, BadgeInfo } from "lucide-react";

const STALLS = [
  { name: "Green Goal Vegan", loc: "Gate B, Level 1", wait: "5 min", icon: Coffee, tags: ["vegan"] },
  { name: "Stadium Slice", loc: "Gate A, Level 2", wait: "15 min", icon: Pizza, tags: ["all"] },
  { name: "Burger Stand 104", loc: "Section 104", wait: "2 min", icon: Utensils, tags: ["all"] },
  { name: "Craft Beer Station", loc: "Gate C, Level 1", wait: "8 min", icon: Coffee, tags: ["all"] },
  { name: "Halal Cart", loc: "Gate D, Level 1", wait: "12 min", icon: Utensils, tags: ["halal"] },
  { name: "Quick Snacks", loc: "Section 112", wait: "0 min", icon: Pizza, tags: ["all"] },
];

export default function AmenitiesPage() {
  const [filter, setFilter] = useState<"all" | "vegan" | "halal">("all");

  const filteredStalls = STALLS.filter((stall) => {
    if (filter === "all") return true;
    return stall.tags.includes(filter);
  });

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 max-w-7xl mx-auto flex flex-col gap-6">
      <header className="mb-6 flex items-center gap-4 pt-4">
        <Link href="/hub" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ArrowLeft className="text-white w-6 h-6" />
        </Link>
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white/95">
            Stadium Amenities
          </h1>
          <p className="font-sans text-neutral-400 mt-1 text-lg font-medium">
            Food, Drink & Facilities
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        
        {/* Food Directory */}
        <div className="md:col-span-2 rounded-3xl bg-neutral-900/40 border border-white/5 p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-display font-bold text-white">Food & Drink</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setFilter("all")}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${filter === "all" ? "bg-white text-black" : "bg-neutral-800 text-white hover:bg-neutral-700"}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter("vegan")}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${filter === "vegan" ? "bg-white text-black" : "bg-neutral-800 text-white hover:bg-neutral-700"}`}
              >
                Vegan
              </button>
              <button 
                onClick={() => setFilter("halal")}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${filter === "halal" ? "bg-white text-black" : "bg-neutral-800 text-white hover:bg-neutral-700"}`}
              >
                Halal
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredStalls.map((stall, i) => {
              const Icon = stall.icon;
              return (
                <div key={i} className="p-4 rounded-2xl bg-neutral-950 border border-white/5 flex gap-4 hover:border-white/20 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                    <Icon className="text-white/60 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{stall.name}</h3>
                    <p className="text-neutral-400 text-xs mb-2">{stall.loc}</p>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-900 border border-white/10">
                       <span className={`w-1.5 h-1.5 rounded-full ${parseInt(stall.wait) < 5 ? 'bg-emerald-500' : parseInt(stall.wait) < 10 ? 'bg-amber-500' : 'bg-red-500'}`} />
                       <span className="text-xs text-neutral-300 font-medium">Wait: {stall.wait}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredStalls.length === 0 && (
              <p className="text-neutral-500 text-center col-span-2 py-12">No stalls match the selected filter.</p>
            )}
          </div>
        </div>

        {/* Essential Facilities */}
        <div className="rounded-3xl bg-neutral-900/40 border border-white/5 p-8 flex flex-col gap-4 shadow-2xl">
          <h2 className="text-2xl font-display font-bold text-white mb-4">Facilities</h2>
          
          <div className="p-5 rounded-2xl bg-neutral-950 border border-white/5">
             <h3 className="font-bold text-white text-lg">Restrooms</h3>
             <p className="text-neutral-400 text-sm mt-1">Nearest is 50m away, Level 1.</p>
             <p className="text-emerald-500 text-xs font-semibold uppercase tracking-wider mt-3">Uncrowded</p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-950 border border-white/5">
             <h3 className="font-bold text-white text-lg">First Aid</h3>
             <p className="text-neutral-400 text-sm mt-1">Medical tent at South Gate.</p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-950 border border-white/5">
             <h3 className="font-bold text-white text-lg">Sensory Room</h3>
             <p className="text-neutral-400 text-sm mt-1">Quiet space available at Gate E, Level 2.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mt-auto flex items-start gap-3">
             <BadgeInfo className="text-white/60 w-5 h-5 shrink-0 mt-0.5" />
             <p className="text-neutral-300 text-sm font-medium">Need something specific? Ask the GenAI Concierge on the Hub.</p>
          </div>
        </div>

      </div>
    </main>
  );
}
