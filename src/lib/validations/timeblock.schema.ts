import { z } from "zod";

export const timeblockSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().optional(),
  startTime: z.string().datetime("Invalid start time format"),
  endTime: z.string().datetime("Invalid end time format"),
  classId: z.string().optional(),
  assignmentId: z.string().optional(),
  type: z.enum(["study", "break", "exam", "project", "meeting", "other"]).default("study"),
});

export const updateTimeblockSchema = timeblockSchema.partial().extend({
  completed: z.boolean().optional(),
});

export type TimeblockInput = z.infer<typeof timeblockSchema>;
export type UpdateTimeblockInput = z.infer<typeof updateTimeblockSchema>;
