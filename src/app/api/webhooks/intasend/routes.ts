import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Log incoming signal for Vercel monitoring
    console.log("IntaSend Signal Received:", body.api_ref);

    // 2. Check if payment was successful
    if (body.state === "COMPLETE" || body.challenge === "checkout.completed") {
      const userId = body.api_ref.replace("nexus_verify_", "");

      if (userId) {
        const client = await clerkClient();
        await client.users.updateUserMetadata(userId, {
          publicMetadata: {
            status: "Verified",
            role: "freelancer"
          },
        });
        console.log(`🏆 Node ${userId} Verified Successfully.`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook Uplink Error:", error);
    return NextResponse.json({ error: "Signal Failed" }, { status: 500 });
  }
}