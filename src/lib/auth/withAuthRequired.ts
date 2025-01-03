import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema/user";
import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { plans } from "@/db/schema/plans";
import { MeResponse } from "@/app/api/app/me/types";
import { RouteModuleHandleContext } from "next/dist/server/route-modules/route-module";

interface WithAuthRequiredHandler {
  (
    req: NextRequest,
    context: {
      session: NonNullable<
        Session & {
          user: MeResponse["user"];
        }
      >;
      getCurrentPlan: () => Promise<MeResponse["currentPlan"]>;
      params: RouteModuleHandleContext["params"];
    }
  ): Promise<NextResponse | Response>;
}

const withAuthRequired = (handler: WithAuthRequiredHandler) => {
  return async (req: NextRequest, context: RouteModuleHandleContext) => {
    const session = await auth();

    if (!session || !session.user || !session.user.id || !session.user.email) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "You are not authorized to perform this action",
        },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const getCurrentPlan = async () => {
      const user = await db.select().from(users).where(eq(users.id, userId));

      if (!user) {
        return null;
      }

      // Get the current plan and quotas

      if (!user[0].planId) {
        return null;
      }

      const currentPlan = await db
        .select({
          id: plans.id,
          name: plans.name,
          codename: plans.codename,
          quotas: plans.quotas,
        })
        .from(plans)
        .where(eq(plans.id, user[0].planId));

      if (!currentPlan.length) {
        return null;
      }

      return currentPlan[0];
    };

    return await handler(req, {
      ...context,
      // @ts-expect-error - session is typed correctly, but user is not
      // althogh it is checked above
      session: session,
      getCurrentPlan,
    });
  };
};

export default withAuthRequired;
