"use server";

import axios from "axios";

export async function initiateMpesaPayment(phoneNumber: string, amount: number, userId: string) {
  try {
    const username = process.env.PAYHERO_API_USERNAME;
    const password = process.env.PAYHERO_API_PASSWORD;
    const channelId = process.env.PAYHERO_CHANNEL_ID;

    const auth = Buffer.from(`${username}:${password}`).toString("base64");

    const response = await axios.post(
      "https://backend.payhero.co.ke/api/v2/payments",
      {
        amount: amount,
        phone_number: phoneNumber,
        channel_id: channelId,
        provider: "m-pesa",
        external_reference: userId, // This links the payment to the user in the callback
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