import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount, phone, email, firstName, lastName, method, api_ref } = await req.json();

    const payload = {
      public_key: process.env.NEXT_PUBLIC_INTASEND_PUBLISHABLE_KEY,
      amount: amount,
      currency: "KES",
      email: email,
      phone_number: phone.replace(/\s+/g, ''),
      first_name: firstName,
      last_name: lastName,
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
    return response.ok 
      ? NextResponse.json({ success: true, url: data.url })
      : NextResponse.json({ success: false, message: data.detail }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Signal Offline" }, { status: 500 });
  }
}