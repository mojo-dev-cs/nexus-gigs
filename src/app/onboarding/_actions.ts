"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export async function completeOnboarding(role: "freelancer" | "client") {
  const { userId } = await auth();
  if (!userId) return { error: "No user found" };

  try {
    const client = await clerkClient();
    
    // Update Clerk Metadata - This is the "Source of Truth"
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboardingComplete: true,
        role: role,
      },
    });

    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}