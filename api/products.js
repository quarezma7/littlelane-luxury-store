import connectToDatabase from './lib/db.js';
import Product from './models/Product.js';

export default async function handler(req, res) {
  try {
    await connectToDatabase();

    if (req.method === 'GET') {
      const products = await Product.find({}).sort({ dateAdded: -1 });
      return res.status(200).json(products);
    }

    if (req.method === 'POST') {
      const product = new Product(req.body);
      await product.save();
      return res.status(201).json(product);
    }

    if (req.method === 'PUT') {
      const { id, ...updateData } = req.body;
      const product = await Product.findOneAndUpdate({ id }, updateData, { new: true });
      if (!product) return res.status(404).json({ error: 'Product not found' });
      return res.status(200).json(product);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'ID is required' });
      await Product.findOneAndDelete({ id });
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
