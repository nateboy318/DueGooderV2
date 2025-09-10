import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { users } from "./user";

export const timeblocks = pgTable("timeblocks", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  title: text("title").notNull(),
  description: text("description"),
  
  startTime: timestamp("startTime", { mode: "date" }).notNull(),
  endTime: timestamp("endTime", { mode: "date" }).notNull(),
  
  // Optional: Link to a specific class/assignment
  classId: text("classId"),
  assignmentId: text("assignmentId"),
  
  // Timeblock type for categorization
  type: text("type").notNull().default("study"), // study, break, exam, project, etc.
  
  // Status tracking
  completed: boolean("completed").default(false),
  
  // Metadata
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow(),
  
  // Optional: Recurring timeblock support
  isRecurring: boolean("isRecurring").default(false),
  recurringPattern: text("recurringPattern"), // daily, weekly, etc.
  parentTimeblockId: text("parentTimeblockId"), // For recurring instances
});

export type Timeblock = typeof timeblocks.$inferSelect;
export type NewTimeblock = typeof timeblocks.$inferInsert;
