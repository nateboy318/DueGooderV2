import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { accounts } from "@/db/schema/user";
import { eq, and } from "drizzle-orm";
import withAuthRequired from "@/lib/auth/withAuthRequired";

interface ParsedClass {
  id: string;
  name: string;
  assignments: {
    id: string;
    name: string;
    dueDate: string;
    description?: string;
  }[];
}

export const POST = withAuthRequired(async (request: NextRequest, context) => {
  try {
    const userId = context.session.user.id;

    const { classes }: { classes: ParsedClass[] } = await request.json();
    
    if (!classes || !Array.isArray(classes)) {
      return NextResponse.json({ error: "Classes data is required" }, { status: 400 });
    }

    // Get user's Google account with refresh token
    const googleAccount = await db
      .select()
      .from(accounts)
      .where(
        and(
          eq(accounts.userId, userId),
          eq(accounts.provider, "google")
        )
      )
      .limit(1);

    if (!googleAccount.length || !googleAccount[0].refresh_token) {
      return NextResponse.json({ error: "Google account not connected" }, { status: 400 });
    }

    const account = googleAccount[0];
    
    // Get fresh access token
    const accessToken = await getGoogleAccessToken(account.refresh_token!);
    
    if (!accessToken) {
      return NextResponse.json({ error: "Failed to get Google access token" }, { status: 500 });
    }

    const results = [];

    // Create calendar events for each class
    for (const classData of classes) {
      try {
        // Create a calendar for this class
        const calendar = await createGoogleCalendar(accessToken, classData.name);
        
        if (!calendar) {
          console.error(`Failed to create calendar for class: ${classData.name}`);
          continue;
        }

        // Create events for each assignment
        for (const assignment of classData.assignments) {
          try {
            const event = await createGoogleCalendarEvent(
              accessToken,
              calendar.id,
              assignment.name,
              assignment.dueDate,
              assignment.description || ""
            );
            
            if (event) {
              results.push({
                class: classData.name,
                assignment: assignment.name,
                calendarId: calendar.id,
                eventId: event.id,
                status: "created"
              });
            }
          } catch (error) {
            console.error(`Failed to create event for assignment ${assignment.name}:`, error);
            results.push({
              class: classData.name,
              assignment: assignment.name,
              status: "failed",
              error: error instanceof Error ? error.message : "Unknown error"
            });
          }
        }
      } catch (error) {
        console.error(`Failed to process class ${classData.name}:`, error);
        results.push({
          class: classData.name,
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      message: `Processed ${classes.length} classes with ${results.length} events`
    });

  } catch (error) {
    console.error("Calendar events creation error:", error);
    return NextResponse.json(
      { error: "Failed to create calendar events" },
      { status: 500 }
    );
  }
});

async function getGoogleAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      console.error("Failed to refresh Google token:", await response.text());
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error refreshing Google token:", error);
    return null;
  }
}

async function createGoogleCalendar(accessToken: string, calendarName: string): Promise<{ id: string } | null> {
  try {
    const response = await fetch("https://www.googleapis.com/calendar/v3/calendars", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: calendarName,
        description: `Calendar for ${calendarName} assignments`,
        timeZone: "UTC",
      }),
    });

    if (!response.ok) {
      console.error("Failed to create Google calendar:", await response.text());
      return null;
    }

    const calendar = await response.json();
    return { id: calendar.id };
  } catch (error) {
    console.error("Error creating Google calendar:", error);
    return null;
  }
}

async function createGoogleCalendarEvent(
  accessToken: string,
  calendarId: string,
  eventName: string,
  dueDate: string,
  description: string
): Promise<{ id: string } | null> {
  try {
    const dueDateTime = new Date(dueDate);
    const startTime = new Date(dueDateTime.getTime() - 60 * 60 * 1000); // 1 hour before due date
    const endTime = dueDateTime;

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: eventName,
          description: description,
          start: {
            dateTime: startTime.toISOString(),
            timeZone: "UTC",
          },
          end: {
            dateTime: endTime.toISOString(),
            timeZone: "UTC",
          },
          reminders: {
            useDefault: false,
            overrides: [
              { method: "email", minutes: 24 * 60 }, // 1 day before
              { method: "popup", minutes: 60 }, // 1 hour before
            ],
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("Failed to create Google calendar event:", await response.text());
      return null;
    }

    const event = await response.json();
    return { id: event.id };
  } catch (error) {
    console.error("Error creating Google calendar event:", error);
    return null;
  }
}
