import Link from "next/link";
import { ArrowLeft, Navigation as NavIcon } from "lucide-react";

export default function NavigationPage() {
  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 max-w-7xl mx-auto flex flex-col gap-6">
      <header className="mb-6 flex items-center gap-4 pt-4">
        <Link href="/hub" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ArrowLeft aria-hidden="true" className="text-white w-6 h-6" />
        </Link>
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white/95">
            Precision Navigation
          </h1>
          <p className="font-sans text-neutral-400 mt-1 text-lg font-medium">
            Gate to Seat Routing
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Mocked 3D Map Area */}
        <div className="lg:col-span-2 rounded-3xl bg-neutral-950/60 border border-white/5 overflow-hidden relative min-h-[400px] flex items-center justify-center shadow-2xl">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30 grayscale" />
           <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
           <div className="relative z-10 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 flex items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
             <span className="font-semibold tracking-wider text-sm">LIVE: Routing to Section 104</span>
           </div>
        </div>

        {/* Directions Pane */}
        <div className="rounded-3xl bg-neutral-900/40 border border-white/5 p-8 flex flex-col gap-6 shadow-2xl">
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div>
              <p className="text-neutral-500 font-sans text-sm font-semibold uppercase tracking-wider">Destination</p>
              <h2 className="text-white text-2xl font-display font-bold mt-1">Section 104, Row G</h2>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <NavIcon aria-hidden="true" className="text-emerald-500 w-6 h-6" />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6 relative">
             {/* Progress Line */}
             <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-white/10" />
             
             {/* Step 1 */}
             <div className="flex gap-6 relative z-10">
               <div className="w-6 h-6 rounded-full bg-emerald-500 border-4 border-neutral-900 shrink-0" />
               <div>
                 <h3 className="text-white font-medium text-lg">North Gate Entrance</h3>
                 <p className="text-neutral-400 text-sm mt-1">You are here.</p>
               </div>
             </div>

             {/* Step 2 */}
             <div className="flex gap-6 relative z-10">
               <div className="w-6 h-6 rounded-full bg-neutral-800 border-4 border-neutral-900 shrink-0" />
               <div>
                 <h3 className="text-white font-medium text-lg">Proceed straight 100m</h3>
                 <p className="text-neutral-400 text-sm mt-1">Walk past the official merch store on your right.</p>
               </div>
             </div>

             {/* Step 3 */}
             <div className="flex gap-6 relative z-10">
               <div className="w-6 h-6 rounded-full bg-neutral-800 border-4 border-neutral-900 shrink-0" />
               <div>
                 <h3 className="text-white font-medium text-lg">Turn Left at Concourse A</h3>
                 <p className="text-neutral-400 text-sm mt-1">Follow signs for Sections 100-115.</p>
               </div>
             </div>

             {/* Step 4 */}
             <div className="flex gap-6 relative z-10">
               <div className="w-6 h-6 rounded-full bg-neutral-800 border-4 border-neutral-900 shrink-0" />
               <div>
                 <h3 className="text-white font-medium text-lg">Section 104</h3>
                 <p className="text-neutral-400 text-sm mt-1">Your section is on the right.</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}
