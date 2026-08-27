require('dotenv').config({path: '.env.local'});
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, { tlsInsecure: true })
  .then(async () => {
    const db = mongoose.connection.db;
    const users = await db.collection('users').find({
      $or: [
        {name: /diamante|diamamnte/i},
        {email: /diamante|diamamnte/i}
      ]
    }).toArray();
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
