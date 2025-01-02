import { NextResponse } from "next/server";
import withSuperAdminAuthRequired from "@/lib/auth/withSuperAdminAuthRequired";
import { db } from "@/db";
import { plans } from "@/db/schema/plans";
import { desc, sql, eq } from "drizzle-orm";
import { planFormSchema } from "@/lib/validations/plan.schema";

export const GET = withSuperAdminAuthRequired(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const offset = (page - 1) * limit;

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(plans)
      .where(
        search
          ? sql`name LIKE ${`%${search}%`} OR codename LIKE ${`%${search}%`}`
          : sql`1=1`
      );

    const totalCount = totalCountResult[0].count;

    // Get paginated plans
    const plansList = await db
      .select()
      .from(plans)
      .where(
        search
          ? sql`name LIKE ${`%${search}%`} OR codename LIKE ${`%${search}%`}`
          : sql`1=1`
      )
      .orderBy(desc(plans.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      plans: plansList,
      pagination: {
        total: totalCount,
        pageCount: Math.ceil(totalCount / limit),
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
});

export const POST = withSuperAdminAuthRequired(async (req) => {
  try {
    const data = await req.json();
    const validatedData = planFormSchema.parse(data);

    const newPlan = await db.insert(plans).values(validatedData).returning();

    return NextResponse.json(newPlan[0]);
  } catch (error) {
    console.error("Error creating plan:", error);
    return NextResponse.json(
      { error: "Failed to create plan" },
      { status: 500 }
    );
  }
});

export const PATCH = withSuperAdminAuthRequired(async (req) => {
  try {
    const data = await req.json();
    const { id, ...updateData } = data;
    const validatedData = planFormSchema.parse(updateData);

    const updatedPlan = await db
      .update(plans)
      .set(validatedData)
      .where(eq(plans.id, id))
      .returning();

    return NextResponse.json(updatedPlan[0]);
  } catch (error) {
    console.error("Error updating plan:", error);
    return NextResponse.json(
      { error: "Failed to update plan" },
      { status: 500 }
    );
  }
});

export const DELETE = withSuperAdminAuthRequired(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 }
      );
    }

    await db.delete(plans).where(eq(plans.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting plan:", error);
    return NextResponse.json(
      { error: "Failed to delete plan" },
      { status: 500 }
    );
  }
}); 