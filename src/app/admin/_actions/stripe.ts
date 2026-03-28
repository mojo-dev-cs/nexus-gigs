"use server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any,
});

export async function createStripeSession(userEmail: string) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: "Nexus Verification Fee", 
              description: "Official Node Authentication" 
            },
            unit_amount: 1000, // $10.00
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `https://nexus-gigs.vercel.app/admin?status=success`,
      cancel_url: `https://nexus-gigs.vercel.app/admin`,
      customer_email: userEmail,
    });

    return { success: true, url: session.url };
  } catch (error: any) {
    console.error("Stripe Error:", error.message);
    return { success: false, error: error.message };
  }
}