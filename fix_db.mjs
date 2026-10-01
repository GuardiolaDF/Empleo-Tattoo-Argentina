import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');
  
  console.log('Uploading image...');
  const result = await cloudinary.uploader.upload('C:/Users/Fabi/.gemini/antigravity/brain/ca395827-6162-4431-bd82-b71eb540e333/.user_uploaded/media_1790817125516.jpg', {
    folder: 'eta-studios',
    transformation: [{ quality: 'auto', fetch_format: 'auto' }]
  });
  console.log('Uploaded to:', result.secure_url);
  
  const db = mongoose.connection.db;
  const col = db.collection('conventions');
  
  const updateResult = await col.updateOne(
    { title: { $regex: /San Miguel/i } },
    { $set: { 
        posterUrl: result.secure_url,
        posterPublicId: result.public_id,
        scheduleDetails: 'Apertura 12:00hs tanto sábado como domingo.\nPremiación a partir de las 20:00hs.'
      } 
    }
  );
  
  console.log('Updated:', updateResult.modifiedCount);
  process.exit(0);
}
run().catch(console.error);
