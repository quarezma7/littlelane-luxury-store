import mongoose from 'mongoose';

const PromoSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  value: { type: Number, required: true },
  type: { type: String, enum: ['percent', 'fixed'], default: 'percent' },
  maxUses: { type: Number, default: 100 },
  uses: { type: Number, default: 0 },
  expiry: { type: String },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Promo || mongoose.model('Promo', PromoSchema);
