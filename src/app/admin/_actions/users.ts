"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Fetches all Nexus users and calculates metadata-based stats
 */
export async function getAllNexusUsers() {
  try {
    const client = await clerkClient();
    const response = await client.users.getUserList({ limit: 100 });

    const users = response.data.map((user) => ({
      id: user.id,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown Node",
      email: user.emailAddresses[0]?.emailAddress || "N/A",
      status: user.publicMetadata?.status === "Verified" ? "Verified" : "Pending",
      joined: new Date(user.createdAt).toLocaleDateString(),
      lastActive: new Date(user.updatedAt).toLocaleTimeString(),
    }));

    return { success: true, users };
  } catch (error) {
    console.error("Nexus Registry Sync Error:", error);
    return { success: false, users: [] };
  }
}

/**
 * Manually authorizes a node for Elite access
 */
export async function verifyUserNode(userId: string) {
  try {
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      publicMetadata: { status: "Verified" },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

/**
 * Permanently removes a node from the relay
 */
export async function terminateUserNode(userId: string) {
  try {
    const client = await clerkClient();
    await client.users.deleteUser(userId);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}