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
      status: (u.publicMetadata.status as string) || "Pending",
      banned: u.banned,
      createdAt: u.createdAt, // Needed for Today's Revenue
      joined: new Date(u.createdAt).toLocaleDateString(),
    }));
    return { success: true, users };
  } catch (error) {
    return { success: false, error: "Sync Failed" };
  }
}

export async function verifyUserNode(userId: string) {
  await clerkClient.users.updateUser(userId, { publicMetadata: { status: "Verified" } });
  return { success: true };
}

export async function suspendUserNode(userId: string, ban: boolean) {
  if (ban) {
    await clerkClient.users.banUser(userId);
  } else {
    await clerkClient.users.unbanUser(userId);
  }
  return { success: true };
}

export async function terminateUserNode(userId: string) {
  await clerkClient.users.deleteUser(userId);
  return { success: true };
}