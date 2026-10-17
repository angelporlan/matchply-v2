"use server";

import Stripe from "stripe";
import { redirect } from "next/navigation";
import { getUserById } from "@/db/users";
import { requireAuth } from "@/lib/auth";
import { env } from "@/lib/env";

export async function startCheckout() {
  const { userId } = await requireAuth();
  const user = await getUserById(userId);
  if (!user) {
    redirect("/login");
  }
  if (user.subscriptionStatus === "pro") {
    redirect("/dashboard");
  }

  let checkoutUrl: string;
  try {
    const stripe = new Stripe(env.stripeSecretKey);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email,
      line_items: [{ price: env.stripePriceId, quantity: 1 }],
      success_url: `${env.appUrl}/dashboard?billing=ok`,
      cancel_url: `${env.appUrl}/dashboard?billing=cancel`,
      metadata: { userId },
      client_reference_id: userId,
    });
    if (!session.url) {
      redirect("/dashboard?error=stripe");
    }
    checkoutUrl = session.url;
  } catch (error) {
    if (error instanceof Error && error.message.includes("STRIPE_")) {
      redirect("/dashboard?error=stripe");
    }
    throw error;
  }
  redirect(checkoutUrl);
}
