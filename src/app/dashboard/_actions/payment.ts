"use server";

import { auth } from "@clerk/nextjs/server";

export async function verifyMpesaPayment(phoneNumber: string) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  // basic auth token from your dashboard
  const BASIC_AUTH_TOKEN = "SzNiV3dxSGF3c3FuUjBkS2ZZQjg6QVROZDJzTmplZCU1DD2p2eXNmZHRhQXZiZlF3dHQl5ZA==";
  
  // 🔑 Using your active Equity Bank Channel from the screenshot
  const CHANNEL_ID = "6533"; 

  let formattedPhone = phoneNumber;
  if (formattedPhone.startsWith("0")) {
    formattedPhone = "254" + formattedPhone.substring(1);
  }

  try {
    const response = await fetch("https://backend.payhero.co.ke/api/v2/payments/initiate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${BASIC_AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        amount: 1350, // Approx $10 in KES
        phone_number: formattedPhone,
        channel_id: CHANNEL_ID,
        provider: "m-pesa", // PayHero will attempt M-Pesa STK even on bank channels if supported
        external_reference: `NEXUS-${userId.slice(-6)}`,
        callback_url: `https://nexus-gigs.vercel.app/api/webhooks/payhero`, 
      }),
    });

    const data = await response.json();

    if (data.success) {
      return { 
        success: true, 
        message: "Payment Initialized! Please follow the prompts on your device." 
      };
    } else {
      return { success: false, error: data.message || "Channel 6533 refused the request." };
    }
  } catch (error) {
    return { success: false, error: "Gateway connection failed." };
  }
}