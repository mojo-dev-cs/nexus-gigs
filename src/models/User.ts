import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  role: { type: String, enum: ["freelancer", "client"], required: true },
  onboardingComplete: { type: Boolean, default: false },
}, { timestamps: true });

export default models.User || model("User", UserSchema);