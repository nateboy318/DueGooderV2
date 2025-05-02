import { NextResponse } from "next/server";
import withSuperAdminAuthRequired from "@/lib/auth/withSuperAdminAuthRequired";
import { db } from "@/db";
import { users } from "@/db/schema/user";
import { eq } from "drizzle-orm";
import { encryptJson } from "@/lib/encryption/edge-jwt";

export const POST = withSuperAdminAuthRequired(async (req, context) => {
  const { id } = (await context.params) as { id: string };
  const currentUser = await context.session?.user;

  if (!currentUser?.id) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    // Get target user to be impersonated
    const targetUser = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)
      .then((users) => users[0]);

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create impersonation token with the new structure
    const impersonationData = {
      impersonateIntoId: targetUser.id,
      impersonateIntoEmail: targetUser.email,
      impersonator: currentUser.id, // Using the session user's ID
      expiry: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // 30 minutes
    };

    const token = await encryptJson(impersonationData);

    // Generate sign-in URL with token
    const signInUrl = new URL(`${process.env.NEXTAUTH_URL}/sign-in`);
    signInUrl.searchParams.append("impersonateToken", token);

    return NextResponse.json({ url: signInUrl.toString() });
  } catch (error) {
    console.error("Error creating impersonation token:", error);
    return NextResponse.json(
      { error: "Failed to create impersonation token" },
      { status: 500 }
    );
  }
});
