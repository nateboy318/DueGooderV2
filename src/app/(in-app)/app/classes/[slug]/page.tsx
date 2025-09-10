"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus, Check, Pencil, Trash2 } from "lucide-react";
import { AddAssignmentModal } from "@/components/classes/add-assignment-modal";
import { EditAssignmentModal } from "@/components/classes/edit-assignment-modal";
import { hexToRgba } from "@/lib/colors";
import { generateClassId } from "@/lib/utils/slug";

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

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [classData, setClassData] = useState<Class | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  useEffect(() => {
    fetchClassData();
  }, [slug]);

  const fetchClassData = async () => {
    try {
      const response = await fetch('/api/app/classes');
      if (!response.ok) throw new Error('Failed to fetch classes');
      
      const data = await response.json();
      const classData = data.classes.find((cls: Class) => 
        cls.id === slug || generateClassId(cls.name) === slug
      );
      
      if (!classData) {
        setError('Class not found');
        return;
      }
      
      setClassData(classData);
    } catch (err) {
      setError('Failed to load class data');
      console.error('Error fetching class data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAssignment = async (assignmentData: { name: string; dueDate: string; description?: string }) => {
    if (!classData) return;

    try {
      const response = await fetch('/api/app/classes/assignments/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: classData.id,
          ...assignmentData
        })
      });

      if (response.ok) {
        await fetchClassData(); // Refresh data
        setShowAddModal(false);
      } else {
        console.error('Failed to add assignment');
      }
    } catch (error) {
      console.error('Error adding assignment:', error);
    }
  };

  const handleEditAssignment = async (assignmentId: string, assignmentData: { name: string; dueDate: string; description?: string }) => {
    try {
      const response = await fetch('/api/app/classes/assignments/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: classData?.id,
          assignmentId,
          ...assignmentData
        })
      });

      if (response.ok) {
        await fetchClassData(); // Refresh data
        setEditingAssignment(null);
      } else {
        console.error('Failed to edit assignment');
      }
    } catch (error) {
      console.error('Error editing assignment:', error);
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;

    try {
      const response = await fetch('/api/app/classes/assignments/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: classData?.id,
          assignmentId
        })
      });

      if (response.ok) {
        await fetchClassData(); // Refresh data
      } else {
        console.error('Failed to delete assignment');
      }
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };

  const handleToggleComplete = async (assignmentId: string, completed: boolean) => {
    try {
      const response = await fetch('/api/app/classes/assignments/toggle-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: classData?.id,
          assignmentId,
          completed
        })
      });

      if (response.ok) {
        await fetchClassData(); // Refresh data
      } else {
        console.error('Failed to toggle assignment completion');
      }
    } catch (error) {
      console.error('Error toggling assignment completion:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">{error || 'Class not found'}</div>
      </div>
    );
  }

  const incompleteAssignments = classData.assignments.filter(a => !a.completed);
  const completedAssignments = classData.assignments.filter(a => a.completed);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{classData.emoji}</span>
            <h1 className="text-2xl font-bold">{classData.name} Assignments</h1>
          </div>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white hover:bg-gray-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Assignment
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Not Completed */}
        <div>
          <h2 className="text-xl font-bold mb-4">Not Completed</h2>
          <div className="space-y-3">
            {incompleteAssignments.map((assignment) => (
              <Card
                key={assignment.id}
                className="border-2 transition-colors py-4 px-2" style={{ borderColor: classData.colorHex, backgroundColor: hexToRgba(classData.colorHex, 0.1) }}
              >
                <CardContent className="px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{assignment.name}</h3>
                      <p className="text-sm text-gray-600">Due: {formatDate(assignment.dueDate)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleComplete(assignment.id, true)}
                        className="p-2"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingAssignment(assignment)}
                        className="p-2"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAssignment(assignment.id)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {incompleteAssignments.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No incomplete assignments
              </div>
            )}
          </div>
        </div>

        {/* Completed */}
        <div>
          <h2 className="text-xl font-bold mb-4">Completed</h2>
          <div className="space-y-3">
            {completedAssignments.map((assignment) => (
              <Card
                key={assignment.id}
                className="border-2 border-gray-300 hover:border-gray-400 transition-colors bg-gray-100"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900 line-through">{assignment.name}</h3>
                      <p className="text-sm text-gray-600">Due: {formatDate(assignment.dueDate)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleComplete(assignment.id, false)}
                        className="p-2 text-green-600"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAssignment(assignment.id)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {completedAssignments.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No completed assignments
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddAssignmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddAssignment}
      />
      
      {editingAssignment && (
        <EditAssignmentModal
          isOpen={!!editingAssignment}
          onClose={() => setEditingAssignment(null)}
          assignment={editingAssignment}
          onEdit={handleEditAssignment}
        />
      )}
    </div>
  );
}
