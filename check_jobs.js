const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const jobs = await mongoose.connection.collection('jobs').find({ status: 'active' }).toArray();
  console.log(JSON.stringify(jobs, null, 2));
  process.exit(0);
}

check();
