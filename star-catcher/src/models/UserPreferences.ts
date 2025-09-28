import { Schema, model, models } from "mongoose";

const UserPreferencesSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  
  // Raw extracted data from OpenAI analysis
  extractedThemes: [{ type: String }],
  extractedColors: [{ type: String }],
  extractedStyles: [{ type: String }],
  extractedKeywords: [{ type: String }],
  extractedPatterns: [{ type: String }],
  
  // Processed preferences with weights and usage tracking
  styleKeywords: [{
    keyword: String,
    category: { 
      type: String, 
      enum: ['color', 'layout', 'typography', 'spacing', 'animation', 'theme', 'component-style', 'pattern'],
      default: 'theme'
    },
    weight: { type: Number, min: 0, max: 1, default: 0.5 },
    usageCount: { type: Number, default: 1 },
    lastUsed: { type: Date, default: Date.now },
    source: { type: String, enum: ['user-input', 'ai-analysis'], default: 'user-input' }
  }],
  
  // Aggregated preferences
  preferredColors: [{ type: String }],
  preferredThemes: [{ type: String }], // No enum restriction - let AI generate themes
  preferredStyles: [{ type: String }],
  preferredPatterns: [{ type: String }],
  
  // Component-specific preferences
  componentPreferences: { type: Map, of: Schema.Types.Mixed, default: {} },
  
  // Analysis metadata
  analysisCount: { type: Number, default: 0 },
  lastAnalysis: { type: Date },
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export default models.UserPreferences || model("UserPreferences", UserPreferencesSchema);
