import request from 'supertest';
import app from '../app';

describe('Telemetry API Endpoints', () => {
  it('should fetch the default synthetic telemetry data', async () => {
    const response = await request(app).get('/api/v1/telemetry');
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('gates');
    expect(response.body.data).toHaveProperty('transit');
  });

  it('should allow uploading new telemetry data (Jury Evaluation)', async () => {
    const newTelemetry = {
      gates: [
        { gateId: 'Gate A', capacityPercent: 99, status: 'Restricted' }
      ]
    };

    const response = await request(app)
      .post('/api/v1/telemetry/upload')
      .send(newTelemetry);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    
    // Verify it updated
    const getRes = await request(app).get('/api/v1/telemetry');
    expect(getRes.body.data.gates[0].capacityPercent).toBe(99);
  });

  it('should handle invalid telemetry upload gracefully', async () => {
    // Edge case: malformed data structure (should not crash server)
    const response = await request(app)
      .post('/api/v1/telemetry/upload')
      .send("NOT_JSON");

    expect([400, 500]).toContain(response.status);
  });
});
