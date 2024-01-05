// Import necessary modules and dependencies
const request = require('supertest');
const express = require('express');
const rateLimitMiddleware = require('../middlewares/rateLimit');

// Create an instance of the Express application
const app = express();

// Apply the rateLimitMiddleware to the Express application
app.use(rateLimitMiddleware);

// Define a simple route for testing purposes
app.get('/test', (req, res) => {
  res.send('OK');
});

// Describe block for Rate Limit Middleware testing
describe('Rate Limit Middleware', () => {

  // Test case: should allow requests within the limit
  it('should allow requests within the limit', async () => {
    // Send 99 requests to '/test' within the time window
    for (let i = 0; i < 99; i++) {
      await request(app).get('/test').expect(200);
    }

    // The 100th request should still be allowed
    await request(app).get('/test').expect(200);
  });

  // Test case: should block requests beyond the limit
  it('should block requests beyond the limit', async () => {
    // Send 101 requests to '/test' within the time window
    for (let i = 0; i < 101; i++) {
      await request(app).get('/test').expect(429);
    }
  });
});
