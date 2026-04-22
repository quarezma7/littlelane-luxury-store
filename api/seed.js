import connectToDatabase from './lib/db.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import User from './models/User.js';
import Promo from './models/Promo.js';
import { PRODUCTS, ORDERS, USERS, PROMO_CODES } from '../src/data/seed.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed. Use POST to seed.' });
    }

    await connectToDatabase();

    // Clear existing data
    await Product.deleteMany({});
    await Order.deleteMany({});
    await User.deleteMany({});
    await Promo.deleteMany({});

    // Insert new seed data
    await Product.insertMany(PRODUCTS);
    await Order.insertMany(ORDERS);
    await User.insertMany(USERS);
    await Promo.insertMany(PROMO_CODES);

    return res.status(200).json({ success: true, message: 'Database seeded successfully with initial data!' });
  } catch (error) {
    console.error('Seed Error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
