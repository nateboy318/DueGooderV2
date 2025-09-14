CREATE TABLE "flashcard_sets" (
	"id" serial PRIMARY KEY NOT NULL,
	"studentId" text NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "flashcards" (
	"id" serial PRIMARY KEY NOT NULL,
	"setId" integer NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"type" text NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "flashcard_sets" ADD CONSTRAINT "flashcard_sets_studentId_app_user_id_fk" FOREIGN KEY ("studentId") REFERENCES "public"."app_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flashcards" ADD CONSTRAINT "flashcards_setId_flashcard_sets_id_fk" FOREIGN KEY ("setId") REFERENCES "public"."flashcard_sets"("id") ON DELETE cascade ON UPDATE no action;