import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function ErrorRedirector() {
  const message = "Your payment was not successful. Please try again.";
  const detailedMessage =
    "Please try again. If the problem persists, please contact support.";
  return (
    <div className="container max-w-lg mx-auto py-12">
      <Card className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <XCircle className="h-12 w-12 text-destructive" />
          <h1 className="text-2xl font-bold">Payment Error</h1>
          <p className="text-muted-foreground">{message}</p>

          <div className="flex flex-col gap-2 items-center">
            <p className="text-muted-foreground">{detailedMessage}</p>
            <Button asChild>
              <Link href="/#pricing">Try Again</Link>
            </Button>
          </div>
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
