import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { contacts } from "@/db/schema/contact";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = contactSchema.parse(json);

    const contact = await db.insert(contacts).values({
      name: body.name,
      email: body.email,
      company: body.company,
      message: body.message,
    }).returning();

    return NextResponse.json(contact[0], { status: 201 });
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