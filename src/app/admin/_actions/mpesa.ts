"use server";

import axios from "axios";

// Helper to ensure number is always 254...
function formatPhone(phone: string) {
  let cleaned = phone.replace(/\D/g, ""); // Remove non-digits
  if (cleaned.startsWith("0")) {
    return "254" + cleaned.slice(1);
  }
  if (cleaned.startsWith("7") || cleaned.startsWith("1")) {
    return "254" + cleaned;
  }
  return cleaned;
}

export async function initiateMpesaPayment(phoneNumber: string, amount: number, userId: string) {
  try {
    const username = process.env.PAYHERO_API_USERNAME;
    const password = process.env.PAYHERO_API_PASSWORD;
    const channelId = process.env.PAYHERO_CHANNEL_ID;

    if (!username || !password || !channelId) {
      throw new Error("Missing API Credentials in Environment");
    }

    const formattedPhone = formatPhone(phoneNumber);
    const auth = Buffer.from(`${username}:${password}`).toString("base64");

    const response = await axios.post(
      "https://backend.payhero.co.ke/api/v2/payments",
      {
        amount: amount,
        phone_number: formattedPhone,
        channel_id: channelId,
        provider: "m-pesa",
        external_reference: userId,
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
      error: error.response?.data?.message || "Gateway refused request. Check API keys." 
    };
  }
}