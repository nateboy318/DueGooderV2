"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FaGoogle, FaSpinner } from "react-icons/fa";
import { toast } from "sonner";

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  callbackUrl?: string;
}

export function AuthForm({ className, callbackUrl, ...props }: AuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>("");
  const searchParams = useSearchParams();
  const router = useRouter();

  React.useEffect(() => {
    const impersonateToken = searchParams?.get("impersonateToken");
    if (impersonateToken) {
      handleImpersonation(impersonateToken);
    }
  }, [searchParams]);

  const handleImpersonation = async (token: string) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        signedToken: token,
        redirect: false,
        callbackUrl: callbackUrl || searchParams?.get("callbackUrl") || "/app",
      });

      if (result?.error) {
        toast.error("Failed to impersonate user");
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      console.error("Impersonation error:", error);
      toast.error("Failed to impersonate user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", {
        callbackUrl: callbackUrl || searchParams?.get("callbackUrl") || "/app",
      });
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Failed to continue with Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: callbackUrl || searchParams?.get("callbackUrl") || "/app",
      });

      if (result?.error) {
        toast.error("Failed to send login email");
      } else {
        toast.success("Check your email for the login link");
        setEmail("");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col space-y-6", className)} {...props}>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={handleGoogleSignIn}
        className="w-full py-6"
      >
        {isLoading ? (
          <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FaGoogle className="mr-2 h-4 w-4" />
        )}
        Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      <form onSubmit={handleEmailSignIn} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full py-6"
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full py-6">
          {isLoading && <FaSpinner className="mr-2 h-4 w-4 animate-spin" />}
          Continue with Email
        </Button>
      </form>
    </div>
  );
}
