import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema/user";
import onUserCreate from "./onUserCreate";

const getOrCreateUser = async ({
  emailId,
  name,
}: {
  emailId: string;
  name: string | null | undefined;
}) => {
  // Find user by emailId
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, emailId))
    .limit(1);

  if (!user?.[0]) {
    // Create user
    const newUser = await db
      .insert(users)
      .values({
        email: emailId,
        name,
      })
      .returning();

    await onUserCreate(newUser[0]);

    return {
      user: newUser[0],
      created: true,
    };
  }

  return {
    user: user[0],
    created: false,
  };
};

export default getOrCreateUser;
