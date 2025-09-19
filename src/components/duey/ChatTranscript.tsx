"use client";

import React, { useRef } from "react";
import { Loader2, Pencil, Trash } from "lucide-react";
import { Virtuoso } from "react-virtuoso";
import { StreamingMarkdownRenderer } from "@/components/duey/StreamingMarkdownRenderer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Spinner from "@/components/customized/spinner/spinner-01";
export type ChatRole = "user" | "assistant";

export type ChatItem = {
  id: string;
  role: ChatRole;
  content: string;
  streaming?: boolean;
};

type ChatTranscriptProps = {
  items: ChatItem[]; 
  onTimeblockConfirm?: (timeblock: any, messageId: string) => void;
  onTimeblockReject?: (timeblock: any, messageId: string) => void;
  pendingTool?: "none" | "timeblocks" | "flashcards";
  pendingTask?: boolean;
  isFallbackStreaming?: boolean;
};

export function ChatTranscript({ items, onTimeblockConfirm, onTimeblockReject, pendingTool = "none", pendingTask = false, isFallbackStreaming = false }: ChatTranscriptProps) {
  const virtuosoRef = useRef<any>(null);
  const [clickedMessages, setClickedMessages] = React.useState<Record<string, "confirm" | "reject" | undefined>>({});
  const [submittingMessages, setSubmittingMessages] = React.useState<Record<string, boolean>>({});
  const [edits, setEdits] = React.useState<Record<string, { overrides: Record<number, any> }>>({});
  const [deleted, setDeleted] = React.useState<Record<string, Record<number, true>>>({});

  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editMsgId, setEditMsgId] = React.useState<string | null>(null);
  const [editIndex, setEditIndex] = React.useState<number>(-1);
  const [editTitle, setEditTitle] = React.useState("");
  const [editDescription, setEditDescription] = React.useState("");
  const [editDate, setEditDate] = React.useState("");
  const [editStart, setEditStart] = React.useState("");
  const [editEnd, setEditEnd] = React.useState("");

  const formatDate = (d: Date) => d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const formatTimeRange = (start: Date, end: Date) =>
    `${start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })} – ${end.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`;

  const openEditor = (messageId: string, block: any, index: number) => {
    setEditMsgId(messageId);
    setEditIndex(index);
    setEditTitle(block.title || "");
    setEditDescription(block.description || "");
    const start = new Date(block.startTime);
    const end = new Date(block.endTime);
    const yyyy = start.getFullYear();
    const mm = String(start.getMonth() + 1).padStart(2, "0");
    const dd = String(start.getDate()).padStart(2, "0");
    const toTime = (d: Date) => `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    setEditDate(`${yyyy}-${mm}-${dd}`);
    setEditStart(toTime(start));
    setEditEnd(toTime(end));
    setIsEditOpen(true);
  };

  const saveEdit = () => {
    if (!editMsgId || editIndex < 0) {
      setIsEditOpen(false);
      return;
    }
    const currentOverrides = edits[editMsgId]?.overrides || {};
    // Build updated ISO datetimes from date + times in local timezone
    const [sh, sm] = editStart.split(":").map(Number);
    const [eh, em] = editEnd.split(":").map(Number);
    const [y, m, d] = editDate.split("-").map(Number);
    const start = new Date((y || 0), (m ? m - 1 : 0), (d || 1), (sh || 0), (sm || 0), 0, 0);
    const end = new Date((y || 0), (m ? m - 1 : 0), (d || 1), (eh || 0), (em || 0), 0, 0);

    const updated: any = {
      title: editTitle,
      description: editDescription,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    };
    const nextOverrides = { ...currentOverrides, [editIndex]: updated };
    setEdits(prev => ({ ...prev, [editMsgId]: { overrides: nextOverrides } }));
    setIsEditOpen(false);
  };

  const removeBlock = (messageId: string, index: number) => {
    setDeleted(prev => ({
      ...prev,
      [messageId]: { ...(prev[messageId] || {}), [index]: true },
    }));
  };

  const handleClick = async (
    messageId: string,
    action: "confirm" | "reject",
    handler?: (parsed: any, messageId: string) => void,
    parsed?: any
  ) => {
    if (!clickedMessages[messageId]) {
      setClickedMessages(prev => ({ ...prev, [messageId]: action }));
      if (handler) {
        try {
          setSubmittingMessages(prev => ({ ...prev, [messageId]: true }));
          await handler(parsed, messageId);
        } finally {
          setSubmittingMessages(prev => ({ ...prev, [messageId]: false }));
          // For reject, clear the clicked state so other actions remain enabled
          if (action === "reject") {
            setClickedMessages(prev => ({ ...prev, [messageId]: undefined }));
          }
        }
      }
    }
  };


  return (
    <div className="h-full">
      <Virtuoso
        ref={virtuosoRef}
        data={items}
        className="h-full"
        followOutput={(atBottom: boolean) => (atBottom ? "smooth" : false)}
        itemContent={(index, item) => {
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
          const originalBlocks = parsed && parsed.action === "create_timeblock"
            ? (Array.isArray(parsed.timeblocks) ? parsed.timeblocks : parsed.timeblock ? [parsed.timeblock] : [])
            : [];
          const overrides = edits[item.id]?.overrides;
          const deletions = deleted[item.id] || {};
          const displayBlocks = originalBlocks
            .map((tb: any, idx: number) => (overrides && overrides[idx]) ? overrides[idx] : tb)
            .filter((_: any, idx: number) => !deletions[idx]);
          // Only allow confirmation UI if there is at least one block to confirm
          if (parsed && parsed.action === "create_timeblock") {
            showConfirmation = (displayBlocks?.length || 0) > 0;
          }
          // Only render prose BEFORE any JSON/tool payload hint; cards are rendered from parsed JSON below.
          const contentWithoutJson = item.role === "assistant"
            ? (() => {
                const cleaned = item.content
                  .replace(/^\s*tool:\s*\w+\s*\n?/i, "")
                  .replace(/```[\s\S]*?```/g, "");
                const tokenIdx = cleaned.search(/"action"\s*:\s*"create_timeblock"/i);
                const braceIdx = cleaned.indexOf("{");
                const cutAt = [tokenIdx, braceIdx]
                  .filter((i) => i !== -1)
                  .reduce((min, i) => (min === -1 ? i : Math.min(min, i)), -1);
                const beforeJson = cutAt !== -1 ? cleaned.slice(0, cutAt) : cleaned;
                return beforeJson.replace(/\n{3,}/g, "\n\n");
              })()
            : item.content;
          const hasTimeblockToolHeader =
            item.role === "assistant" && /^\s*tool:\s*timeblocks/i.test(item.content);
          const hasCreateActionToken =
            item.role === "assistant" && /"action"\s*:\s*"create_timeblock"/i.test(item.content);
          // Only show generating UI when we actually see the create_timeblock token.
          // Do NOT show during fallback extraction to avoid flashing on clarification prompts.
          const showGeneratingPlaceholder =
            (item.role === "assistant" && !!item.streaming && hasCreateActionToken && !parsed);
          if (item.role === "assistant") {
            console.debug("[ChatTranscript] flags:", {
              id: item.id,
              streaming: !!item.streaming,
              hasTimeblockToolHeader,
              hasCreateActionToken,
              parsedCreate: !!parsed && parsed.action === "create_timeblock",
              showGeneratingPlaceholder,
              blocksOriginal: originalBlocks.length,
              blocksDisplay: displayBlocks.length,
              pendingTask,
              pendingTool,
              isFallbackStreaming,
            });
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
                        <StreamingMarkdownRenderer text={contentWithoutJson} streaming={!!item.streaming} />
                        {showGeneratingPlaceholder && (
                          <div className="mt-2 flex items-center gap-2 text-green-600 bg-green-100 rounded px-3 py-1.5">
                            <Spinner />
                            <span className="text-base">Generating timeblocks...</span>
                          </div>
                        )}
                        {!item.streaming && parsed && parsed.action === "create_timeblock" && (
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {displayBlocks.map((tb: any, idx: number) => {
                              const start = new Date(tb.startTime);
                              const end = new Date(tb.endTime);
                              return (
                                <div key={idx} className="rounded-md border-12 border-gray-100 bg-white p-4 transition-all duration-200 ease-in-out flex flex-col gap-2">
                                  <div className="text-sm font-semibold text-gray-900 truncate">{tb.title || "Untitled"}</div>
                                  <div className="text-xs text-gray-500">{formatDate(start)}</div>
                                  <div className="text-sm text-gray-700 flex items-center gap-2">{formatTimeRange(start, end)}<div
                                      className="cursor-pointer"
                                      onClick={(e) => { e.stopPropagation(); openEditor(item.id, tb, idx); }}
                                    >
                                      <Pencil className="w-3 h-3 text-myBlue hover:scale-[110%] transition-all duration-200 ease-in-out" />
                                    </div>
                                    <div
                                      className="cursor-pointer"
                                      title="Remove"
                                      onClick={(e) => { e.stopPropagation(); removeBlock(item.id, idx); }}
                                    >
                                      <Trash className="w-3 h-3 text-myRed hover:scale-[110%] transition-all duration-200 ease-in-out" />
                                    </div>
                                  </div> 
                                  {tb.description && (
                                    <div className="text-xs text-gray-600 truncate">{tb.description}</div>
                                  )}
                                  
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {showConfirmation && !item.streaming && (
                          <div className="flex gap-4 my-4 mt-8 justify-start">
                            <Button
                              className={` ${clickedMessages[item.id] === 'confirm' ? '' : ''}`}
                              onClick={() => handleClick(item.id, 'confirm', onTimeblockConfirm, { action: "create_timeblock", timeblocks: displayBlocks })}
                              variant="default"
                              disabled={(clickedMessages[item.id] === 'confirm') || (submittingMessages[item.id] && clickedMessages[item.id] === 'confirm')}
                            >
                              {clickedMessages[item.id] === 'confirm' && submittingMessages[item.id] ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Scheduling...
                                </>
                              ) : (
                                <>Looks good!</>
                              )}
                            </Button>
                            {onTimeblockReject && (
                              <Button
                                className={`${clickedMessages[item.id] === 'reject' ? '' : ''}`}
                                onClick={() => handleClick(item.id, 'reject', onTimeblockReject, { action: "create_timeblock", timeblocks: displayBlocks })}
                                variant="outline"
                                disabled={(clickedMessages[item.id] === 'reject') || (submittingMessages[item.id] && clickedMessages[item.id] === 'reject')}
                              >
                                Not quite
                              </Button>
                            )}
                          </div>
                        )}
                      </>
                    )
                  ) : (
                    <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">{item.content.replace(/^tool:\s*\w+\s*\n?/i, "")}</div>
                  )}
                </div>
              </div>
              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[480px]">
                  <DialogHeader>
                    <DialogTitle>Edit timeblock</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-2">
                    <div className="grid gap-2">
                      <Label htmlFor="tb-title">Title</Label>
                      <Input id="tb-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tb-desc">Description</Label>
                      <Textarea id="tb-desc" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="grid gap-2">
                        <Label htmlFor="tb-date">Date</Label>
                        <Input id="tb-date" type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="tb-start">Start</Label>
                        <Input id="tb-start" type="time" value={editStart} onChange={(e) => setEditStart(e.target.value)} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="tb-end">End</Label>
                        <Input id="tb-end" type="time" value={editEnd} onChange={(e) => setEditEnd(e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                    <Button onClick={saveEdit}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          );
        } }
      />
    </div>
  );
}