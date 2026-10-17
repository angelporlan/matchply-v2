import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getUserByStripeCustomer, setSubscription } from "@/db/users";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new NextResponse("missing signature", { status: 400 });
  }

  const stripe = new Stripe(env.stripeSecretKey);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.stripeWebhookSecret,
    );
  } catch {
    return new NextResponse("invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId ?? session.client_reference_id;
    if (userId) {
      await setSubscription({
        userId,
        subscriptionStatus: "pro",
        stripeCustomerId:
          typeof session.customer === "string" ? session.customer : undefined,
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object;
    const customerId = typeof sub.customer === "string" ? sub.customer : null;
    if (customerId) {
      const row = await getUserByStripeCustomer(customerId);
      if (row) {
        await setSubscription({ userId: row.id, subscriptionStatus: "free" });
      }
    }
  }

  return NextResponse.json({ received: true });
}
