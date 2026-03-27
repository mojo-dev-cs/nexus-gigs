import mongoose, { Schema, model, models } from "mongoose";

const JobSchema = new Schema({
  clientClerkId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  category: { type: String, required: true }, // e.g., Web Dev, Design, Marketing
  status: { type: String, enum: ["open", "in-progress", "completed"], default: "open" },
}, { timestamps: true });

const Job = models.Job || model("Job", JobSchema);
export default Job;