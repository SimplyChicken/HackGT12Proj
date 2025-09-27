import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  name: String,
  password: String, // hashed if using credentials login
  createdAt: { type: Date, default: Date.now },
  favoriteColor: { type: String, default: "Red" },
});

export default models.User || model("User", UserSchema);
