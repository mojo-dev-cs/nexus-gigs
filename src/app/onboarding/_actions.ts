"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export async function completeOnboarding(role: "freelancer" | "client") {
  const { userId } = await auth();
  if (!userId) return { error: "No User ID found" };

  try {
    const client = await clerkClient();
    
    // WE ARE SKIPPING MONGODB FOR 1 MINUTE TO TEST REDIRECT
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboardingComplete: true,
        role: role,
      },
    });

    console.log("Metadata updated successfully!");
    return { success: true };
  } catch (err: any) {
    console.error("CLERK_ERROR:", err.message);
    return { error: err.message };
  }
}