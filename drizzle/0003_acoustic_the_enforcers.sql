ALTER TABLE "flashcard_sets" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "flashcard_sets" ADD COLUMN "maxCards" integer DEFAULT 25;