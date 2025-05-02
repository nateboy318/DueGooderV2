import { NextResponse } from "next/server";
import withSuperAdminAuthRequired from "@/lib/auth/withSuperAdminAuthRequired";
import { db } from "@/db";
import { users } from "@/db/schema/user";
import { plans } from "@/db/schema/plans";
import { sql } from "drizzle-orm";

export const GET = withSuperAdminAuthRequired(async () => {
  const planCounts = await db
    .select({
      planId: users.planId,
      planName: plans.name,
      count: sql<number>`COUNT(*)`,
    })
    .from(users)
    .leftJoin(plans, sql`${users.planId} = ${plans.id}`)
    .groupBy(users.planId, plans.name);

  // Transform the results
  const formattedCounts = planCounts.map((count) => ({
    name: count.planName || "No Plan",
    count: Number(count.count),
  }));

  return NextResponse.json({ data: formattedCounts });
}); 