"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Train, Car, Clock } from "lucide-react";

interface MetroDeparture {
  line: string;
  dest: string;
  time: string;
  status: string;
  color: string;
}

interface TransitData {
  gate: string;
  metro: MetroDeparture[];
  rideshare: {
    uber: { waitTime: string; surge: string };
    lyft: { waitTime: string; surge: string };
    pickupZone: string;
  };
}

const DEFAULT_TRANSIT: TransitData = {
  gate: "North Gate",
  metro: [
    { line: "Red Line", dest: "City Center", time: "2 min", status: "On Time", color: "bg-red-500" },
    { line: "Blue Line", dest: "Airport Express", time: "6 min", status: "On Time", color: "bg-blue-500" },
    { line: "Red Line", dest: "City Center", time: "14 min", status: "On Time", color: "bg-red-500" },
    { line: "Green Line", dest: "North Suburbs", time: "18 min", status: "Delayed", color: "bg-emerald-500" },
  ],
  rideshare: {
    uber: { waitTime: "8m", surge: "1.2x" },
    lyft: { waitTime: "12m", surge: "1.0x" },
    pickupZone: "South-East Lot near Gate E",
  },
};

export default function TransitPage() {
  const [data, setData] = useState<TransitData>(DEFAULT_TRANSIT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransit() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiUrl}/api/v1/transit?gate=North%20Gate`);
        if (!response.ok) throw new Error("API error");
        const resJson = await response.json();
        if (resJson.success && resJson.data) {
          setData(resJson.data);
        }
      } catch (err) {
        console.warn("Failed to fetch live transit, using cached fallback:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTransit();
  }, []);

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 max-w-7xl mx-auto flex flex-col gap-6">
      <header className="mb-6 flex items-center gap-4 pt-4">
        <Link href="/hub" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ArrowLeft className="text-white w-6 h-6" />
        </Link>
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white/95">
            Smart Transit
          </h1>
          <p className="font-sans text-neutral-400 mt-1 text-lg font-medium">
            Live Departures & Ride-Share {loading && "• Syncing..."}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        
        {/* Metro / Public Transit */}
        <div className="rounded-3xl bg-neutral-900/40 border border-white/5 p-8 flex flex-col shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold text-white">Metro Network</h2>
            <Train className="text-white/60 w-8 h-8" />
          </div>

          <div className="space-y-4">
            {data.metro.map((train, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-neutral-950 border border-white/5">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-10 rounded-full ${train.color}`} />
                  <div>
                    <h3 className="font-bold text-lg text-white">{train.dest}</h3>
                    <p className="text-neutral-400 text-sm">{train.line}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl text-white">{train.time}</p>
                  <p className={`text-sm font-medium ${train.status === 'Delayed' ? 'text-amber-500' : 'text-emerald-500'}`}>{train.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ride-share & Taxis */}
        <div className="rounded-3xl bg-neutral-900/40 border border-white/5 p-8 flex flex-col shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold text-white">Ride-Share & Taxis</h2>
            <Car className="text-white/60 w-8 h-8" />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-6 rounded-2xl bg-neutral-950 border border-white/5 text-center">
              <Clock className="w-8 h-8 text-white/40 mx-auto mb-2" />
              <p className="text-neutral-400 text-sm mb-1">Uber Wait Time</p>
              <p className="text-3xl font-display font-bold text-white">{data.rideshare.uber.waitTime}</p>
              <p className="text-xs text-neutral-500 mt-1 font-semibold">Surge: {data.rideshare.uber.surge}</p>
            </div>
            <div className="p-6 rounded-2xl bg-neutral-950 border border-white/5 text-center">
               <Clock className="w-8 h-8 text-white/40 mx-auto mb-2" />
              <p className="text-neutral-400 text-sm mb-1">Lyft Wait Time</p>
              <p className="text-3xl font-display font-bold text-white">{data.rideshare.lyft.waitTime}</p>
              <p className="text-xs text-neutral-500 mt-1 font-semibold">Surge: {data.rideshare.lyft.surge}</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 mt-auto">
             <h3 className="font-bold text-blue-400 text-lg mb-2">Designated Pickup Zone</h3>
             <p className="text-blue-200/70 text-sm">{data.rideshare.pickupZone}</p>
          </div>
        </div>

      </div>
    </main>
  );
}
