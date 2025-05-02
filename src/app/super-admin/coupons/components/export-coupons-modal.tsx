"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Download, FileDown } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { fetcher } from "@/lib/swr/fetcher";
import Papa from "papaparse";

type StatusFilter = "all" | "used" | "unused" | "expired";

interface ExportOption {
  label: string;
  value: "filtered" | "all";
}

interface ExportCouponsModalProps {
  currentFilter: StatusFilter;
  searchQuery: string;
}

interface CouponApiResponse {
  totalItems: number;
  coupons: Array<{
    id: string;
    code: string;
    createdAt: string;
    usedAt: string | null;
    userId?: string;
    expired: boolean;
  }>;
}

export function ExportCouponsModal({ currentFilter, searchQuery }: ExportCouponsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exportOption, setExportOption] = useState<"filtered" | "all">("filtered");
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [exportedRecords, setExportedRecords] = useState(0);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setExportOption("filtered");
        setProgress(0);
        setTotalRecords(0);
        setExportedRecords(0);
        setIsExporting(false);
      }, 300);
    }
  }, [isOpen]);

  const exportCoupons = async () => {
    setIsExporting(true);
    setProgress(0);
    setExportedRecords(0);
    
    try {
      // Get the total count first
      const params = new URLSearchParams();
      if (exportOption === "filtered") {
        if (searchQuery) params.append("search", searchQuery);
        if (currentFilter !== "all") params.append("status", currentFilter);
      }
      params.append("page", "1");
      params.append("limit", "1"); // Just to get the total count
      
      const initialResponse = await fetcher<CouponApiResponse>(`/api/super-admin/coupons?${params.toString()}`);
      const totalPages = Math.ceil(initialResponse.totalItems / 50);
      setTotalRecords(initialResponse.totalItems);
      
      if (initialResponse.totalItems === 0) {
        setIsExporting(false);
        return;
      }
      
      // Prepare CSV data structure
      const csvData: Array<Record<string, string>> = [];
      
      // Fetch all records in batches
      for (let page = 1; page <= totalPages; page++) {
        params.set("page", page.toString());
        params.set("limit", "50");
        
        const response = await fetcher<CouponApiResponse>(`/api/super-admin/coupons?${params.toString()}`);
        const coupons = response.coupons || [];
        
        // Add coupons to CSV data array
        coupons.forEach((coupon) => {
          csvData.push({
            Code: coupon.code,
            "Created At": new Date(coupon.createdAt).toLocaleString(),
            User: coupon.userId || "",
            "Used On": coupon.usedAt ? new Date(coupon.usedAt).toLocaleString() : "",
            Status: coupon.expired ? "Expired" : (coupon.usedAt ? "Used" : "Unused")
          });
        });
        
        setExportedRecords(prev => prev + coupons.length);
        setProgress(Math.floor((page / totalPages) * 100));
      }
      
      // Use PapaParse to generate CSV
      const csv = Papa.unparse(csvData, {
        header: true,
        quotes: true, // Add quotes around all fields
        skipEmptyLines: true
      });
      
      // Create download link
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `coupons_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
      setProgress(100);
    }
  };

  const exportOptions: ExportOption[] = [
    {
      label: currentFilter !== "all" || searchQuery 
        ? `Export filtered coupons (${currentFilter}${searchQuery ? ` with search "${searchQuery}"` : ''})`
        : "Export all coupons",
      value: "filtered"
    },
    {
      label: "Export all coupons",
      value: "all"
    }
  ];

  // If no filter or search is applied, don't show duplicate options
  const displayOptions = currentFilter === "all" && !searchQuery 
    ? [exportOptions[0]] 
    : exportOptions;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Coupons</DialogTitle>
          <DialogDescription>
            Download coupons data as a CSV file. Choose which coupons to include.
          </DialogDescription>
        </DialogHeader>

        {!isExporting ? (
          <>
            <div className="py-4">
              <RadioGroup 
                value={exportOption} 
                onValueChange={(value) => setExportOption(value as "filtered" | "all")}
                className="space-y-3"
              >
                {displayOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <DialogFooter>
              <Button onClick={exportCoupons}>
                <FileDown className="mr-2 h-4 w-4" />
                Export Coupons
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-6 space-y-4">
            <p className="text-center font-medium">Exporting Coupons...</p>
            <Progress value={progress} className="w-full h-2" />
            <p className="text-center text-sm text-muted-foreground">
              {progress}% Complete {exportedRecords > 0 ? `(${exportedRecords}/${totalRecords} records)` : ''}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 