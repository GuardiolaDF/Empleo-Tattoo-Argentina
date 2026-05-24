import mongoose, { Document, Schema } from 'mongoose';

export type EventType = 'job_view' | 'whatsapp_click' | 'instagram_click' | 'studio_view';

export interface IAnalyticsEvent extends Document {
  eventType: EventType;
  jobId?: string;
  studioUserId: string; // Owner of the studio receiving the interaction
  createdAt: Date;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    eventType: {
      type: String,
      required: true,
      enum: ['job_view', 'whatsapp_click', 'instagram_click', 'studio_view'],
    },
    jobId: { type: String },
    studioUserId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

// Compound index for efficient querying
AnalyticsEventSchema.index({ studioUserId: 1, eventType: 1, createdAt: -1 });

export default mongoose.models.AnalyticsEvent ||
  mongoose.model<IAnalyticsEvent>('AnalyticsEvent', AnalyticsEventSchema);
