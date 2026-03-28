"use server";

import { auth } from "@clerk/nextjs/server";

export async function verifyMpesaPayment(phoneNumber: string) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  try {
    // 🔗 Your Unique PayHero Lipwa Link
    const lipwaUrl = `https://lipwa.link/6861?address=${userId.slice(-6)}&amount=1350`;

    return { 
      success: true, 
      redirectUrl: lipwaUrl,
      message: "Redirecting to Secure Payment Portal..." 
    };
  } catch (error) {
    return { success: false, error: "Could not initialize payment link." };
  }
}