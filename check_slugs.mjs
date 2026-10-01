import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB.");
  
  const schema = new mongoose.Schema({}, { strict: false });
  const Convention = mongoose.models.Convention || mongoose.model('Convention', schema);
  
  const convs = await Convention.find({}).lean();
  console.log("Conventions in DB:");
  convs.forEach(c => console.log(`_id: ${c._id}, slug: ${c.slug}, title: ${c.title}`));
  process.exit(0);
}
run();
