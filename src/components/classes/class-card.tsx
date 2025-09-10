"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Palette, Pencil, Trash2, Dna } from "lucide-react";
import { AssignmentsModal } from "./assignments-modal";
import { ColorPicker } from "./color-picker";
import { EditNameModal } from "./edit-name-modal";
import { hexToRgba } from "@/lib/colors";

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

interface ClassCardProps {
  classData: Class;
  onUpdate?: () => void;
}

export function ClassCard({ classData, onUpdate }: ClassCardProps) {
  const [showAssignments, setShowAssignments] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentName, setCurrentName] = useState(classData.name);
  const [currentEmoji, setCurrentEmoji] = useState(classData.emoji);
  const [showEditModal, setShowEditModal] = useState(false);

  // Calculate completion stats
  const totalAssignments = classData.assignments.length;
  const completedAssignments = classData.assignments.filter(assignment => assignment.completed).length;
  const completionPercentage = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;

  // Get next assignment due
  const now = new Date();
  const upcomingAssignments = classData.assignments.filter(assignment => {
    const dueDate = new Date(assignment.dueDate);
    return dueDate >= now;
  });

  const nextAssignment = upcomingAssignments.sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  )[0];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleColorChange = async (newColorHex: string) => {
    try {
      const response = await fetch("/api/app/classes/update-color", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classId: classData.id,
          colorHex: newColorHex,
        }),
      });

      if (response.ok) {
        // Update the UI without page reload
        onUpdate?.();
      } else {
        console.error("Failed to update class color");
      }
    } catch (error) {
      console.error("Error updating class color:", error);
    }
  };

  const handleNameUpdate = (newName: string, newEmoji: string) => {
    setCurrentName(newName);
    setCurrentEmoji(newEmoji);
    setShowEditModal(false);
    // Update the UI without page reload
    onUpdate?.();
  };

  const handleOpenEditModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${classData.name}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch("/api/app/classes/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classId: classData.id,
        }),
      });

      if (response.ok) {
        // Update the UI without page reload
        onUpdate?.();
      } else {
        console.error("Failed to delete class");
        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Error deleting class:", error);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Link href={`/app/classes/${classData.id}`}>
        <div 
          className="h-full border-2 p-4 rounded-md hover:scale-[102%] transition-all cursor-pointer group flex flex-col" 
          style={{
            borderColor: classData.colorHex,
            backgroundColor: hexToRgba(classData.colorHex, 0.1) // 10% opacity
          }}
        >
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <span className="text-2xl">{classData.emoji}</span>
              <CardTitle className="text-xl font-bold text-gray-900 flex-1">
                {currentName}
              </CardTitle>
            </div>
            <div className="flex items-center gap-0">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-12 w-12 p-0 text-gray-700 hover:bg-transparent hover:scale-[110%]"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowColorPicker(true);
                }}
              >
                <Palette className="h-8 w-8" style={{ width: '20px', height: '20px' }} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-12 w-12 p-0 text-gray-700 hover:bg-transparent hover:scale-[110%]"
                onClick={handleOpenEditModal}
              >
                <Pencil className="h-8 w-8" style={{ width: '20px', height: '20px' }} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-12 w-12 p-0 text-gray-700 hover:bg-transparent hover:scale-[110%]"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDelete();
                }}
                disabled={isDeleting}
              >
                <Trash2 className="h-8 w-8" style={{ width: '20px', height: '20px' }} />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 flex flex-col h-full">
          <div className="space-y-4 flex-1">
            {/* Assignment summary */}
            <div className="text-sm text-gray-600">
              {totalAssignments} Assignment{totalAssignments !== 1 ? 's' : ''} · {completedAssignments} Completed
            </div>

            {/* Next assignment */}
            {nextAssignment ? (
              <div className="text-sm text-gray-700">
                <div className="font-medium">Next due: {nextAssignment.name} ({formatDate(nextAssignment.dueDate)})</div>
              </div>
            ) : (
              <div className="text-sm font-semibold text-gray-700 italic">
                No more assignments coming up
              </div>
            )}
          </div>

          {/* Progress bar - pushed to bottom */}
          <div className="space-y-1 mt-6">
            <div className="w-full h-4 rounded-full h-2 border-2" style={{ borderColor: classData.colorHex, backgroundColor: hexToRgba(classData.colorHex, 0.1) }}>
              <div 
                className="h-3 rounded-l-full"
                style={{ 
                  width: `${completionPercentage}%`,
                  backgroundColor: classData.colorHex
                }}
              ></div>
            </div>
            <div className="text-xs font-medium text-gray-700">
              {completionPercentage}% Complete
            </div>
          </div>
        </CardContent>
        </div>
      </Link>

      {/* Assignments Modal */}
      <AssignmentsModal
        classData={classData}
        isOpen={showAssignments}
        onClose={() => setShowAssignments(false)}
      />

      {/* Color Picker Modal */}
      <ColorPicker
        isOpen={showColorPicker}
        onClose={() => setShowColorPicker(false)}
        currentColorHex={classData.colorHex}
        onColorSelect={handleColorChange}
        className={classData.name}
      />

      {/* Edit Name Modal */}
      <EditNameModal
        currentName={currentName}
        currentEmoji={currentEmoji}
        classId={classData.id}
        onNameUpdate={handleNameUpdate}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </>
  );
}
