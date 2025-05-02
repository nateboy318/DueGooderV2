import { NextResponse } from "next/server";
import withSuperAdminAuthRequired from "@/lib/auth/withSuperAdminAuthRequired";
import { z } from "zod";
import updatePlan from "@/lib/plans/updatePlan";

const updatePlanSchema = z.object({
  planId: z.string().min(1, "Plan ID is required"),
});

export const PATCH = withSuperAdminAuthRequired(async (req, context) => {
  const { id } = await context.params as { id: string };
  
  try {
    const body = await req.json();
    const { planId } = updatePlanSchema.parse(body);

    await updatePlan({
      userId: id,
      newPlanId: planId,
      sendEmail: true,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user plan:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update user plan" },
      { status: 500 }
    );
  }
}); 