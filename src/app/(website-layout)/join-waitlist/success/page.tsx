import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Waitlist Confirmation",
  description: "Successfully joined the waitlist.",
};

export default function WaitlistSuccessPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="container max-w-md px-4 py-16 text-center">
        <div className="mb-6 flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="mb-2 text-3xl font-bold">You&apos;re on the Waitlist!</h1>
        <p className="mb-8 text-muted-foreground">
          Thank you for joining. We&apos;ll notify you via email when our platform is ready.
        </p>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
} 