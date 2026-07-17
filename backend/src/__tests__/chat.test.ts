import request from 'supertest';
import app from '../app';

jest.setTimeout(30000);

describe('Chat API Endpoints - Edge Cases', () => {
  it('should return a generated response for a valid chat request', async () => {
    const response = await request(app)
      .post('/api/v1/chat')
      .send({
        message: 'Where is my seat?',
        context: {
          currentZone: 'North Gate',
          language: 'en'
        }
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('reply');
    expect(typeof response.body.data.reply).toBe('string');
  });

  it('should return 400 for missing message in request body', async () => {
    const response = await request(app)
      .post('/api/v1/chat')
      .send({
        context: {
          currentZone: 'North Gate'
        }
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
  });

  it('should handle edge case: missing language and zone gracefully', async () => {
    const response = await request(app)
      .post('/api/v1/chat')
      .send({
        message: 'I need to exit'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.reply).toContain('[Reasoning]');
  });

  it('should handle edge case: extremely long message', async () => {
    const longMessage = 'a'.repeat(5000);
    const response = await request(app)
      .post('/api/v1/chat')
      .send({
        message: longMessage,
        context: { language: 'en' }
      });
      
    // Should be handled gracefully, likely rejected by Zod validation if max length is set,
    // or processed. In our current Zod schema, we didn't specify max length, so it's a 200 or 400.
    // Assuming standard 200 or 400.
    expect([200, 400]).toContain(response.status);
  });
});
