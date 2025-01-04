import { Check, X } from "lucide-react";

interface ComparisonItem {
  title: string;
  description: string;
}

export function WithWithout() {
  const withProduct: ComparisonItem[] = [
    {
      title: "Ready-to-Use Components",
      description:
        "Get access to 100s of pre-built, responsive UI components (powered by shadcn/ui) and email templates",
    },
    {
      title: "Authentication & Payments",
      description:
        "Secure login system and payment processing ready out of the box",
    },
    {
      title: "Background Processing",
      description:
        "Efficient job queues and scheduled tasks handled automatically",
    },
    {
      title: "SEO Optimization",
      description:
        "Built-in SEO features, sitemaps, and structured data for better rankings",
    },
    {
      title: "Database & Storage",
      description:
        "Pre-configured database setup with migrations and file storage solutions",
    },
    {
      title: "Developer Experience",
      description:
        "Well-documented codebase with TypeScript and best practices implemented",
    },
  ];

  const withoutProduct: ComparisonItem[] = [
    {
      title: "Start From Scratch",
      description:
        "Spend weeks building basic components and designing email templates",
    },
    {
      title: "Complex Integrations",
      description:
        "Struggle with authentication providers and payment gateway setups",
    },
    {
      title: "Manual Processing",
      description:
        "Build your own job scheduling system and handle background tasks",
    },
    {
      title: "Basic SEO",
      description:
        "Miss out on important SEO features and struggle with search rankings",
    },
    {
      title: "Database Headaches",
      description:
        "Deal with database setup, migrations, and storage configuration manually",
    },
    {
      title: "Technical Debt",
      description:
        "Risk building without proper structure, leading to maintenance issues",
    },
  ];

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8" aria-label="Comparison">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Experience the Difference
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Without Product Section */}
          <div className="bg-red-50 dark:bg-red-950/30 p-6 rounded-lg border border-red-200 dark:border-red-900">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-500 p-2 rounded-full">
                <X className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-red-700 dark:text-red-400">
                Without Indie Kit
              </h3>
            </div>
            <div className="space-y-6">
              {withoutProduct.map((item, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-medium text-red-700 dark:text-red-400">
                    {item.title}
                  </h4>
                  <p className="text-red-600 dark:text-red-300/90">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {/* With Product Section */}
          <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg border border-green-200 dark:border-green-900">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-500 p-2 rounded-full">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">
                With Indie Kit
              </h3>
            </div>
            <div className="space-y-6">
              {withProduct.map((item, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-medium text-green-700 dark:text-green-400">
                    {item.title}
                  </h4>
                  <p className="text-green-600 dark:text-green-300/90">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
