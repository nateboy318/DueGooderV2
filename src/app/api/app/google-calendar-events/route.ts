import { db } from "@/db";
import { accounts } from "@/db/schema/user";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  status: string;
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
    const { searchParams } = new URL(req.url);
    const calendarId = searchParams.get('calendarId');

    if (!calendarId) {
      return NextResponse.json(
        { error: "Calendar ID is required" },
        { status: 400 }
      );
    }

    // Get access token
    const accessToken = await getAccessToken(userId);
    if (!accessToken) {
      return NextResponse.json(
        { error: "No valid Google access token found" },
        { status: 401 }
      );
    }

    // Get current time and 30 days from now
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + 30);

    // Fetch events from Google Calendar API
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?` +
      `timeMin=${now.toISOString()}&timeMax=${future.toISOString()}&maxResults=20&singleEvents=true&orderBy=startTime`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

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
        { error: "Failed to fetch events from Google" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const events: CalendarEvent[] = data.items?.map((item: any) => ({
      id: item.id,
      summary: item.summary || 'No title',
      start: {
        dateTime: item.start?.dateTime,
        date: item.start?.date,
      },
      end: {
        dateTime: item.end?.dateTime,
        date: item.end?.date,
      },
      status: item.status || 'confirmed',
    })) || [];

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error fetching Google calendar events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
});
