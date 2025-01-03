"use client";

import { useState } from "react";
import useSWR from "swr";
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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Plan {
  id: string;
  name: string;
  codename: string;
  default: boolean;
  isLifetime: boolean;
  monthlyPrice: number;
  yearlyPrice: number;
  onetimePrice: number;
  createdAt: string;
}

interface PaginationInfo {
  total: number;
  pageCount: number;
  currentPage: number;
  perPage: number;
}

export default function PlansPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  const { data, error, isLoading } = useSWR<{
    plans: Plan[];
    pagination: PaginationInfo;
  }>(`/api/super-admin/plans?page=${page}&limit=${limit}&search=${search}`);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price / 100);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-2xl font-bold">Plans</h1>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search plans..."
              className="pl-8"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Button className="w-full sm:w-auto" asChild>
            <Link href="/super-admin/plans/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Plan
            </Link>
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">Name</TableHead>
              <TableHead className="min-w-[120px]">Codename</TableHead>
              <TableHead className="min-w-[100px]">Monthly</TableHead>
              <TableHead className="min-w-[100px]">Yearly</TableHead>
              <TableHead className="min-w-[100px]">One-time</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="min-w-[120px]">Created</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-red-500">
                  Error loading plans
                </TableCell>
              </TableRow>
            ) : data?.plans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No plans found
                </TableCell>
              </TableRow>
            ) : (
              data?.plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>
                    <div className="font-medium">{plan.name}</div>
                  </TableCell>
                  <TableCell>{plan.codename}</TableCell>
                  <TableCell>{formatPrice(plan.monthlyPrice)}</TableCell>
                  <TableCell>{formatPrice(plan.yearlyPrice)}</TableCell>
                  <TableCell>{formatPrice(plan.onetimePrice)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {plan.default && (
                        <Badge variant="default">Default</Badge>
                      )}
                      {plan.isLifetime && (
                        <Badge variant="secondary">Lifetime</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(plan.createdAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/super-admin/plans/${plan.id}/edit`)
                          }
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            // TODO: Add delete confirmation
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
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

      {data?.pagination && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground text-center sm:text-left">
            Showing {(page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, data.pagination.total)} of{" "}
            {data.pagination.total} plans
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
    </div>
  );
}