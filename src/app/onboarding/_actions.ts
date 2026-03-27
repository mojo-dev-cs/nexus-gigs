"use server";

import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import User from "../../models/User";

const MONGODB_URI = process.env.MONGODB_URI;

export async function completeOnboarding(role: "freelancer" | "client") {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) return { error: "No Session" };

  try {
    // 1. Quick DB Connect
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGODB_URI!, { serverSelectionTimeoutMS: 5000 });
    }

    // 2. Parallel Update (Much Faster)
    const client = await clerkClient();
    
    await Promise.all([
      User.findOneAndUpdate(
        { clerkId: userId },
        {
          clerkId: userId,
          email: user.emailAddresses[0].emailAddress,
          role: role,
          onboardingComplete: true,
        },
        { upsert: true, new: true }
      ),
      client.users.updateUserMetadata(userId, {
        publicMetadata: { onboardingComplete: true, role: role },
      })
    ]);

    return { success: true }; // Simplified return
  } catch (err: any) {
    console.error("ONBOARDING_CRASH:", err.message);
    return { error: err.message };
  }
}