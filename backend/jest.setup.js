/**
 * Jest setup file for backend tests.
 *
 * Clears GEMINI_API_KEY so all chat tests use the deterministic
 * rule-engine fallback path. This keeps tests fast (<2s), hermetic,
 * and independent of network connectivity or API quota limits.
 *
 * The live Gemma 26B integration is validated manually in staging.
 */
process.env.GEMINI_API_KEY = '';
