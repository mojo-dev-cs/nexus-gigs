"use server";

import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import Job from "../../models/Job";
import { revalidatePath } from "next/cache";

const MONGODB_URI = process.env.MONGODB_URI;

// This version is "Strict" so Vercel won't crash
async function connectDirect() {
  if (mongoose.connection.readyState >= 1) return;
  if (!MONGODB_URI) throw new Error("MONGODB_URI is missing");
  
  return mongoose.connect(MONGODB_URI);
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