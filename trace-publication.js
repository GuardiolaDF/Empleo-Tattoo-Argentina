import connectToDatabase from './src/lib/mongodb.js';
import clientPromise from './src/lib/mongoClient.js';

async function run() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const email = "belenavila1993@gmail.com";
    const studioName = "tu vieja";

    const user = await db.collection("users").findOne({ email });
    console.log("=== USER ===");
    console.log(user);

    const jobsByEmail = await db.collection("jobs").find({ contactEmail: new RegExp(email, 'i') }).toArray();
    console.log("\n=== JOBS BY EMAIL ===");
    console.log(jobsByEmail);

    const jobsByStudio = await db.collection("jobs").find({ studioName: new RegExp(studioName, 'i') }).toArray();
    console.log("\n=== JOBS BY STUDIO ===");
    console.log(jobsByStudio);

    const studiosByEmail = await db.collection("studios").find({ contactEmail: new RegExp(email, 'i') }).toArray();
    console.log("\n=== STUDIOS BY EMAIL ===");
    console.log(studiosByEmail);

    const studiosByName = await db.collection("studios").find({ name: new RegExp(studioName, 'i') }).toArray();
    console.log("\n=== STUDIOS BY NAME ===");
    console.log(studiosByName);
    
    // Also check jobs by userId if exists
    if (user) {
      const jobsByUserId = await db.collection("jobs").find({ userId: user._id.toString() }).toArray();
      console.log("\n=== JOBS BY USER ID ===");
      console.log(jobsByUserId);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
