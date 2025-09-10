"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface Assignment {
  id: string;
  name: string;
  dueDate: string;
  description?: string;
  completed: boolean;
}

interface Class {
  id: string;
  name: string;
  colorHex: string;
  emoji: string;
  assignments: Assignment[];
}

interface WeeklyBreakdownProps {
  classes: Class[];
}

export function WeeklyBreakdown({ classes }: WeeklyBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'today' | 'week'>('today');

  // Calculate weekly data
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  // Get all assignments for the week
  const weeklyAssignments = classes.flatMap(cls => 
    cls.assignments
      .filter(assignment => {
        const dueDate = new Date(assignment.dueDate);
        return dueDate >= startOfWeek && dueDate <= endOfWeek;
      })
      .map(assignment => ({
        ...assignment,
        className: cls.name,
        classColor: cls.colorHex
      }))
  );

  // Get today's assignments
  const todayAssignments = weeklyAssignments.filter(assignment => {
    const dueDate = new Date(assignment.dueDate);
    return dueDate >= startOfToday && dueDate <= endOfToday;
  });

  // Calculate busyness score (0-100)
  const totalAssignments = weeklyAssignments.length;
  const busynessScore = Math.min(Math.round((totalAssignments / 20) * 100), 100);

  // Group assignments by class
  const groupAssignmentsByClass = (assignments: typeof weeklyAssignments) => {
    const grouped: { [key: string]: typeof weeklyAssignments & { emoji?: string } } = {};
    assignments.forEach(assignment => {
      if (!grouped[assignment.className]) {
        // Find the class emoji from the classes array
        const classData = classes.find(cls => cls.name === assignment.className);
        grouped[assignment.className] = [];
        if (classData) {
          (grouped[assignment.className] as any).emoji = classData.emoji;
        }
      }
      grouped[assignment.className].push(assignment);
    });
    return grouped;
  };

  const displayAssignments = viewMode === 'today' ? todayAssignments : weeklyAssignments;
  const groupedAssignments = groupAssignmentsByClass(displayAssignments);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'numeric', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <Card className="w-full bg-gray-100 p-6 rounded-lg border-none shadow-none">
        <div className="bg-white py-6 px-6">
        <CardHeader className="px-0 pb-4">
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span className="text-4xl">📣</span>
                <h2 className="text-3xl font-bold text-gray-800">This Week&apos;s Overview</h2>
            </div>
            <Button
                onClick={() => setIsExpanded(!isExpanded)}
                className="bg-black text-white hover:bg-gray-800 px-4 py-1 text-sm rounded-md"
            >
                {isExpanded ? "Hide" : "View Assignments"}
            </Button>
            </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-2 px-0">
        {/* Summary */}
        <div className="text-lg text-gray-600">
          You have <span className="font-bold">{totalAssignments}</span> assignments due across{" "}
          <span className="font-bold">{classes.length}</span> classes this week.
        </div>

        {/* Busyness Scale */}
        <div className="space-y-1 pt-4">
          
          <div className="w-full bg-gray-200 border-2 border-black rounded-full h-[13px]">
            <div
              className="bg-black h-[10px]  transition-all duration-300"
              style={{ width: `${busynessScore}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-gray-400 pt-2">
            <span>Calm</span>
            <div className="text-center text-xs text-gray-500">
            {busynessScore}/100 On The Busyness Scale
            </div>
            <span>Hectic</span>
          </div>
        </div>

        {isExpanded && (
          <>
            {/* Assignments Section */}
            <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">
                Assignments {viewMode === 'today' ? 'Today' : 'This Week'} by Class
              </h3>
              <div className="flex gap-1">
                <Button
                  onClick={() => setViewMode('today')}
                  className={`h-6 px-3 text-xs rounded ${
                    viewMode === 'today' 
                      ? 'bg-black text-white' 
                      : 'bg-white text-gray-700 border border-gray-300'
                  }`}
                >
                  Today
                </Button>
                <Button
                  onClick={() => setViewMode('week')}
                  className={`h-6 px-3 text-xs rounded ${
                    viewMode === 'week' 
                      ? 'bg-black text-white' 
                      : 'bg-white text-gray-700 border border-gray-300'
                  }`}
                >
                  This Week
                </Button>
              </div>
            </div>

            {Object.keys(groupedAssignments).length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                No assignments {viewMode === 'today' ? 'due today' : 'this week'}
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(groupedAssignments).map(([className, assignments]) => (
                  <div key={className} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{(groupedAssignments[className] as any)?.emoji || '📚'}</span>
                      <h4 className="font-medium text-gray-800 text-sm">{className}</h4>
                    </div>
                    <div className="space-y-1 ml-4">
                      {assignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className="flex items-center justify-between py-1"
                        >
                          <span className="text-sm text-gray-700">{assignment.name}</span>
                          <span className="text-xs text-gray-500">
                            {formatDate(assignment.dueDate)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          </>
        )}
      </CardContent>
      </div>
    </Card>
  );
}
