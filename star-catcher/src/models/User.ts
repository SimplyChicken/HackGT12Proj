import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  name: String,
  password: String, // hashed if using credentials login
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
  }
});

export default models.User || model("User", UserSchema);
