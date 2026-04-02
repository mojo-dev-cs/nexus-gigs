"use server";

import { createClerkClient } from "@clerk/nextjs/server";

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function getAllNexusUsers() {
  try {
    const response = await clerkClient.users.getUserList();
    const users = response.data.map((u) => ({
      id: u.id,
      name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Unknown Node",
      email: u.emailAddresses[0]?.emailAddress || "N/A",
      status: (u.publicMetadata?.status as string) || "Pending",
      role: (u.publicMetadata?.role as string) || "freelancer",
      banned: u.banned,
      createdAt: u.createdAt,
      joined: new Date(u.createdAt).toLocaleDateString(),
    }));
    return { success: true, users };
  } catch (error) {
    console.error("Clerk Sync Error:", error);
    return { success: false, error: "Sync Failed" };
  }
}

export async function verifyUserNode(userId: string) {
  try {
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { status: "Verified" },
    });
    return { success: true };
  } catch (e) { return { success: false }; }
}

export async function terminateUserNode(userId: string) {
  try {
    await clerkClient.users.deleteUser(userId);
    return { success: true };
  } catch (e) { return { success: false }; }
}

export async function suspendUserNode(userId: string, ban: boolean) {
  try {
    if (ban) await clerkClient.users.banUser(userId);
    else await clerkClient.users.unbanUser(userId);
    return { success: true };
  } catch (e) { return { success: false }; }
}