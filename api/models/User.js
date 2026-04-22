import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['Admin', 'Manager', 'Customer', 'admin', 'customer', 'manager'], default: 'Customer' },
  avatar: String,
  status: { type: String, enum: ['Active', 'Inactive', 'active', 'inactive', 'suspended', 'Suspended'], default: 'Active' },
  lastActive: String,
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
