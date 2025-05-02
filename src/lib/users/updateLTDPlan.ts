import { db } from "@/db";
import { coupons } from "@/db/schema/coupons";
import { plans } from "@/db/schema/plans";
import { users } from "@/db/schema/user";
import { eq, and, isNotNull, sql } from "drizzle-orm";

/**
 * Updates an user's plan based on the number of redeemed coupons
 * 
 * @param userId - The ID of the user to update
 * @returns The updated user with plan information
 */
export async function updateLTDPlan(userId: string) {
  // Count valid redeemed coupons for this user
  const redeemedCouponsCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(coupons)
    .where(
      and(
        eq(coupons.userId, userId),
        isNotNull(coupons.usedAt),
        eq(coupons.expired, false)
      )
    )
    .then((result) => Number(result[0].count));

  // Find plans that require this number of coupons
  const eligiblePlans = await db
    .select()
    .from(plans)
    .where(eq(plans.requiredCouponCount, redeemedCouponsCount))
    .orderBy(plans.createdAt);

  // Find default plan as fallback
  const defaultPlan = await db
    .select()
    .from(plans)
    .where(eq(plans.default, true))
    .limit(1)
    .then((results) => results[0] || null);

  // Determine which plan to use
  const planToUse = eligiblePlans.length > 0 ? eligiblePlans[0] : defaultPlan;

  // Update the user's plan
  await db
    .update(users)
    .set({ 
      planId: planToUse?.id || null,
      // If we have a plan, clear any stripe/lemon squeezy IDs since this is now LTD
      ...(planToUse && {
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        lemonSqueezyCustomerId: null,
        lemonSqueezySubscriptionId: null,
      })
    })
    .where(eq(users.id, userId));

  // Get the updated user
  const updatedUser = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)
    .then((results) => results[0]);

  // Get the current plan details
  const currentPlan = planToUse
    ? await db
        .select()
        .from(plans)
        .where(eq(plans.id, planToUse.id))
        .limit(1)
        .then((results) => results[0])
    : null;

  return {
    user: updatedUser,
    plan: currentPlan,
    couponCount: redeemedCouponsCount
  };
} 