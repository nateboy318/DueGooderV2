"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Calendar } from "@/components/calendar/calendar";
import { SlidingClassFilter } from "@/components/calendar/sliding-class-filter";
import { CalendarToolbar } from "@/components/calendar/calendar-toolbar";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { TimeblockForm } from "@/components/calendar/timeblock-form";
import { useAppData } from "@/contexts/AppDataContext";
import useSWR from "swr";
import { mutate } from "swr";

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
  const { classes, mutateClasses } = useAppData();
  const { data: timeblocksData, error: timeblocksError, mutate: mutateTimeblocks, isLoading: timeblocksLoading } = useSWR<{success: boolean, timeblocks: Timeblock[]}>('/api/app/timeblocks');
  const [error, setError] = useState<string | null>(null);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"month" | "week" | "day" | "agenda">("week");
  const calendarRef = useRef<{ navigateToDate: (date: Date) => void; setView: (view: "month" | "week" | "day" | "agenda") => void }>(null);

  // Extract timeblocks and assignments from SWR data
  const timeblocks = timeblocksData?.timeblocks || [];
  const assignments = useMemo(() => {
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
    return allAssignments;
  }, [classes]);

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

  // Handle errors from SWR
  useEffect(() => {
    if (timeblocksError) {
      setError(timeblocksError instanceof Error ? timeblocksError.message : "Failed to fetch timeblocks");
    }
  }, [timeblocksError]);

  // Show loading state while data is being fetched
  if (timeblocksLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-blue-400 animate-spin" />
          <p className="text-blue-500">Loading calendar...</p>
        </div>
      </div>
    );
  }

  const handleTimeblockComplete = async (timeblockId: string) => {
    console.log('handleTimeblockComplete called with:', timeblockId);
    
    // Update state immediately - state becomes the source of truth
    const currentData = timeblocksData;
    if (currentData) {
      const updatedData = {
        ...currentData,
        timeblocks: currentData.timeblocks.map(tb =>
          tb.id === timeblockId ? { ...tb, completed: true } : tb
        )
      };
      
      console.log('Marking timeblock as completed in state:', { timeblockId });
      
      // Update SWR cache with new state - this becomes the source of truth
      mutateTimeblocks(updatedData, false);
    }
    
    // Update database in background
    try {
      const response = await fetch(`/api/app/timeblocks/${timeblockId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: true }),
      });

      if (!response.ok) {
        console.error("Failed to complete timeblock in database:", await response.text());
      } else {
        console.log('Timeblock completed successfully in database');
      }
    } catch (error) {
      console.error("Error completing timeblock in database:", error);
    }
  };

  const handleAssignmentComplete = async (assignmentId: string, classId: string) => {
    console.log('handleAssignmentComplete called with:', { assignmentId, classId });
    
    // Update state immediately - state becomes the source of truth
    const currentClasses = classes;
    if (currentClasses) {
      const updatedClasses = currentClasses.map(classData => {
        if (classData.id === classId) {
          return {
            ...classData,
            assignments: classData.assignments.map(assignment => 
              assignment.id === assignmentId ? { ...assignment, completed: true } : assignment
            )
          };
        }
        return classData;
      });
      
      console.log('Marking assignment as completed in state:', { assignmentId, classId });
      
      // Update SWR cache with new state - this becomes the source of truth
      mutateClasses({ success: true, classes: updatedClasses, count: updatedClasses.length }, false);
    }
    
    // Update database in background
    try {
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
        console.error("Failed to complete assignment in database:", await response.text());
      } else {
        console.log('Assignment completed successfully in database');
      }
    } catch (error) {
      console.error("Error completing assignment in database:", error);
    }
  };

  const handleTimeblockCreated = async (newTimeblock: Timeblock) => {
    console.log('handleTimeblockCreated called with:', newTimeblock);
    
    // Update state immediately - state becomes the source of truth
    const currentData = timeblocksData;
    if (currentData) {
      const updatedData = {
        ...currentData,
        timeblocks: [...currentData.timeblocks, newTimeblock]
      };
      
      console.log('Adding new timeblock to state:', { 
        timeblockId: newTimeblock.id,
        newCount: updatedData.timeblocks.length 
      });
      
      // Update SWR cache with new state - this becomes the source of truth
      mutateTimeblocks(updatedData, false);
    }
    
    setIsDialogOpen(false);
  };

  const handleTimeblockClick = (timeblock: Timeblock) => {
    console.log("Clicked timeblock:", timeblock);
  };

  const handleAssignmentClick = (assignment: Assignment) => {
    console.log("Clicked assignment:", assignment);
  };

  const handleTimeblockUpdate = async (updatedTimeblock: Timeblock) => {
    console.log('handleTimeblockUpdate called with:', updatedTimeblock);
    
    // Update state immediately - state becomes the source of truth
    const currentData = timeblocksData;
    if (currentData) {
      const updatedData = {
        ...currentData,
        timeblocks: currentData.timeblocks.map(tb =>
          tb.id === updatedTimeblock.id ? updatedTimeblock : tb
        )
      };
      
      console.log('Updating timeblock in state:', {
        timeblockId: updatedTimeblock.id,
        newStartTime: updatedTimeblock.startTime,
        newEndTime: updatedTimeblock.endTime
      });
      
      // Update SWR cache with new state - this becomes the source of truth
      mutateTimeblocks(updatedData, false);
    }
  };

  const handleAssignmentUpdate = async (updatedAssignment: Assignment) => {
    console.log('handleAssignmentUpdate called with:', updatedAssignment);
    
    // For assignments, we need to update the classes data
    // since assignments are nested within classes
    const currentClasses = classes;
    if (currentClasses) {
      const updatedClasses = currentClasses.map(classData => {
        if (classData.id === updatedAssignment.classId) {
          return {
            ...classData,
            assignments: classData.assignments.map(assignment => 
              assignment.id === updatedAssignment.id ? {
                ...assignment,
                dueDate: updatedAssignment.dueDate,
                name: updatedAssignment.name,
                description: updatedAssignment.description,
                completed: updatedAssignment.completed
              } : assignment
            )
          };
        }
        return classData;
      });
      
      console.log('Updating assignment in state:', { 
        classId: updatedAssignment.classId,
        assignmentId: updatedAssignment.id,
        newDueDate: updatedAssignment.dueDate
      });
      
      // Update SWR cache with new state - this becomes the source of truth
      mutateClasses({ success: true, classes: updatedClasses, count: updatedClasses.length }, false);
    }
  };

  const handleTimeblockDelete = async (timeblockId: string) => {
    console.log('handleTimeblockDelete called with:', timeblockId);
    
    // Update state immediately - state becomes the source of truth
    const currentData = timeblocksData;
    if (currentData) {
      const updatedData = {
        ...currentData,
        timeblocks: currentData.timeblocks.filter(tb => tb.id !== timeblockId)
      };
      
      console.log('Removing timeblock from state:', { 
        timeblockId,
        originalCount: currentData.timeblocks.length, 
        newCount: updatedData.timeblocks.length 
      });
      
      // Update SWR cache with new state - this becomes the source of truth
      mutateTimeblocks(updatedData, false);
    }
  };

  const handleAssignmentDelete = async (assignmentId: string) => {
    console.log('handleAssignmentDelete called with:', assignmentId);
    
    // Find the assignment to get its classId
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
      // Update state immediately - state becomes the source of truth
      const currentClasses = classes;
      if (currentClasses) {
        const updatedClasses = currentClasses.map(classData => {
          if (classData.id === assignment.classId) {
            return {
              ...classData,
              assignments: classData.assignments.filter(a => a.id !== assignmentId)
            };
          }
          return classData;
        });
        
        console.log('Removing assignment from state:', { 
          assignmentId,
          classId: assignment.classId
        });
        
        // Update SWR cache with new state - this becomes the source of truth
        mutateClasses({ success: true, classes: updatedClasses, count: updatedClasses.length }, false);
      }
    }
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
          <Button onClick={() => mutateTimeblocks()}>Try Again</Button>
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
        onTimeblockCreated={handleTimeblockCreated}
      />
    </div>
  );
}
