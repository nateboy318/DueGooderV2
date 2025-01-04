"use client";
import React from "react";
import useCurrentPlan from "@/lib/users/useCurrentPlan";
import { Button } from "@/components/ui/button";
import { CreditCardIcon } from "lucide-react";
import Link from "next/link";

function AppHomepage() {
  const { currentPlan } = useCurrentPlan();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-sm text-muted-foreground">
        {currentPlan
          ? `You are on the ${currentPlan.name} plan.`
          : "You are not subscribed to any plan."}
      </p>
      {/* If not on any plan or on default plan, show subscribe button */}
      {!currentPlan || currentPlan.default ? (
        <Link href="/#pricing">
          <Button>
            <CreditCardIcon className="w-4 h-4" />
            <span>Subscribe</span>
          </Button>
        </Link>
      ) : (
        <Link href="/app/billing">
          <Button>
            <CreditCardIcon className="w-4 h-4" />
            <span>Manage Subscription</span>
          </Button>
        </Link>
      )}
      {currentPlan ? (
        <pre>{JSON.stringify({ currentPlan }, null, 2)}</pre>
      ) : null}
    </div>
  );
}

export default AppHomepage;
