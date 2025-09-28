import { Schema, model, models } from "mongoose";

// Sub-schema for Color Pairs - support both old and new formats
const ColorPairSchema = new Schema({
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
}, { _id: false }); // optional: disables automatic _id for sub-documents

// Sub-schema for Font Pairs - support both old and new formats
const FontPairSchema = new Schema({
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
}, { _id: false });

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  name: String,
  password: String,
  createdAt: { type: Date, default: Date.now },
  favoriteColor: { type: String, default: "Red" },
  
  // Enhanced style preferences
  preferences: {
    styleKeywords: [{
      keyword: String,
      category: { 
        type: String, 
        enum: ['color', 'layout', 'typography', 'spacing', 'animation', 'theme', 'component-style'],
        default: 'theme'
      },
      weight: { type: Number, min: 0, max: 1, default: 0.5 },
      usageCount: { type: Number, default: 1 },
      lastUsed: { type: Date, default: Date.now }
    }],
    preferredColors: [{ type: String }],
    preferredThemes: [{ 
      type: String, 
      enum: ['modern', 'minimal', 'bold', 'elegant', 'playful', 'corporate', 'creative'] 
    }],
    componentPreferences: { type: Map, of: Schema.Types.Mixed, default: {} },
    lastUpdated: { type: Date, default: Date.now }
  },
  
  // Color and font pairs from main branch
  colorPairs: { type: [ColorPairSchema], default: [] },
  fontPairs: { type: [FontPairSchema], default: [] },
  
  // Combos - saved combinations of colors and fonts
  combos: [{
    case_id: { type: String, required: true },
    colorPair: ColorPairSchema,
    fontPair: FontPairSchema,
    savedAt: { type: Date, default: Date.now }
  }]
});

// Force delete the old model if it exists to use the new schema
if (models.User) {
  delete models.User;
}

export default model("User", UserSchema);

