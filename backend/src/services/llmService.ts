import { config } from "../config/unifiedConfig";

export class LlmService {
  public async generateResponse(query: string, currentZone: string, language: string): Promise<{ reply: string; actionMetadata?: any }> {
    if (!config.GEMINI_API_KEY) {
      return this.fallbackRuleEngine(query, currentZone, language);
    }

    try {
      // Real API implementation placeholder (if API key is present)
      // For this hackathon, we combine the rule engine and API key detection.
      return this.fallbackRuleEngine(query, currentZone, language);
    } catch (error) {
      // Fallback
      console.warn("LLM API call failed, falling back to rule engine:", error);
      return this.fallbackRuleEngine(query, currentZone, language);
    }
  }

  private fallbackRuleEngine(query: string, currentZone: string, language: string): { reply: string; actionMetadata?: any } {
    const q = query.toLowerCase();

    // Map localized queries if needed, for simplicity we use keywords
    if (q.includes("seat") || q.includes("where is my")) {
      return {
        reply: `Based on your location near ${currentZone || "North Gate"}, Section 104 is a 4-minute walk straight ahead. Follow the green line path on your screen.`,
        actionMetadata: { type: "SHOW_ROUTE", target: "section_104" }
      };
    }
    if (q.includes("food") || q.includes("vegan") || q.includes("eat")) {
      return {
        reply: "There is a 'Green Goal Vegan' food stall located at Gate B, Level 1. It currently has a short 5-minute queue. Would you like me to map the path?",
        actionMetadata: { type: "SHOW_MAP_PIN", targetId: "vegan_stall_gate_b" }
      };
    }
    if (q.includes("transit") || q.includes("metro") || q.includes("train") || q.includes("leave")) {
      return {
        reply: "The Metro system is running normally. The nearest Red Line train towards City Center departs in 6 minutes from the North exit.",
        actionMetadata: { type: "SHOW_TRANSIT_STATUS", targetId: "red_line" }
      };
    }
    if (q.includes("bathroom") || q.includes("restroom")) {
      return {
        reply: "The nearest restroom is located 50m away on Level 1. It is currently reported as uncrowded.",
        actionMetadata: { type: "SHOW_MAP_PIN", targetId: "restroom_level_1" }
      };
    }

    return {
      reply: "I am your Smart Stadium Concierge. I can help you find your seat, locate amenities like restaurants and restrooms, or give you transit advice. How can I assist you?",
    };
  }
}
