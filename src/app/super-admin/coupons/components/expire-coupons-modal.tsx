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
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Ban } from "lucide-react";

interface ExpireReportData {
  usersDowngraded: number;
  totalExpired: number;
  errors: string[];
}

interface ExpireCouponsModalProps {
  onSuccess: () => void;
}

export function ExpireCouponsModal({ onSuccess }: ExpireCouponsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [couponCodes, setCouponCodes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [report, setReport] = useState<ExpireReportData | null>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCouponCodes("");
        setProgress(0);
        setReport(null);
      }, 300);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!couponCodes.trim()) return;

    setIsSubmitting(true);
    setProgress(0);
    setReport(null);

    // Parse coupon codes - split by commas, spaces, or new lines
    const codes = couponCodes
      .trim()
      .split(/[\s,\n]+/)
      .filter(code => code.trim().length > 0)
      .map(code => code.trim().toUpperCase());
    
    if (codes.length === 0) {
      setIsSubmitting(false);
      return;
    }

    // Process in batches of 5
    const batchSize = 5;
    const totalBatches = Math.ceil(codes.length / batchSize);
    let currentBatch = 0;
    let usersDowngraded = 0;
    let totalExpired = 0;
    let errorsList: string[] = [];

    for (let i = 0; i < codes.length; i += batchSize) {
      const batch = codes.slice(i, i + batchSize);
      
      try {
        const response = await fetch("/api/super-admin/coupons/expire-batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ codes: batch }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to expire coupons");
        }

        const result = await response.json();
        usersDowngraded += result.usersDowngraded;
        totalExpired += result.totalExpired;
        
        if (result.errors && result.errors.length > 0) {
          errorsList = [...errorsList, ...result.errors];
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        errorsList.push(`Batch ${currentBatch + 1} error: ${errorMessage}`);
      }

      // Update progress
      currentBatch++;
      setProgress(Math.floor((currentBatch / totalBatches) * 100));
    }

    // Set final report
    setReport({
      usersDowngraded,
      totalExpired,
      errors: errorsList
    });
    
    setIsSubmitting(false);
    
    // Refresh the main coupon list
    if (totalExpired > 0) {
      onSuccess();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Ban className="mr-2 h-4 w-4" />
          Expire Coupon Codes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Expire Coupon Codes</DialogTitle>
          <DialogDescription>
            Use this tool to expire coupon codes or mark refunded coupons as expired. 
            This will recalculate plans for affected users.
          </DialogDescription>
        </DialogHeader>

        {!isSubmitting && !report ? (
          <>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="coupon-codes" className="text-sm font-medium">
                  Coupon Codes
                </label>
                <Textarea
                  id="coupon-codes"
                  value={couponCodes}
                  onChange={(e) => setCouponCodes(e.target.value)}
                  placeholder="Enter coupon codes separated by spaces, commas, or new lines"
                  className="min-h-[150px] font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Enter one or more coupon codes to expire. Users using these coupons may be downgraded.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="destructive" 
                onClick={handleSubmit} 
                disabled={!couponCodes.trim()}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Expire Coupons
              </Button>
            </DialogFooter>
          </>
        ) : isSubmitting ? (
          <div className="py-6 space-y-4">
            <p className="text-center font-medium">Processing Coupon Codes...</p>
            <Progress value={progress} className="w-full h-2" />
            <p className="text-center text-sm text-muted-foreground">
              {progress}% Complete
            </p>
          </div>
        ) : report ? (
          <div className="py-6 space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Expiration Report</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Users Downgraded:</dt>
                  <dd className="font-medium">{report.usersDowngraded}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Total Coupons Expired:</dt>
                  <dd className="font-medium">{report.totalExpired}</dd>
                </div>
              </dl>
            </div>
            
            {report.errors.length > 0 && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                <h3 className="font-medium text-destructive mb-2">Errors</h3>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  {report.errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <DialogFooter>
              <Button onClick={() => setIsOpen(false)}>Close</Button>
            </DialogFooter>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
} 