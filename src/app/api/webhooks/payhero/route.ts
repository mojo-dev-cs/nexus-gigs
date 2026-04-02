import { createClerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import crypto from "crypto";

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 🛡️ INTASEND SIGNATURE VERIFICATION (Optional but recommended for Live)
    // Check if state is 'COMPLETE'
    if (body.state === "COMPLETE" || body.status === "CHARTED") {
      
      // Extract the User ID we sent in the 'api/intasend' route as the 'invoice_id' or 'tracking_id'
      // Assuming you passed clerk_user_id in the metadata or tracking_id
      const userId = body.api_ref; // Ensure you pass user.id as api_ref in your payment trigger

      if (userId) {
        // 🚀 FLIP THE SWITCH IN REAL-TIME
        await clerkClient.users.updateUser(userId, {
          publicMetadata: { status: "Verified" },
        });

        console.log(`Node ${userId} successfully synchronized and verified.`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook Protocol Error:", err);
    return NextResponse.json({ error: "Webhook Failed" }, { status: 400 });
  }
}