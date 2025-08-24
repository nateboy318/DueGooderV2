"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { BadgePlusIcon, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import useCurrentPlan from "@/lib/users/useCurrentPlan";

export default function RedeemLTDPage() {
  const [couponCode, setCouponCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { currentPlan, mutate: mutateCurrentPlan } = useCurrentPlan();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      const response = await fetch("/api/app/redeem-ltd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: couponCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to redeem coupon");
      }

      // Success
      setSuccessMessage(
        `Coupon redeemed successfully! You now have ${data.couponCount} ${
          data.couponCount === 1 ? "coupon" : "coupons"
        } redeemed.`
      );
      setCouponCode("");

      mutateCurrentPlan();
      toast.success("Coupon has been redeemed successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to redeem coupon"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-medium">Redeem Lifetime Deal Coupon</h3>
        <p className="text-sm text-muted-foreground">
          Enter your coupon code to redeem your Lifetime Deal access
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enter Coupon Code</CardTitle>
          <CardDescription>
            Your coupon code will unlock LTD pricing for your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            {successMessage ? (
              <div className="flex items-center space-x-2 text-green-600 mb-4">
                <CheckCircle className="h-5 w-5" />
                <p>{successMessage}</p>
              </div>
            ) : null}

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" htmlFor="coupon-code">
                Coupon Code
              </label>
              <Input
                id="coupon-code"
                placeholder="Enter your coupon code (e.g. APPSUMO-12345678)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="w-full"
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck="false"
              />
            </div>

            {currentPlan && (
              <div className="mt-4 text-sm">
                <p>
                  Current Plan:{" "}
                  <span className="font-medium">{currentPlan.name}</span>
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end mt-2">
            <Button
              type="submit"
              disabled={isSubmitting || !couponCode.trim()}
              className="w-fit"
            >
              {isSubmitting ? "Redeeming..." : "Redeem Coupon"}
              {!isSubmitting && <BadgePlusIcon className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="text-sm text-muted-foreground">
        <h4 className="font-medium mb-2">How it works:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Enter the coupon code you received from your purchase</li>
          <li>Each valid coupon unlocks additional benefits</li>
          <li>Multiple coupons can be redeemed for higher tier plans</li>
          <li>Coupon codes can only be used once</li>
        </ul>
      </div>
    </div>
  );
}
