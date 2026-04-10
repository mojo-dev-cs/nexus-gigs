"use server";

import { clerkClient } from "@clerk/nextjs/server";

export async function getAllNexusUsers() {
  try {
    const client = await clerkClient();
    const response = await client.users.getUserList({
      limit: 100,
      orderBy: '-created_at'
    });

    const users = response.data.map((user) => {
      const metadata = user.publicMetadata || {};
      return {
        id: user.id,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Nexus Node",
        email: user.emailAddresses[0]?.emailAddress || "N/A",
        status: (metadata.status as string) || "Unverified",
        role: (metadata.role as string) || "freelancer",
        joined: new Date(user.createdAt).toLocaleDateString(),
        createdAt: user.createdAt,
        paidBalance: typeof metadata.paidBalance === 'number' ? metadata.paidBalance : 0,
        banned: user.banned
      };
    });

    // Also get total count for traffic metrics
    const totalCount = await (await clerkClient()).users.getCount();

    return { success: true, users, totalCount };
  } catch (error: any) {
    console.error("Clerk Sync Error:", error);
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

export async function terminateUserNode(userId: string) {
  try {
    const client = await clerkClient();
    await client.users.deleteUser(userId);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}