"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, CheckCircle, Plus, Check } from "lucide-react";
import useSWR, { mutate } from "swr";

interface Assignment {
  id: string;
  name: string;
  dueDate: string;
  description?: string;
  completed: boolean;
  classId: string;
  className?: string;
  classColor?: string;
  emoji?: string;
}

interface Class {
  id: string;
  name: string;
  colorHex: string;
  emoji: string;
  assignments: Assignment[];
}

export function AssignmentsSidebar() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch classes data
  const { data: classesResponse } = useSWR<{success: boolean, classes: Class[], count: number}>('/api/app/classes');
  const classes = classesResponse?.classes || [];

  // Process assignments data
  const allAssignments: Assignment[] = classes.flatMap(classData => 
    classData.assignments?.map((assignment: any) => ({
      ...assignment,
      classId: classData.id,
      className: classData.name,
      classColor: classData.colorHex,
      emoji: classData.emoji
    })) || []
  );

  // Filter assignments
  const overdueAssignments = allAssignments.filter(assignment => {
    const dueDate = new Date(assignment.dueDate);
    return !assignment.completed && dueDate < currentTime;
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const comingUpAssignments = allAssignments.filter(assignment => {
    const dueDate = new Date(assignment.dueDate);
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    return !assignment.completed && dueDate >= currentTime && dueDate <= sevenDaysFromNow;
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Handle marking assignment as complete
  const handleMarkComplete = async (assignmentId: string, classId: string) => {
    try {
      console.log('Marking assignment complete:', { assignmentId, classId });
      
      const response = await fetch('/api/app/classes/assignments/toggle-complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          classId, 
          assignmentId, 
          completed: true 
        }),
      });

      if (response.ok) {
        // Refresh the data to show updated state
        mutate('/api/app/classes');
      } else {
        const errorData = await response.json();
        console.error('Failed to mark assignment as complete:', errorData);
      }
    } catch (error) {
      console.error('Error marking assignment as complete:', error);
    }
  };

  return (
    <div className="w-80 p-6 max-h-screen my-8 overflow-y-auto space-y-4 bg-gray-100 rounded-l-lg">
      {/* Overdue Assignments */}
      <div className="bg-white ">
        <div className="p-5 pb-0">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-semibold text-md">
              <AlertCircle className="w-4 h-4 text-red-500" />
              Overdue
            </span>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800">
              View All
            </Button>
          </div>
        </div>
        <div className="p-4 space-y-2">
          {overdueAssignments.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p>No overdue assignments!</p>
            </div>
          ) : (
            <>
              {overdueAssignments.slice(0, 3).map((assignment) => (
                <div key={assignment.id} className="relative flex items-start gap-3 p-3 rounded-lg border-2" style={{ borderColor: assignment.classColor, backgroundColor: `${assignment.classColor}20` }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {assignment.emoji}
                        </span>
                        <span className="ml-2 text-sm font-bold text-gray-900 truncate">
                          {assignment.name}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{formatDate(assignment.dueDate)}</span>
                      <span>•</span>
                      <span className="text-black font-medium">Overdue</span>
                    </div>
                    {assignment.className && (
                      <div className="text-sm text-black mt-1 truncate max-w-[120px]">
                        {assignment.className}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkComplete(assignment.id, assignment.classId)}
                    className="absolute bottom-2 right-2 h-6 w-6 p-0 hover:bg-black/10 rounded-md"
                  >
                    <Check className="h-4 w-4 text-black" />
                  </Button>
                </div>
              ))}
              {overdueAssignments.length > 3 && (
                <div className="text-center py-2">
                  <span className="text-sm text-gray-500 font-medium">
                    +{overdueAssignments.length - 3} more assignments
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Coming Up Assignments */}
      <div className="bg-white">
        <div className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-500" />
              <span className="font-semibold text-md">Coming Up</span>
            </span>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800">
              View All
            </Button>
          </div>
        </div>
        <div className="p-4 space-y-2">
          {comingUpAssignments.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No upcoming assignments</p>
            </div>
          ) : (
            <>
              {comingUpAssignments.slice(0, 3).map((assignment) => (
                <div key={assignment.id} className="relative p-3 rounded-lg border-2" style={{ borderColor: assignment.classColor, backgroundColor: `${assignment.classColor}20` }}>
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">
                        {assignment.emoji}
                        <span className="ml-2 text-sm font-bold text-gray-900 truncate">
                          {assignment.name}
                        </span>
                      </div>
                      <div className="text-xs text-black font-medium mt-1">
                        Due {formatDate(assignment.dueDate)} <span className="text-gray-500">at</span> {formatTime(assignment.dueDate)}
                      </div>
                      <div className="text-sm text-black mt-1 truncate max-w-[120px]">
                        {assignment.className}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkComplete(assignment.id, assignment.classId)}
                    className="absolute bottom-2 right-2 h-6 w-6 p-0 hover:bg-black/10 rounded-md"
                  >
                    <Check className="h-4 w-4 text-black" />
                  </Button>
                </div>
              ))}
              {comingUpAssignments.length > 3 && (
                <div className="text-center py-2">
                  <span className="text-sm text-gray-500 font-medium">
                    +{comingUpAssignments.length - 3} more assignments
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>


    </div>
  );
}
