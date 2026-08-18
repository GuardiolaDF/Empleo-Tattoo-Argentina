import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  studioName: string;
  location: string;
  description: string;
  category: string;
  style?: string;
  price?: number;
  status: 'pending' | 'active';
  paymentId?: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    studioName: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    style: { type: String },
    price: { type: Number },
    status: {
      type: String,
      enum: ['pending', 'active'],
      default: 'pending',
    },
    paymentId: { type: String },
    userId: { type: String },
  },
JobSchema.index({ status: 1, createdAt: -1 });
JobSchema.index({ userId: 1 });

export default mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);

