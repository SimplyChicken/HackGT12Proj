import { Schema, model, models } from "mongoose";

const SavedComponentSchema = new Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  description: { type: String },
  props: { type: Map, of: Schema.Types.Mixed },
  style: { type: String },
  features: [{ type: String }],
  preferences: { type: Map, of: Schema.Types.Mixed },
  userInputs: [{ type: String }],
  analyzedPreferences: { type: Map, of: Schema.Types.Mixed },
  savedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Create index for efficient querying by userId
SavedComponentSchema.index({ userId: 1, savedAt: -1 });

export default models.SavedComponent || model("SavedComponent", SavedComponentSchema);
