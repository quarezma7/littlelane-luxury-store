import connectToDatabase from './lib/db.js';
import Order from './models/Order.js';

export default async function handler(req, res) {
  try {
    await connectToDatabase();

    if (req.method === 'GET') {
      const orders = await Order.find({}).sort({ createdAt: -1 });
      return res.status(200).json(orders);
    }

    if (req.method === 'POST') {
      const order = new Order(req.body);
      await order.save();
      return res.status(201).json(order);
    }

    if (req.method === 'PUT') {
      const { id, ...updateData } = req.body;
      const order = await Order.findOneAndUpdate({ id }, updateData, { new: true });
      if (!order) return res.status(404).json({ error: 'Order not found' });
      return res.status(200).json(order);
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
