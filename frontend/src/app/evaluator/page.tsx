"use client";

import { useState } from "react";
import { BentoCard } from "@/components/BentoCard";
import { ArrowLeft, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/apiClient";

export default function EvaluatorPanel() {
  const [jsonInput, setJsonInput] = useState(`{
  "gates": [
    { "gateId": "Gate A", "capacityPercent": 40, "status": "Normal" },
    { "gateId": "Gate B", "capacityPercent": 95, "status": "Restricted" },
    { "gateId": "Gate C", "capacityPercent": 20, "status": "Normal" }
  ],
  "transit": [
    { "type": "Metro", "status": "Normal", "nextDeparture": "5 mins" },
    { "type": "Bus", "status": "Delayed", "nextDeparture": "20 mins" }
  ]
}`);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    try {
      setStatus("loading");
      const data = JSON.parse(jsonInput);
      await apiClient.post("/telemetry/upload", data);
      setStatus("success");
      setMessage("Telemetry data injected successfully!");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (e: any) {
      setStatus("error");
      setMessage(e.message || "Invalid JSON or network error");
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 max-w-[1000px] mx-auto flex flex-col gap-6 w-full">
      <header className="mb-6 pt-4 flex flex-col gap-4">
        <Link href="/hub" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors w-fit">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Hub</span>
        </Link>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white/95">
          Jury / Evaluator <span className="text-emerald-500">Panel</span>
        </h1>
        <p className="font-sans text-neutral-400 mt-2 text-lg font-medium">
          Inject real-time telemetry data to test the LLM's dynamic routing capabilities.
        </p>
      </header>

      <div className="flex-1">
        <BentoCard delay={0.1} className="h-full flex flex-col p-6 md:p-8 border-white/5 bg-neutral-900/60 shadow-2xl">
          <h2 className="font-display text-2xl font-semibold text-white mb-4">Telemetry Injection JSON</h2>
          <p className="text-neutral-400 mb-6 font-sans">
            Paste your test JSON here to override the backend's current state. The GenAI co-pilot will immediately adapt to these new conditions.
          </p>
          
          <textarea 
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="flex-1 w-full min-h-[300px] bg-neutral-950/80 border border-white/10 rounded-xl p-4 text-emerald-400 font-mono text-sm focus:outline-none focus:border-emerald-500/50 transition-colors resize-y mb-6"
            spellCheck={false}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {status === "success" && (
                <div className="flex items-center gap-2 text-emerald-400 animate-in fade-in zoom-in">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">{message}</span>
                </div>
              )}
              {status === "error" && (
                <div className="flex items-center gap-2 text-red-400 animate-in fade-in zoom-in">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">{message}</span>
                </div>
              )}
            </div>

            <button 
              onClick={handleUpload}
              disabled={status === "loading"}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
            >
              <Upload className="w-5 h-5" />
              {status === "loading" ? "Injecting..." : "Inject Data"}
            </button>
          </div>
        </BentoCard>
      </div>
    </main>
  );
}
