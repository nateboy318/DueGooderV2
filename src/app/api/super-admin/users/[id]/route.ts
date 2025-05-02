import { NextResponse } from "next/server";
import withSuperAdminAuthRequired from "@/lib/auth/withSuperAdminAuthRequired";
import { db } from "@/db";
import { users } from "@/db/schema/user";
import { eq } from "drizzle-orm";
import { plans } from "@/db/schema/plans";

export const GET = withSuperAdminAuthRequired(async (req, context) => {
  const { id } = await context.params as { id: string };
  
  try {
    // Get user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)
      .then(users => users[0]);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get user's current plan
    let currentPlan;
    if(user?.planId) {
      currentPlan = await db
        .select()
        .from(plans)
        .where(eq(plans.id, user?.planId))
        .limit(1)
        .then(plans => plans[0]);
    }

    // Return user with related data
    return NextResponse.json({
      ...user,
      currentPlan
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
});

export const DELETE = withSuperAdminAuthRequired(async (req, context) => {
  const { id } = await context.params as { id: string };
  
  try {
    // Check if user exists
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)
      .then(users => users[0]);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Delete the user - will also delete any memberships due to foreign key constraints
    await db.delete(users).where(eq(users.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}); 