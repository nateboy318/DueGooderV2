"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Calendar } from "@/components/calendar/calendar";
import { SlidingClassFilter } from "@/components/calendar/sliding-class-filter";
import { CalendarToolbar } from "@/components/calendar/calendar-toolbar";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { TimeblockForm } from "@/components/calendar/timeblock-form";
import { useAppData } from "@/contexts/AppDataContext";

interface Timeblock {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  type: string;
  classId?: string;
  assignmentId?: string;
  completed: boolean;
}

interface Assignment {
  id: string;
  name: string;
  dueDate: string;
  description?: string;
  completed: boolean;
  classId: string;
  className: string;
  classColor?: string;
  classEmoji?: string;
}

export default function CalendarPage() {
  const { classes } = useAppData();
  const [timeblocks, setTimeblocks] = useState<Timeblock[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"month" | "week" | "day" | "agenda">("week");
  const calendarRef = useRef<{ navigateToDate: (date: Date) => void; setView: (view: "month" | "week" | "day" | "agenda") => void }>(null);

  // Use classes from context and create class map
  const classMap = useMemo(() => {
    const map = new Map<string, { id: string; name: string; color: string; emoji?: string }>();
    
    classes.forEach((cls) => {
      map.set(cls.id, {
        id: cls.id,
        name: cls.name,
        color: cls.colorHex,
        emoji: cls.emoji,
      });
    });
    
    return map;
  }, [classes]);

  // Filter events based on selected classes
  const filteredTimeblocks = useMemo(() => {
    if (selectedClasses.length === 0) return timeblocks;
    return timeblocks.filter(timeblock => 
      timeblock.classId && selectedClasses.includes(timeblock.classId)
    );
  }, [timeblocks, selectedClasses]);

  const filteredAssignments = useMemo(() => {
    if (selectedClasses.length === 0) return assignments;
    return assignments.filter(assignment => 
      selectedClasses.includes(assignment.classId)
    );
  }, [assignments, selectedClasses]);

  const classesList = Array.from(classMap.values());

  const fetchData = async () => {
    try {
      // Fetch timeblocks
      const timeblocksResponse = await fetch("/api/app/timeblocks");
      if (!timeblocksResponse.ok) {
        throw new Error("Failed to fetch timeblocks");
      }
      const timeblocksData = await timeblocksResponse.json();
      setTimeblocks(timeblocksData.timeblocks || []);

      // Extract assignments from classes (already loaded from context)
      const allAssignments: Assignment[] = [];
      if (classes) {
        classes.forEach((classData) => {
          if (classData.assignments) {
            classData.assignments.forEach((assignment) => {
              allAssignments.push({
                id: assignment.id,
                name: assignment.name,
                dueDate: assignment.dueDate,
                description: assignment.description,
                completed: assignment.completed,
                classId: classData.id,
                className: classData.name,
                classColor: classData.colorHex,
                classEmoji: classData.emoji,
              });
            });
          }
        });
      }
      setAssignments(allAssignments);

    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch data");
    }
  };

  useEffect(() => {
    if (classes.length > 0) {
      fetchData();
    }
  }, [classes]);

  const handleTimeblockComplete = async (timeblockId: string) => {
    try {
      const response = await fetch(`/api/app/timeblocks/${timeblockId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to complete timeblock");
      }

      setTimeblocks(prev =>
        prev.map(tb =>
          tb.id === timeblockId ? { ...tb, completed: true } : tb
        )
      );
    } catch (error) {
      console.error("Error completing timeblock:", error);
      setError(error instanceof Error ? error.message : "Failed to complete timeblock");
    }
  };

  const handleAssignmentComplete = async (assignmentId: string, classId: string) => {
    try {
      // Update assignment completion via classes API
      const response = await fetch("/api/app/classes/update-assignment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classId,
          assignmentId,
          completed: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to complete assignment");
      }

      setAssignments(prev =>
        prev.map(assignment =>
          assignment.id === assignmentId && assignment.classId === classId
            ? { ...assignment, completed: true }
            : assignment
        )
      );
    } catch (error) {
      console.error("Error completing assignment:", error);
      setError(error instanceof Error ? error.message : "Failed to complete assignment");
    }
  };

  const handleTimeblockCreated = (newTimeblock: Timeblock) => {
    setTimeblocks(prev => [...prev, newTimeblock]);
    setIsDialogOpen(false);
  };

  const handleTimeblockClick = (timeblock: Timeblock) => {
    console.log("Clicked timeblock:", timeblock);
  };

  const handleAssignmentClick = (assignment: Assignment) => {
    console.log("Clicked assignment:", assignment);
  };

  const handleTimeblockUpdate = (updatedTimeblock: Timeblock) => {
    setTimeblocks(prev =>
      prev.map(tb =>
        tb.id === updatedTimeblock.id ? updatedTimeblock : tb
      )
    );
  };

  const handleAssignmentUpdate = (updatedAssignment: Assignment) => {
    setAssignments(prev =>
      prev.map(assignment =>
        assignment.id === updatedAssignment.id ? updatedAssignment : assignment
      )
    );
  };

  const handleTimeblockDelete = (timeblockId: string) => {
    setTimeblocks(prev => prev.filter(tb => tb.id !== timeblockId));
  };

  const handleAssignmentDelete = (assignmentId: string) => {
    setAssignments(prev => prev.filter(assignment => assignment.id !== assignmentId));
  };

  // Wrapper functions to match Calendar component interface
  const handleAssignmentCompleteWrapper = (assignmentId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
      handleAssignmentComplete(assignmentId, assignment.classId);
    }
  };

  // Search functionality
  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    
    // Find matching assignments or timeblocks
    const matchingAssignments = assignments.filter(assignment => 
      assignment.name.toLowerCase().includes(query.toLowerCase()) ||
      assignment.className.toLowerCase().includes(query.toLowerCase())
    );
    
    const matchingTimeblocks = timeblocks.filter(timeblock => 
      timeblock.title.toLowerCase().includes(query.toLowerCase())
    );
    
    // Navigate to the first incomplete assignment's due date
    if (matchingAssignments.length > 0) {
      const incompleteAssignments = matchingAssignments.filter(a => !a.completed);
      if (incompleteAssignments.length > 0) {
        const firstAssignment = incompleteAssignments[0];
        const dueDate = new Date(firstAssignment.dueDate);
        if (calendarRef.current) {
          calendarRef.current.navigateToDate(dueDate);
        }
        return;
      }
    }
    
    // If no incomplete assignments, navigate to first page (today)
    if (calendarRef.current) {
      calendarRef.current.navigateToDate(new Date());
    }
  };

  // Toolbar handlers
  const handleFilterClick = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleAddEvent = () => {
    setIsDialogOpen(true);
  };

  const handleViewChange = (view: "month" | "week" | "day" | "agenda") => {
    setCurrentView(view);
    if (calendarRef.current) {
      calendarRef.current.setView(view);
    }
  };


  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-red-400" />
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchData}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full p-2">
      {/* Calendar Toolbar */}
      <CalendarToolbar
        onFilterClick={handleFilterClick}
        onSearch={handleSearch}
        onAddEvent={handleAddEvent}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isFilterOpen={isFilterOpen}
        currentView={currentView}
        onViewChange={handleViewChange}
      />

      {/* Class Filter */}
      {classesList.length > 0 && (
        <SlidingClassFilter
          classes={classesList}
          selectedClasses={selectedClasses}
          onSelectionChange={setSelectedClasses}
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />
      )}

      {/* Calendar */}
      <Calendar
        timeblocks={filteredTimeblocks}
        assignments={filteredAssignments}
        onTimeblockClick={handleTimeblockClick}
        onTimeblockComplete={handleTimeblockComplete}
        onAssignmentClick={handleAssignmentClick}
        onAssignmentComplete={handleAssignmentCompleteWrapper}
        onTimeblockUpdate={handleTimeblockUpdate}
        onAssignmentUpdate={handleAssignmentUpdate}
        onTimeblockDelete={handleTimeblockDelete}
        onAssignmentDelete={handleAssignmentDelete}
        calendarRef={calendarRef}
      />

      {/* Add Event Dialog */}
      <TimeblockForm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onTimeblockCreated={() => {
          setIsDialogOpen(false);
          fetchData(); // Refresh data
        }}
      />
    </div>
  );
}
