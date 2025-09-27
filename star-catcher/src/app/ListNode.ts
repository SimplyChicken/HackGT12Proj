import mongoose from "mongoose";
import dotenv from "dotenv";

// Load .env.local reliably even from subfolders
dotenv.config({ path: ".env.local" });

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌ MONGODB_URI not defined in .env.local");
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    if (!db) throw new Error("No database connection available");

    // List all collections
    const collections = await db.listCollections().toArray();
    if (collections.length === 0) {
      console.log("⚠️ No collections found yet.");
    } else {
      console.log("Collections found:");
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        console.log(`- ${col.name}: ${count} document(s)`);
      }
    }

    // --- Changed: avoid dynamic imports that can fail under ESM/ts-node ---
    // Use an existing registered mongoose model if available, otherwise define and register it inline.
    let UserModel: any;
    if ((mongoose as any).models && (mongoose as any).models.User) {
      UserModel = (mongoose as any).models.User;
    } else {
      const userSchema = new mongoose.Schema({
        email: { type: String, unique: true, required: true },
        name: String,
        password: String,
        createdAt: { type: Date, default: Date.now },
        favoriteColor: { type: String, default: "Red" },
      });
      UserModel = mongoose.model("User", userSchema);
    }

    // Check if any users exist
    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      console.log("⚠️ No users found. Inserting dummy user...");

      await UserModel.create({
        email: "testuser@example.com",
        name: "Test User",
        password: "hashedpassword123", // just a placeholder
        favoriteColor: "blue",
      });

      console.log("✅ Dummy user inserted!");
    } else {
      console.log(`✅ Users already exist: ${userCount}`);
    }

    // Disconnect
    await mongoose.disconnect();
    console.log("Disconnected.");
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

main();
