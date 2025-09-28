import { Schema, model, models } from "mongoose";

// Sub-schema for Color Pairs
const ColorPairSchema = new Schema({
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
}, { _id: false }); // optional: disables automatic _id for sub-documents

// Sub-schema for Font Pairs
const FontPairSchema = new Schema({
  case_id: { type: String, required: true },
  font: { type: String, required: true, default: "Arial" },
  font2: { type: String, required: true, default: "sans-serif" },
}, { _id: false });

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  name: String,
  password: String,
  createdAt: { type: Date, default: Date.now },
  favoriteColor: { type: String, default: "Red" },
  colorPairs: { type: [ColorPairSchema], default: [] },
  fontPairs: { type: [FontPairSchema], default: [] },
});

export default models.User || model("User", UserSchema);

