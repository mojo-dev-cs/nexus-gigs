"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export async function completeOnboarding(role: "freelancer" | "client") {
  const { userId } = await auth();

  if (!userId) {
    return { message: "No logged in user" };
  }

  const client = await clerkClient();

  try {
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboardingComplete: true,
        role: role,
      },
    });
    return { message: "Onboarding completed" };
  } catch (err) {
    return { error: "There was an error updating the user metadata." };
  }
}