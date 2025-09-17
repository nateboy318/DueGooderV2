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

  // Reject timeblock and prompt for new
  const onTimeblockReject = useCallback(
    async (parsed: any, messageId: string) => {
      const lastUserMsg = [...items].reverse().find((it) => it.role === "user");
      let prevTime = null;
      if (parsed?.timeblock?.startTime) {
        prevTime = parsed.timeblock.startTime;
      } else {
        const lastAssistantMsg = [...items]
          .reverse()
          .find(
            (it) =>
              it.role === "assistant" &&
              it.content.includes("create_timeblock")
          );
        if (lastAssistantMsg) {
          try {
            const match = lastAssistantMsg.content.match(/\{[\s\S]*\}/);
            if (match) {
              const json = JSON.parse(match[0]);
              prevTime = json.timeblock?.startTime;
            }
          } catch {}
        }
      }
      if (!lastUserMsg?.content) return;
      const userText = lastUserMsg.content;
      let prompt = userText;
      if (prevTime) {
        prompt += `\nPlease propose a different time than ${prevTime}, but still honor any time constraints I gave (e.g., between 12-3).`;
      } else {
        prompt += `\nPlease propose a different time, but still honor any time constraints I gave.`;
      }
      const id = crypto.randomUUID();
      setIsLoading(true);
      setItems((prev: any[]) => [
        ...prev,
        { id, role: "assistant", content: "", streaming: true },
      ]);
      streamingRef.current = true;
      try {
        const response = await fetch("/api/duey/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: prompt }],
            options: { maxTokens: 600, temperature: 0.3 },
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          }),
        });
        if (response.status === 429) {
          setIsRateLimited(true);
          return;
        }
        const reader = response.body?.getReader();
        if (!reader) return;
        const decoder = new TextDecoder();
        let acc = "";
        while (streamingRef.current) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          for (const line of chunk.split("\n")) {
            if (!line.startsWith("data: ")) continue;
            try {
              const data = JSON.parse(line.slice(6));
              if (data.done) continue;
              if (data.content) {
                acc += data.content;
                setItems((prev: any[]) =>
                  prev.map((it) =>
                    it.id === id ? { ...it, content: acc } : it
                  )
                );
              }
            } catch {}
          }
        }
        setItems((prev: any[]) =>
          prev.map((it) =>
            it.id === id ? { ...it, streaming: false } : it
          )
        );
      } finally {
        setIsLoading(false);
        streamingRef.current = false;
      }
    },
    [items, setItems, setIsLoading, setIsRateLimited, streamingRef]
  );

  return { onTimeblockConfirm, onTimeblockReject };
}
