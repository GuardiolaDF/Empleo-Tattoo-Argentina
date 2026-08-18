import mongoose, { Document, Schema } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  discountPercent: number;
  maxUses: number;
  currentUses: number;
  active: boolean;
  usedBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountPercent: { type: Number, required: true, default: 100 },
    maxUses: { type: Number, required: true, default: 10 },
    currentUses: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    usedBy: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);
