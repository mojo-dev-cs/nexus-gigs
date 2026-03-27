import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // PayHero sends the external_reference we created: NEXUS-XXXXXX
    const reference = body.external_reference;
    const status = body.status; // PayHero sends 'Success' or 'Failed'

    if (status === "Success") {
        // Extract the userId part or use a better lookup method
        // For now, we'll need to find the user by this reference or ID
        // Note: In a production app, you'd store the 'checkout_id' in MongoDB first
        console.log(`Payment Successful for Ref: ${reference}`);
        
        // Logic to update Clerk would go here once we map the Ref to a UserID
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }
}