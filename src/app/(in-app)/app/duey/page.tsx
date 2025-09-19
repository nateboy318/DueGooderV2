"use client";

import { useRef, useState, useEffect } from "react";
import { useTimeblockActions } from "../../../../duey-engine/hooks/useTimeblockActions";
import { ChatInput } from "@/components/duey/chat-input";
import { EmptyState } from "@/components/duey/empty-state";
import { AssignmentsSidebar } from "@/components/duey/assignments-sidebar";
import { ChatTranscript } from "@/components/duey/ChatTranscript";

export default function DueyPage() {
  const [pendingTool, setPendingTool] = useState<"none" | "timeblocks" | "flashcards">("none");
  const [isLoading, setIsLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [items, setItems] = useState<{ id: string; role: "user" | "assistant"; content: string; streaming?: boolean }[]>([]);
  const streamingRef = useRef<boolean>(false);
  const prevPendingToolRef = useRef<"none" | "timeblocks" | "flashcards">("none");
  const [isFallbackStreaming, setIsFallbackStreaming] = useState(false);


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
          options: { maxTokens: 1800, temperature: 0.3 },
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          pendingTool
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
      console.log("[Duey Chat] Streaming start");
      while (streamingRef.current) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        console.debug("[Duey Chat] Raw chunk:", chunk);
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          console.debug("[Duey Chat] SSE line:", line);
          try {
            const data = JSON.parse(line.slice(6));
            console.debug("[Duey Chat] SSE parsed:", data);
            if (data.phase === "fallback_start" && data.tool === "timeblocks") {
              console.debug("[Duey Chat] Fallback extraction started");
              setIsFallbackStreaming(true);
            }
            if (data.done) {
              // Append only the tail that wasn't already streamed (avoids duplication)
              if (data.content) {
                const finalContent: string = data.content;
                const tail = finalContent.slice(acc.length);
                console.debug("[Duey Chat] Final tail length:", tail.length);
                if (tail) {
                  acc += tail;
                  setItems((prev) => prev.map((it) => (it.id === id ? { ...it, content: acc } : it)));
                }
              }
              // Capture intended tool for next step
              if (data.tool && data.tool !== "none") {
                console.debug("[Duey Chat] Final tool detected:", data.tool);
                setPendingTool(data.tool);
              }
              setIsFallbackStreaming(false);
              continue;
            }
            if (data.content) {
              const hasToolHeader = /(^|\n)\s*tool:\s*timeblocks/i.test(data.content);
              const hasCreateAction = /"action"\s*:\s*"create_timeblock"/i.test(data.content);
              if (hasToolHeader || hasCreateAction) {
                console.debug("[Duey Chat] Detected tool markers in chunk:", { hasToolHeader, hasCreateAction });
              }
              // If server includes tool on chunks, set early
              if (data.tool && data.tool !== "none" && pendingTool === "none") {
                console.debug("[Duey Chat] Early tool detected:", data.tool);
                setPendingTool(data.tool);
              }
              acc += data.content;
              setItems((prev) => prev.map((it) => (it.id === id ? { ...it, content: acc } : it)));
              console.debug("[Duey Chat] Accumulated length:", acc.length);
            }
          } catch (e) {
            console.warn("[Duey Chat] Failed to parse SSE line:", line, e);
          }
        }
      }
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, streaming: false } : it)));
      console.log("[Duey Chat] Streaming end. Final content length:", acc.length, "\nFinal content:\n", acc);
    } finally {
      setIsLoading(false);
      streamingRef.current = false;
      setIsFallbackStreaming(false);
    }
  };
 
  useEffect(() => {
    const prev = prevPendingToolRef.current;
    if (prev !== "none" && pendingTool === "none") {
      console.log("[Duey Chat] Tool unlocked:", prev);
    }
    prevPendingToolRef.current = pendingTool;
  }, [pendingTool]);

  // removed pendingTask tracking

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
  };

  const handleTimeblockReject = async (_arg1?: any, _arg2?: any) => {
    const id = crypto.randomUUID();
    const streamText = "Let me know what I can change!";
    setItems((prev) => [
      ...prev,
      { id, role: "assistant", content: "", streaming: true },
    ]);


    let i = 0;
    const stepMs = 25; 
    const interval = setInterval(() => {
      i++;
      const next = streamText.slice(0, i);
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, content: next } : it)));
      if (i >= streamText.length) {
        clearInterval(interval);
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, streaming: false } : it)));
      }
    }, stepMs);
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
              <ChatTranscript
                items={items}
                onTimeblockConfirm={handleTimeblockConfirm}
                onTimeblockReject={handleTimeblockReject}
                pendingTool={pendingTool}
                isFallbackStreaming={isFallbackStreaming}
              />
            </div>
          </div>
        )}
        <ChatInput
          onSendMessage={sendMessage}
          disabled={isLoading || isRateLimited}
          placeholder={"Ask Duey anything about your classes..."}
        />
      </div>
      <AssignmentsSidebar />
    </div>
  );
}
