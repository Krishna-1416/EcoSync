import Link from "next/link";
import { Home, LayoutDashboard, MapPin, Train, Utensils } from "lucide-react";

export function Navbar() {
  return (
    <nav aria-label="Main Navigation" className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 px-4 py-3 rounded-full bg-neutral-950/80 backdrop-blur-xl border border-white/10 shadow-2xl">
        <Link 
          href="/" 
          className="flex flex-col items-center gap-1 p-2 min-w-[64px] rounded-2xl hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
        >
          <Home aria-hidden="true" className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-wider uppercase">Home</span>
        </Link>

        <Link 
          href="/hub" 
          className="flex flex-col items-center gap-1 p-2 min-w-[64px] rounded-2xl hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
        >
          <LayoutDashboard aria-hidden="true" className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-wider uppercase">Hub</span>
        </Link>
        
        <div className="w-[1px] h-8 bg-white/10 mx-1" />

        <Link 
          href="/navigation" 
          className="flex flex-col items-center gap-1 p-2 min-w-[64px] rounded-2xl hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
        >
          <MapPin aria-hidden="true" className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-wider uppercase">Navigate</span>
        </Link>

        <Link 
          href="/transit" 
          className="flex flex-col items-center gap-1 p-2 min-w-[64px] rounded-2xl hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
        >
          <Train aria-hidden="true" className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-wider uppercase">Transit</span>
        </Link>

        <Link 
          href="/amenities" 
          className="flex flex-col items-center gap-1 p-2 min-w-[64px] rounded-2xl hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
        >
          <Utensils aria-hidden="true" className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-wider uppercase">Amenities</span>
        </Link>
      </div>
    </nav>
  );
}
