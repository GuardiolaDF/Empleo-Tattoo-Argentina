require('dotenv').config({path: '.env.local'});
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, { tlsInsecure: true })
  .then(async () => {
    const db = mongoose.connection.db;
    const twoDaysAgo = new Date(Date.now() - 48*60*60*1000);
    const jobs = await db.collection('jobs').find({ createdAt: { $gte: twoDaysAgo } }).toArray();
    console.log(JSON.stringify(jobs.map(j => ({id: j._id, name: j.studioName, status: j.status, createdAt: j.createdAt})), null, 2));
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
