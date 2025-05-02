"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertTriangle, MoreVertical, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import useSWR from "swr";
import { GenerateModal } from "./components/generate-modal";
import { useDebounce } from "@/hooks/use-debounce";
import { Pagination } from "@/components/ui/pagination";
import Link from "next/link";
import { ExpireCouponsModal } from "./components/expire-coupons-modal";
import { ExportCouponsModal } from "./components/export-coupons-modal";

interface Coupon {
  id: string;
  code: string;
  createdAt: string;
  usedAt: string | null;
  userId: string | null;
  expired: boolean;
}

interface CouponsResponse {
  coupons: Coupon[];
  totalItems: number;
  page: number;
  limit: number;
}

type StatusFilter = "all" | "used" | "unused" | "expired";

export default function CouponsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data, isLoading, mutate } = useSWR<CouponsResponse>(
    `/api/super-admin/coupons?page=${page}&search=${debouncedSearch}&status=${statusFilter}`,
  );

  // Function to expire coupon
  const expireCoupon = async (id: string) => {
    try {
      const response = await fetch(`/api/super-admin/coupons/${id}`, {
        method: "PATCH",
      });

      if (!response.ok) throw new Error("Failed to expire coupon");

      mutate(); // Refresh the data
    } catch (error) {
      console.error("Error expiring coupon:", error);
    }
  };

  // Function to delete coupon
  const deleteCoupon = async (id: string) => {
    try {
      const response = await fetch(`/api/super-admin/coupons/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete coupon");

      mutate(); // Refresh the data
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lifetime Deal Coupons</h1>
        <p className="text-muted-foreground">
          Helpful for running lifetime deals on platforms like Appsumo
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <Input
            placeholder="Search coupons..."
            className="max-w-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            value={statusFilter}
            onValueChange={(value: StatusFilter) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Coupons</SelectItem>
              <SelectItem value="used">Used</SelectItem>
              <SelectItem value="unused">Unused</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <ExportCouponsModal currentFilter={statusFilter} searchQuery={debouncedSearch} />
          <ExpireCouponsModal onSuccess={() => mutate()} />
          <GenerateModal onSuccess={() => mutate()} />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Used By</TableHead>
              <TableHead>Used On</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data?.coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No coupons found
                </TableCell>
              </TableRow>
            ) : (
              data?.coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-mono">{coupon.code}</TableCell>
                  <TableCell>
                    {format(new Date(coupon.createdAt), "PPP 'at' p")}
                  </TableCell>
                  <TableCell>
                    {coupon.userId ? (
                      <Link 
                        href={`/super-admin/users/${coupon.userId}`}
                        className="flex items-center text-primary hover:underline"
                      >
                        {coupon.userId.substring(0, 8)}...
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {coupon.usedAt
                      ? format(new Date(coupon.usedAt), "PPP 'at' p")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {coupon.expired ? (
                      <span className="text-destructive">Expired</span>
                    ) : coupon.usedAt ? (
                      <span className="text-muted-foreground">Used</span>
                    ) : (
                      <span className="text-primary">Active</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!coupon.expired && !coupon.usedAt && (
                          <DropdownMenuItem
                            onClick={() => expireCoupon(coupon.id)}
                            className="text-destructive"
                          >
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Expire
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this coupon?")) {
                              deleteCoupon(coupon.id);
                            }
                          }}
                          className="text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {data && (
        <Pagination
          page={page}
          pageSize={data.limit}
          total={data.totalItems}
          onPageChange={setPage}
        />
      )}
    </div>
  );
} 