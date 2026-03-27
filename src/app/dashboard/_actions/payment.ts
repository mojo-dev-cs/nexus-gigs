"use server";

import { auth } from "@clerk/nextjs/server";

export async function getPaymentLink() {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  // Your unique Lipwa Link from the screenshot
  const LIPWA_LINK = "https://lipwa.link/6861";

  // We append the userId as a reference so you know who paid in your PayHero dashboard
  const personalizedLink = `${LIPWA_LINK}?address=${userId.slice(-6)}`;

  return { 
    success: true, 
    url: personalizedLink 
  };
}