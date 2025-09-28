// src/updateDefaults.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// ----------------- User Schema -----------------
const ColorPairSchema = new mongoose.Schema(
  {
    case_id: { type: String, required: true },
    // New format
    primary: {
      name: { type: String },
      value: {
        type: String,
        match: /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/,
      },
      contrast: { type: String },
    },
    secondary: {
      name: { type: String },
      value: {
        type: String,
        match: /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/,
      },
      contrast: { type: String },
    },
    accent: {
      name: { type: String },
      value: {
        type: String,
        match: /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/,
      },
      contrast: { type: String },
    },
    // Old format (for backward compatibility)
    color: {
      type: String,
      match: /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/,
    },
    color2: {
      type: String,
      match: /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/,
    },
  },
  { _id: false }
);

const FontPairSchema = new mongoose.Schema(
  {
    case_id: { type: String, required: true },
    // New format
    primary: {
      name: { type: String },
      googleFontUrl: { type: String },
      weight: { type: String },
      style: { type: String },
      usage: { type: String },
    },
    secondary: {
      name: { type: String },
      googleFontUrl: { type: String },
      weight: { type: String },
      style: { type: String },
      usage: { type: String },
    },
    // Old format (for backward compatibility)
    font: { type: String },
    font2: { type: String },
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
  { 
    case_id: "default1", 
    primary: { name: "Primary Red", value: "#FF0000", contrast: "#FFFFFF" },
    secondary: { name: "Secondary Green", value: "#00FF00", contrast: "#000000" },
    accent: { name: "Accent Blue", value: "#0000FF", contrast: "#FFFFFF" }
  },
  { 
    case_id: "default2", 
    primary: { name: "Primary Blue", value: "#0000FF", contrast: "#FFFFFF" },
    secondary: { name: "Secondary Yellow", value: "#FFFF00", contrast: "#000000" },
    accent: { name: "Accent Red", value: "#FF0000", contrast: "#FFFFFF" }
  },
];

const defaultFontPairs = [
  { 
    case_id: "default1", 
    primary: { 
      name: "Arial", 
      googleFontUrl: "https://fonts.googleapis.com/css2?family=Arial:wght@400&display=swap",
      weight: "400",
      style: "normal",
      usage: "Use for headings and titles"
    },
    secondary: { 
      name: "Helvetica", 
      googleFontUrl: "https://fonts.googleapis.com/css2?family=Helvetica:wght@400&display=swap",
      weight: "400",
      style: "normal",
      usage: "Use for body text and supporting content"
    }
  },
  { 
    case_id: "default2", 
    primary: { 
      name: "Times New Roman", 
      googleFontUrl: "https://fonts.googleapis.com/css2?family=Times+New+Roman:wght@400&display=swap",
      weight: "400",
      style: "normal",
      usage: "Use for headings and titles"
    },
    secondary: { 
      name: "Courier", 
      googleFontUrl: "https://fonts.googleapis.com/css2?family=Courier:wght@400&display=swap",
      weight: "400",
      style: "normal",
      usage: "Use for body text and supporting content"
    }
  },
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
