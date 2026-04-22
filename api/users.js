import connectToDatabase from './lib/db.js';
import User from './models/User.js';

export default async function handler(req, res) {
  try {
    await connectToDatabase();

    if (req.method === 'GET') {
      const users = await User.find({}).sort({ createdAt: -1 });
      return res.status(200).json(users);
    }

    if (req.method === 'POST') {
      const user = new User(req.body);
      await user.save();
      return res.status(201).json(user);
    }

    if (req.method === 'PUT') {
      const { id, ...updateData } = req.body;
      const user = await User.findOneAndUpdate({ id }, updateData, { new: true });
      if (!user) return res.status(404).json({ error: 'User not found' });
      return res.status(200).json(user);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'ID is required' });
      await User.findOneAndDelete({ id });
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
