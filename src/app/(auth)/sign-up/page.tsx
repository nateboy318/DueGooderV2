import { Metadata } from "next"
import Link from "next/link"
import { appConfig } from "@/lib/config"
import { AuthForm } from "@/components/auth/auth-form"

export const metadata: Metadata = {
  title: "Sign Up",
  description: `Create your ${appConfig.projectName} account`,
}

export default function SignUpPage() {
  return (
    <div className="h-full flex items-center justify-center py-10">
      <div className="w-full max-w-sm space-y-6 px-2">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign up for your account to get started with {appConfig.projectName}
          </p>
        </div>
        {/* TODO: Configure this to redirect to the onboarding page if required */}
        <AuthForm callbackUrl="/app" />
        <p className="text-center text-sm text-muted-foreground">
          <Link
            href="/sign-in"
            className="hover:text-primary underline underline-offset-4"
          >
            Already have an account? Sign in
          </Link>
        </p>
      </div>
    </div>
  )
} 