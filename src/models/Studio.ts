import mongoose, { Document, Schema } from 'mongoose';

export interface IStudio extends Document {
  userId: string;
  nombre: string;
  anio: string;
  ubicacion: string;
  bio: string;
  instagram: string;
  whatsapp: string;
  countryCode: string;
  website?: string;
  especialidades: string[];
  fotos: string[]; // Cloudinary URLs
  portada?: string; // Cover image URL, separate from gallery
  status: 'active' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

const StudioSchema = new Schema<IStudio>(
  {
    userId: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    anio: { type: String, required: true },
    ubicacion: { type: String, required: true },
    bio: { type: String, required: true },
    instagram: { type: String, required: true },
    whatsapp: { type: String, required: true },
    countryCode: { type: String, default: '54' },
    website: { type: String },
    especialidades: [{ type: String }],
    fotos: [{ type: String }],
    portada: { type: String },
    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Studio || mongoose.model<IStudio>('Studio', StudioSchema);
