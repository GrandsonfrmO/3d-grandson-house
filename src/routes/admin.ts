import { Router, Request, Response, NextFunction } from 'express';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: { id: string; role: string; username?: string };
}

export function createAdminRouter(pool: Pool, JWT_SECRET: string) {
  const router = Router();

  // Middleware d'authentification
  const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
  };

  // LOGIN
  router.post('/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
      }

      const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

      if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: 'admin', role: 'admin', username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ token, expiresIn: '24h' });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // PRODUCTS
  router.get('/products', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const result = await pool.query('SELECT * FROM products ORDER BY id DESC');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  router.post('/products', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const { name, price, stock, status, image, description, category, sizes, colors } = req.body;

      if (!name || !price || stock === undefined) {
        return res.status(400).json({ error: 'Name, price, and stock are required' });
      }

      const result = await pool.query(
        'INSERT INTO products (name, price, stock, status, image, description, category, sizes, colors) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [
          name,
          price,
          stock,
          status || 'Active',
          image || null,
          description || '',
          category || '',
          JSON.stringify(sizes || []),
          JSON.stringify(colors || [])
        ]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create product' });
    }
  });

  router.put('/products/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { name, price, stock, status, image, description, category, sizes, colors } = req.body;

      const result = await pool.query(
        'UPDATE products SET name=$1, price=$2, stock=$3, status=$4, image=$5, description=$6, category=$7, sizes=$8, colors=$9, updated_at=CURRENT_TIMESTAMP WHERE id=$10 RETURNING *',
        [
          name,
          price,
          stock,
          status,
          image,
          description,
          category,
          JSON.stringify(sizes || []),
          JSON.stringify(colors || []),
          id
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update product' });
    }
  });

  router.delete('/products/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM products WHERE id=$1 RETURNING id', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({ success: true, id });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });

  // ORDERS
  router.get('/orders', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const result = await pool.query('SELECT * FROM orders ORDER BY date DESC');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  router.get('/orders/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM orders WHERE id=$1', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  });

  router.put('/orders/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
      }

      const result = await pool.query(
        'UPDATE orders SET status=$1, updated_at=CURRENT_TIMESTAMP WHERE id=$2 RETURNING *',
        [status, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update order' });
    }
  });

  // POSTERS
  router.get('/posters', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const result = await pool.query('SELECT * FROM posters ORDER BY room, location');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch posters' });
    }
  });

  router.post('/posters', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const { id, room, location, image, status } = req.body;

      if (!id || !room || !location) {
        return res.status(400).json({ error: 'ID, room, and location are required' });
      }

      const result = await pool.query(
        'INSERT INTO posters (id, room, location, image, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [id, room, location, image || null, status || 'Active']
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create poster' });
    }
  });

  router.put('/posters/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { room, location, image, status } = req.body;

      const result = await pool.query(
        'UPDATE posters SET room=$1, location=$2, image=$3, status=$4, updated_at=CURRENT_TIMESTAMP WHERE id=$5 RETURNING *',
        [room, location, image, status, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Poster not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update poster' });
    }
  });

  router.delete('/posters/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM posters WHERE id=$1 RETURNING id', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Poster not found' });
      }

      res.json({ success: true, id });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete poster' });
    }
  });

  // SCREENS
  router.get('/screens', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const result = await pool.query('SELECT * FROM screens ORDER BY id');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch screens' });
    }
  });

  router.put('/screens/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { image, name } = req.body;

      const result = await pool.query(
        'UPDATE screens SET image=$1, name=$2, updated_at=CURRENT_TIMESTAMP WHERE id=$3 RETURNING *',
        [image, name, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Screen not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update screen' });
    }
  });

  // DASHBOARD STATS
  router.get('/stats', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const productsCount = await pool.query('SELECT COUNT(*) FROM products');
      const ordersCount = await pool.query('SELECT COUNT(*) FROM orders');
      const totalRevenue = await pool.query('SELECT SUM(total) FROM orders WHERE status != $1', ['Cancelled']);
      const recentOrders = await pool.query('SELECT * FROM orders ORDER BY date DESC LIMIT 5');

      res.json({
        productsCount: parseInt(productsCount.rows[0].count),
        ordersCount: parseInt(ordersCount.rows[0].count),
        totalRevenue: parseFloat(totalRevenue.rows[0].sum || 0),
        recentOrders: recentOrders.rows
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  return router;
}
