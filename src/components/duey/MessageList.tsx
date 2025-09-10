"use client";

import React, { useEffect, useRef } from "react";
import { Virtuoso } from "react-virtuoso";
import { MessageBubble } from "@/components/duey/message-bubble";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
  streaming?: boolean;
  error?: boolean;
};

type MessageListProps = {
  messages: ChatMessage[];
};

export function MessageList({ messages }: MessageListProps) {
  const virtuosoRef = useRef<any>(null);
  const atBottomRef = useRef(true);

  useEffect(() => {
    if (atBottomRef.current) {
      virtuosoRef.current?.scrollToIndex({ index: messages.length - 1, align: "end", behavior: "smooth" });
    }
  }, [messages.length]);

  return (
    <div className="h-full">
      <Virtuoso
        ref={virtuosoRef}
        data={messages}
        className="h-full"
        followOutput={(isAtBottom: boolean) => {
          atBottomRef.current = isAtBottom;
          return isAtBottom ? "smooth" : false;
        }}
        itemContent={(index, message) => (
          <MessageBubble role={message.role} content={message.content} isStreaming={message.streaming} />
        )}
      />
    </div>
  );
}


