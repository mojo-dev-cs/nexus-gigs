import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, email, amount, method } = body;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized Node Access" }, { status: 401 });
    }

    const client = await clerkClient();

    // UPDATE USER METADATA
    // paidBalance is stored as a number so Admin Dashboard sums it correctly
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        status: "Verified",
        paidBalance: Number(amount), 
        verifiedAt: new Date().toISOString(),
        gateway: method
      }
    });

    console.log(`[REV SYNC] ${email} paid KES ${amount}. Registry updated.`);

    return NextResponse.json({ success: true, message: "Balance Synchronized." });
  } catch (error: any) {
    console.error("METADATA SYNC ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}