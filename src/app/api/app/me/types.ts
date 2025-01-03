import { plans } from "@/db/schema/plans";
import { users } from "@/db/schema/user";

export interface MeResponse {
  currentPlan: {
    id: (typeof plans.$inferSelect)["id"];
    name: (typeof plans.$inferSelect)["name"];
    codename: (typeof plans.$inferSelect)["codename"];
    quotas: (typeof plans.$inferSelect)["quotas"];
  } | null;
  user: typeof users.$inferSelect;
}
