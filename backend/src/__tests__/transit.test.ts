import request from 'supertest';
import app from '../app';

describe('Transit API Endpoints', () => {
  it('should fetch real-time transit updates successfully', async () => {
    const response = await request(app).get('/api/v1/transit');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data');
    expect(typeof response.body.data).toBe('object');
    expect(response.body.data).toHaveProperty('metro');
    expect(response.body.data).toHaveProperty('rideshare');
  });
});
