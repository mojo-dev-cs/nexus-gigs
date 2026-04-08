import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, email, amount, method } = body;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized Node Access" }, { status: 401 });
    }

    // Clerk v5 Fix: must await clerkClient()
    const client = await clerkClient();

    // 1. UPDATE CLERK METADATA
    // Promoting the node status and banking the KES 10 for the Admin Dashboard
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        status: "Verified",
        paidBalance: Number(amount), 
        verifiedAt: new Date().toISOString(),
        gateway: method
      }
    });

    // 2. LOG FOR ADMIN DASHBOARD
    console.log(`[SYSTEM UPLINK] Node Verified: ${email} | Amount: KES ${amount} | Gateway: ${method}`);

    return NextResponse.json({ 
      success: true, 
      message: "Node authentication finalized." 
    });
  } catch (error: any) {
    console.error("VERIFICATION ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}