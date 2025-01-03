import { auth } from "@/auth";
import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface WithManagerHandler {
  (
    req: NextRequest,
    context: {
      session: NonNullable<Session>;
      params: {
        [key: string]: string;
      };
    }
  ): Promise<NextResponse | Response>;
}

const withSuperAdminAuthRequired = (handler: WithManagerHandler) => {
  return async (
    req: NextRequest,
    context?: { params: { [key: string]: string } }
  ) => {
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

    if (!process.env.SUPER_ADMIN_EMAILS) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "No super admins found",
        },
        { status: 403 }
      );
    }

    if (
      !process.env.SUPER_ADMIN_EMAILS?.split(",").includes(session.user?.email)
    ) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Only managers can access this resource",
        },
        { status: 403 }
      );
    }

    return await handler(req, {
      params: context?.params || {},
      session: session,
    });
  };
};

export default withSuperAdminAuthRequired;
