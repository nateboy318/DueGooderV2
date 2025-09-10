"use client";

import React, { useMemo } from "react";
import { MarkdownRenderer } from "@/components/duey/MarkdownRenderer";

function computeStablePrefix(input: string): string {
  if (!input) return "";
  let i = 0;
  const n = input.length;
  let inFence = false;
  let inInline = false;
  let strongAsterisk = false;
  let emAsterisk = false;
  let strongUnderscore = false;
  let emUnderscore = false;
  let linkDepth = 0;
  let lastSafe = 0;

  while (i < n) {
    if (!inInline && i + 2 < n && input[i] === '`' && input[i + 1] === '`' && input[i + 2] === '`') {
      if (!inFence) lastSafe = Math.max(lastSafe, i);
      inFence = !inFence;
      i += 3;
      continue;
    }
    if (inFence) { i++; continue; }
    if (input[i] === '`') { if (!inInline) lastSafe = Math.max(lastSafe, i); inInline = !inInline; i++; continue; }
    if (inInline) { i++; continue; }
    if (input[i] === '*') { if (i + 1 < n && input[i + 1] === '*') { if (!strongAsterisk) lastSafe = Math.max(lastSafe, i); strongAsterisk = !strongAsterisk; i += 2; continue; } else { if (!emAsterisk) lastSafe = Math.max(lastSafe, i); emAsterisk = !emAsterisk; i += 1; continue; } }
    if (input[i] === '_') { if (i + 1 < n && input[i + 1] === '_') { if (!strongUnderscore) lastSafe = Math.max(lastSafe, i); strongUnderscore = !strongUnderscore; i += 2; continue; } else { if (!emUnderscore) lastSafe = Math.max(lastSafe, i); emUnderscore = !emUnderscore; i += 1; continue; } }
    if (input[i] === '[') { if (linkDepth === 0) lastSafe = Math.max(lastSafe, i); linkDepth++; i++; continue; }
    if (input[i] === ']') { i++; continue; }
    if (input[i] === ')') { if (linkDepth > 0) linkDepth--; i++; continue; }
    const constructsClosed = !inFence && !inInline && !strongAsterisk && !emAsterisk && !strongUnderscore && !emUnderscore && linkDepth === 0;
    if (constructsClosed) {
      const ch = input[i];
      if (ch === ' ' || ch === '\n' || ch === '\t' || ch === '.' || ch === ',' || ch === ';' || ch === ':' || ch === '!' || ch === '?') {
        lastSafe = i + 1;
      }
    }
    i++;
  }
  const constructsClosed = !inFence && !inInline && !strongAsterisk && !emAsterisk && !strongUnderscore && !emUnderscore && linkDepth === 0;
  if (constructsClosed) return input;
  return input.slice(0, lastSafe);
}

type StreamingMarkdownRendererProps = {
  text: string;
  streaming: boolean;
};

export function StreamingMarkdownRenderer({ text, streaming }: StreamingMarkdownRendererProps) {
  const safeText = useMemo(() => (streaming ? computeStablePrefix(text) : text), [text, streaming]);
  if (!safeText) return null;
  return (
    <div>
      <MarkdownRenderer content={safeText} />
    </div>
  );
}


