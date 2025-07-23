import { sql } from "drizzle-orm";
import { text, timestamp, pgTable } from "drizzle-orm/pg-core";
import { plans } from "./plans";
import { users } from "./user";

export const paypalAccessTokens = pgTable("paypal_access_tokens", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const paypalContext = pgTable("paypal_context", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  planId: text("plan_id").references(() => plans.id),
  userId: text("user_id").references(() => users.id),
  frequency: text("frequency").notNull(), // monthly, yearly, onetime
  paypalOrderId: text("paypal_order_id"),
  paypalSubscriptionId: text("paypal_subscription_id"),
  status: text("status").notNull().default("pending"), // 'pending', 'success', 'cancelled'
});

// Types
export type PaypalAccessToken = typeof paypalAccessTokens.$inferSelect;
export type NewPaypalAccessToken = typeof paypalAccessTokens.$inferInsert;

export type PaypalContext = typeof paypalContext.$inferSelect;
export type NewPaypalContext = typeof paypalContext.$inferInsert;
