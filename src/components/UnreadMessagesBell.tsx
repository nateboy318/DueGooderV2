"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function UnreadMessagesBell() {
  const { data } = useSWR<{ data: number }>("/api/super-admin/stats/unread-messages");

  if (!data || data.data === 0) return null;

  return (
    <Link href="/super-admin/messages">
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
        >
          {data.data}
        </Badge>
        <span className="sr-only">View unread messages</span>
      </Button>
    </Link>
  );
} 