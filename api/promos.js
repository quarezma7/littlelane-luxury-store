import connectToDatabase from './lib/db.js';
import Promo from './models/Promo.js';

export default async function handler(req, res) {
  try {
    await connectToDatabase();

    if (req.method === 'GET') {
      const promos = await Promo.find({}).sort({ createdAt: -1 });
      return res.status(200).json(promos);
    }

    if (req.method === 'POST') {
      const promo = new Promo(req.body);
      await promo.save();
      return res.status(201).json(promo);
    }

    if (req.method === 'PUT') {
      const { id, ...updateData } = req.body;
      const promo = await Promo.findOneAndUpdate({ id }, updateData, { new: true });
      if (!promo) return res.status(404).json({ error: 'Promo not found' });
      return res.status(200).json(promo);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'ID is required' });
      await Promo.findOneAndDelete({ id });
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
