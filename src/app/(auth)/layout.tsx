import { appConfig } from "@/lib/config";
import type { ReactNode } from "react";
import Link from "next/link";
import { FaTwitter, FaInstagram, FaLinkedin, FaFacebook, FaYoutube } from "react-icons/fa";

interface AuthLayoutProps {
  children: ReactNode;
}

const SocialIcon = ({ type }: { type: keyof typeof appConfig.social }) => {
  const icons = {
    twitter: FaTwitter,
    instagram: FaInstagram,
    linkedin: FaLinkedin,
    facebook: FaFacebook,
    youtube: FaYoutube,
  };
  const Icon = icons[type];
  const link = appConfig.social[type];
  
  if (!link) return null;
  
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="text-muted-foreground hover:text-white transition-colors"
    >
      <Icon className="h-5 w-5" />
    </a>
  );
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <div className="relative hidden h-full flex-col justify-between bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            {appConfig.projectName}
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">&ldquo;{appConfig.description}&rdquo;</p>
              <footer className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Built with ❤️ by {appConfig.projectName} Team
                </p>
                <div className="flex items-center space-x-4">
                  <SocialIcon type="twitter" />
                  <SocialIcon type="instagram" />
                  <SocialIcon type="linkedin" />
                  <SocialIcon type="facebook" />
                  <SocialIcon type="youtube" />
                </div>
              </footer>
            </blockquote>
          </div>
        </div>
        <div className="container flex flex-col items-center justify-center lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6">
            {children}
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="hover:text-primary underline underline-offset-4"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="hover:text-primary underline underline-offset-4"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
