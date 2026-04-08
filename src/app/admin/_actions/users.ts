"server-only";

import { clerkClient } from "@clerk/nextjs/server";

export async function getAllNexusUsers() {
  try {
    const client = await clerkClient();
    const response = await client.users.getUserList({
      limit: 100, // Adjust as needed
      orderBy: '-created_at'
    });

    const users = response.data.map((user) => ({
      id: user.id,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown Node",
      email: user.emailAddresses[0]?.emailAddress || "N/A",
      status: (user.publicMetadata.status as string) || "Unverified",
      role: (user.publicMetadata.role as string) || "freelancer",
      joined: new Date(user.createdAt).toLocaleDateString(),
      createdAt: user.createdAt,
      paidBalance: (user.publicMetadata.paidBalance as number) || 0,
      banned: user.banned
    }));

    return { success: true, users };
  } catch (error: any) {
    console.error("Clerk Fetch Error:", error);
    return { success: false, message: error.message };
  }
}

export async function verifyUserNode(userId: string) {
  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { status: "Verified" }
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function suspendUserNode(userId: string, ban: boolean) {
  try {
    const client = await clerkClient();
    if (ban) {
      await client.users.banUser(userId);
    } else {
      await client.users.unbanUser(userId);
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function terminateUserNode(userId: string) {
  try {
    const client = await clerkClient();
    await client.users.deleteUser(userId);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}