"use client";

import { useRef, useState, useEffect } from "react";
import { useTimeblockActions } from "../../../../duey-engine/hooks/useTimeblockActions";
import { ChatInput } from "@/components/duey/chat-input";
import { EmptyState } from "@/components/duey/empty-state";
import { AssignmentsSidebar } from "@/components/duey/assignments-sidebar";
import { ChatTranscript } from "@/components/duey/ChatTranscript";

export default function DueyPage() {
  const [pendingTool, setPendingTool] = useState<"none" | "timeblocks" | "flashcards">("none");
  const [pendingTask, setPendingTask] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [items, setItems] = useState<{ id: string; role: "user" | "assistant"; content: string; streaming?: boolean }[]>([]);
  const streamingRef = useRef<boolean>(false);
  const prevPendingTaskRef = useRef<boolean>(false);
  const isFirstRenderRef = useRef<boolean>(true);


  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;
    const userText = content.trim();
    setItems((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: userText }]);


    setIsLoading(true);
    try {
      const id = crypto.randomUUID();
      setItems((prev) => [...prev, { id, role: "assistant", content: "", streaming: true }]);
      streamingRef.current = true;

      // Send the full conversation history for LLM memory
      const contextWindow = items.slice(-20).map(({ role, content }) => ({ role, content }));
      const response = await fetch("/api/duey/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...contextWindow,
            { role: "user", content: userText }
          ],
          options: { maxTokens: 600, temperature: 0.3 },
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          pendingTool,
          pendingTask
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
      let toolIntent: "none" | "timeblocks" | "flashcards" = "none";
      while (streamingRef.current) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.done) {
              if (
                pendingTool === "none" &&
                pendingTask === false &&
                data.tool &&
                data.tool !== "none"
              ) {
                setPendingTool(data.tool);
                setPendingTask(true);
              }
              continue;
            }
            if (data.content) {
              acc += data.content;
              setItems((prev) => prev.map((it) => (it.id === id ? { ...it, content: acc } : it)));
            }
          } catch {}
        }
      }
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, streaming: false } : it)));
    } finally {
      setIsLoading(false);
      streamingRef.current = false;
    }
  };
 
  useEffect(() => {}, [pendingTool]);

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      prevPendingTaskRef.current = pendingTask;
      return;
    }
    const prev = prevPendingTaskRef.current;
    if (!prev && pendingTask) {
      console.log('pending task started');
    } else if (prev && !pendingTask) {
      console.log('pending task complete');
    }
    prevPendingTaskRef.current = pendingTask;
  }, [pendingTask]);

  const { onTimeblockConfirm } = useTimeblockActions({
    setItems,
    setIsLoading,
    setIsRateLimited,
    streamingRef,
    items,
  });

  const handleTimeblockConfirm = async (arg1: any, arg2: any) => {
    await onTimeblockConfirm(arg1, arg2);
    setPendingTool("none");
    setPendingTask(false);
  };

  
  return (
    <div className="flex h-[calc(100vh-65px)]">
      <div className="flex-1 flex flex-col">
        {items.length === 0 ? (
          <div className="flex-1 overflow-hidden">
            <EmptyState onSendMessage={sendMessage} />
          </div>
        ) : (
          <div className="flex-1 overflow-hidden px-4 py-6">
            <div className="max-w-4xl mx-auto h-full">
              <ChatTranscript items={items} onTimeblockConfirm={handleTimeblockConfirm} />
            </div>
          </div>
        )}
        <ChatInput onSendMessage={sendMessage} disabled={isLoading || isRateLimited} />
      </div>
      <AssignmentsSidebar />
    </div>
  );
}
