import Link from "next/link";
import { ArrowRight, MapPin, MessageSquare, Train } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/30 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Subtle Background Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800/20 via-black to-black z-0" />
        
        <div className="relative z-10 text-center flex flex-col items-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold tracking-widest text-neutral-300 uppercase">FIFA World Cup 2026 Ready</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Your Stadium.<br />Perfectly Guided.
          </h1>
          
          <p className="text-lg md:text-2xl text-neutral-400 font-sans max-w-2xl mb-12 font-medium leading-relaxed">
            Stadium AI is the ultimate concierge for fans. Intelligent navigation, real-time transit updates, and instant answers in any language.
          </p>
          
          <Link 
            href="/hub" 
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-full font-semibold text-lg overflow-hidden transition-transform hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2">
              Enter the Hub
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-neutral-200 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
          </Link>
        </div>
      </section>

      {/* Feature Bento Section */}
      <section className="py-32 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">Everything you need. <br className="md:hidden" /><span className="text-neutral-500">All in one place.</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
          {/* Feature 1 */}
          <div className="md:col-span-2 rounded-3xl bg-neutral-950 border border-white/10 p-10 flex flex-col justify-between overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
              <MessageSquare className="w-32 h-32 text-white" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-display font-bold mb-2">GenAI Concierge</h3>
              <p className="text-neutral-400 font-sans text-lg max-w-md">
                Ask anything in your native language. From finding the nearest vegan food to locating medical assistance, get instant, context-aware answers.
              </p>
            </div>
            <div className="relative z-10 w-full max-w-sm bg-neutral-900 border border-white/10 rounded-2xl p-4 mt-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-white/10" />
                <div className="h-4 w-32 bg-white/10 rounded" />
              </div>
              <div className="h-16 w-full bg-white/5 rounded-xl" />
            </div>
          </div>

          {/* Feature 2 */}
          <div className="rounded-3xl bg-neutral-950 border border-white/10 p-10 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="text-white/80 w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-2">Precision Navigation</h3>
              <p className="text-neutral-400 font-sans text-lg">
                Never get lost again. Real-time routing from your gate straight to your section, row, and seat.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="rounded-3xl bg-neutral-950 border border-white/10 p-10 flex flex-col justify-between group">
             <div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 mb-6 group-hover:scale-110 transition-transform">
                <Train className="text-white/80 w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-2">Smart Transit</h3>
              <p className="text-neutral-400 font-sans text-lg">
                Beat the crowds. Get live updates on metro schedules, ride-share wait times, and the fastest exits.
              </p>
            </div>
          </div>
          
           {/* CTA Banner */}
           <div className="md:col-span-2 rounded-3xl bg-white text-black p-10 flex flex-col md:flex-row items-center justify-between group">
             <div>
               <h3 className="text-3xl font-display font-bold mb-2">Ready for the match?</h3>
               <p className="text-neutral-600 font-sans text-lg">Experience the future of stadium attendance.</p>
             </div>
             <Link 
                href="/hub" 
                className="mt-6 md:mt-0 inline-flex items-center justify-center px-8 py-4 bg-black text-white rounded-full font-semibold text-lg hover:bg-neutral-800 transition-colors"
              >
                Launch App
              </Link>
           </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 text-center border-t border-white/10">
        <p className="text-neutral-500 font-sans text-sm">
          Built for PromptWars Virtual Challenge • Smart Stadiums & Tournament Operations
        </p>
      </footer>
    </main>
  );
}
