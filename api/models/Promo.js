import mongoose from 'mongoose';

const PromoSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  type: { type: String, enum: ['Percentage', 'Fixed'], default: 'Percentage' },
  usageLimit: { type: Number, default: 100 },
  usageCount: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Expired', 'Depleted'], default: 'Active' },
}, { timestamps: true });

export default mongoose.models.Promo || mongoose.model('Promo', PromoSchema);
