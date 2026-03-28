"use server";

import { clerkClient } from "@clerk/nextjs/server";

export async function getAllNexusUsers() {
  try {
    const client = await clerkClient();
    const response = await client.users.getUserList({
      limit: 100, // Adjust as you grow
      orderBy: '-created_at'
    });

    return {
      success: true,
      users: response.data.map(user => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.emailAddresses[0].emailAddress,
        status: user.publicMetadata.isVerified ? "Verified" : "Unverified",
        role: (user.publicMetadata.role as string) || "Freelancer",
        joined: new Date(user.createdAt).toLocaleDateString()
      }))
    };
  } catch (error) {
    console.error("Clerk Fetch Error:", error);
    return { success: false, error: "Failed to connect to Operator Registry" };
  }
}