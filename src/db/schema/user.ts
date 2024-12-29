import {
  integer,
  pgTable,
  varchar,
  timestamp,
  boolean,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// Users schema
export const usersTable = pgTable(
  "users",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    auth0Sub: varchar({ length: 255 }).notNull().unique(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull(),
    photo: varchar({ length: 500 }),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow(),
    isSuperAdmin: boolean().default(false),
    isBanned: boolean().default(false),
    banedReason: text(),
  },
  (table) => [
    uniqueIndex("auth0_sub_idx").on(table.auth0Sub),
    uniqueIndex("email_idx").on(table.email),
  ]
);
