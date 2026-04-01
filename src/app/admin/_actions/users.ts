"use server";

import { createClerkClient } from "@clerk/nextjs/server";

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

// 1. Fetch all users from Clerk
export async function getAllNexusUsers() {
  try {
    const response = await clerkClient.users.getUserList();
    const users = response.data.map((u) => ({
      id: u.id,
      name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Unknown Node",
      email: u.emailAddresses[0]?.emailAddress || "N/A",
      status: (u.publicMetadata.status as string) || "Pending",
      joined: new Date(u.createdAt).toLocaleDateString(),
    }));
    return { success: true, users };
  } catch (error) {
    console.error("Clerk Fetch Error:", error);
    return { success: false, error: "Failed to sync nodes" };
  }
}

// 2. Flip status to 'Verified'
export async function verifyUserNode(userId: string) {
  try {
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { status: "Verified" },
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// 3. Delete user from Clerk (Terminate Node)
export async function terminateUserNode(userId: string) {
  try {
    await clerkClient.users.deleteUser(userId);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}