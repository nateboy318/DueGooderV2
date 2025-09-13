import { useState, useCallback } from "react";

export type TimeblockInput = {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  type?: string;
  classId?: string;
  assignmentId?: string;
  isRecurring?: boolean;
  recurringPattern?: string;
};

export function useCreateTimeblock() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [created, setCreated] = useState<any>(null);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
    setCreated(null);
  }, []);

  const createTimeblock = useCallback(async (timeblock: TimeblockInput) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setCreated(null);
    try {
      const res = await fetch("/api/duey/timeblock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeblock }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Failed to create timeblock");
      }
      const data = await res.json();
      setSuccess(true);
      setCreated(data.timeblock);
      return data;
    } catch (err: any) {
      setError(err.message || "Unknown error");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createTimeblock, loading, error, success, created, reset };
}
