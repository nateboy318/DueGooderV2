"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Indie Kit?",
    answer:
      "Indie Kit is a complete starter kit for indie hackers and startups that provides all the essential features needed to launch a SaaS product. It includes authentication, payment processing, email systems, background jobs, SEO optimization, and much more, all pre-configured and ready to use.",
  },
  {
    question: "What tech stack does Indie Kit use?",
    answer:
      "Indie Kit is built with modern technologies including Next.js, TypeScript, TailwindCSS, Shadcn UI, Drizzle ORM, and more. For services, it integrates with industry standards like Stripe/Lemon Squeezy for payments, various email providers (Resend, SES, etc.), and Inngest for background jobs.",
  },
  {
    question: "Do I need to be an experienced developer to use Indie Kit?",
    answer:
      "While some development experience is helpful, Indie Kit is designed to be accessible. The codebase is well-documented, follows best practices, and comes with detailed guides. We also provide a supportive Discord community where you can get help when needed.",
  },
  {
    question: "Can I customize the design and features?",
    answer:
      "Absolutely! Indie Kit provides a solid foundation that's fully customizable. All components are built with TailwindCSS and Shadcn UI, making it easy to modify the design. You can also add, remove, or modify features to match your specific needs.",
  },
  {
    question: "What kind of support is included?",
    answer:
      "Indie Kit comes with comprehensive documentation, integration guides, and access to our Discord community. You'll get support for technical issues, guidance on best practices, and can connect with other indie hackers building with the kit.",
  },
  {
    question: "How does the payment integration work?",
    answer:
      "Indie Kit includes pre-built integrations with Stripe and Lemon Squeezy, handling both one-time payments and subscriptions. It includes features like plan management, usage quotas, and customer portals. PayPal integration is coming soon.",
  },
  {
    question: "What about email functionality?",
    answer:
      "The kit includes a complete email system with beautiful, responsive templates built using react-email. It supports multiple providers (Resend, SES, Mailgun, etc.) and includes automated sequences for onboarding, notifications, and marketing.",
  },
  {
    question: "How does Indie Kit handle SEO?",
    answer:
      "Indie Kit comes with built-in SEO optimization including automated sitemap generation, structured data (JSON-LD), Open Graph tags, and a complete blog structure using MDX. All UI components are also optimized for search engines.",
  },
  {
    question: "What databases are supported?",
    answer:
      "Indie Kit supports PostgreSQL, MySQL, and MongoDB out of the box. It uses Drizzle ORM for type-safe database operations and includes features like automated migrations and connection pooling for better performance.",
  },
  {
    question: "How much time can Indie Kit save me?",
    answer:
      "Based on our estimates, Indie Kit can save you 50+ hours of development time by providing pre-built features and integrations. This includes time saved on authentication (12h), payment processing (8h), email setup (4h), background jobs (7h), and more.",
  },
];

export function WebsiteFAQs() {
  return (
    <aside className="bg-muted/40 py-16 sm:py-24" aria-label="Frequently Asked Questions">
      <div className="mx-auto max-w-(--breakpoint-xl) px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-muted-foreground">
            Can&apos;t find what you&apos;re looking for? Join our{" "}
            <a
              href="https://discord.gg/indiekit"
              className="font-medium text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord community
            </a>{" "}
            for support
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-3xl">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </aside>
  );
}
