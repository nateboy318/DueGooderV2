import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { plans } from "@/db/schema/plans";

export const GET = async (req: NextRequest) => {
  try {
    // Fetch all plans that have pricing enabled
    const allPlans = await db
      .select({
        id: plans.id,
        name: plans.name,
        codename: plans.codename,
        hasMonthlyPricing: plans.hasMonthlyPricing,
        hasYearlyPricing: plans.hasYearlyPricing,
        hasOnetimePricing: plans.hasOnetimePricing,
        monthlyPrice: plans.monthlyPrice,
        monthlyPriceAnchor: plans.monthlyPriceAnchor,
        yearlyPrice: plans.yearlyPrice,
        yearlyPriceAnchor: plans.yearlyPriceAnchor,
        onetimePrice: plans.onetimePrice,
        onetimePriceAnchor: plans.onetimePriceAnchor,
        quotas: plans.quotas,
      })
      .from(plans);

    // Filter out plans that don't have any pricing enabled
    const publicPlans = allPlans.filter(
      (plan) =>
        plan.hasMonthlyPricing || plan.hasYearlyPricing || plan.hasOnetimePricing
    );

    return NextResponse.json({ plans: publicPlans });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
};
