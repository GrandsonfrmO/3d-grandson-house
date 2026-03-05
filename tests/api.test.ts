import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const API_URL = 'http://localhost:5000/api';
let authToken: string;

describe('API Tests', () => {
  // Authentication Tests
  describe('Authentication', () => {
    it('should login with valid credentials', async () => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'admin123' }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.token).toBeDefined();
      expect(data.expiresIn).toBe('24h');
      authToken = data.token;
    });

    it('should reject invalid credentials', async () => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'wrong' }),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Invalid credentials');
    });

    it('should reject missing credentials', async () => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin' }),
      });

      expect(response.status).toBe(400);
    });
  });

  // Products Tests
  describe('Products', () => {
    it('should fetch all products', async () => {
      const response = await fetch(`${API_URL}/products`);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    it('should create a product with authentication', async () => {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: 'Test Product',
          price: 29.99,
          stock: 100,
          status: 'Active',
          image: 'https://example.com/image.jpg',
        }),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.name).toBe('Test Product');
      expect(data.price).toBe('29.99');
    });

    it('should reject product creation without authentication', async () => {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Product',
          price: 29.99,
          stock: 100,
        }),
      });

      expect(response.status).toBe(401);
    });

    it('should validate product data', async () => {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: 'Test Product',
          price: -10, // Invalid: negative price
          stock: 100,
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });
  });

  // Orders Tests
  describe('Orders', () => {
    it('should fetch all orders', async () => {
      const response = await fetch(`${API_URL}/orders`);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    it('should create an order', async () => {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `#ORD-TEST-${Date.now()}`,
          customer: 'Test Customer',
          date: new Date().toISOString(),
          total: 99.99,
          status: 'Pending',
        }),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.customer).toBe('Test Customer');
      expect(data.status).toBe('Pending');
    });

    it('should validate order data', async () => {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `#ORD-TEST-${Date.now()}`,
          customer: '', // Invalid: empty customer
          total: 99.99,
        }),
      });

      expect(response.status).toBe(400);
    });

    it('should update order status with authentication', async () => {
      // First create an order
      const createResponse = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `#ORD-UPDATE-${Date.now()}`,
          customer: 'Test Customer',
          date: new Date().toISOString(),
          total: 99.99,
          status: 'Pending',
        }),
      });

      const order = await createResponse.json();

      // Then update it
      const updateResponse = await fetch(`${API_URL}/orders/${order.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status: 'Shipped' }),
      });

      expect(updateResponse.status).toBe(200);
      const data = await updateResponse.json();
      expect(data.status).toBe('Shipped');
    });

    it('should reject invalid order status', async () => {
      const response = await fetch(`${API_URL}/orders/%23ORD-001`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status: 'InvalidStatus' }),
      });

      expect(response.status).toBe(400);
    });
  });

  // Game Scores Tests
  describe('Game Scores', () => {
    it('should save a game score', async () => {
      const response = await fetch(`${API_URL}/game-scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_name: 'Test Game',
          player_name: 'Test Player',
          score: 1000,
        }),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.game_name).toBe('Test Game');
      expect(data.score).toBe(1000);
    });

    it('should fetch game scores', async () => {
      const response = await fetch(`${API_URL}/game-scores/Basketball`);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    it('should validate game score data', async () => {
      const response = await fetch(`${API_URL}/game-scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_name: 'Test Game',
          player_name: '', // Invalid: empty player name
          score: 1000,
        }),
      });

      expect(response.status).toBe(400);
    });
  });

  // Health Check
  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await fetch(`${API_URL}/health`);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.status).toBe('ok');
      expect(data.timestamp).toBeDefined();
    });
  });
});
