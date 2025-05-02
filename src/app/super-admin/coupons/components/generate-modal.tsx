"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
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
import { Loader2, Download } from "lucide-react";
import { format } from "date-fns";

interface GenerateModalProps {
  onSuccess?: () => void;
}

export function GenerateModal({ onSuccess }: GenerateModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [count, setCount] = useState(1000);
  const [generatedCoupons, setGeneratedCoupons] = useState<string[]>([]);
  const [prefixError, setPrefixError] = useState("");

  const validatePrefix = (value: string) => {
    const upperValue = value.toUpperCase();
    if (!/^[A-Z]*$/.test(upperValue)) {
      setPrefixError("Only letters A-Z are allowed");
      return false;
    }
    setPrefixError("");
    return true;
  };

  const handlePrefixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setPrefix(value);
    validatePrefix(value);
  };

  // Function to generate coupons in batches
  const generateCoupons = async () => {
    if (!validatePrefix(prefix)) return;
    
    setIsGenerating(true);
    const batchSize = 100;
    const totalBatches = Math.ceil(count / batchSize);
    const allCoupons: string[] = [];

    try {
      for (let i = 0; i < totalBatches; i++) {
        const currentBatchSize = Math.min(batchSize, count - i * batchSize);
        const response = await fetch("/api/super-admin/coupons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prefix,
            count: currentBatchSize,
          }),
        });

        if (!response.ok) throw new Error("Failed to generate coupons");

        const { codes } = await response.json();
        allCoupons.push(...codes);
      }

      setGeneratedCoupons(allCoupons);
      onSuccess?.();
    } catch (error) {
      console.error("Error generating coupons:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCoupons = () => {
    const csv = generatedCoupons.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `coupons-${prefix}-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    setIsOpen(false);
    setGeneratedCoupons([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Generate Coupon Codes</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Coupon Codes</DialogTitle>
          <DialogDescription>
            Generate multiple coupon codes with a specific prefix.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label>Prefix (A-Z only)</label>
            <Input
              value={prefix}
              onChange={handlePrefixChange}
              placeholder="APPSUMO"
              className={prefixError ? "border-destructive" : ""}
            />
            {prefixError && (
              <p className="text-sm text-destructive">{prefixError}</p>
            )}
          </div>
          <div className="space-y-2">
            <label>Number of Coupons</label>
            <Input
              type="number"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between sm:gap-0">
          {generatedCoupons.length > 0 ? (
            <Button onClick={downloadCoupons} className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Download {generatedCoupons.length} Coupons
            </Button>
          ) : (
            <Button
              onClick={generateCoupons}
              disabled={isGenerating || !prefix || count <= 0 || !!prefixError}
              className="w-full sm:w-auto"
            >
              {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 