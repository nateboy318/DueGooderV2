import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema/user";

const updatePlan = async ({
  userId,
  newPlanId,
  sendEmail = true,
}: {
  userId: string;
  newPlanId: string;
  sendEmail?: boolean;
}) => {
  await db.update(users).set({ planId: newPlanId }).where(eq(users.id, userId));

  if (sendEmail) {
    // TODO: Implement this
  }
};

export default updatePlan;
