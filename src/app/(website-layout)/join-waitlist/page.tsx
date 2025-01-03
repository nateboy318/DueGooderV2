import { Metadata } from "next";
import WaitlistForm from "./waitlist-form";

export const metadata: Metadata = {
  title: "Join Waitlist",
  description: "Join our waitlist to get early access to our platform.",
};

export default function JoinWaitlistPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="container max-w-md px-4 py-16">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Join Our Waitlist</h1>
          <p className="text-muted-foreground">
            Be among the first to experience our platform when we launch.
          </p>
        </div>
        <WaitlistForm />
      </div>
    </div>
  );
} 