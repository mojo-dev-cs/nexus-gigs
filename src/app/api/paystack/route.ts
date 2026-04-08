import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount, email, firstName, lastName } = await req.json();

    // Multiply by 100 because Paystack expects the amount in subunits (cents/kobo)
    const amountInSubunits = amount * 100;

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 🚨 MAKE SURE THIS EXACT KEY NAME IS IN YOUR .env.local
        "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 
      },
      body: JSON.stringify({
        email: email,
        amount: amountInSubunits,
        currency: "KES", 
        channels: ["card"], // This ensures only the card option appears
        callback_url: "https://www.nexusgigs.me/dashboard?payment=success",
        metadata: {
          first_name: firstName,
          last_name: lastName,
        }
      })
    });

    const data = await response.json();

    // If Paystack returns an error (like invalid API key), it will be caught here
    if (!data.status) {
      console.error("Paystack API Error:", data.message);
      return NextResponse.json({ status: false, message: data.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Internal Server Error:", error.message);
    return NextResponse.json({ status: false, message: "Internal Server Relay Error" }, { status: 500 });
  }
}