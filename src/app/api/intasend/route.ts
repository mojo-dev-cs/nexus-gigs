import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, phone, email, firstName, lastName, method, api_ref } = body;

    const payload = {
      public_key: process.env.NEXT_PUBLIC_INTASEND_PUBLISHABLE_KEY,
      amount: amount,
      currency: "KES",
      email: email,
      phone_number: phone.replace(/\s+/g, ''),
      first_name: firstName || "Nexus",
      last_name: lastName || "User",
      api_ref: api_ref,
      redirect_url: `https://www.nexusgigs.me/dashboard`, 
      method: method === "M-PESA" ? "MPESA" : "CARD",
    };

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
      console.error("IntaSend Error Details:", data);
      return NextResponse.json({ success: false, message: data.detail || "Handshake Denied" }, { status: 400 });
    }

    return NextResponse.json({ success: true, url: data.url });

  } catch (error) {
    console.error("Server Crash:", error);
    return NextResponse.json({ success: false, message: "Signal Offline" }, { status: 500 });
  }
}