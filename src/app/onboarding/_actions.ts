"use server";

import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import User from "../../models/User";
import { revalidatePath } from "next/cache";

const MONGODB_URI = process.env.MONGODB_URI;

export async function completeOnboarding(role: "freelancer" | "client") {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) return { error: "User session not found" };

  try {
    // 1. Direct Connection with a 5-second timeout
    if (mongoose.connection.readyState !== 1) {
      if (!MONGODB_URI) throw new Error("URI Missing");
      await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    }

    // 2. Sync to MongoDB
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

    // 3. Update Clerk Metadata
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboardingComplete: true,
        role: role,
      },
    });

    revalidatePath("/dashboard");
    return { message: "Onboarding completed" };
  } catch (err: any) {
    console.error("Critical Onboarding Error:", err.message);
    return { error: err.message || "Connection failed" };
  }
}