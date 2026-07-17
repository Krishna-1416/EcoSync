import { config } from "../config/unifiedConfig";
import { GoogleGenAI } from "@google/genai";
import { TelemetryRepository } from "../repositories/TelemetryRepository";

/**
 * LlmService — Core GenAI integration for the Stadium Volunteer Co-Pilot.
 *
 * Uses Google Gemma 26B via the `@google/genai` SDK to:
 *  1. Analyse live stadium telemetry (crowd density at gates, transit delays)
 *  2. Generate a reasoning explanation for the volunteer
 *  3. Produce a translated phrase the volunteer can speak directly to the fan
 *  4. Return structured `actionMetadata` to drive UI map overlays (SHOW_ROUTE,
 *     SHOW_MAP_PIN) — fulfilling the real-time decision support requirement.
 *
 * Falls back to a deterministic rule engine when the API key is absent or the
 * model call fails, ensuring offline resilience for stadium operations.
 */
export class LlmService {
  private ai: GoogleGenAI;
  private telemetryRepo: TelemetryRepository;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY || "mock-key" });
    this.telemetryRepo = TelemetryRepository.getInstance();
  }

  /**
   * Generates a contextual AI response for a volunteer query.
   *
   * @param query       The fan or volunteer's natural-language question
   * @param currentZone Volunteer's current stadium zone (e.g. "North Gate")
   * @param language    ISO 639-1 target language for the fan phrase (e.g. "es")
   * @returns           Structured reply with reasoning, translated phrase, and
   *                    optional actionMetadata for UI routing triggers
   */
  public async generateResponse(
    query: string,
    currentZone: string,
    language: string
  ): Promise<{ reply: string; actionMetadata?: Record<string, unknown> }> {
    if (!config.GEMINI_API_KEY) {
      return this.fallbackRuleEngine(query, currentZone, language);
    }

    try {
      const telemetry = this.telemetryRepo.getTelemetry();

      // System instruction grounds the model in FIFA World Cup 2026 context
      // and enforces structured JSON output for reliable UI integration.
      const systemInstruction = `
You are the "Stadium Volunteer Co-Pilot", an AI assistant designed to help stadium volunteers during the FIFA World Cup 2026.
Your primary goals are crowd management, real-time route optimisation, and contextual multilingual assistance.

Current Live Telemetry Data:
${JSON.stringify(telemetry, null, 2)}

Volunteer Location: ${currentZone || "Unknown"}
Target Language for Fan: ${language || "English"}

Instructions:
1. Analyse the telemetry data. A gate is heavily congested if it exceeds 80% capacity.
2. Provide a short reasoning explanation to the volunteer (in English) about why you are suggesting a specific route.
3. Provide the exact phrase the volunteer should speak to the fan (translated into the Target Language, adjusting tone contextually — e.g., medical vs. casual situations).
4. Ensure your routing advice explicitly avoids congested gates or delayed transit lines.

Output Format — strictly as valid JSON, no markdown fences:
{
  "reasoning": "Explanation to volunteer why you chose this route based on telemetry",
  "translatedPhrase": "The phrase in the target language to speak to the fan",
  "actionMetadata": { "type": "SHOW_ROUTE", "target": "gate_id_or_poi" }
}
`;

      const response = await this.ai.models.generateContent({
        model: "gemma-4-26b-a4b-it",
        contents: query,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        },
      });

      const text = response.text;
      if (!text) throw new Error("Empty response from Gemma model");

      const parsed = JSON.parse(text);
      return {
        reply: `**[Reasoning]** ${parsed.reasoning}\n\n**[Speak to Fan]**\n"${parsed.translatedPhrase}"`,
        actionMetadata: parsed.actionMetadata,
      };
    } catch (error) {
      console.warn("LLM API call failed, falling back to rule engine:", error);
      return this.fallbackRuleEngine(query, currentZone, language);
    }
  }

  /**
   * Deterministic rule engine — offline fallback for stadium operations.
   *
   * Uses crowd telemetry from TelemetryRepository to dynamically select
   * the least-congested gate and return structured routing advice without
   * requiring the GenAI API.
   *
   * @param query       User query
   * @param currentZone Volunteer's zone
   * @param language    Target language code
   */
  private fallbackRuleEngine(
    query: string,
    currentZone: string,
    language: string
  ): { reply: string; actionMetadata?: Record<string, unknown> } {
    const q = query.toLowerCase();
    const telemetry = this.telemetryRepo.getTelemetry();

    // Dynamically find the least-congested gate for routing
    const gates: Array<{ gateId: string; capacityPercent: number }> = telemetry.gates ?? [];
    const bestGate = gates.sort((a, b) => a.capacityPercent - b.capacityPercent)[0];
    const bestGateLabel = bestGate ? `${bestGate.gateId} (${bestGate.capacityPercent}% full)` : "Gate C";
    const bestGateId = bestGate ? bestGate.gateId.toLowerCase().replace(/\s+/g, "_") : "gate_c";

    if (q.includes("exit") || q.includes("leave")) {
      return {
        reply: `**[Reasoning]** Based on live telemetry, the clearest exit is via ${bestGateLabel}. Direct the fan there.\n\n**[Speak to Fan]**\n"Please use ${bestGate?.gateId ?? "Gate C"} for a faster exit — it is currently the least crowded."`,
        actionMetadata: { type: "SHOW_ROUTE", target: bestGateId },
      };
    }

    if (q.includes("bathroom") || q.includes("restroom")) {
      return {
        reply: `**[Reasoning]** The nearest restroom is on Level 1. It is uncrowded.\n\n**[Speak to Fan]**\n"The nearest restroom is located 50m away on Level 1."`,
        actionMetadata: { type: "SHOW_MAP_PIN", targetId: "restroom_level_1" },
      };
    }

    if (q.includes("medical") || q.includes("first aid") || q.includes("hurt")) {
      return {
        reply: `**[Reasoning]** Medical priority — direct to the nearest first aid post immediately.\n\n**[Speak to Fan]**\n"Please follow me to the First Aid station on Level G. Help is on the way."`,
        actionMetadata: { type: "SHOW_MAP_PIN", targetId: "first_aid_level_g" },
      };
    }

    return {
      reply: `**[Reasoning]** General assistance required. Offering available services.\n\n**[Speak to Fan]**\n"I am here to help. I can assist you with finding your seat, exits, food, or transit. What do you need?"`,
    };
  }
}
