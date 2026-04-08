import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount, email, firstName, lastName } = await req.json();

    const amountInCents = amount * 100;

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      },
      body: JSON.stringify({
        email: email,
        amount: amountInCents,
        currency: "USD", 

        channels: ["card"], 
        callback_url: "https://www.nexusgigs.me/dashboard?payment=success",
        metadata: {
          first_name: firstName,
          last_name: lastName,
          custom_fields: [{ display_name: "Action", variable_name: "action", value: "verification" }]
        }
      })
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}