import { NextResponse } from "next/server";
import withSuperAdminAuthRequired from "@/lib/auth/withSuperAdminAuthRequired";
import { db } from "@/db";
import { contacts } from "@/db/schema/contact";
import { desc, sql, eq } from "drizzle-orm";

export const GET = withSuperAdminAuthRequired(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const offset = (page - 1) * limit;

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(contacts)
      .where(
        search
          ? sql`email LIKE ${`%${search}%`} OR name LIKE ${`%${search}%`} OR message LIKE ${`%${search}%`}`
          : sql`1=1`
      );

    const totalCount = totalCountResult[0].count;

    // Get paginated messages
    const messagesList = await db
      .select()
      .from(contacts)
      .where(
        search
          ? sql`email LIKE ${`%${search}%`} OR name LIKE ${`%${search}%`} OR message LIKE ${`%${search}%`}`
          : sql`1=1`
      )
      .orderBy(desc(contacts.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      messages: messagesList,
      pagination: {
        total: totalCount,
        pageCount: Math.ceil(totalCount / limit),
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
});

// Mark as read/unread
export const PATCH = withSuperAdminAuthRequired(async (req) => {
  try {
    const { id, readAt } = await req.json();

    const updatedMessage = await db
      .update(contacts)
      .set({
        readAt: readAt ? new Date() : null,
      })
      .where(eq(contacts.id, id))
      .returning();

    return NextResponse.json(updatedMessage[0]);
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    );
  }
});

// Delete message
export const DELETE = withSuperAdminAuthRequired(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      );
    }

    await db.delete(contacts).where(eq(contacts.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  }
}); 