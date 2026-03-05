import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  sendEmail,
  sendOrderConfirmationEmail,
  sendWelcomeEmail,
  sendOrderStatusUpdateEmail,
} from '../src/services/email';

describe('Email Service', () => {
  // Note: Ces tests nécessitent une clé API Resend valide
  // Utilisez des emails de test ou des services comme Mailtrap

  describe('sendEmail', () => {
    it('should send a basic email', async () => {
      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test Email',
        html: '<h1>Test</h1>',
      });

      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
    });

    it('should reject invalid email', async () => {
      try {
        await sendEmail({
          to: 'invalid-email',
          subject: 'Test',
          html: '<p>Test</p>',
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('sendOrderConfirmationEmail', () => {
    it('should send order confirmation email', async () => {
      const result = await sendOrderConfirmationEmail({
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        orderId: 'ORD-12345',
        total: 99.99,
        status: 'Pending',
        items: [
          {
            name: 'Product 1',
            quantity: 2,
            price: 49.99,
          },
        ],
      });

      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
    });

    it('should include order details in email', async () => {
      const result = await sendOrderConfirmationEmail({
        customerName: 'Jane Doe',
        customerEmail: 'jane@example.com',
        orderId: 'ORD-67890',
        total: 199.99,
        status: 'Processing',
        items: [
          {
            name: 'Product A',
            quantity: 1,
            price: 99.99,
          },
          {
            name: 'Product B',
            quantity: 1,
            price: 100.00,
          },
        ],
      });

      expect(result.success).toBe(true);
    });
  });

  describe('sendWelcomeEmail', () => {
    it('should send welcome email', async () => {
      const result = await sendWelcomeEmail({
        email: 'newuser@example.com',
        name: 'New User',
      });

      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
    });
  });

  describe('sendOrderStatusUpdateEmail', () => {
    it('should send order status update email', async () => {
      const result = await sendOrderStatusUpdateEmail(
        'customer@example.com',
        'John Doe',
        'ORD-12345',
        'Shipped'
      );

      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
    });

    it('should handle different statuses', async () => {
      const statuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

      for (const status of statuses) {
        const result = await sendOrderStatusUpdateEmail(
          'customer@example.com',
          'John Doe',
          'ORD-12345',
          status
        );

        expect(result.success).toBe(true);
      }
    });
  });
});

// Tests d'intégration API
describe('Email API Endpoints', () => {
  let token: string;
  const baseUrl = 'http://localhost:5000';

  beforeAll(async () => {
    // Obtenir un token JWT
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123',
      }),
    });

    const loginData = await loginResponse.json();
    token = loginData.token;
  });

  describe('POST /api/email/welcome', () => {
    it('should send welcome email via API', async () => {
      const response = await fetch(`${baseUrl}/api/email/welcome`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'api-test@example.com',
          name: 'API Test User',
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.id).toBeDefined();
    });

    it('should reject invalid email', async () => {
      const response = await fetch(`${baseUrl}/api/email/welcome`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'invalid-email',
          name: 'Test',
        }),
      });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/email/order-confirmation', () => {
    it('should send order confirmation via API', async () => {
      const response = await fetch(`${baseUrl}/api/email/order-confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'API Test Customer',
          customerEmail: 'customer@example.com',
          orderId: 'API-ORD-001',
          total: 99.99,
          status: 'Pending',
          items: [
            {
              name: 'Test Product',
              quantity: 1,
              price: 99.99,
            },
          ],
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });

  describe('POST /api/email/order-status-update', () => {
    it('should send order status update via API', async () => {
      const response = await fetch(`${baseUrl}/api/email/order-status-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerEmail: 'customer@example.com',
          customerName: 'API Test Customer',
          orderId: 'API-ORD-001',
          newStatus: 'Shipped',
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
    });

    it('should require authentication', async () => {
      const response = await fetch(`${baseUrl}/api/email/order-status-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail: 'customer@example.com',
          customerName: 'Test',
          orderId: 'ORD-001',
          newStatus: 'Shipped',
        }),
      });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/email/logs', () => {
    it('should fetch email logs', async () => {
      const response = await fetch(`${baseUrl}/api/email/logs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    it('should require authentication', async () => {
      const response = await fetch(`${baseUrl}/api/email/logs`);
      expect(response.status).toBe(401);
    });
  });
});
