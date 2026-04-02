import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, phone, email, firstName, lastName, method, api_ref } = body;

    // 1. Prepare the IntaSend Payload
    const payload = {
      public_key: process.env.NEXT_PUBLIC_INTASEND_PUBLISHABLE_KEY,
      amount: amount,
      currency: "KES",
      email: email,
      phone_number: phone,
      first_name: firstName,
      last_name: lastName,
      api_ref: api_ref,
      redirect_url: `https://${process.env.VERCEL_URL || 'nexus-gigs.vercel.app'}/dashboard`,
      method: method === "M-PESA" ? "MPESA" : "CARD",
    };

    // 2. Uplink to Live IntaSend API
    const response = await fetch("https://payment.intasend.com/api/v1/checkout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.INTASEND_SECRET_KEY}`
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("IntaSend API Error:", data);
      return NextResponse.json({ 
        success: false, 
        message: data.detail || "IntaSend handshake failed." 
      }, { status: 400 });
    }

    // 3. Return the secure checkout URL
    return NextResponse.json({ 
      success: true, 
      url: data.url 
    });

  } catch (error) {
    console.error("Internal Payment Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Internal Server Error in Payment Relay." 
    }, { status: 500 });
  }
}