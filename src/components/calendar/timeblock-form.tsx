"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { RiCalendarLine } from "@remixicon/react";
import { timeblockSchema, type TimeblockInput } from "@/lib/validations/timeblock.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface TimeblockFormProps {
  isOpen: boolean;
  onClose: () => void;
  onTimeblockCreated: (timeblock: any) => void;
  onTimeblockUpdated?: (timeblock: any) => void;
  onTimeblockDeleted?: (timeblockId: string) => void;
  initialData?: Partial<TimeblockInput> & { id?: string };
  isEditMode?: boolean;
}

export function TimeblockForm({ isOpen, onClose, onTimeblockCreated, onTimeblockUpdated, onTimeblockDeleted, initialData, isEditMode = false }: TimeblockFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateOpen, setDateOpen] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [duration, setDuration] = useState("60"); // in minutes

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<TimeblockInput>({
    // Remove zodResolver temporarily to debug
    defaultValues: {
      type: "study",
      startTime: "", // Will be set dynamically
      endTime: "", // Will be set dynamically
      ...initialData,
    },
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      reset({
        type: "study",
        ...initialData,
      });
      setError(null);
      setSelectedDate(new Date());
      setStartTime("09:00");
      setDuration("60");
      
      if (initialData?.startTime) {
        const startDate = new Date(initialData.startTime);
        setSelectedDate(startDate);
        setStartTime(format(startDate, "HH:mm"));
        
        if (initialData?.endTime) {
          const endDate = new Date(initialData.endTime);
          const durationMs = endDate.getTime() - startDate.getTime();
          const durationMinutes = Math.round(durationMs / (1000 * 60));
          setDuration(durationMinutes.toString());
        }
      }
      
      // Recurring state is managed by the form's isRecurring field
    }
  }, [isOpen, initialData, reset]);

  // Color options for timeblock types
  const typeColors = {
    study: { bg: "bg-blue-500", border: "border-blue-500", label: "Study" },
    break: { bg: "bg-green-500", border: "border-green-500", label: "Break" },
    exam: { bg: "bg-red-500", border: "border-red-500", label: "Exam" },
    project: { bg: "bg-purple-500", border: "border-purple-500", label: "Project" },
    meeting: { bg: "bg-orange-500", border: "border-orange-500", label: "Meeting" },
    other: { bg: "bg-gray-500", border: "border-gray-500", label: "Other" },
  };

  // Generate time options for start time dropdown
  const timeOptions = [];
  for (let hour = 6; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const displayTime = format(new Date(2000, 0, 1, hour, minute), "h:mm a");
      timeOptions.push({ value: timeStr, label: displayTime });
    }
  }

  // Generate duration options in 15-minute increments
  const durationOptions = [
    { value: "15", label: "15 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "45", label: "45 minutes" },
    { value: "60", label: "1 hour" },
    { value: "90", label: "1.5 hours" },
    { value: "120", label: "2 hours" },
    { value: "150", label: "2.5 hours" },
    { value: "180", label: "3 hours" },
    { value: "240", label: "4 hours" },
    { value: "300", label: "5 hours" },
  ];


  const onSubmit = async (data: TimeblockInput) => {
    console.log("Form submitted with data:", data);
    console.log("Selected date:", selectedDate);
    console.log("Start time:", startTime);
    console.log("Duration:", duration);
    
    // Basic validation
    if (!data.title || data.title.trim() === "") {
      setError("Title is required");
      return;
    }
    
    if (!selectedDate) {
      setError("Please select a date");
      return;
    }
    
    if (!startTime) {
      setError("Please select a start time");
      return;
    }
    
    if (!duration) {
      setError("Please select a duration");
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);

      // Create start datetime
      const startDateTime = new Date(selectedDate);
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      startDateTime.setHours(startHours, startMinutes, 0, 0);

      // Calculate end datetime based on duration
      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + parseInt(duration));

      const timeblockData = {
        title: data.title,
        description: data.description || "",
        type: data.type,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
      };

      console.log("Sending timeblock data:", timeblockData);

      const url = isEditMode && initialData?.id 
        ? `/api/app/timeblocks/${initialData.id}` 
        : "/api/app/timeblocks";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(timeblockData),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error:", errorData);
        throw new Error(errorData.error || `Failed to ${isEditMode ? 'update' : 'create'} timeblock`);
      }

      const result = await response.json();
      console.log(`Success! ${isEditMode ? 'Updated' : 'Created'} timeblock:`, result);
      
      if (isEditMode && onTimeblockUpdated) {
        onTimeblockUpdated(result.timeblock);
      } else {
        onTimeblockCreated(result.timeblock);
      }
      onClose();
    } catch (error) {
      console.error("Error creating timeblock:", error);
      setError(error instanceof Error ? error.message : "Failed to create timeblock");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id || !onTimeblockDeleted) return;
    
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(`/api/app/timeblocks/${initialData.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete timeblock");
      }

      onTimeblockDeleted(initialData.id);
      onClose();
    } catch (error) {
      console.error("Error deleting timeblock:", error);
      setError(error instanceof Error ? error.message : "Failed to delete timeblock");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Timeblock" : "Create Timeblock"}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? "Update your timeblock details and schedule."
              : "Add a new timeblock to schedule your study sessions and activities."
            }
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-destructive/15 text-destructive rounded-md px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="e.g., Study for Math Exam"
              className="w-full"
            />
            {errors.title && (
              <p className="text-destructive text-sm">{errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Optional description..."
              rows={3}
              className="w-full"
            />
            {errors.description && (
              <p className="text-destructive text-sm">{errors.description.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="date">Date</Label>
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-full justify-between px-3 font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <span className="truncate">
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </span>
                  <RiCalendarLine size={16} className="text-muted-foreground/80 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2 z-[100] bg-white border shadow-lg" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  defaultMonth={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date);
                      setError(null);
                      setDateOpen(false);
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger id="start-time">
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent className="z-[100] bg-white border shadow-lg">
                  {timeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <Label htmlFor="duration">Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent className="z-[100] bg-white border shadow-lg">
                  {durationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Type</Label>
            <RadioGroup
              value={watch("type")}
              onValueChange={(value) => setValue("type", value as any)}
              className="flex flex-wrap gap-3"
            >
              {Object.entries(typeColors).map(([key, color]) => (
                <div key={key} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={key}
                    id={`type-${key}`}
                    className={cn(
                      "size-5",
                      color.bg,
                      color.border
                    )}
                  />
                  <Label htmlFor={`type-${key}`} className="text-sm font-normal">
                    {color.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {errors.type && (
              <p className="text-destructive text-sm">{errors.type.message}</p>
            )}
          </div>


          <DialogFooter className="flex flex-row justify-between gap-2 pt-4">
            <div className="flex gap-2">
              {isEditMode && (
                <>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                onClick={() => console.log("Create button clicked")}
              >
                {isSubmitting 
                  ? (isEditMode ? "Updating..." : "Creating...") 
                  : (isEditMode ? "Update Timeblock" : "Create Timeblock")
                }
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
