"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  CreditCard,
  UserCheck,
  Database,
  Search,
  Palette,
  Cog,
  MoreHorizontal,
  Check,
} from "lucide-react";
import HyperText from "../ui/hyper-text";

const tabs = [
  {
    id: 1,
    tabName: "Emails",
    icon: Mail,
    heading: "Email Setup & Design",
    featureList: (
      <ul className="mt-4 space-y-3">
        <li>
          • <b>Beautiful, responsive email templates</b> design using{" "}
          <code>react-email</code>
        </li>
        <li>
          • Automated welcome & onboarding <b>sequences</b>
        </li>
        <li>• SES integration guide.</li>
        <li>• Resend integration guide</li>
      </ul>
    ),
    timeSaved: "4 hours",
    footer: (
      <div className="flex items-center gap-2">
        <Badge>Resend</Badge>
        <Badge>SES</Badge>
        <Badge>Mailgun</Badge>
        <Badge>Mailchimp</Badge>
      </div>
    ),
  },
  {
    id: 2,
    tabName: "Payments",
    icon: CreditCard,
    heading: "Payment Processing",
    featureList: (
      <ul className="mt-4 space-y-3">
        <li>
          • <b>Plan and Quota management</b> on user level.
        </li>
        <li>
          • Handle <b>subscriptions and one-time payments</b>.
        </li>
        <li>• Stripe integration with webhooks and checkout.</li>
        <li>• Lemon Squeezy integration with webhooks and checkout.</li>
        <li>
          • Subscription management & billing using <b>Customer Portal</b>.
        </li>
      </ul>
    ),
    timeSaved: "8 hours",
    footer: (
      <div className="flex items-center gap-2">
        <Badge>Stripe</Badge>
        <Badge>Lemon Squeezy</Badge>
        <Badge>PayPal (coming soon)</Badge>
      </div>
    ),
  },
  {
    id: 3,
    tabName: "Login",
    icon: UserCheck,
    heading: "Secure Authentication",
    featureList: (
      <ul className="mt-4 space-y-3">
        <li>• Social login (Google, GitHub etc.)</li>
        <li>• Magic link authentication</li>
        <li>• Save user data to database</li>
        <li>• Private API route for protected routes</li>
        <li>• Super Admin dashboard for managing users</li>
      </ul>
    ),
    timeSaved: "12 hours",
    footer: (
      <div className="flex items-center gap-2">
        <Badge>NextAuth</Badge>
        <Badge>Google Auth</Badge>
        <Badge>Custom Pages</Badge>
      </div>
    ),
  },
  {
    id: 4,
    tabName: "Database",
    icon: Database,
    heading: "Database & Storage",
    featureList: (
      <ul className="mt-4 space-y-3">
        <li>
          • <b>PostgreSQL/MySQL/MongoDB</b> database
        </li>
        <li>
          • <b>Drizzle</b> ORM
        </li>
        <li>
          • <b>Automated migrations</b>
        </li>
        <li>
          • <b>Connection pooling</b> for better performance
        </li>
        <li>
          • <b>File uploads</b> to S3 for cheap storage
        </li>
      </ul>
    ),
    timeSaved: "6 hours",
    footer: (
      <div className="flex items-center gap-2">
        <Badge>PostgreSQL</Badge>
        <Badge>Drizzle</Badge>
        <Badge>NeonDB</Badge>
        <Badge>MongoDB</Badge>
        <Badge>PlanetScale</Badge>
      </div>
    ),
  },
  {
    id: 5,
    tabName: "SEO",
    icon: Search,
    heading: "Search Engine Optimization",
    featureList: (
      <ul className="mt-4 space-y-3">
        <li>
          • <b>Entire blog structure</b> (MDX)
        </li>
        <li>
          • <b>Automated Sitemap generation</b>
        </li>
        <li>
          • <b>Structured data (JSON-LD)</b> for SEO
        </li>
        <li>
          • <b>Open Graph</b> for social media pre-setup
        </li>
        <li>
          • <b>SEO Optimised</b> UI components
        </li>
      </ul>
    ),
    timeSaved: "5 hours",
    footer: (
      <div className="flex items-center gap-2">
        <Badge>MDX</Badge>
        <Badge>Schema.org</Badge>
        <Badge>Open Graph</Badge>
        <Badge>@vercel/og</Badge>
      </div>
    ),
  },
  {
    id: 6,
    tabName: "Design",
    icon: Palette,
    heading: "Modern UI Components",
    featureList: (
      <ul className="mt-4 space-y-3">
        <li>
          • <b>Responsive layouts</b>
        </li>
        <li>
          • <b>Custom Themes</b> as per your brand
        </li>
        <li>
          • <b>Email designer</b> for beautiful emails
        </li>
        <li>
          • <b>Dark mode support</b>
        </li>
        <li>
          • <b>SEO Optimised</b> UI components
        </li>
        <li>
          • Powered by <b>Shadcn/UI</b>
        </li>
        <li>
          • <b>Magic UI</b> for more components
        </li>
        <li>
          • <b>TailwindCSS</b> for styling
        </li>
      </ul>
    ),
    timeSaved: "10 hours",
    footer: (
      <div className="flex items-center gap-2">
        <Badge>TailwindCSS</Badge>
        <Badge>Shadcn UI</Badge>
        <Badge>Magic UI</Badge>
      </div>
    ),
  },
  {
    id: 7,
    tabName: "Background Jobs",
    icon: Cog,
    heading: "Serverless Job Processing",
    featureList: (
      <ul className="mt-4 space-y-3">
        <li>
          • <b>Queue management</b>
        </li>
        <li>
          • <b>Scheduled tasks</b>
        </li>
        <li>
          • <b>Error handling & retries</b>
        </li>
        <li>
          • Powered by <b>Inngest</b>
        </li>
        <li>
          • Optional <b>Upstash</b> for rate limiting
        </li>
        <li>
          • Implement heavy tasks in <b>background</b>
        </li>
        <li>
          • Email sequences in <b>background</b>
        </li>
      </ul>
    ),
    timeSaved: "7 hours",
    footer: (
      <div className="flex items-center gap-2">
        <Badge>Upstash</Badge>
        <Badge>Inngest</Badge>
        <Badge>Schedule Tasks</Badge>
        <Badge>Background Jobs</Badge>
      </div>
    ),
  },
  {
    id: 8,
    tabName: "More",
    icon: MoreHorizontal,
    heading: "And Much More...",
    featureList: (
      <ul className="mt-4 space-y-3">
        <li>• API rate limiting (optional)</li>
        <li>• File uploads (S3)</li>
        <li>
          • <b>Discord community</b> for accountability and support.
        </li>
        <li>
          • <b>Super Admin dashboard</b> for managing users, plans, and more.
        </li>
        <li>
          • <b>Roadmap Manager</b> for tracking your roadmap
        </li>
        <li>
          • <b>Waitlist Manager</b> for managing your waitlist
        </li>
        <li>
          • <b>Privacy Policy and other legal documents</b> ChatGPT prompts
        </li>
        <li>
          • <b>Contact Us</b> messages manager.
        </li>
        <li>
          • <b>Common Email Templates</b> for your emails
        </li>
        <li>• And much more...</li>
      </ul>
    ),
    timeSaved: "15+ hours",
    footer: (
      <div className="flex items-center gap-2">
        <Badge>Discord</Badge>
        <Badge>Email Templates</Badge>
        <Badge>Roadmap Manager</Badge>
        <Badge>Waitlist Manager</Badge>
        <Badge>Privacy Policy</Badge>
        <Badge>Contact Us</Badge>
      </div>
    ),
  },
];

export const WebsiteFeatures = () => {
  const [activeTab, setActiveTab] = useState("1");

  return (
    <section className="py-32" id="features" aria-label="Features">
      <div className="container">
        <div className="mx-auto flex max-w-(--breakpoint-md) flex-col items-center gap-6">
          <h2 className="mb-4 text-center text-4xl font-semibold md:text-5xl">
            Bootstrap your app instantly,{" "}
            <HyperText
              startOnView
              delay={1000}
              as="span"
              className="text-primary"
            >
              launch faster
            </HyperText>
            , make $
          </h2>
          <p className="text-center text-lg text-muted-foreground md:text-xl">
            Login users, process payments, send emails at lightspeed. Spend your
            time building your startup, not integrating APIs.{" "}
            <span className="text-primary">Indie Kit</span> provides you with
            the boilerplate code you need to launch,{" "}
            <HyperText startOnView delay={2500} as="span" className="text-sm">
              Faster than ever.
            </HyperText>
          </p>
        </div>
        <div className="mt-12">
          <Tabs
            defaultValue="1"
            className="mx-auto flex w-full flex-col items-center gap-8"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="flex h-auto flex-wrap justify-center gap-2 rounded-lg md:rounded-full py-4 md:p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id.toString()}
                    className={`flex items-center gap-2 rounded-full border border-solid border-transparent px-4 py-2 text-sm font-semibold transition ${
                      activeTab === tab.id.toString()
                        ? "border border-solid border-muted2 shadow-xs"
                        : ""
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.tabName}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            {tabs.map((tab) => (
              <TabsContent
                value={tab.id.toString()}
                key={tab.id}
                className="mt-0 w-full overflow-hidden rounded-2xl bg-accent px-8 py-6 md:px-12 md:py-8"
              >
                <div className="flex flex-col justify-between">
                  <div className="mb-8">
                    <h3 className="text-2xl font-semibold">{tab.heading}</h3>
                    {tab.featureList}
                    <div className="mt-6">
                      <span className="text-sm text-green-500 flex items-center gap-1">
                        <Check className="h-4 w-4" /> Time saved:
                        <span className="font-semibold text-green-500">
                          {tab.timeSaved}
                        </span>
                      </span>
                    </div>
                    <div className="mt-4 w-full">{tab.footer}</div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default WebsiteFeatures;
