"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { paypalContext } from "@/db/schema/paypal";

function PaypalSubscriptionManager() {
  const { data, error, isLoading, mutate } = useSWR(`/api/app/paypal`);
  const [canceling, setCanceling] = useState<string | null>(null);
  const contexts = data?.contexts || [];

  const handleCancel = async (contextId: string) => {
    setCanceling(contextId);
    try {
      const res = await fetch("/api/app/paypal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "cancel",
          contextId,
        }),
      });
      if (!res.ok) {
        toast.error("Failed to cancel subscription.");
        return;
      }
      await mutate();
      toast.success("Subscription cancelled.");
    } catch (e) {
      console.error("Failed to cancel subscription", e);
      toast.error("Failed to cancel subscription.");
    } finally {
      setCanceling(null);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error.message}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/app"
          className="text-sm text-muted-foreground hover:text-primary transition font-medium"
        >
          ← Back
        </Link>
        <h2 className="text-xl font-bold text-foreground">
          PayPal Orders & Subscriptions
        </h2>
        <Link
          href="/contact"
          className="text-sm text-primary underline font-medium"
        >
          Need Help?
        </Link>
      </div>
      {contexts.length === 0 ? (
        <div className="text-muted-foreground">
          No PayPal orders or subscriptions found.
        </div>
      ) : (
        <div className="space-y-4">
          {contexts.map((ctx: typeof paypalContext.$inferSelect & { planName: string }) => {
            const isSub = !!ctx.paypalSubscriptionId;
            let badgeText = "One-time";
            let badgeColor = "bg-muted text-foreground";
            if (isSub) {
              if (ctx.frequency === "monthly") {
                badgeText = "Subscription (Monthly)";
                badgeColor = "bg-blue-100 text-blue-800";
              } else if (ctx.frequency === "yearly") {
                badgeText = "Subscription (Yearly)";
                badgeColor = "bg-green-100 text-green-800";
              } else {
                badgeText = "Subscription";
                badgeColor = "bg-yellow-100 text-yellow-800";
              }
            }
            return (
              <div
                key={ctx.id}
                className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-2 bg-background shadow-sm transition hover:shadow-md"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-primary text-lg">
                      {ctx.planName || ctx.planId}
                    </span>
                    <Badge className={badgeColor}>{badgeText}</Badge>
                  </div>
                  <div className="text-sm">
                    Status:{" "}
                    <span
                      className={
                        ctx.status === "success"
                          ? "text-green-600"
                          : ctx.status === "cancelled"
                            ? "text-red-600"
                            : "text-yellow-600"
                      }
                    >
                      {ctx.status}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {isSub ? (
                      <>
                        Subscription ID:{" "}
                        <span className="font-mono">
                          {ctx.paypalSubscriptionId}
                        </span>
                      </>
                    ) : (
                      <>
                        Order ID:{" "}
                        <span className="font-mono">{ctx.paypalOrderId}</span>
                      </>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(ctx.createdAt).toLocaleString()}
                  </div>
                </div>
                {isSub && ctx.status === "success" && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        disabled={canceling === ctx.id}
                      >
                        {canceling === ctx.id
                          ? "Cancelling..."
                          : "Cancel Subscription"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
                      </AlertDialogHeader>
                      <div>
                        Are you sure you want to cancel this subscription? This
                        action cannot be undone.
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Close</AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button
                            variant="destructive"
                            disabled={canceling === ctx.id}
                            onClick={() => handleCancel(ctx.id)}
                          >
                            {canceling === ctx.id
                              ? "Cancelling..."
                              : "Yes, Cancel Subscription"}
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PaypalSubscriptionManager;
