import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import Link from "next/link";

interface ErrorMessages {
  [key: string]: string;
}

const errorMessages: ErrorMessages = {
  STRIPE_CANCEL_BEFORE_SUBSCRIBING:
    "Please cancel your current subscription befo re subscribing to a new onetime plan.",
  LEMON_SQUEEZY_CANCEL_BEFORE_SUBSCRIBING:
    "Please cancel your current subscription before subscribing to a new onetime plan.",
  INVALID_PARAMS: "Invalid parameters.",
};

export default async function SubscribeErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const message = code
    ? errorMessages[code]
    : "An error occurred during subscription.";

  return (
    <div className="container max-w-lg mx-auto py-12">
      <Card className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <XCircle className="h-12 w-12 text-destructive" />
          <h1 className="text-2xl font-bold">Subscription Error</h1>
          <p className="text-muted-foreground">{message}</p>
          {code === "STRIPE_CANCEL_BEFORE_SUBSCRIBING" && (
            <div className="flex flex-col gap-2 items-center">
              <p>
                If you want to cancel your current subscription, please go to
                your billing page.
              </p>
              <Button asChild>
                <Link href="/app/billing">Go to Billing</Link>
              </Button>
            </div>
          )}
          {code === "LEMON_SQUEEZY_CANCEL_BEFORE_SUBSCRIBING" && (
            <div className="flex flex-col gap-2 items-center">
              <p>
                If you want to cancel your current subscription, please go to
                your billing page.
              </p>
              <Button asChild>
                <Link href="/app/billing">Go to Billing</Link>
              </Button>
            </div>
          )}

          {/* Contact Support */}
          <div className="flex flex-row gap-2 items-center">
            <Button variant="outline" asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
