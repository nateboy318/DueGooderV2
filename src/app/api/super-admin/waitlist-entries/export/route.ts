import { NextResponse } from "next/server";
import withSuperAdminAuthRequired from "@/lib/auth/withSuperAdminAuthRequired";
import { db } from "@/db";
import { waitlist } from "@/db/schema/waitlist";
import { desc } from "drizzle-orm";

export const GET = withSuperAdminAuthRequired(async () => {
  try {
    // Get all entries ordered by creation date
    const entries = await db
      .select()
      .from(waitlist)
      .orderBy(desc(waitlist.createdAt));

    // Convert to CSV format
    const csvHeader = "Name,Email,Twitter Account,Joined Date\n";
    const csvRows = entries.map((entry) => {
      const name = (entry.name || "").replace(/,/g, ""); // Remove commas from fields
      const email = (entry.email || "").replace(/,/g, "");
      const twitter = entry.twitterAccount?.replace(/,/g, "") || "";
      const date = entry.createdAt
        ? new Date(entry.createdAt).toLocaleDateString()
        : "";
      return `${name},${email},${twitter},${date}`;
    });
    const csvContent = csvHeader + csvRows.join("\n");

    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="waitlist-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting waitlist:", error);
    return NextResponse.json(
      { error: "Failed to export waitlist" },
      { status: 500 }
    );
  }
});
