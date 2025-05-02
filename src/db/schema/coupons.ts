import { timestamp, pgTable, text, boolean } from "drizzle-orm/pg-core";
import { users } from "./user";

export const coupons = pgTable("coupon", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  code: text("code").unique().notNull(),

  // Usage tracking
  userId: text("userId").references(() => users.id),

  // Timestamps
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  usedAt: timestamp("usedAt", { mode: "date" }),

  // Status
  expired: boolean("expired").default(false),
});
