"use client";

import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { MarkdownRenderer } from "@/components/duey/MarkdownRenderer";
import { useEffect, useMemo, useRef, useState } from "react";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  externalDrive?: boolean; // when true, parent controls incremental content; disable internal queue
}

function stripMarkdown(input: string): string {
  if (!input) return "";
  let out = input;
  // Remove code fences and inline backticks
  out = out.replace(/```[\s\S]*?```/g, (m) => m.replace(/```/g, ""));
  out = out.replace(/`([^`]+)`/g, "$1");
  // Remove emphasis and strong markers
  out = out.replace(/\*\*(.*?)\*\*/g, "$1");
  out = out.replace(/__(.*?)__/g, "$1");
  out = out.replace(/\*(.*?)\*/g, "$1");
  out = out.replace(/_(.*?)_/g, "$1");
  // Remove strikethrough
  out = out.replace(/~~(.*?)~~/g, "$1");
  // Remove headings and blockquotes markers
  out = out.replace(/^\s{0,3}#{1,6}\s+/gm, "");
  out = out.replace(/^>\s?/gm, "");
  // Remove list markers
  out = out.replace(/^\s*[-*+]\s+/gm, "");
  out = out.replace(/^\s*\d+\.\s+/gm, "");
  // Convert links [text](url) -> text
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");
  // Images ![alt](url) -> alt
  out = out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "$1");
  // Tables: drop pipes while streaming
  out = out.replace(/\|/g, " ");
  // Any leftover markdown control chars during partial stream
  out = out.replace(/[`*_>#\[\]()]/g, "");
  return out;
}

// Compute a stable prefix of the text that doesn't end inside an open markdown construct
function computeStablePrefix(input: string): string {
  if (!input) return "";
  let i = 0;
  const n = input.length;
  let inFence = false;
  let inInline = false; // backtick `
  let strongAsterisk = false; // ** ... **
  let emAsterisk = false; // * ... *
  let strongUnderscore = false; // __ ... __
  let emUnderscore = false; // _ ... _
  let linkDepth = 0; // [ ... ](...)
  let lastSafe = 0;

  while (i < n) {
    // Check code fence
    if (!inInline && i + 2 < n && input[i] === '`' && input[i + 1] === '`' && input[i + 2] === '`') {
      // Opening fence marks safe boundary before it
      if (!inFence) lastSafe = Math.max(lastSafe, i);
      inFence = !inFence;
      i += 3;
      continue;
    }

    if (inFence) {
      i++;
      continue; // don't mark safe inside fence
    }

    // Inline code
    if (input[i] === '`') {
      if (!inInline) lastSafe = Math.max(lastSafe, i);
      inInline = !inInline;
      i++;
      continue;
    }

    if (inInline) {
      i++;
      continue; // don't mark safe inside inline code
    }

    // Strong/Emphasis with asterisks
    if (input[i] === '*') {
      if (i + 1 < n && input[i + 1] === '*') {
        if (!strongAsterisk) lastSafe = Math.max(lastSafe, i);
        strongAsterisk = !strongAsterisk;
        i += 2;
        continue;
      } else {
        if (!emAsterisk) lastSafe = Math.max(lastSafe, i);
        emAsterisk = !emAsterisk;
        i += 1;
        continue;
      }
    }

    // Strong/Emphasis with underscores
    if (input[i] === '_') {
      if (i + 1 < n && input[i + 1] === '_') {
        if (!strongUnderscore) lastSafe = Math.max(lastSafe, i);
        strongUnderscore = !strongUnderscore;
        i += 2;
        continue;
      } else {
        if (!emUnderscore) lastSafe = Math.max(lastSafe, i);
        emUnderscore = !emUnderscore;
        i += 1;
        continue;
      }
    }

    // Links: [text](url)
    if (input[i] === '[') {
      if (linkDepth === 0) lastSafe = Math.max(lastSafe, i);
      linkDepth++;
      i++;
      continue;
    }
    if (input[i] === ']') {
      // don't decrement here; wait for closing ) to count as fully resolved
      i++;
      continue;
    }
    if (input[i] === ')') {
      if (linkDepth > 0) linkDepth--;
      i++;
      continue;
    }

    // If all constructs are closed and boundary char, update lastSafe
    const constructsClosed = !inFence && !inInline && !strongAsterisk && !emAsterisk && !strongUnderscore && !emUnderscore && linkDepth === 0;
    if (constructsClosed) {
      const ch = input[i];
      if (ch === ' ' || ch === '\n' || ch === '\t' || ch === '.' || ch === ',' || ch === ';' || ch === ':' || ch === '!' || ch === '?') {
        lastSafe = i + 1;
      }
    }
    i++;
  }

  // If no constructs open, whole input is safe
  const constructsClosed = !inFence && !inInline && !strongAsterisk && !emAsterisk && !strongUnderscore && !emUnderscore && linkDepth === 0;
  if (constructsClosed) return input;
  // Otherwise return safe prefix up to last boundary
  return input.slice(0, lastSafe);
}

export function MessageBubble({ role, content, isStreaming = false, externalDrive = false }: MessageBubbleProps) {
  const isUser = role === "user";
  const isAssistant = role === "assistant";

  // Smooth word-by-word streaming for assistant
  const [displayContent, setDisplayContent] = useState<string>("");
  const queueRef = useRef<string[]>([]);
  const timerRef = useRef<number | null>(null);
  const lastUpstreamLenRef = useRef<number>(0);
  const initializedRef = useRef<boolean>(false);

  // Ingest new upstream content into a word queue
  useEffect(() => {
    if (!isAssistant || externalDrive) return;
    const upstream = content || "";
    // Reset when a new message starts or content shrinks
    if (!initializedRef.current || upstream.length < lastUpstreamLenRef.current) {
      queueRef.current = [];
      setDisplayContent("");
      lastUpstreamLenRef.current = 0;
      initializedRef.current = true;
    }
    if (upstream.length <= lastUpstreamLenRef.current) return;
    const delta = upstream.slice(lastUpstreamLenRef.current);
    // Tokenize as words with following space to keep spacing
    const tokens = delta.match(/\S+\s*/g) || [];
    if (tokens.length) {
      queueRef.current.push(...tokens);
    }
    lastUpstreamLenRef.current = upstream.length;
  }, [content, isAssistant, externalDrive]);

  // Drain queue at a steady cadence
  useEffect(() => {
    if (!isAssistant || externalDrive) return;
    if (timerRef.current != null) return;
    const interval = window.setInterval(() => {
      if (queueRef.current.length === 0) return;
      const next = queueRef.current.shift() as string;
      setDisplayContent((prev) => prev + next);
    }, 35); // smoother cadence (~28 words/sec)
    timerRef.current = interval as unknown as number;
    return () => {
      if (timerRef.current != null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isAssistant, externalDrive]);

  // When streaming ends, snap to full content and cleanup
  useEffect(() => {
    if (!isAssistant) return;
    if (!isStreaming) {
      queueRef.current = [];
      if (!externalDrive) setDisplayContent(content || "");
      if (timerRef.current != null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isStreaming, isAssistant, content, externalDrive]);

  return (
    <div className={cn(
      "flex gap-3 mb-6",
      isUser ? "justify-end" : "justify-start"
    )}>
      {isAssistant && (
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={cn(
        "max-w-[75%] rounded-2xl px-5 py-4 shadow-sm border",
        isUser 
          ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-400" 
          : "bg-white text-gray-900 border-gray-200"
      )}>
        {isAssistant ? (
          isStreaming ? (
            <>
              {(externalDrive ? content.length === 0 : displayContent.length === 0) ? (
                <div className="flex items-center gap-1 py-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.12s' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.24s' }}></div>
                </div>
              ) : (
                <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {externalDrive
                    ? stripMarkdown(computeStablePrefix(content))
                    : stripMarkdown(computeStablePrefix(displayContent))}
                </div>
              )}
              <div className="flex items-center gap-1 mt-2 opacity-70">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.12s' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.24s' }}></div>
              </div>
            </>
          ) : (
            <MarkdownRenderer content={content} />
          )
        ) : (
          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">{content}</div>
        )}
        {isStreaming && (
          <div className="flex items-center gap-1 mt-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-sm border border-gray-300">
          <User className="w-5 h-5 text-gray-600" />
        </div>
      )}
    </div>
  );
}
