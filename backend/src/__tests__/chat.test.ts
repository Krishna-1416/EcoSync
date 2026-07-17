import request from 'supertest';
import app from '../app'; // Assume app is exported from app.ts

describe('Chat API Endpoints', () => {
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

    // Check status
    expect(response.status).toBe(200);
    
    // Check response structure
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('reply');
    
    // Check if the reply is a string
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
});
