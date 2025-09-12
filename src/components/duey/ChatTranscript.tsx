"use client";

import React, { useRef } from "react";
import { Virtuoso } from "react-virtuoso";
import { StreamingMarkdownRenderer } from "@/components/duey/StreamingMarkdownRenderer";

export type ChatRole = "user" | "assistant";

export type ChatItem = {
  id: string;
  role: ChatRole;
  content: string;
  streaming?: boolean;
};

type ChatTranscriptProps = {
  items: ChatItem[];
};

export function ChatTranscript({ items }: ChatTranscriptProps) {
  const virtuosoRef = useRef<any>(null);
  return (
    <div className="h-full">
      <Virtuoso
        ref={virtuosoRef}
        data={items}
        className="h-full"
        followOutput={(atBottom: boolean) => (atBottom ? "smooth" : false)}
        itemContent={(index, item) => {
          // Try to detect a create_timeblock action in the assistant message
          let parsed: any = null;
          let showConfirmation = false;
          if (item.role === "assistant") {
            const match = item.content.match(/\{[\s\S]*\}/);
            if (match) {
              try {
                parsed = JSON.parse(match[0]);
                showConfirmation = parsed.action === "create_timeblock";
              } catch {}
            }
          }
          return (
            <div className="flex flex-col mb-6">
              <div className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-md px-5 py-2 ${
                    item.role === "user"
                      ? "bg-myBlue text-white"
                      : "bg-white text-gray-900 border-[18px] border-gray-100"
                  }`}
                >
                  {item.role === "assistant" ? (
                    item.streaming && item.content.length === 0 ? (
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.12s" }}></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.24s" }}></div>
                      </div>
                    ) : (
                      <>
                        <StreamingMarkdownRenderer text={item.content} streaming={!!item.streaming} />
                        {showConfirmation && (
                          <div className="flex gap-4 mt-4 justify-center">
                            <button className="px-4 py-2 rounded border border-gray-300 bg-white">Yes</button>
                            <button className="px-4 py-2 rounded border border-gray-300 bg-white">Let's try another</button>
                          </div>
                        )}
                      </>
                    )
                  ) : (
                    <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">{item.content}</div>
                  )}
                </div>
              </div>
            </div>
          );
        } }
      />
    </div>
  );
}


