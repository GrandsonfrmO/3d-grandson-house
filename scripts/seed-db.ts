import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function seedDatabase() {
  const client = await pool.connect();

  try {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await client.query('DELETE FROM game_scores');
    await client.query('DELETE FROM orders');
    await client.query('DELETE FROM screens');
    await client.query('DELETE FROM posters');
    await client.query('DELETE FROM products');

    // Insert products
    const products = [
      { name: 'Grandson Hoodie v1', price: 65, stock: 45, status: 'Active', image: 'https://picsum.photos/seed/hoodie1/400/400' },
      { name: 'Cyberpunk Tee', price: 35, stock: 12, status: 'Low Stock', image: 'https://picsum.photos/seed/tee1/400/400' },
      { name: 'Neon Joggers', price: 55, stock: 0, status: 'Out of Stock', image: 'https://picsum.photos/seed/joggers1/400/400' },
      { name: 'Gamer Beanie', price: 25, stock: 156, status: 'Active', image: 'https://picsum.photos/seed/beanie1/400/400' },
      { name: 'RGB Mousepad', price: 30, stock: 89, status: 'Active', image: 'https://picsum.photos/seed/mousepad1/400/400' },
      { name: 'Grandson Cap', price: 20, stock: 210, status: 'Active', image: 'https://picsum.photos/seed/cap1/400/400' },
      { name: 'Animated LED Glasses', price: 45, stock: 34, status: 'Active', image: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif' },
    ];

    for (const product of products) {
      await client.query(
        'INSERT INTO products (name, price, stock, status, image) VALUES ($1, $2, $3, $4, $5)',
        [product.name, product.price, product.stock, product.status, product.image]
      );
    }
    console.log('✅ Products inserted');

    // Insert posters
    const posters = [
      { id: 'gamingMainLeft', room: 'Gaming Room', location: 'Main Wall (Left)', image: 'https://picsum.photos/seed/poster1/400/600', status: 'Active' },
      { id: 'gamingMainRight', room: 'Gaming Room', location: 'Main Wall (Right)', image: 'https://picsum.photos/seed/poster2/400/600', status: 'Active' },
      { id: 'gamingRight1', room: 'Gaming Room', location: 'Right Wall (Top Left)', image: 'https://picsum.photos/seed/poster3/400/600', status: 'Active' },
      { id: 'gamingRight2', room: 'Gaming Room', location: 'Right Wall (Top Right)', image: 'https://picsum.photos/seed/poster4/400/600', status: 'Active' },
      { id: 'gamingRight3', room: 'Gaming Room', location: 'Right Wall (Bottom)', image: 'https://picsum.photos/seed/poster5/400/600', status: 'Active' },
      { id: 'gamingLeft1', room: 'Gaming Room', location: 'Left Wall (Top Left)', image: 'https://picsum.photos/seed/poster6/400/600', status: 'Active' },
      { id: 'gamingLeft2', room: 'Gaming Room', location: 'Left Wall (Top Right)', image: 'https://picsum.photos/seed/poster7/400/600', status: 'Active' },
      { id: 'gamingLeft3', room: 'Gaming Room', location: 'Left Wall (Bottom)', image: 'https://picsum.photos/seed/poster8/400/600', status: 'Active' },
      { id: 'bedroom1', room: 'Bedroom', location: 'Above Bed (Left)', image: 'https://picsum.photos/seed/poster9/400/600', status: 'Active' },
      { id: 'bedroom2', room: 'Bedroom', location: 'Above Bed (Right)', image: 'https://picsum.photos/seed/poster10/400/600', status: 'Active' },
      { id: 'bedroomLeft1', room: 'Bedroom', location: 'Left Wall (Top)', image: 'https://picsum.photos/seed/poster11/400/600', status: 'Active' },
      { id: 'bedroomLeft2', room: 'Bedroom', location: 'Left Wall (Bottom Right)', image: 'https://picsum.photos/seed/poster12/400/600', status: 'Active' },
      { id: 'bedroomLeft3', room: 'Bedroom', location: 'Left Wall (Bottom Left)', image: 'https://picsum.photos/seed/poster13/400/600', status: 'Active' },
    ];

    for (const poster of posters) {
      await client.query(
        'INSERT INTO posters (id, room, location, image, status) VALUES ($1, $2, $3, $4, $5)',
        [poster.id, poster.room, poster.location, poster.image, poster.status]
      );
    }
    console.log('✅ Posters inserted');

    // Insert screens
    const screens = [
      { id: 'pcLeft', name: 'PC Left Screen', image: 'https://picsum.photos/seed/pcleft/400/300' },
      { id: 'pcMain', name: 'PC Main Screen', image: 'https://picsum.photos/seed/pcmain/800/600' },
      { id: 'tv', name: 'TV Screen', image: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif' },
    ];

    for (const screen of screens) {
      await client.query(
        'INSERT INTO screens (id, name, image) VALUES ($1, $2, $3)',
        [screen.id, screen.name, screen.image]
      );
    }
    console.log('✅ Screens inserted');

    // Insert orders
    const orders = [
      { id: '#ORD-001', customer: 'Alex Johnson', date: new Date('2026-02-26'), total: 120.00, status: 'Delivered' },
      { id: '#ORD-002', customer: 'Sarah Smith', date: new Date('2026-02-26'), total: 65.00, status: 'Processing' },
      { id: '#ORD-003', customer: 'Mike Brown', date: new Date('2026-02-25'), total: 210.00, status: 'Shipped' },
      { id: '#ORD-004', customer: 'Emma Wilson', date: new Date('2026-02-25'), total: 45.00, status: 'Pending' },
    ];

    for (const order of orders) {
      await client.query(
        'INSERT INTO orders (id, customer, date, total, status) VALUES ($1, $2, $3, $4, $5)',
        [order.id, order.customer, order.date, order.total, order.status]
      );
    }
    console.log('✅ Orders inserted');

    console.log('🎉 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase();
