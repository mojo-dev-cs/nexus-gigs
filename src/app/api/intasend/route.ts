import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount, phone, email, firstName, lastName } = await req.json();

    const response = await fetch("https://payment.intasend.com/api/v1/checkout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.INTASEND_SECRET_KEY}`,
      },
      body: JSON.stringify({
        public_key: process.env.NEXT_PUBLIC_INTASEND_PUBLISHABLE_KEY,
        amount: amount,
        currency: "KES",
        email: email,
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
        host: "https://nexus-gigs.vercel.app", // Your live site
        redirect_url: "https://nexus-gigs.vercel.app/dashboard",
        method: "M-PESA",
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Intasend Error:", error);
    return NextResponse.json({ error: "Payment failed to initialize" }, { status: 500 });
  }
}