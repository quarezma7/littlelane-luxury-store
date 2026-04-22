import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { PRODUCTS, ORDERS, USERS, PROMO_CODES } from './src/data/seed.js';
import Product from './api/models/Product.js';
import Order from './api/models/Order.js';
import User from './api/models/User.js';
import Promo from './api/models/Promo.js';

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB. Seeding data...');

    await Product.deleteMany({});
    await Order.deleteMany({});
    await User.deleteMany({});
    await Promo.deleteMany({});

    await Product.insertMany(PRODUCTS);
    await Order.insertMany(ORDERS);
    await User.insertMany(USERS);
    await Promo.insertMany(PROMO_CODES);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
