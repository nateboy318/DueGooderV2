import { Metadata } from "next";
import Link from "next/link";
import { appConfig } from "@/lib/config";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: `Sign in to your ${appConfig.projectName} account`,
};

export default function SignInPage() {
  return (
    <div className="h-full flex items-center justify-center py-10">
      <div className="w-full max-w-sm space-y-6 px-2">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your {appConfig.projectName} account
          </p>
        </div>
        <AuthForm />
        <p className="text-center text-sm text-muted-foreground">
          <Link
            href="/sign-up"
            className="hover:text-primary underline underline-offset-4"
          >
            Don&apos;t have an account? Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
