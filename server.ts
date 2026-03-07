import express, { Request, Response, NextFunction } from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

// Load environment variables FIRST
dotenv.config();

import { monitoring } from './src/monitoring/index';
import { backupManager } from './src/backup/index';
import { createAdminRouter } from './src/routes/admin';
import {
  sendEmail,
  sendOrderConfirmationEmail,
  sendWelcomeEmail,
  sendOrderStatusUpdateEmail,
} from './src/services/email';

const app = express();
const PORT = process.env.PORT || 5000;

// SECURITY: Never use a hardcoded fallback for JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined.');
  process.exit(1);
}

// Logger utility
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data || '');
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error || '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data || '');
  },
};

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // SECURITY: Set to true in production to prevent MITM attacks
    rejectUnauthorized: process.env.NODE_ENV === 'production',
  },
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`, { ip: req.ip });
  next();
});

// Monitoring middleware
app.use(monitoring.requestMetricsMiddleware());

// JWT Authentication middleware
interface AuthRequest extends Request {
  user?: { id: string; role: string; username?: string };
}

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    logger.warn('Missing authentication token', { path: req.path });
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Invalid token', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Validation utilities
const validators = {
  isValidEmail: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  isValidZipCode: (zip: string) => /^\d{5}(-\d{4})?$/.test(zip),
  isValidCardNumber: (card: string) => /^\d{16}$/.test(card.replace(/\s/g, '')),
  isPositiveNumber: (num: any) => typeof num === 'number' && num > 0,
  isNonEmptyString: (str: any) => typeof str === 'string' && str.trim().length > 0,
};

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount admin routes
const adminRouter = createAdminRouter(pool, JWT_SECRET);
app.use('/api/admin', adminRouter);

// Initialize database
async function initializeDatabase() {
  try {
    const client = await pool.connect();
    
    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        status VARCHAR(50) NOT NULL DEFAULT 'Active',
        image TEXT,
        description TEXT,
        category VARCHAR(100),
        sizes TEXT,
        colors TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS posters (
        id VARCHAR(50) PRIMARY KEY,
        room VARCHAR(100) NOT NULL,
        location VARCHAR(100) NOT NULL,
        image TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS screens (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        customer VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        address TEXT,
        city VARCHAR(100),
        date TIMESTAMP NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(50) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        quantity INTEGER NOT NULL,
        image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS game_scores (
        id SERIAL PRIMARY KEY,
        game_name VARCHAR(100) NOT NULL,
        player_name VARCHAR(255) NOT NULL,
        score INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS email_logs (
        id SERIAL PRIMARY KEY,
        recipient VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        email_type VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'sent',
        resend_id VARCHAR(255),
        error_message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    logger.info('Database tables initialized');

    // Add missing columns to products table if they don't exist
    try {
      await client.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT');
      await client.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS category VARCHAR(100)');
      await client.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS sizes TEXT');
      await client.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS colors TEXT');
      // Drop old single-value columns if they exist
      try {
        await client.query('ALTER TABLE products DROP COLUMN IF EXISTS size');
        await client.query('ALTER TABLE products DROP COLUMN IF EXISTS color');
      } catch (e) {
        // Columns might not exist, that's fine
      }
      logger.info('Product table columns migrated');
    } catch (err) {
      logger.info('Product columns already exist or migration skipped');
    }

    // Initialize default screens if they don't exist
    const screensCheck = await client.query('SELECT COUNT(*) FROM screens');
    if (screensCheck.rows[0].count === '0') {
      await client.query(`
        INSERT INTO screens (id, name, image) VALUES
        ('pcLeft', 'PC Left Monitor', 'https://picsum.photos/seed/pcleft/400/300'),
        ('pcMain', 'PC Main Monitor', 'https://picsum.photos/seed/pcmain/800/600'),
        ('tv', 'TV Screen', 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif')
      `);
      logger.info('Default screens initialized');
    }

    client.release();
  } catch (error) {
    logger.error('Database initialization error', error);
  }
}

// PRODUCTS ENDPOINTS (Public)
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    logger.info('Fetching products');
    const result = await pool.query('SELECT * FROM products WHERE status=$1 ORDER BY id', ['Active']);
    res.json(result.rows);
  } catch (error) {
    logger.error('Failed to fetch products', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POSTERS ENDPOINTS (Public)
app.get('/api/posters', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM posters WHERE status=$1 ORDER BY room, location', ['Active']);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posters' });
  }
});

// Update posters (Protected)
// SECURITY: Applied authenticateToken to prevent unauthorized defacement
app.put('/api/posters/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { image, room, location, status } = req.body;

    // Allow empty images for deletion
    if (image === undefined) {
      return res.status(400).json({ error: 'Image field is required' });
    }

    logger.info('Updating poster', { id, imageLength: image ? image.length : 0 });
    
    const result = await pool.query(
      'UPDATE posters SET image=$1, room=$2, location=$3, status=$4, updated_at=CURRENT_TIMESTAMP WHERE id=$5 RETURNING *',
      [image || null, room || null, location || null, status || 'Active', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Poster not found' });
    }

    logger.info('Poster updated successfully', { id });
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Failed to update poster', error);
    res.status(500).json({ error: 'Failed to update poster', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// SCREENS ENDPOINTS (Public)
app.get('/api/screens', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM screens ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch screens' });
  }
});

// Update screens (Protected)
// SECURITY: Applied authenticateToken to prevent unauthorized defacement
app.put('/api/screens/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { image } = req.body;

    // Allow empty images for deletion
    if (image === undefined) {
      return res.status(400).json({ error: 'Image field is required' });
    }

    logger.info('Updating screen', { id, imageLength: image ? image.length : 0 });
    
    // Only update the image field, keep the name as is
    const result = await pool.query(
      'UPDATE screens SET image=$1, updated_at=CURRENT_TIMESTAMP WHERE id=$2 RETURNING *',
      [image || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Screen not found' });
    }

    logger.info('Screen updated successfully', { id });
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Failed to update screen', error);
    res.status(500).json({ error: 'Failed to update screen', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// ORDERS ENDPOINTS (Protected)
// SECURITY: Applied authenticateToken to prevent public data leak of customer info
app.get('/api/orders', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    logger.info('Fetching orders', { user: req.user?.username });
    const result = await pool.query('SELECT * FROM orders ORDER BY date DESC');
    
    // Fetch items for each order
    const ordersWithItems = await Promise.all(
      result.rows.map(async (order: any) => {
        const itemsResult = await pool.query(
          'SELECT * FROM order_items WHERE order_id = $1',
          [order.id]
        );
        return {
          ...order,
          items: itemsResult.rows
        };
      })
    );
    
    res.json(ordersWithItems);
  } catch (error) {
    logger.error('Failed to fetch orders', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const { id, customer, email, phone, address, city, date, total, status, items } = req.body;

    // Validate input
    if (!validators.isNonEmptyString(id)) {
      return res.status(400).json({ error: 'Order ID is required' });
    }
    if (!validators.isNonEmptyString(customer)) {
      return res.status(400).json({ error: 'Customer name is required' });
    }
    if (!validators.isPositiveNumber(parseFloat(total))) {
      return res.status(400).json({ error: 'Total must be a positive number' });
    }

    logger.info('Creating order', { id, customer, total });
    
    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Insert order
      const orderResult = await client.query(
        'INSERT INTO orders (id, customer, email, phone, address, city, date, total, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [id, customer, email || null, phone || null, address || null, city || null, date || new Date(), total, status || 'Pending']
      );

      // Insert order items if provided
      if (items && Array.isArray(items)) {
        for (const item of items) {
          await client.query(
            'INSERT INTO order_items (order_id, product_id, name, price, quantity, image) VALUES ($1, $2, $3, $4, $5, $6)',
            [id, item.id || null, item.name, item.price, item.quantity, item.image || null]
          );
        }
      }

      await client.query('COMMIT');
      res.status(201).json(orderResult.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    logger.error('Failed to create order', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.put('/api/orders/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    logger.info('Updating order status', { id, status, user: req.user?.username });
    const result = await pool.query(
      'UPDATE orders SET status=$1, updated_at=CURRENT_TIMESTAMP WHERE id=$2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Failed to update order', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// GAME SCORES ENDPOINTS
app.get('/api/game-scores/:gameName', async (req: Request, res: Response) => {
  try {
    const { gameName } = req.params;
    logger.info('Fetching game scores', { gameName });
    
    const result = await pool.query(
      'SELECT * FROM game_scores WHERE game_name=$1 ORDER BY score DESC LIMIT 10',
      [gameName]
    );
    res.json(result.rows);
  } catch (error) {
    logger.error('Failed to fetch game scores', error);
    res.status(500).json({ error: 'Failed to fetch game scores' });
  }
});

app.post('/api/game-scores', async (req: Request, res: Response) => {
  try {
    const { game_name, player_name, score } = req.body;

    // Validate input
    if (!validators.isNonEmptyString(game_name)) {
      return res.status(400).json({ error: 'Game name is required' });
    }
    if (!validators.isNonEmptyString(player_name)) {
      return res.status(400).json({ error: 'Player name is required' });
    }
    if (typeof score !== 'number' || score < 0) {
      return res.status(400).json({ error: 'Score must be a non-negative number' });
    }

    logger.info('Saving game score', { game_name, player_name, score });
    const result = await pool.query(
      'INSERT INTO game_scores (game_name, player_name, score) VALUES ($1, $2, $3) RETURNING *',
      [game_name, player_name, score]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error('Failed to save game score', error);
    res.status(500).json({ error: 'Failed to save game score' });
  }
});

// EMAIL ENDPOINTS
app.post('/api/email/send', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { to, subject, html } = req.body;

    // Validate input
    if (!validators.isValidEmail(to)) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }
    if (!validators.isNonEmptyString(subject)) {
      return res.status(400).json({ error: 'Subject is required' });
    }
    if (!validators.isNonEmptyString(html)) {
      return res.status(400).json({ error: 'HTML content is required' });
    }

    logger.info('Sending email', { to, subject, user: req.user?.username });

    const result = await sendEmail({ to, subject, html });

    // Log email in database
    await pool.query(
      'INSERT INTO email_logs (recipient, subject, email_type, status, resend_id) VALUES ($1, $2, $3, $4, $5)',
      [to, subject, 'custom', 'sent', result.id]
    );

    res.json({ success: true, id: result.id });
  } catch (error) {
    logger.error('Failed to send email', error);
    
    // Log error in database
    const { to, subject } = req.body;
    await pool.query(
      'INSERT INTO email_logs (recipient, subject, email_type, status, error_message) VALUES ($1, $2, $3, $4, $5)',
      [to, subject, 'custom', 'failed', (error as Error).message]
    );

    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/api/email/order-confirmation', async (req: Request, res: Response) => {
  try {
    const { customerName, customerEmail, orderId, total, status, items } = req.body;

    // Validate input
    if (!validators.isValidEmail(customerEmail)) {
      return res.status(400).json({ error: 'Valid customer email is required' });
    }
    if (!validators.isNonEmptyString(customerName)) {
      return res.status(400).json({ error: 'Customer name is required' });
    }
    if (!validators.isNonEmptyString(orderId)) {
      return res.status(400).json({ error: 'Order ID is required' });
    }
    if (!validators.isPositiveNumber(total)) {
      return res.status(400).json({ error: 'Total must be a positive number' });
    }

    logger.info('Sending order confirmation email', { orderId, customerEmail });

    const result = await sendOrderConfirmationEmail({
      customerName,
      customerEmail,
      orderId,
      total,
      status,
      items,
    });

    // Log email in database
    await pool.query(
      'INSERT INTO email_logs (recipient, subject, email_type, status, resend_id) VALUES ($1, $2, $3, $4, $5)',
      [customerEmail, `Confirmation de commande #${orderId}`, 'order_confirmation', 'sent', result.id]
    );

    res.json({ success: true, id: result.id });
  } catch (error) {
    logger.error('Failed to send order confirmation email', error);
    
    const { customerEmail, orderId } = req.body;
    await pool.query(
      'INSERT INTO email_logs (recipient, subject, email_type, status, error_message) VALUES ($1, $2, $3, $4, $5)',
      [customerEmail, `Confirmation de commande #${orderId}`, 'order_confirmation', 'failed', (error as Error).message]
    );

    res.status(500).json({ error: 'Failed to send order confirmation email' });
  }
});

app.post('/api/email/welcome', async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    // Validate input
    if (!validators.isValidEmail(email)) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }
    if (!validators.isNonEmptyString(name)) {
      return res.status(400).json({ error: 'Name is required' });
    }

    logger.info('Sending welcome email', { email, name });

    const result = await sendWelcomeEmail({ email, name });

    // Log email in database
    await pool.query(
      'INSERT INTO email_logs (recipient, subject, email_type, status, resend_id) VALUES ($1, $2, $3, $4, $5)',
      [email, 'Bienvenue !', 'welcome', 'sent', result.id]
    );

    res.json({ success: true, id: result.id });
  } catch (error) {
    logger.error('Failed to send welcome email', error);
    
    const { email } = req.body;
    await pool.query(
      'INSERT INTO email_logs (recipient, subject, email_type, status, error_message) VALUES ($1, $2, $3, $4, $5)',
      [email, 'Bienvenue !', 'welcome', 'failed', (error as Error).message]
    );

    res.status(500).json({ error: 'Failed to send welcome email' });
  }
});

app.post('/api/email/order-status-update', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { customerEmail, customerName, orderId, newStatus } = req.body;

    // Validate input
    if (!validators.isValidEmail(customerEmail)) {
      return res.status(400).json({ error: 'Valid customer email is required' });
    }
    if (!validators.isNonEmptyString(customerName)) {
      return res.status(400).json({ error: 'Customer name is required' });
    }
    if (!validators.isNonEmptyString(orderId)) {
      return res.status(400).json({ error: 'Order ID is required' });
    }
    if (!validators.isNonEmptyString(newStatus)) {
      return res.status(400).json({ error: 'Status is required' });
    }

    logger.info('Sending order status update email', { orderId, newStatus, user: req.user?.username });

    const result = await sendOrderStatusUpdateEmail(customerEmail, customerName, orderId, newStatus);

    // Log email in database
    await pool.query(
      'INSERT INTO email_logs (recipient, subject, email_type, status, resend_id) VALUES ($1, $2, $3, $4, $5)',
      [customerEmail, `Mise à jour de votre commande #${orderId}`, 'order_status_update', 'sent', result.id]
    );

    res.json({ success: true, id: result.id });
  } catch (error) {
    logger.error('Failed to send order status update email', error);
    
    const { customerEmail, orderId } = req.body;
    await pool.query(
      'INSERT INTO email_logs (recipient, subject, email_type, status, error_message) VALUES ($1, $2, $3, $4, $5)',
      [customerEmail, `Mise à jour de votre commande #${orderId}`, 'order_status_update', 'failed', (error as Error).message]
    );

    res.status(500).json({ error: 'Failed to send order status update email' });
  }
});

app.get('/api/email/logs', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    logger.info('Fetching email logs', { user: req.user?.username });
    const result = await pool.query(
      'SELECT * FROM email_logs ORDER BY created_at DESC LIMIT 100'
    );
    res.json(result.rows);
  } catch (error) {
    logger.error('Failed to fetch email logs', error);
    res.status(500).json({ error: 'Failed to fetch email logs' });
  }
});

// BACKUP ENDPOINTS
app.post('/api/backup/create', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    logger.info('Creating manual backup');
    const result = await backupManager.createBackup();
    
    if (result.success) {
      res.json({ success: true, backup: result });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    logger.error('Failed to create backup', error);
    res.status(500).json({ error: 'Failed to create backup' });
  }
});

app.get('/api/backup/list', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const backups = await backupManager.listBackups();
    const details = await Promise.all(
      backups.map(async (filename) => await backupManager.getBackupDetails(filename))
    );
    res.json({ backups: details.filter(d => d !== null) });
  } catch (error) {
    logger.error('Failed to list backups', error);
    res.status(500).json({ error: 'Failed to list backups' });
  }
});

app.post('/api/backup/restore/:filename', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { filename } = req.params;
    logger.info('Restoring backup', { filename });
    const result = await backupManager.restoreBackup(filename);
    
    if (result.success) {
      res.json({ success: true, backup: result });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    logger.error('Failed to restore backup', error);
    res.status(500).json({ error: 'Failed to restore backup' });
  }
});

// Start server
async function start() {
  await initializeDatabase();
  
  const server = app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
    logger.info(`Database: ${process.env.DATABASE_URL?.split('@')[1]}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  // Collect system metrics every 30 seconds
  setInterval(() => {
    monitoring.collectSystemMetrics();
  }, 30000);

  // Automatic backup every 24 hours (if enabled)
  if (process.env.BACKUP_ENABLED === 'true') {
    logger.info('Automatic backups enabled - scheduled for 2 AM daily');
    
    // Create backup on startup
    await backupManager.createBackup();
    
    // Schedule daily backups at 2 AM
    setInterval(async () => {
      const now = new Date();
      if (now.getHours() === 2 && now.getMinutes() === 0) {
        logger.info('Running scheduled backup');
        await backupManager.createBackup();
      }
    }, 60000); // Check every minute
  }

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  });
}

start().catch((error) => {
  logger.error('Failed to start server', error);
  process.exit(1);
});