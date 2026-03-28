import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Log for Vercel monitoring
    console.log("PAYHERO_CALLBACK_RECEIVED:", JSON.stringify(body));

    // 1. PayHero Success Status (1 = Success, 0 = Failed)
    if (body.status === 1 || body.status === "Success") {
      
      const userId = body.external_reference; 

      if (!userId) {
        return NextResponse.json({ error: "No UserID in reference" }, { status: 400 });
      }

      // 2. Update the User in Clerk
      const client = await clerkClient();
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          status: "Verified"
        }
      });

      return NextResponse.json({ success: true, message: "Node Authenticated" }, { status: 200 });
    }

    return NextResponse.json({ message: "Transaction Pending/Failed" }, { status: 200 });
  } catch (error: any) {
    console.error("WEBHOOK_CRITICAL_ERROR:", error.message);
    return NextResponse.json({ error: "Internal Protocol Failure" }, { status: 500 });
  }
}

// Optional: Add a GET handler so you can test if the URL is alive in a browser
export async function GET() {
  return NextResponse.json({ status: "Nexus Callback Listener Active" });
}