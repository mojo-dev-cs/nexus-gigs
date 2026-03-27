import mongoose, { Schema, model, models } from "mongoose";

const JobSchema = new Schema({
  clientClerkId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ["open", "in-progress", "completed"], default: "open" },
}, { timestamps: true });

export default models.Job || model("Job", JobSchema);