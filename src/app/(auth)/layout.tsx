import { appConfig } from "@/lib/config";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          {/* Replace with your actual logo path */}
          <Image
            src="/assets/logo.png"
            alt={appConfig.projectName}
            width={48}
            height={48}
            className="mb-4"
          />
          <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">
            {appConfig.projectName}
          </h2>
        </div>

        <div className="bg-background py-8 px-4 rounded-lg sm:px-10 border border-border shadow-lg">
          {children}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            className="font-medium text-primary hover:text-primary/90 underline underline-offset-4"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="font-medium text-primary hover:text-primary/90 underline underline-offset-4"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
