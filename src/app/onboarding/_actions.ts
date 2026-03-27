"use server";

import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import User from "../../models/User"; // Ensure this path is correct to your User model
import { revalidatePath } from "next/cache";

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDirect() {
  if (mongoose.connection.readyState >= 1) return;
  if (!MONGODB_URI) throw new Error("MONGODB_URI is missing from Env Variables");
  return mongoose.connect(MONGODB_URI);
}

export async function completeOnboarding(role: "freelancer" | "client") {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return { error: "No logged in user" };
  }

  try {
    console.log("Attempting DB Connection...");
    await connectDirect();
    console.log("DB Connected. Syncing User...");

    // 1. Sync user to MongoDB
    await User.findOneAndUpdate(
      { clerkId: userId },
      {
        clerkId: userId,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        role: role,
        onboardingComplete: true,
      },
      { upsert: true, new: true }
    );

    // 2. Update Clerk Metadata
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboardingComplete: true,
        role: role,
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    
    return { message: "Onboarding completed" };
  } catch (err) {
    console.error("Onboarding Error:", err);
    return { error: "There was an error updating your profile." };
  }
}