"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, BookOpen, Calendar } from "lucide-react";
import { toast } from "sonner";

interface CanvasIntegrationModalProps {
  onSuccess?: () => void;
  children?: React.ReactNode;
}

export function CanvasIntegrationModal({ onSuccess, children }: CanvasIntegrationModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [canvasUrl, setCanvasUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canvasUrl.trim()) {
      toast.error("Please enter a Canvas URL");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/app/canvas/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ canvasUrl: canvasUrl.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to import Canvas data");
      }

      toast.success(`Successfully imported ${data.classesCount} classes with ${data.assignmentsCount} assignments`);
      
      // Close modal and reset form
      setIsOpen(false);
      setCanvasUrl("");
      
      // Call success callback if provided
      onSuccess?.();
      
    } catch (error) {
      console.error("Canvas import error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to import Canvas data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="gap-2">
            <BookOpen className="h-4 w-4" />
            Import ICS Calendar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Import ICS Calendar
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Enter your ICS calendar URL to automatically import your classes and assignments. 
            We&apos;ll create Google Calendar events for each assignment.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="canvas-url">ICS Calendar URL</Label>
            <Input
              id="canvas-url"
              type="url"
              placeholder="https://your-school.instructure.com/feeds/calendars/..."
              value={canvasUrl}
              onChange={(e) => setCanvasUrl(e.target.value)}
              disabled={isLoading}
              required
            />
            <p className="text-sm text-gray-500">
              Enter your ICS calendar feed URL (e.g., Canvas, Blackboard, or other LMS calendar feed)
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Assignments will be added to your Google Calendar</span>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !canvasUrl.trim()}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Importing..." : "Import Calendar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
