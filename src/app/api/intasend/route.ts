import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount, phone, email, firstName, lastName } = await req.json();

    // Use direct Fetch to bypass SDK "is not a function" errors
    const response = await fetch("https://payment.intasend.com/api/v1/payment/mpesa-stk-push/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.INTASEND_SECRET_KEY}`
      },
      body: JSON.stringify({
        first_name: firstName || "Nexus",
        last_name: lastName || "User",
        email: email,
        amount: amount,
        phone_number: phone,
        host: "https://www.nexusgigs.me",
        api_ref: `nexus_${Date.now()}`
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || "IntaSend Handshake Denied");
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("CRITICAL UPLINK FAILURE:", error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}