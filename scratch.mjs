import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: String,
  status: String,
  paymentId: String,
}, { strict: false });
const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const jobs = await Job.find().sort({ createdAt: -1 }).limit(5);
    console.log('--- LATEST 5 JOBS ---');
    jobs.forEach(j => {
      console.log(`ID: ${j._id} | Title: ${j.title} | Status: ${j.status} | Payment ID: ${j.paymentId || 'NONE'}`);
    });
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
check();
