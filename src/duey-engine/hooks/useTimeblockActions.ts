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
      if (parsed?.timeblocks && Array.isArray(parsed.timeblocks)) {
        try {
          await fetch("/api/duey/timeblock", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ timeblocks: parsed.timeblocks }),
          });
        } catch (error) {
          console.error("Failed to create multiple timeblocks", error);
        }
        return;
      }
      if (parsed?.timeblock) {
        try {
          await fetch("/api/duey/timeblock", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parsed.timeblock),
          });
        } catch (error) {
          console.error("Failed to create timeblock", error);
        }
      }
    },
    []
  );

  return { onTimeblockConfirm };
}
