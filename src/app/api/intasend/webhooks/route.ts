import { createClerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Check if the payment was successful
    if (body.state === "COMPLETE" || body.status === "CHARTED") {
      const userId = body.api_ref; // Ensure you passed user.id as api_ref during checkout

      if (userId) {
        await clerkClient.users.updateUser(userId, {
          publicMetadata: { status: "Verified" },
        });
        console.log(`User ${userId} verified via Webhook.`);
      }
    }
    return NextResponse.json({ status: "Webhook received" });
  } catch (err) {
    console.error("Webhook Error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 400 });
  }
}