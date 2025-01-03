import TextReveal from "@/components/ui/text-reveal";

export function TextRevealIndieKit() {
  return (
    <section className="py-24 px-4 md:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto relative">
        <TextReveal text="Without Indie Kit, I was spending countless hours setting up emails, designing a landing page, handling Stripe webhooks, SEO tags, setting up basic auth, DNS records, protected API routes, and lot more..." />
      </div>
    </section>
  );
}
