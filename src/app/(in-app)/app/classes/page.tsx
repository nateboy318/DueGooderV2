"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClassCard } from "@/components/classes/class-card";
import { BookOpen, AlertTriangle } from "lucide-react";
import { CanvasIntegrationModal } from "@/components/canvas/canvas-integration-modal";

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

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/app/classes");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch classes");
      }

      setClasses(data.classes || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch classes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportSuccess = () => {
    // Refresh classes after successful import
    fetchClasses();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Loading your classes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <h3 className="text-lg font-semibold text-gray-900">Error Loading Classes</h3>
        <p className="text-gray-600 text-center max-w-md">{error}</p>
        <Button onClick={fetchClasses} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      {/* Classes Grid */}
      {classes.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Classes Yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Import your class calendar to get started. We&apos;ll automatically organize your assignments by class.
            </p>
            <CanvasIntegrationModal onSuccess={handleImportSuccess} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map((classData) => (
            <div key={classData.id} className="h-full">
              <ClassCard classData={classData} />
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
