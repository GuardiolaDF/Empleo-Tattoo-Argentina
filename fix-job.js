const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://guardioladario_db_user:CHrS6t8PY4rAGmFI@etaback.9akkhxd.mongodb.net/?appName=ETAback').then(async () => {
  try {
    const db = mongoose.connection.useDb('eta_beta');
    const result = await db.collection('jobs').updateOne(
      { _id: new mongoose.Types.ObjectId('6a188fe46e5de7a6baa4100d') },
      { $set: { status: 'active', paymentId: 'fixed_manually' } }
    );
    console.log(result);
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
});
