import { db } from "@/db";
import { accounts } from "@/db/schema/user";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = withAuthRequired(async (req, context) => {
  try {
    const userId = context.session.user.id;

    // Find Google account for this user
    const googleAccount = await db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, userId))
      .then((accounts) => accounts.find((account) => account.provider === "google"));

    if (!googleAccount) {
      return NextResponse.json({
        hasGoogleAccount: false,
        hasCalendarScope: false,
        needsReauth: false,
      });
    }

    // Check if the scope includes calendar access
    const scope = googleAccount.scope || "";
    const hasCalendarScope = scope.includes("https://www.googleapis.com/auth/calendar");
    const needsReauth = !hasCalendarScope;

    return NextResponse.json({
      hasGoogleAccount: true,
      hasCalendarScope,
      needsReauth,
      scope,
    });
  } catch (error) {
    console.error("Error checking Google account:", error);
    return NextResponse.json(
      { error: "Failed to check Google account" },
      { status: 500 }
    );
  }
});
