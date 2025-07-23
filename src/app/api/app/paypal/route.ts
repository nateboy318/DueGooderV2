import { NextResponse } from "next/server";
import { db } from "@/db";
import { paypalContext } from "@/db/schema/paypal";
import { desc, eq } from "drizzle-orm";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { cancelPaypalSubscription } from "@/lib/paypal/api";
import { z } from "zod";
import { plans } from "@/db/schema/plans";

export const GET = withAuthRequired(async (req, context) => {
  try {
    const currentUser = await context.session.user;
    const contexts = await db
      .select({
        id: paypalContext.id,
        createdAt: paypalContext.createdAt,
        planId: paypalContext.planId,
        userId: paypalContext.userId,
        frequency: paypalContext.frequency,
        paypalOrderId: paypalContext.paypalOrderId,
        paypalSubscriptionId: paypalContext.paypalSubscriptionId,
        status: paypalContext.status,
        planName: plans.name,
      })
      .from(paypalContext)
      .leftJoin(plans, eq(paypalContext.planId, plans.id))
      .where(eq(paypalContext.userId, currentUser.id))
      .orderBy(desc(paypalContext.createdAt));
    return NextResponse.json({ contexts });
  } catch (error) {
    console.error("Failed to fetch PayPal contexts", error);
    return NextResponse.json({ error: "Failed to fetch PayPal contexts" }, { status: 500 });
  }
});

const cancelSchema = z.object({
  contextId: z.string().min(1),
  action: z.literal("cancel"),
});

export const POST = withAuthRequired(async (req, context) => {
  try {
    const body = await req.json();
    const parsed = cancelSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.format() }, { status: 400 });
    }
    const { contextId, action } = parsed.data;
    if (action !== "cancel") {
      return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
    }
    const currentUser = await context.session.user;
    // Ensure the context belongs to the user
    const [ctx] = await db.select().from(paypalContext).where(eq(paypalContext.id, contextId)).limit(1);
    if (!ctx || ctx.userId !== currentUser.id) {
      return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
    }
    const success = await cancelPaypalSubscription(contextId);
    if (!success) {
      return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: "Subscription cancelled" });
  } catch (error) {
    console.error("Failed to cancel subscription", error);
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
  }
});
