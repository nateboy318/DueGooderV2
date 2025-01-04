import { ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";

export function ProblemStatement() {
  return (
    <section className="py-24 px-4 md:px-6 lg:px-8 bg-background w-full" aria-label="Problem Statement">
      <div className="flex flex-col gap-4 max-w-3xl mx-auto relative justify-center items-center w-full">
        <Card className="bg-red-200 dark:bg-red-800/50 text-foreground text-left md:text-center border-none w-fit">
          <CardHeader>
            <CardTitle>I&apos;ve quit 10+ times!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">
              I wanted to build simple apps to launch over the weekend. I was so
              frustrated implementing billing, stripe, auth, quota management,
              etc. I just gave up.
            </p>
            <hr className="my-4 border-foreground/20" />
            <ul className="list-disc list-inside mb-4">
              <li>
                <b>4 hrs+</b> to set up emails
              </li>
              <li>
                <b>6 hrs+</b> designing a landing page
              </li>
              <li>
                <b>4 hrs+</b> to handle Stripe webhooks
              </li>
              <li>
                <b>4 hrs+</b> for SEO tags
              </li>
              <li>
                <b>4 hrs+</b> for setting up basic auth
              </li>
              <li>
                <b>3 hrs+</b> for DNS records
              </li>
              <li>
                <b>2 hrs+</b> for protected API routes
              </li>
              <li>
                <b>10+ hrs+</b> for billing, quota management, etc.
              </li>
              <li>
                <b>∞ hrs+</b> overthinking/clueless...
              </li>
            </ul>
            <p className="text-lg mb-4">
              <b>37+ hours of headaches</b>
            </p>
            <p className="text-lg">
              <b>No inspiration or confidence for building the app</b>
            </p>
          </CardContent>
        </Card>
        <Link
          href="/#features"
          className="flex flex-row gap-2 items-center text-foreground/50 hover:text-foreground"
        >
          I knew there was a better way <ArrowDown className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
