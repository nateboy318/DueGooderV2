"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GoogleCalendar {
  id: string;
  summary: string;
  description?: string;
  primary?: boolean;
  accessRole: string;
}

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

export function CalendarList() {
  const [calendars, setCalendars] = useState<GoogleCalendar[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedCalendar, setSelectedCalendar] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  const fetchCalendars = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/app/google-calendars");
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch calendars");
      }
      
      setCalendars(data.calendars || []);
      setHasAccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch calendars");
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async (calendarId: string) => {
    if (!calendarId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/app/google-calendar-events?calendarId=${calendarId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch events");
      }
      
      setEvents(data.events || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendars();
  }, []);

  useEffect(() => {
    if (selectedCalendar) {
      fetchEvents(selectedCalendar);
    }
  }, [selectedCalendar]);

  const formatEventTime = (event: CalendarEvent) => {
    const start = event.start.dateTime || event.start.date;
    if (!start) return "No time";
    
    try {
      const date = new Date(start);
      if (event.start.date && !event.start.dateTime) {
        // All-day event
        return date.toLocaleDateString();
      } else {
        return date.toLocaleString();
      }
    } catch {
      return start;
    }
  };

  if (hasAccess === false) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Google Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Calendar access is not available. Please reconnect your Google account to access calendar features.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Google Calendar
            {hasAccess && <CheckCircle className="h-4 w-4 text-green-500" />}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCalendars}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {calendars.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Calendar:</label>
            <Select value={selectedCalendar} onValueChange={setSelectedCalendar}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a calendar" />
              </SelectTrigger>
              <SelectContent>
                {calendars.map((calendar) => (
                  <SelectItem key={calendar.id} value={calendar.id}>
                    <div className="flex items-center gap-2">
                      {calendar.primary && <Badge variant="secondary">Primary</Badge>}
                      {calendar.summary}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedCalendar && events.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Upcoming Events:</label>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="p-3 border rounded-lg bg-muted/50"
                >
                  <div className="font-medium">{event.summary}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatEventTime(event)}
                  </div>
                  <Badge variant={event.status === "confirmed" ? "default" : "secondary"}>
                    {event.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedCalendar && events.length === 0 && !loading && (
          <div className="text-center text-muted-foreground py-4">
            No events found in this calendar
          </div>
        )}

        {calendars.length === 0 && !loading && !error && (
          <div className="text-center text-muted-foreground py-4">
            No calendars found
          </div>
        )}
      </CardContent>
    </Card>
  );
}
