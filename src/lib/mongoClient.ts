import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';
import connectToDatabase from './mongodb';

// Reuse the existing Mongoose connection's underlying MongoClient
// This avoids DNS SRV resolution issues that can occur with a separate native client
const clientPromise: Promise<MongoClient> = connectToDatabase().then(() => {
  return mongoose.connection.getClient() as unknown as MongoClient;
});

export default clientPromise;
