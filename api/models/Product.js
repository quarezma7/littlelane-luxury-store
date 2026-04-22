import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  images: [{ type: String }],
  emoji: { type: String },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  stock: { type: Number, required: true },
  active: { type: Boolean, default: true },
  discount: { type: Number, default: 0 },
  sales: { type: Number, default: 0 },
  dateAdded: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
