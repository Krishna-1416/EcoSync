import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

/**
 * POST /api/chat
 *
 * Next.js serverless API route — acts as the AI proxy so the Gemini API key
 * stays server-side and never exposed to the browser.
 *
 * Accepts: { message: string, context?: { currentZone?: string, language?: string } }
 * Returns: { success: true, data: { reply: string, actionMetadata?: object } }
 */
export async function POST(req: NextRequest) {
  let message = "";
  let context: { currentZone?: string; language?: string } = {};

  try {
    const body = await req.json();
    message = body?.message || "";
    context = body?.context || {};

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 });
    }

    if (message.length > 2000) {
      return NextResponse.json({ success: false, error: "Message too long (max 2000 chars)" }, { status: 400 });
    }

    const currentZone = context?.currentZone || "General";
    const language = context?.language || "en";

    // If no API key, use the deterministic rule engine
    if (!GEMINI_API_KEY) {
      const reply = fallbackRuleEngine(message, currentZone);
      return NextResponse.json({ success: true, data: { reply } });
    }

    // --- GenAI call ---
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const systemInstruction = `
You are the "Stadium Volunteer Co-Pilot", an AI assistant for volunteers at FIFA World Cup 2026 stadiums.
Your goals: crowd management, real-time route optimisation, and multilingual fan assistance.

Volunteer Location: ${currentZone}
Target Language for Fan: ${language}

Synthetic Telemetry (current stadium state):
- Gate A: 40% capacity (Normal)
- Gate B: 95% capacity (RESTRICTED — heavily congested)
- Gate C: 20% capacity (Normal — best exit)
- Metro: Normal, next departure in 5 mins
- Bus: Delayed, next departure in 20 mins

Instructions:
1. Analyse telemetry. Gate B is congested (>80%). Route fans away from it.
2. Give the volunteer a short reasoning explanation (English).
3. Give the exact phrase to speak to the fan (in the Target Language, tone-appropriate).
4. For medical/urgent queries: prioritise speed and empathy.

Output strictly as valid JSON (no markdown fences):
{
  "reasoning": "...",
  "translatedPhrase": "...",
  "actionMetadata": { "type": "SHOW_ROUTE", "target": "gate_c" }
}`;

    const response = await ai.models.generateContent({
      model: "gemma-4-26b-a4b-it",
      contents: message,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from model");

    const parsed = JSON.parse(text);
    const reply = `**[Reasoning]** ${parsed.reasoning}\n\n**[Speak to Fan]**\n"${parsed.translatedPhrase}"`;

    return NextResponse.json({
      success: true,
      data: { reply, actionMetadata: parsed.actionMetadata },
    });
  } catch (error: any) {
    console.error("Chat API error:", error?.message);
    // Fallback on any error — use already-parsed message & context
    const reply = fallbackRuleEngine(message, context?.currentZone || "");
    return NextResponse.json({ success: true, data: { reply } });
  }
}

/**
 * Deterministic offline fallback — uses hardcoded telemetry.
 * Returns structured volunteer + fan guidance without hitting the AI API.
 */
function fallbackRuleEngine(query: string, zone: string): string {
  const q = query.toLowerCase();

  if (q.includes("exit") || q.includes("leave")) {
    return `**[Reasoning]** Gate B is at 95% capacity (congested). Gate C is the clearest exit at 20%.\n\n**[Speak to Fan]**\n"Please use Gate C for the fastest exit — it is currently much less crowded."`;
  }
  if (q.includes("medical") || q.includes("hurt") || q.includes("first aid")) {
    return `**[Reasoning]** Medical priority. Direct to Level G First Aid immediately.\n\n**[Speak to Fan]**\n"Please follow me to the First Aid station on Level G. Help is on the way."`;
  }
  if (q.includes("bathroom") || q.includes("restroom") || q.includes("toilet")) {
    return `**[Reasoning]** Nearest restroom is on Level 1, uncrowded.\n\n**[Speak to Fan]**\n"The nearest restroom is 50 metres away on Level 1."`;
  }
  if (q.includes("metro") || q.includes("train") || q.includes("transit") || q.includes("leave")) {
    return `**[Reasoning]** Metro is running normally. Next southbound train in 5 minutes. Avoid East exit (crowded).\n\n**[Speak to Fan]**\n"The Metro is running normally. The next train arrives in 5 minutes. I recommend using the West exit."`;
  }
  if (q.includes("seat") || q.includes("where")) {
    return `**[Reasoning]** Fan needs seating assistance from ${zone || "current zone"}.\n\n**[Speak to Fan]**\n"Your section is straight ahead. Follow the blue signage — it is about a 3-minute walk."`;
  }
  return `**[Reasoning]** General assistance requested.\n\n**[Speak to Fan]**\n"I can help you with exits, seating, transit, or amenities. What do you need?"`;
}
