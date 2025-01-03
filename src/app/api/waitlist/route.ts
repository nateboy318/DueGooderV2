import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { waitlist } from "@/db/schema/waitlist";

const waitlistSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  twitterAccount: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = waitlistSchema.parse(json);

    const entry = await db
      .insert(waitlist)
      .values({
        name: body.name,
        email: body.email,
        twitterAccount: body.twitterAccount || null,
      })
      .returning();

    return NextResponse.json(entry[0], { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 