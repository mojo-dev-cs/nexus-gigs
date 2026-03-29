"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Fetches all Nexus users from the Clerk Registry
 */
export async function getAllNexusUsers() {
  try {
    // FIX: Await the clerkClient() function first
    const client = await clerkClient();
    const response = await client.users.getUserList({
      limit: 100,
    });

    // Extracting data safely
    const users = response.data.map((user) => ({
      id: user.id,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown Node",
      email: user.emailAddresses[0]?.emailAddress || "N/A",
      status: user.publicMetadata?.status === "Verified" ? "Verified" : "Pending",
      joined: new Date(user.createdAt).toLocaleDateString(),
    }));

    return { success: true, users };
  } catch (error) {
    console.error("Fetch Error:", error);
    return { success: false, users: [] };
  }
}

/**
 * Manually verifies a node (Clerk Metadata Update)
 */
export async function verifyUserNode(userId: string) {
  try {
    // FIX: Await the clerkClient() function first
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      publicMetadata: {
        status: "Verified",
      },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Verification Error:", error);
    return { success: false };
  }
}

/**
 * Permanently deletes a user from the system
 */
export async function terminateUserNode(userId: string) {
  try {
    // FIX: Await the clerkClient() function first
    const client = await clerkClient();
    await client.users.deleteUser(userId);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Termination Error:", error);
    return { success: false };
  }
}