import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  productId: String,
  name: String,
  size: String,
  qty: Number,
  price: Number,
  emoji: String,
});

const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customer: {
    name: String,
    email: String,
    avatar: String,
  },
  date: String,
  total: Number,
  status: { type: String, enum: ['Delivered', 'Processing', 'Cancelled', 'Shipped', 'Refunded'], default: 'Processing' },
  items: [OrderItemSchema],
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
