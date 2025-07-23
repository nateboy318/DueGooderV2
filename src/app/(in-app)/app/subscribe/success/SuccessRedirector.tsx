"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessRedirector() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          router.push("/app");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, [router]);

  return (
    <div className="container max-w-lg mx-auto py-12">
      <Card className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
          <h1 className="text-2xl font-bold">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Thank you for your payment. You will be redirected to the dashboard
            in <span className="font-medium">{countdown}</span> seconds.
          </p>

          <p className="text-muted-foreground text-sm">
            Please note that it can take upto 2-3 minutes for the subscription
            to be activated.
          </p>

          <div className="flex flex-row gap-2 items-center">
            <Button asChild>
              <Link href="/app">Go to Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/app/billing">View Billing</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
