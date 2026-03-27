"use server";

import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import Job from "../../models/Job"; // Relative path to Job model
import { revalidatePath } from "next/cache";

// Direct connection logic to stop the import error
const MONGODB_URI = process.env.MONGODB_URI;

async function connectDirect() {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(MONGODB_URI!);
}

export async function createJob(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const budget = Number(formData.get("budget"));
  const category = formData.get("category") as string;

  try {
    await connectDirect();
    await Job.create({
      clientClerkId: userId,
      title,
      description,
      budget,
      category,
    });
    
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.error("Database Error:", err);
    return { error: "Failed to post job" };
  }
}