import { NextResponse } from "next/server";
import withSuperAdminAuthRequired from "@/lib/auth/withSuperAdminAuthRequired";
import { db } from "@/db";
import { plans } from "@/db/schema/plans";
import { eq } from "drizzle-orm";

export const GET = withSuperAdminAuthRequired(async (req, context) => {
  const { id } = await context.params as { id: string };
  try {
    const plan = await db
      .select()
      .from(plans)
      .where(eq(plans.id, id))
      .limit(1);

    if (!plan[0]) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json(plan[0]);
  } catch (error) {
    console.error("Error fetching plan:", error);
    return NextResponse.json(
      { error: "Failed to fetch plan" },
      { status: 500 }
    );
  }
});
