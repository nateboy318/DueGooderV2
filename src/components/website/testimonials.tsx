"use client";

import Image from "next/image";

const testimonials = [
  {
    quote:
      "The AI-driven analytics have revolutionized our product development cycle. Insights are now more accurate and faster than ever. A game-changer for tech companies.",
    author: "Alex Rivera",
    role: "CTO at InnovateTech",
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    quote:
      "Implementing the customer prediction model has drastically improved our targeting strategy. Seeing a 50% increase in conversion rates! Highly recommend their solutions.",
    author: "Samantha Lee",
    role: "Marketing Director at NextGen Solutions",
    image: "https://i.pravatar.cc/150?img=2",
  },
  {
    quote:
      "As a startup, we need to move fast and stay ahead. The automated coding assistant helps us do just that. Our development speed has doubled. Essential tool for any startup.",
    author: "Raj Patel",
    role: "Founder & CEO at StartUp Grid",
    image: "https://i.pravatar.cc/150?img=3",
  },
  {
    quote:
      "The supply chain optimization tools have drastically reduced our operational costs. Efficiency and accuracy in logistics have never been better.",
    author: "Linda Wu",
    role: "VP of Operations at LogiChain Solutions",
    image: "https://i.pravatar.cc/150?img=4",
  },
  {
    quote:
      "By integrating their sustainable energy solutions, we've seen a significant reduction in carbon footprint. Leading the way in eco-friendly business practices.",
    author: "Carlos Gomez",
    role: "Head of R&D at EcoInnovate",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    quote:
      "The market analysis AI has transformed how we approach fashion trends. Our campaigns are now data-driven with higher customer engagement.",
    author: "Aisha Khan",
    role: "Chief Marketing Officer at Fashion Forward",
    image: "https://i.pravatar.cc/150?img=6",
  },
];

export function WebsiteTestimonials() {
  return (
    <section className="bg-muted/40 py-16 sm:py-24" aria-label="Testimonials">
      <div className="mx-auto max-w-(--breakpoint-xl) px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            What our customers are saying
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of satisfied customers who are transforming their
            businesses with our AI solutions.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="flex flex-col justify-between rounded-3xl bg-background p-8 shadow-xs ring-1 ring-border/60"
            >
              <blockquote className="text-lg leading-relaxed">
                &quot;{testimonial.quote}&quot;
              </blockquote>
              <div className="mt-8 flex items-center gap-4">
                <Image
                  className="h-10 w-10 rounded-full object-cover"
                  src={testimonial.image}
                  alt={testimonial.author}
                  fill
                />
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
