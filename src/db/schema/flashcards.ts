import {
  pgTable,
  text,
  timestamp,
  integer,
  serial,
} from "drizzle-orm/pg-core";
import { users } from "./user";

export const flashcardSets = pgTable("flashcard_sets", {
  id: serial("id").primaryKey(),
  studentId: text("studentId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  maxCards: integer("maxCards").default(25),
  classId: text("classId"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

export const flashcards = pgTable("flashcards", {
  id: serial("id").primaryKey(),
  setId: integer("setId")
    .notNull()
    .references(() => flashcardSets.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  type: text("type").notNull(), // "question", "vocab", etc.
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

export type FlashcardSet = typeof flashcardSets.$inferSelect;
export type NewFlashcardSet = typeof flashcardSets.$inferInsert;
export type Flashcard = typeof flashcards.$inferSelect;
export type NewFlashcard = typeof flashcards.$inferInsert;
