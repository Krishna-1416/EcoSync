import { NextResponse } from 'next/server';
import { CartItem } from '../../../types';

// In-memory cache for duplicate queries (LRU / Simple Map)
const queryCache = new Map<string, { co2_kg: number; relatable_comparison: string; micro_nudge: string; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// Clean stale items from cache to avoid memory leaks
function cleanStaleCache() {
  const now = Date.now();
  for (const [key, value] of queryCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      queryCache.delete(key);
    }
  }
}

// Simple prompt injection detection and neutralization
function sanitizeCustomPrompt(prompt: string): string {
  if (!prompt) return '';
  // Basic patterns trying to override system prompts
  const injectionPatterns = [
    /ignore previous/i,
    /system prompt/i,
    /you are now/i,
    /act as/i,
    /new instruction/i,
    /override/i
  ];
  let sanitized = prompt;
  for (const pattern of injectionPatterns) {
    sanitized = sanitized.replace(pattern, '[neutralized]');
  }
  return sanitized.slice(0, 500); // Limit maximum characters to avoid token exploitation
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customPrompt } = body;

    // Input validation
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Request body must include a non-empty "items" array.' },
        { status: 400 }
      );
    }
    if (customPrompt !== undefined && typeof customPrompt !== 'string') {
      return NextResponse.json(
        { error: '"customPrompt" must be a string if provided.' },
        { status: 400 }
      );
    }

    const sanitizedPrompt = sanitizeCustomPrompt(customPrompt || '');

    // Hash items and prompt to create cache key
    const cacheKey = JSON.stringify({ items, prompt: sanitizedPrompt });
    cleanStaleCache();
    if (queryCache.has(cacheKey)) {
      const cachedResponse = queryCache.get(cacheKey)!;
      return NextResponse.json({
        co2_kg: cachedResponse.co2_kg,
        relatable_comparison: cachedResponse.relatable_comparison,
        micro_nudge: cachedResponse.micro_nudge,
        _cached: true,
      });
    }

    // Check header for Reviewer API Key first, then fall back to environment variable
    const authHeader = request.headers.get('Authorization') || '';
    const reviewerKey = authHeader.replace('Bearer ', '').trim();
    const apiKey = reviewerKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is missing. Please set GEMINI_API_KEY in .env.local or enter a Reviewer API Key in settings.' },
        { status: 401 }
      );
    }

    const itemsSummary = (items as CartItem[])
      .map((item) =>
        `- ${item.quantity}x ${item.name} [${item.category}] (~${item.baseCo2} kg CO₂ per unit = ~${(item.baseCo2 * item.quantity).toFixed(3)} kg CO₂ subtotal)`
      )
      .join('\n');

    const totalEstimate = (items as CartItem[]).reduce(
      (acc: number, item) => acc + item.baseCo2 * item.quantity,
      0
    );

    const promptText = `You are an expert environmental scientist. Analyze the total carbon footprint of these activities:

${itemsSummary}

Pre-calculated subtotal: ~${totalEstimate.toFixed(3)} kg CO₂ (use this as a reference baseline, verify with your own knowledge).
Additional context from the user: ${sanitizedPrompt || 'None provided.'}

Please:
1. Calculate (or verify) the total carbon emissions in kg of CO2 equivalent across all items.
2. Provide one vivid, relatable real-world comparison (e.g., "equivalent to driving X km in a petrol car" or "the same as charging Y smartphones").
3. Provide one friendly, actionable green micro-nudge — a specific alternative habit or substitution the user can try to reduce their footprint.

Be scientific but conversational.`;

    const modelName = 'gemini-3.1-flash-lite';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const geminiPayload = {
      contents: [
        {
          parts: [{ text: promptText }],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            co2_kg: {
              type: 'NUMBER',
              description: 'Calculated carbon emissions in kg.',
            },
            relatable_comparison: {
              type: 'STRING',
              description: 'A comparison to everyday things, e.g., smartphone charging or driving distance.',
            },
            micro_nudge: {
              type: 'STRING',
              description: 'A polite, actionable nudge recommending a lower emission action.',
            },
          },
          required: ['co2_kg', 'relatable_comparison', 'micro_nudge'],
        },
      },
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(geminiPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `LLM API call failed: ${response.statusText}. Details: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResult) {
      return NextResponse.json(
        { error: 'No response content returned from the generative model.' },
        { status: 500 }
      );
    }

    // Parse the JSON output returned by the model
    let parsedResult: { co2_kg: number; relatable_comparison: string; micro_nudge: string };
    try {
      parsedResult = JSON.parse(textResult.trim());
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse LLM JSON response. The model returned malformed output.' },
        { status: 502 }
      );
    }

    // Schema guard — validate the strict contract before forwarding to the client
    if (
      !Number.isFinite(parsedResult.co2_kg) ||
      parsedResult.co2_kg < 0 ||
      typeof parsedResult.relatable_comparison !== 'string' ||
      parsedResult.relatable_comparison.trim() === '' ||
      typeof parsedResult.micro_nudge !== 'string' ||
      parsedResult.micro_nudge.trim() === ''
    ) {
      return NextResponse.json(
        { error: 'LLM response did not conform to the required schema: { co2_kg: number, relatable_comparison: string, micro_nudge: string }' },
        { status: 502 }
      );
    }

    // Save to cache
    queryCache.set(cacheKey, {
      co2_kg: parsedResult.co2_kg,
      relatable_comparison: parsedResult.relatable_comparison,
      micro_nudge: parsedResult.micro_nudge,
      timestamp: Date.now(),
    });

    return NextResponse.json({
      co2_kg: parsedResult.co2_kg,
      relatable_comparison: parsedResult.relatable_comparison,
      micro_nudge: parsedResult.micro_nudge,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An internal server error occurred.';
    console.error('API Error:', error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
