// src/updateDefaults.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// ----------------- User Schema -----------------
const ColorPairSchema = new mongoose.Schema(
  {
    case_id: { type: String, required: true },
    color: {
      type: String,
      required: true,
      match: /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/,
      default: "#FFFFFF",
    },
    color2: {
      type: String,
      required: true,
      match: /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/,
      default: "#000000",
    },
  },
  { _id: false }
);

const FontPairSchema = new mongoose.Schema(
  {
    case_id: { type: String, required: true },
    font: { type: String, required: true, default: "Arial" },
    font2: { type: String, required: true, default: "sans-serif" },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  name: String,
  password: String,
  createdAt: { type: Date, default: Date.now },
  favoriteColor: { type: String, default: "Red" },
  colorPairs: { type: [ColorPairSchema], default: [] },
  fontPairs: { type: [FontPairSchema], default: [] },
});

const User = mongoose.model("User", UserSchema);

// ----------------- Merge Defaults -----------------
const defaultColorPairs = [
  { case_id: "default1", color: "#FF0000", color2: "#00FF00" },
  { case_id: "default2", color: "#0000FF", color2: "#FFFF00" },
];

const defaultFontPairs = [
  { case_id: "default1", font: "Arial", font2: "Helvetica" },
  { case_id: "default2", font: "Times New Roman", font2: "Courier" },
];

async function updateDefaults() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI not defined in .env.local");

    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");

    const users = await User.find({});
    for (const user of users) {
      let updated = false;

      // Merge colorPairs
      const existingCaseIds = new Set(user.colorPairs.map((c: any) => c.case_id));
      for (const pair of defaultColorPairs) {
        if (!existingCaseIds.has(pair.case_id)) {
          user.colorPairs.push(pair);
          updated = true;
        }
      }

      // Merge fontPairs
      const existingFontCaseIds = new Set(user.fontPairs.map((f: any) => f.case_id));
      for (const pair of defaultFontPairs) {
        if (!existingFontCaseIds.has(pair.case_id)) {
          user.fontPairs.push(pair);
          updated = true;
        }
      }

      if (updated) {
        await user.save();
        console.log(`✅ Updated user: ${user.email}`);
      }
    }

    console.log("✅ All existing users updated with defaults");
    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error updating users:", err);
    process.exit(1);
  }
}

// Run the script
updateDefaults();
