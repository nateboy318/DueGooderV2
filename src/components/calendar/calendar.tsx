"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { EventCalendar, type CalendarEvent, type CalendarView } from "@/components/event-calendar";

interface Timeblock {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  type: string;
  classId?: string;
  completed: boolean;
}

interface Assignment {
  id: string;
  name: string;
  description?: string;
  dueDate: string;
  classId: string;
  className: string;
  classColor?: string;
  classEmoji?: string;
  completed: boolean;
}

interface CalendarProps {
  timeblocks: Timeblock[];
  assignments?: Assignment[];
  onTimeblockClick?: (timeblock: Timeblock) => void;
  onTimeblockComplete?: (timeblockId: string) => void;
  onAssignmentClick?: (assignment: Assignment) => void;
  onAssignmentComplete?: (assignmentId: string) => void;
  onTimeblockUpdate?: (timeblock: Timeblock) => void;
  onAssignmentUpdate?: (assignment: Assignment) => void;
  onTimeblockDelete?: (timeblockId: string) => void;
  onAssignmentDelete?: (assignmentId: string) => void;
  onNavigateToDate?: (navigateFn: (date: Date) => void) => void;
  calendarRef?: React.RefObject<{ navigateToDate: (date: Date) => void; setView: (view: CalendarView) => void } | null>;
}

// Get event color - use actual class colors or default timeblock colors
const getEventColor = (type: string, classColor?: string): CalendarEvent['color'] => {
  // Use the actual class color if available
  if (classColor) {
    return classColor;
  }
  
  // Map timeblock types to default colors
  switch (type) {
    case 'study': return 'sky';
    case 'work': return 'emerald';
    case 'break': return 'amber';
    case 'project': return 'violet';
    case 'meeting': return 'orange';
    default: return 'sky';
  }
};

export function Calendar({ 
  timeblocks, 
  assignments = [],
  onTimeblockClick, 
  onTimeblockComplete,
  onAssignmentClick,
  onAssignmentComplete,
  onTimeblockUpdate,
  onAssignmentUpdate,
  onTimeblockDelete,
  onAssignmentDelete,
  onNavigateToDate,
  calendarRef
}: CalendarProps) {
  // Convert our data to EventCalendar format
  const events = useMemo((): CalendarEvent[] => {
    const calendarEvents: CalendarEvent[] = [];
    
    // Create a lookup map for class colors
    const classColorMap = new Map<string, string>();
    assignments.forEach(assignment => {
      if (assignment.classId && assignment.classColor) {
        classColorMap.set(assignment.classId, assignment.classColor);
      }
    });
    
    // Convert timeblocks
    timeblocks.forEach(timeblock => {
      const start = new Date(timeblock.startTime);
      const end = timeblock.endTime ? new Date(timeblock.endTime) : new Date(start.getTime() + 60 * 60 * 1000); // Default 1 hour
      const startTime = format(start, 'h:mm a');
      const endTime = format(end, 'h:mm a');
      
      // Use gray color for all timeblocks with dark gray border
      const timeblockColor = '#374151'; // gray-700 for dark gray border
      
      calendarEvents.push({
        id: `timeblock-${timeblock.id}`,
        title: timeblock.title,
        description: timeblock.description,
        start,
        end,
        allDay: false,
        color: timeblockColor,
        location: `${startTime} - ${endTime}`,
        completed: timeblock.completed,
        timeblockType: timeblock.type, // Add timeblock type for colored circles
      });
    });
    
    // Convert assignments
    assignments.forEach(assignment => {
      const dueDate = new Date(assignment.dueDate);
      // For assignments, we'll set them as all-day events on their due date
      calendarEvents.push({
        id: `assignment-${assignment.id}`,
        title: assignment.name,
        description: assignment.description,
        start: dueDate,
        end: dueDate,
        allDay: true,
        color: getEventColor('assignment', assignment.classColor),
        location: assignment.className,
        completed: assignment.completed,
        emoji: assignment.classEmoji,
      });
    });
    
    return calendarEvents;
  }, [timeblocks, assignments]);

  const handleEventAdd = async (event: CalendarEvent) => {
    // Handle adding new events (timeblocks)
    console.log('Event added:', event);
    // TODO: Implement timeblock creation
  };

  const handleEventUpdate = async (updatedEvent: CalendarEvent) => {
    // Handle updating events - this is called when dragging/dropping
    const eventId = updatedEvent.id;
    
    if (eventId.startsWith('timeblock-')) {
      // Update timeblock
      const timeblockId = eventId.replace('timeblock-', '');
      const originalTimeblock = timeblocks.find(tb => tb.id === timeblockId);
      
      if (originalTimeblock) {
        const updatedTimeblock: Timeblock = {
          ...originalTimeblock,
          startTime: updatedEvent.start.toISOString(),
          endTime: updatedEvent.end.toISOString(),
        };
        
        // Optimistic update - update UI immediately
        onTimeblockUpdate?.(updatedTimeblock);
        
        // Make API call in background
        try {
          const response = await fetch(`/api/app/timeblocks/${timeblockId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: updatedTimeblock.title,
              description: updatedTimeblock.description,
              startTime: updatedTimeblock.startTime,
              endTime: updatedTimeblock.endTime,
              type: updatedTimeblock.type,
              classId: updatedTimeblock.classId,
              completed: updatedTimeblock.completed,
            }),
          });
          
          if (!response.ok) {
            console.error('Failed to update timeblock:', await response.text());
            // Revert on failure - put back original timeblock
            onTimeblockUpdate?.(originalTimeblock);
          }
        } catch (error) {
          console.error('Error updating timeblock:', error);
          // Revert on failure - put back original timeblock
          onTimeblockUpdate?.(originalTimeblock);
        }
      }
    } else if (eventId.startsWith('assignment-')) {
      // Update assignment due date
      const assignmentId = eventId.replace('assignment-', '');
      const originalAssignment = assignments.find(a => a.id === assignmentId);
      
      if (originalAssignment) {
        const updatedAssignment: Assignment = {
          ...originalAssignment,
          dueDate: updatedEvent.start.toISOString(),
        };
        
        // Optimistic update - update UI immediately
        onAssignmentUpdate?.(updatedAssignment);
        
        // Make API call in background
        try {
          // Update assignment via classes API
          const response = await fetch(`/api/app/classes/${originalAssignment.classId}/assignments/${assignmentId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: updatedAssignment.name,
              description: updatedAssignment.description,
              dueDate: updatedAssignment.dueDate,
              completed: updatedAssignment.completed,
            }),
          });
          
          if (!response.ok) {
            console.error('Failed to update assignment:', await response.text());
            // Revert on failure - put back original assignment
            onAssignmentUpdate?.(originalAssignment);
          }
        } catch (error) {
          console.error('Error updating assignment:', error);
          // Revert on failure - put back original assignment
          onAssignmentUpdate?.(originalAssignment);
        }
      }
    }
  };

  const handleEventDelete = async (eventId: string) => {
    // Handle deleting events
    if (eventId.startsWith('timeblock-')) {
      const timeblockId = eventId.replace('timeblock-', '');
      try {
        const response = await fetch(`/api/app/timeblocks/${timeblockId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          onTimeblockDelete?.(timeblockId);
        } else {
          console.error('Failed to delete timeblock:', await response.text());
        }
      } catch (error) {
        console.error('Error deleting timeblock:', error);
      }
    } else if (eventId.startsWith('assignment-')) {
      const assignmentId = eventId.replace('assignment-', '');
      const assignment = assignments.find(a => a.id === assignmentId);
      
      if (assignment) {
        try {
          const response = await fetch(`/api/app/classes/${assignment.classId}/assignments/${assignmentId}`, {
            method: 'DELETE',
          });
          
          if (response.ok) {
            onAssignmentDelete?.(assignmentId);
          } else {
            console.error('Failed to delete assignment:', await response.text());
          }
        } catch (error) {
          console.error('Error deleting assignment:', error);
        }
      }
    }
  };

  return (
    <div className="h-screen w-full">
      <EventCalendar
        events={events}
        onEventAdd={handleEventAdd}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
        onNavigateToDate={onNavigateToDate}
        calendarRef={calendarRef as React.RefObject<{ navigateToDate: (date: Date) => void; setView: (view: CalendarView) => void; }>}
        initialView="week"
        className="h-full w-full"
      />
    </div>
  );
}