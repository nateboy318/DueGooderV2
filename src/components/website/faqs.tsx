"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is acme.ai?",
    answer:
      "Acme.ai is a cutting-edge AI platform designed to help businesses automate their workflows and improve productivity through advanced artificial intelligence solutions.",
  },
  {
    question: "How can I get started with acme.ai?",
    answer:
      "Getting started is easy! Simply sign up for a free trial, no credit card required. You'll have immediate access to our platform and can start exploring our features right away.",
  },
  {
    question: "What types of AI models does acme.ai support?",
    answer:
      "We support a wide range of AI models including natural language processing, computer vision, predictive analytics, and custom models tailored to your specific needs.",
  },
  {
    question: "Is acme.ai suitable for beginners in AI development?",
    answer:
      "Absolutely! Our platform is designed to be user-friendly for beginners while offering advanced capabilities for experienced users. We provide comprehensive documentation and support to help you get started.",
  },
  {
    question: "What kind of support does acme.ai provide?",
    answer:
      "We offer 24/7 customer support, comprehensive documentation, video tutorials, and a community forum. Enterprise customers also get dedicated support and custom training.",
  },
];

export function WebsiteFAQs() {
  return (
    <section className="bg-muted/40 py-16 sm:py-24">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-muted-foreground">
            Still have questions? Email us at{" "}
            <a
              href="mailto:support@acme.ai"
              className="font-medium text-primary hover:underline"
            >
              support@acme.ai
            </a>
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
    </section>
  );
} 