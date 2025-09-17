import { useCallback } from "react";

export function useTimeblockActions({
  setItems,
  setIsLoading,
  setIsRateLimited,
  streamingRef,
  items,
}: {
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
  setIsLoading: (b: boolean) => void;
  setIsRateLimited: (b: boolean) => void;
  streamingRef: React.MutableRefObject<boolean>;
  items: any[];
}) {
  // Confirm timeblock
  const onTimeblockConfirm = useCallback(
    async (parsed: any, messageId: string) => {
      // Mark tool task as running right when we actually call the API
      setIsLoading(true);
      // Insert a temporary assistant message to show loading state
      const loadingId = crypto.randomUUID();
      setItems((prev) => [
        ...prev,
        {
          id: loadingId,
          role: "assistant",
          content: "Scheduling your timeblock...",
          streaming: false,
        },
      ]);

      const finish = (success: boolean, count?: number) => {
        setItems((prev) =>
          prev.map((it) =>
            it.id === loadingId
              ? {
                  ...it,
                  content: success
                    ? count && count > 1
                      ? `Booked ${count} timeblocks successfully.`
                      : "Timeblock booked successfully."
                    : "Failed to schedule. Try again.",
                }
              : it
          )
        );
      };

      try {
        if (parsed?.timeblocks && Array.isArray(parsed.timeblocks)) {
          const res = await fetch("/api/duey/timeblock", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ timeblocks: parsed.timeblocks }),
          });
          finish(res.ok, parsed.timeblocks.length);
          return;
        }
        if (parsed?.timeblock) {
          const res = await fetch("/api/duey/timeblock", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ timeblock: parsed.timeblock }),
          });
          finish(res.ok, 1);
        }
      } catch (error) {
        console.error("Failed to create timeblock(s)", error);
        finish(false);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { onTimeblockConfirm };
}
