"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Mail,
  Trash2,
} from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  createdAt: string;
  readAt: string | null;
}

interface PaginationInfo {
  total: number;
  pageCount: number;
  currentPage: number;
  perPage: number;
}

export default function MessagesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const limit = 10;

  const { data, error, isLoading } = useSWR<{
    messages: Message[];
    pagination: PaginationInfo;
  }>(`/api/super-admin/messages?page=${page}&limit=${limit}&search=${search}`);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleOpenMessage = async (message: Message) => {
    setSelectedMessage(message);
    if (!message.readAt) {
      try {
        await fetch("/api/super-admin/messages", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: message.id, readAt: true }),
        });
        mutate(`/api/super-admin/messages?page=${page}&limit=${limit}&search=${search}`);
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    }
  };

  const handleToggleRead = async (message: Message) => {
    try {
      await fetch("/api/super-admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: message.id, readAt: !message.readAt }),
      });
      mutate(`/api/super-admin/messages?page=${page}&limit=${limit}&search=${search}`);
    } catch (error) {
      console.error("Error toggling message read status:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/super-admin/messages?id=${id}`, {
        method: "DELETE",
      });
      setSelectedMessage(null);
      mutate(`/api/super-admin/messages?page=${page}&limit=${limit}&search=${search}`);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-2xl font-bold">Messages</h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            className="pl-8"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">From</TableHead>
              <TableHead className="min-w-[120px]">Company</TableHead>
              <TableHead className="min-w-[200px]">Message</TableHead>
              <TableHead className="min-w-[120px]">Date</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-red-500">
                  Error loading messages
                </TableCell>
              </TableRow>
            ) : data?.messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No messages found
                </TableCell>
              </TableRow>
            ) : (
              data?.messages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{message.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {message.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{message.company || "-"}</TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {message.message}
                  </TableCell>
                  <TableCell>{formatDate(message.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant={message.readAt ? "secondary" : "default"}>
                      {message.readAt ? "Read" : "Unread"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenMessage(message)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {data?.pagination && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground text-center sm:text-left">
            Showing {(page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, data.pagination.total)} of{" "}
            {data.pagination.total} messages
          </div>
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page >= data.pagination.pageCount}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="w-[95vw] max-w-[600px] sm:w-full">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <div className="font-medium">From:</div>
                <div>{selectedMessage.name}</div>
                <div className="font-medium">Email:</div>
                <div>{selectedMessage.email}</div>
                {selectedMessage.company && (
                  <>
                    <div className="font-medium">Company:</div>
                    <div>{selectedMessage.company}</div>
                  </>
                )}
                <div className="font-medium">Date:</div>
                <div>{formatDate(selectedMessage.createdAt)}</div>
              </div>
              <div className="space-y-2">
                <div className="font-medium">Message:</div>
                <div className="whitespace-pre-wrap rounded-lg border bg-muted/50 p-4">
                  {selectedMessage.message}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                onClick={() =>
                  selectedMessage && handleToggleRead(selectedMessage)
                }
              >
                Mark as {selectedMessage?.readAt ? "unread" : "read"}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Message</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this message? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        selectedMessage && handleDelete(selectedMessage.id)
                      }
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <Button
              onClick={() => {
                if (selectedMessage) {
                  window.location.href = `mailto:${
                    selectedMessage.email
                  }?subject=Re: Message from ${
                    selectedMessage.name
                  }&body=\n\n------------------\nOriginal message:\n${
                    selectedMessage.message
                  }`;
                }
              }}
            >
              <Mail className="h-4 w-4 mr-2" />
              Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}