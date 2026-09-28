import mongoose, { Document, Schema } from 'mongoose';

export interface IConvention extends Document {
  title: string;
  slug: string;
  posterUrl: string;
  posterPublicId?: string;
  startDate: Date;
  endDate: Date;
  province: string;
  city: string;
  venue?: string;
  address?: string;
  instagramUrl?: string;
  websiteUrl?: string;
  publicationStatus: 'pending' | 'published';
  eventStatus: 'scheduled' | 'postponed' | 'cancelled';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConventionSchema = new Schema<IConvention>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    posterUrl: { type: String, required: true },
    posterPublicId: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    province: { type: String, required: true },
    city: { type: String, required: true },
    venue: { type: String },
    address: { type: String },
    instagramUrl: { type: String },
    websiteUrl: { type: String },
    publicationStatus: {
      type: String,
      enum: ['pending', 'published'],
      default: 'pending',
    },
    eventStatus: {
      type: String,
      enum: ['scheduled', 'postponed', 'cancelled'],
      default: 'scheduled',
    },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

// Índices requeridos por el plan
ConventionSchema.index({ publicationStatus: 1 });
ConventionSchema.index({ eventStatus: 1 });
ConventionSchema.index({ startDate: 1 });
ConventionSchema.index({ province: 1 });
ConventionSchema.index({ userId: 1 });
ConventionSchema.index({ slug: 1 });

// Índices compuestos
ConventionSchema.index({ publicationStatus: 1, startDate: 1 });
ConventionSchema.index({ publicationStatus: 1, province: 1, startDate: 1 });
ConventionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Convention || mongoose.model<IConvention>('Convention', ConventionSchema);
