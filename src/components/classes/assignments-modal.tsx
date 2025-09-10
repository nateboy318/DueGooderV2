"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText, AlertTriangle } from "lucide-react";

interface Assignment {
  id: string;
  name: string;
  dueDate: string;
  description?: string;
}

interface Class {
  id: string;
  name: string;
  assignments: Assignment[];
}

interface AssignmentsModalProps {
  classData: Class;
  isOpen: boolean;
  onClose: () => void;
}

export function AssignmentsModal({ classData, isOpen, onClose }: AssignmentsModalProps) {
  const [sortBy, setSortBy] = useState<'dueDate' | 'name'>('dueDate');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeUntilDue = (dateString: string) => {
    const now = new Date();
    const dueDate = new Date(dateString);
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${diffDays} days`;
    }
  };

  const getAssignmentStatus = (dateString: string) => {
    const now = new Date();
    const dueDate = new Date(dateString);
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'overdue', color: 'destructive' as const };
    } else if (diffDays <= 3) {
      return { status: 'urgent', color: 'destructive' as const };
    } else if (diffDays <= 7) {
      return { status: 'soon', color: 'secondary' as const };
    } else {
      return { status: 'upcoming', color: 'outline' as const };
    }
  };

  const sortedAssignments = [...classData.assignments].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  const overdueCount = classData.assignments.filter(a => new Date(a.dueDate) < new Date()).length;
  const upcomingCount = classData.assignments.filter(a => new Date(a.dueDate) >= new Date()).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl w-full bg-white text-gray-900 max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5" />
            {classData.name} - Assignments
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {classData.assignments.length} total assignment{classData.assignments.length !== 1 ? 's' : ''}
          </DialogDescription>
        </DialogHeader>

        {/* Summary Stats */}
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="text-xs">
              {overdueCount} overdue
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {upcomingCount} upcoming
            </Badge>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={sortBy === 'dueDate' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('dueDate')}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Sort by Due Date
          </Button>
          <Button
            variant={sortBy === 'name' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('name')}
          >
            <FileText className="h-4 w-4 mr-2" />
            Sort by Name
          </Button>
        </div>

        {/* Assignments List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {sortedAssignments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No assignments found for this class.</p>
            </div>
          ) : (
            sortedAssignments.map((assignment) => {
              const { status, color } = getAssignmentStatus(assignment.dueDate);
              
              return (
                <div
                  key={assignment.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {assignment.name}
                      </h4>
                      {assignment.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {assignment.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(assignment.dueDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatTimeUntilDue(assignment.dueDate)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Badge variant={color} className="text-xs">
                        {status === 'overdue' && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {status}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
