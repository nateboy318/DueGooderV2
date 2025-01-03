import { timestamp, pgTable, text, serial } from "drizzle-orm/pg-core";

export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  name: text("name"),
  twitterAccount: text("twitterAccount"),
  email: text("email").unique(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});
