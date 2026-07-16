"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your Stadium AI Concierge. How can I help you today? I can help with navigation, food, transit, or general queries.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:5000/api/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          context: {
            currentZone: "North Gate",
            language: "en",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Backend response error");
      }

      const resData = await response.json();
      if (resData.success && resData.data) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: resData.data.reply,
          },
        ]);
      } else {
        throw new Error("Invalid response format");
      }
      setIsTyping(false);
    } catch (error) {
      console.warn("Could not reach backend, using offline fallback response:", error);
      // Resilient fallback logic
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: generateMockResponse(userMessage.content),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 800);
    }
  };

  // Simple hardcoded logic to simulate "intelligent" context-aware responses for the hackathon
  const generateMockResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes("seat") || q.includes("where is")) {
      return "Based on your current location at the North Gate, Section 104 is a 4-minute walk straight ahead. Follow the blue signage.";
    }
    if (q.includes("food") || q.includes("vegan") || q.includes("eat")) {
      return "There is a 'Green Goal Vegan' stall at Gate B, Level 1. It currently has a 5-minute queue. Would you like me to guide you there?";
    }
    if (q.includes("leave") || q.includes("train") || q.includes("transit") || q.includes("metro")) {
      return "The Metro is running normally. If you leave now, you can catch the southbound train arriving in 6 minutes. Avoid the East exit as it is currently crowded.";
    }
    if (q.includes("bathroom") || q.includes("restroom")) {
      return "The nearest restroom is 50 meters away on Level 1. It is currently uncrowded.";
    }
    return "I can help you find your seat, locate food options, or check transit schedules. What do you need?";
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Header Context Indicator */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-neutral-950/80 backdrop-blur-md border-b border-white/5 flex items-center px-6 z-10 rounded-t-3xl">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Context Active: Match Day • 50,000+ Fans</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto pt-20 pb-24 px-6 flex flex-col gap-6 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border ${msg.role === "user" ? "bg-white text-black border-transparent" : "bg-neutral-900 text-white border-white/10"}`}>
                {msg.role === "user" ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-4 text-[15px] leading-relaxed shadow-sm ${msg.role === "user" ? "bg-white text-black rounded-tr-sm font-medium" : "bg-neutral-900/80 text-neutral-200 border border-white/5 rounded-tl-sm font-sans"}`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 flex-row"
            >
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-neutral-900 text-white border border-white/10 shadow-lg">
                <Bot size={20} />
              </div>
              <div className="rounded-2xl p-4 bg-neutral-900/80 border border-white/5 rounded-tl-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-neutral-500" />
                <span className="text-neutral-500 text-sm font-medium">Synthesizing...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-transparent z-10">
        <form onSubmit={handleSubmit} className="relative flex items-center max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about navigation, food, or transit..."
            className="w-full bg-neutral-900/80 border border-white/10 rounded-full py-4 pl-6 pr-16 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all backdrop-blur-md shadow-2xl font-sans"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-200 transition-colors shadow-lg"
            aria-label="Send message"
          >
            <Send size={18} className="ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
