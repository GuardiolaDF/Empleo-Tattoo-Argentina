import connectToDatabase from './src/lib/mongodb.js';
import clientPromise from './src/lib/mongoClient.js';

async function run() {
  try {
    const client = await clientPromise;
    const db = client.db();
    console.log("Database name:", db.databaseName);
    
    const users = await db.collection("users").find({}).toArray();
    console.log("Users:", users);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
