import { NextResponse } from "next/server";
import withSuperAdminAuthRequired from "@/lib/auth/withSuperAdminAuthRequired";
import { db } from "@/db";
import { coupons } from "@/db/schema/coupons";
import { eq, and, inArray } from "drizzle-orm";
import { updateLTDPlan } from "@/lib/users/updateLTDPlan";
import { z } from "zod";

// Validation schema for the request body
const expireBatchSchema = z.object({
  codes: z.array(z.string()).min(1, "At least one coupon code is required"),
});

export const POST = withSuperAdminAuthRequired(async (req) => {
  try {
    const body = await req.json();
    const parsedBody = expireBatchSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          message: "Invalid request format",
          details: parsedBody.error.format(),
        },
        { status: 400 }
      );
    }

    const { codes } = parsedBody.data;
    const errors: string[] = [];
    let usersDowngraded = 0;

    // First, find all the coupons to expire
    const couponsToExpire = await db
      .select()
      .from(coupons)
      .where(and(inArray(coupons.code, codes), eq(coupons.expired, false)));

    if (couponsToExpire.length === 0) {
      return NextResponse.json({
        message: "No valid coupon codes found to expire",
        usersDowngraded: 0,
        totalExpired: 0,
        errors: ["No valid coupon codes found to expire"],
      });
    }

    // Update coupon codes to expired
    await db
      .update(coupons)
      .set({ expired: true })
      .where(inArray(coupons.code, codes));

    // Separate unused and used coupons
    const usedCoupons = couponsToExpire.filter((coupon) => coupon.usedAt);

    // Get unique users that need to be recalculated
    const affectedUserIds = [
      ...new Set(
        usedCoupons
          .filter((coupon) => coupon.userId)
          .map((coupon) => coupon.userId)
      ),
    ].filter(Boolean) as string[];

    // 2. Then expire used coupons and recalculate plans
    // 3. Recalculate plans for affected users
    for (const userId of affectedUserIds) {
      try {
        await updateLTDPlan(userId);
        usersDowngraded++;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        errors.push(
          `Failed to update plan for user ${userId}: ${errorMessage}`
        );
      }
    }

    // 4. Generate report on not found coupons
    const foundCodes = couponsToExpire.map((c) => c.code);
    const notFoundCodes = codes.filter((code) => !foundCodes.includes(code));

    if (notFoundCodes.length > 0) {
      errors.push(
        `Could not find the following coupon codes: ${notFoundCodes.join(", ")}`
      );
    }

    return NextResponse.json({
      message: "Coupons processed successfully",
      usersDowngraded,
      totalExpired: foundCodes.length,
      errors,
    });
  } catch (error) {
    console.error("Error processing coupon batch:", error);
    return NextResponse.json(
      {
        error: "Failed to process coupons",
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        usersDowngraded: 0,
        totalExpired: 0,
        errors: [
          error instanceof Error ? error.message : "An unknown error occurred",
        ],
      },
      { status: 500 }
    );
  }
});
