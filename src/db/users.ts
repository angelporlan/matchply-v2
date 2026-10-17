import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "./schema";

export async function getUserById(id: string) {
  const [row] = await getDb()
    .select({
      id: users.id,
      email: users.email,
      subscriptionStatus: users.subscriptionStatus,
      stripeCustomerId: users.stripeCustomerId,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return row ?? null;
}

export async function getUserByStripeCustomer(customerId: string) {
  const [row] = await getDb()
    .select({ id: users.id })
    .from(users)
    .where(eq(users.stripeCustomerId, customerId))
    .limit(1);
  return row ?? null;
}

export async function setSubscription(input: {
  userId: string;
  subscriptionStatus: "free" | "pro";
  stripeCustomerId?: string;
}) {
  await getDb()
    .update(users)
    .set({
      subscriptionStatus: input.subscriptionStatus,
      stripeCustomerId: input.stripeCustomerId,
    })
    .where(eq(users.id, input.userId));
}
