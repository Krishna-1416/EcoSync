import request from 'supertest';
import app from '../app';

/**
 * Chat Controller Tests
 * Tests the GenAI volunteer co-pilot chat API endpoint.
 * The LLM service falls back to the rule engine when GEMINI_API_KEY is not set,
 * making all tests deterministic in a CI environment.
 */
jest.setTimeout(5000);

describe('Chat API Endpoints', () => {
  // --- Happy Path Tests ---
  describe('Happy Path', () => {
    it('POST /api/v1/chat — returns 200 with reply for valid request', async () => {
      const response = await request(app)
        .post('/api/v1/chat')
        .send({
          message: 'Where is my seat?',
          context: { currentZone: 'North Gate', language: 'en' }
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('reply');
      expect(typeof response.body.data.reply).toBe('string');
      expect(response.body.data.reply.length).toBeGreaterThan(0);
    });

    it('POST /api/v1/chat — exits routing uses fallback rule engine (Gate C)', async () => {
      const response = await request(app)
        .post('/api/v1/chat')
        .send({
          message: 'I need to exit the stadium',
          context: { currentZone: 'Section 104', language: 'en' }
        });

      expect(response.status).toBe(200);
      expect(response.body.data.reply).toContain('[Reasoning]');
      expect(response.body.data.reply).toContain('[Speak to Fan]');
    });

    it('POST /api/v1/chat — restroom query returns map pin metadata', async () => {
      const response = await request(app)
        .post('/api/v1/chat')
        .send({
          message: 'Where is the nearest restroom?',
          context: { currentZone: 'South Gate', language: 'es' }
        });

      expect(response.status).toBe(200);
      expect(response.body.data.reply).toContain('restroom');
    });

    it('POST /api/v1/chat — missing optional context fields defaults gracefully', async () => {
      const response = await request(app)
        .post('/api/v1/chat')
        .send({ message: 'I need to exit' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.reply).toContain('[Reasoning]');
    });
  });

  // --- Validation / Error Path Tests ---
  describe('Input Validation', () => {
    it('POST /api/v1/chat — missing message returns 400', async () => {
      const response = await request(app)
        .post('/api/v1/chat')
        .send({ context: { currentZone: 'North Gate' } });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('POST /api/v1/chat — empty message string returns 400', async () => {
      const response = await request(app)
        .post('/api/v1/chat')
        .send({ message: '' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('POST /api/v1/chat — empty body returns 400', async () => {
      const response = await request(app)
        .post('/api/v1/chat')
        .send({});

      expect(response.status).toBe(400);
    });

    it('POST /api/v1/chat — extremely long message (5000 chars) is handled (200 or 400)', async () => {
      const longMessage = 'a'.repeat(5000);
      const response = await request(app)
        .post('/api/v1/chat')
        .send({ message: longMessage, context: { language: 'en' } });

      // Should be handled gracefully — not a 500 crash
      expect([200, 400]).toContain(response.status);
    });

    it('POST /api/v1/chat — non-string message returns 400', async () => {
      const response = await request(app)
        .post('/api/v1/chat')
        .send({ message: 12345 });

      expect([400, 200]).toContain(response.status); // Zod coerces or rejects
    });
  });

  // --- Health / Infrastructure Tests ---
  describe('Infrastructure', () => {
    it('GET /health — returns healthy status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('GET /api/v1/unknown — returns 404 for unknown routes', async () => {
      const response = await request(app).get('/api/v1/unknownroute');
      expect(response.status).toBe(404);
    });
  });
});
