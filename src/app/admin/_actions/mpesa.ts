"use server";

import axios from "axios";

export async function initiateMpesaPayment(phoneNumber: string, amount: number, userId: string) {
  try {
    const username = process.env.PAYHERO_API_USERNAME;
    const password = process.env.PAYHERO_API_PASSWORD;
    const channelId = process.env.PAYHERO_CHANNEL_ID;

    // 1. Phone Formatting (Converts 07... to 2547...)
    let cleanedPhone = phoneNumber.replace(/\D/g, "");
    if (cleanedPhone.startsWith("0")) cleanedPhone = "254" + cleanedPhone.slice(1);
    if (cleanedPhone.length === 9) cleanedPhone = "254" + cleanedPhone;

    // 2. Auth Token (Matches your screenshot's "Basic dDlvY...")
    const auth = Buffer.from(`${username}:${password}`).toString("base64");

    // 3. The Request (Matches your screenshot's body exactly)
    const response = await axios.post(
      "https://backend.payhero.co.ke/api/v2/payments",
      {
        amount: amount,
        phone_number: cleanedPhone,
        channel_id: channelId,
        provider: "m-pesa",
        external_reference: userId, // Passed back to our webhook
        customer_name: "Nexus Operator", // Added as per docs
        callback_url: "https://nexus-gigs.vercel.app/api/mpesa-callback"
      },
      {
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("PayHero Success:", response.data);
    return { success: true, data: response.data };

  } catch (error: any) {
    // This logs the EXACT reason the gateway refused (e.g., Wrong Password, Invalid Channel)
    console.error("GATEWAY_REJECTION_LOG:", error.response?.data || error.message);
    
    return { 
      success: false, 
      error: error.response?.data?.message || "Gateway Refused. Check Vercel Logs for detail." 
    };
  }
}