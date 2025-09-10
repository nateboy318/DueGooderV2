CREATE TABLE "timeblocks" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"startTime" timestamp NOT NULL,
	"endTime" timestamp NOT NULL,
	"classId" text,
	"assignmentId" text,
	"type" text DEFAULT 'study' NOT NULL,
	"completed" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"isRecurring" boolean DEFAULT false,
	"recurringPattern" text,
	"parentTimeblockId" text
);
--> statement-breakpoint
ALTER TABLE "timeblocks" ADD CONSTRAINT "timeblocks_userId_app_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."app_user"("id") ON DELETE cascade ON UPDATE no action;