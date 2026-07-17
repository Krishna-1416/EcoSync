import { config } from "../config/unifiedConfig";
import { GoogleGenAI } from "@google/genai";
import { TelemetryRepository } from "../repositories/TelemetryRepository";

export class LlmService {
  private ai: GoogleGenAI;
  private telemetryRepo: TelemetryRepository;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY || "mock-key" });
    this.telemetryRepo = TelemetryRepository.getInstance();
  }

  public async generateResponse(query: string, currentZone: string, language: string): Promise<{ reply: string; actionMetadata?: any }> {
    if (!config.GEMINI_API_KEY) {
      return this.fallbackRuleEngine(query, currentZone, language);
    }

    try {
      const telemetry = this.telemetryRepo.getTelemetry();
      const systemInstruction = `
You are the "Stadium Volunteer Co-Pilot", an AI assistant designed to help stadium volunteers during the FIFA World Cup 2026.
Your primary goals are crowd management and contextual multilingual assistance.

Current Telemetry Data:
${JSON.stringify(telemetry, null, 2)}

Volunteer Location: ${currentZone || 'Unknown'}
Target Language for Fan: ${language || 'English'}

Instructions:
1. Analyze the telemetry data. If a gate is over 80% capacity, it is heavily congested.
2. Provide a short reasoning explanation to the volunteer (in English) about why you are suggesting a specific route.
3. Provide the exact phrase the volunteer should speak to the fan (translated into the Target Language, adjusting the tone contextually e.g. medical vs casual).
4. Ensure your routing advice explicitly avoids congestion levels of the gates or transit delays.

Output Format strictly as JSON:
{
  "reasoning": "Explanation to volunteer why you chose this route based on telemetry",
  "translatedPhrase": "The phrase in the target language to speak to the fan",
  "actionMetadata": { "type": "SHOW_ROUTE", "target": "gate_id_or_poi" }
}
`;

      const response = await this.ai.models.generateContent({
        model: 'gemma-4-26b-a4b-it',
        contents: query,
        config: {
          systemInstruction,
          responseMimeType: "application/json"
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty response from Gemini");
      
      const parsed = JSON.parse(text);
      return {
        reply: `**[Reasoning]** ${parsed.reasoning}\n\n**[Speak to Fan]**\n"${parsed.translatedPhrase}"`,
        actionMetadata: parsed.actionMetadata
      };
    } catch (error) {
      console.warn("LLM API call failed, falling back to rule engine:", error);
      return this.fallbackRuleEngine(query, currentZone, language);
    }
  }

  private fallbackRuleEngine(query: string, currentZone: string, language: string): { reply: string; actionMetadata?: any } {
    const q = query.toLowerCase();

    // Contextual fallback for volunteer
    if (q.includes("exit") || q.includes("leave")) {
      return {
        reply: `**[Reasoning]** Gate B is currently at 85% capacity (congested). Direct the fan to Gate C which is at 20% capacity.\n\n**[Speak to Fan]**\n"Please use Gate C for a faster exit, as Gate B is currently very crowded."`,
        actionMetadata: { type: "SHOW_ROUTE", target: "gate_c" }
      };
    }
    
    if (q.includes("bathroom") || q.includes("restroom")) {
      return {
        reply: `**[Reasoning]** The nearest restroom is on Level 1. It is uncrowded.\n\n**[Speak to Fan]**\n"The nearest restroom is located 50m away on Level 1."`,
        actionMetadata: { type: "SHOW_MAP_PIN", targetId: "restroom_level_1" }
      };
    }

    return {
      reply: `**[Reasoning]** General assistance required.\n\n**[Speak to Fan]**\n"I am here to help. How can I assist you?"`,
    };
  }
}
