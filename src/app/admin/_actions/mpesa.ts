"use server";

import axios from "axios";

export async function initiateMpesaPayment(phoneNumber: string, amount: number) {
  try {
    const username = process.env.PAYHERO_API_USERNAME;
    const password = process.env.PAYHERO_API_PASSWORD;
    const channelId = process.env.PAYHERO_CHANNEL_ID;

    // Basic Auth generation
    const auth = Buffer.from(`${username}:${password}`).toString("base64");

    // PayHero V2 API Call
    const response = await axios.post(
      "https://backend.payhero.co.ke/api/v2/payments",
      {
        amount: amount,
        phone_number: phoneNumber,
        channel_id: channelId,
        provider: "m-pesa",
        external_reference: "NEXUS-" + Date.now(),
        callback_url: "https://nexus-gigs.vercel.app/api/mpesa-callback"
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("PayHero Error:", error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.message || "Check PayHero API credentials." 
    };
  }
}