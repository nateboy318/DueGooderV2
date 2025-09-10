import { db } from "@/db";
import { accounts } from "@/db/schema/user";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

interface GoogleCalendar {
  id: string;
  summary: string;
  description?: string;
  primary?: boolean;
  accessRole: string;
}

async function getAccessToken(userId: string): Promise<string | null> {
  try {
    // Get the Google account for this user
    const googleAccount = await db
      .select()
      .from(accounts)
      .where(
        and(
          eq(accounts.userId, userId),
          eq(accounts.provider, "google")
        )
      )
      .limit(1)
      .then((accounts) => accounts[0]);

    if (!googleAccount || !googleAccount.refresh_token) {
      return null;
    }

    // Use refresh token to get a new access token
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: googleAccount.refresh_token,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      console.error('Failed to refresh token:', response.status, await response.text());
      return null;
    }

    const tokenData = await response.json();
    return tokenData.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

export const GET = withAuthRequired(async (req, context) => {
  try {
    const userId = context.session.user.id;

    // Get access token
    const accessToken = await getAccessToken(userId);
    if (!accessToken) {
      return NextResponse.json(
        { error: "No valid Google access token found" },
        { status: 401 }
      );
    }

    // Fetch calendars from Google Calendar API
    const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Calendar API error:', response.status, errorText);
      
      if (response.status === 403) {
        return NextResponse.json(
          { error: "Calendar access not granted. Please reconnect your Google account." },
          { status: 403 }
        );
      }
      
      return NextResponse.json(
        { error: "Failed to fetch calendars from Google" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const calendars: GoogleCalendar[] = data.items?.map((item: any) => ({
      id: item.id,
      summary: item.summary,
      description: item.description,
      primary: item.primary,
      accessRole: item.accessRole,
    })) || [];

    return NextResponse.json({ calendars });
  } catch (error) {
    console.error("Error fetching Google calendars:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendars" },
      { status: 500 }
    );
  }
});
