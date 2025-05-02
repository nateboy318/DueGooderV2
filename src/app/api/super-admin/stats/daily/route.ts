import { NextResponse } from "next/server";
import withSuperAdminAuthRequired from "@/lib/auth/withSuperAdminAuthRequired";
import { db } from "@/db";
import { users } from "@/db/schema/user";
import { waitlist } from "@/db/schema/waitlist";
import { sql } from "drizzle-orm";
import { subDays, startOfDay, format } from "date-fns";

export const GET = withSuperAdminAuthRequired(async () => {
  const thirtyDaysAgo = startOfDay(subDays(new Date(), 30));

  // Get user signups per day
  const userSignups = await db
    .select({
      date: sql<string>`DATE(${users.createdAt})::text`,
      count: sql<number>`COUNT(*)`,
    })
    .from(users)
    .where(sql`${users.createdAt} >= ${thirtyDaysAgo}`)
    .groupBy(sql`DATE(${users.createdAt})`)
    .orderBy(sql`DATE(${users.createdAt})`);

  // Get waitlist entries per day
  const waitlistEntries = await db
    .select({
      date: sql<string>`DATE(${waitlist.createdAt})::text`,
      count: sql<number>`COUNT(*)`,
    })
    .from(waitlist)
    .where(sql`${waitlist.createdAt} >= ${thirtyDaysAgo}`)
    .groupBy(sql`DATE(${waitlist.createdAt})`)
    .orderBy(sql`DATE(${waitlist.createdAt})`);

  // Generate array of last 30 days
  const dates = Array.from({ length: 31 }, (_, i) => {
    const date = format(subDays(new Date(), i), "yyyy-MM-dd");
    return {
      date,
      users: 0,
      waitlist: 0,
    };
  }).reverse();

  // Fill in actual counts
  userSignups.forEach((signup) => {
    const day = dates.find((d) => d.date === signup.date);
    if (day) day.users = Number(signup.count);
  });

  waitlistEntries.forEach((entry) => {
    const day = dates.find((d) => d.date === entry.date);
    if (day) day.waitlist = Number(entry.count);
  });

  return NextResponse.json({ data: dates });
}); 