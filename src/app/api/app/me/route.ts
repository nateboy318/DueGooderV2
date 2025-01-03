import withAuthRequired from "@/lib/auth/withAuthRequired";
import { NextResponse } from "next/server";
import { MeResponse } from "./types";

export const GET = withAuthRequired(async (req, context) => {
  const { session, getCurrentPlan } = context;

  const currentPlan = await getCurrentPlan();

  return NextResponse.json<MeResponse>({
    currentPlan,
    user: session.user,
  });
});
