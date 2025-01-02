import { Check, X } from "lucide-react";

interface ComparisonItem {
  title: string;
  description: string;
}

export function WithWithout() {
  const withProduct: ComparisonItem[] = [
    {
      title: "Streamlined Publishing",
      description: "Publish content seamlessly across multiple platforms with one click",
    },
    {
      title: "Automated Workflow",
      description: "Save hours with automated content syndication and management",
    },
    {
      title: "Full Control",
      description: "Maintain complete ownership of your content and data",
    },
  ];

  const withoutProduct: ComparisonItem[] = [
    {
      title: "Manual Publishing",
      description: "Waste time copying and pasting content to different platforms",
    },
    {
      title: "Complex Process",
      description: "Juggle multiple tools and platforms manually",
    },
    {
      title: "Limited Control",
      description: "Rely on third-party platforms and lose content ownership",
    },
  ];

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Experience the Difference</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* With Product Section */}
          <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg border border-green-200 dark:border-green-900">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-500 p-2 rounded-full">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">With Our Product</h3>
            </div>
            <div className="space-y-6">
              {withProduct.map((item, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-medium text-green-700 dark:text-green-400">{item.title}</h4>
                  <p className="text-green-600 dark:text-green-300/90">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Without Product Section */}
          <div className="bg-red-50 dark:bg-red-950/30 p-6 rounded-lg border border-red-200 dark:border-red-900">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-500 p-2 rounded-full">
                <X className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-red-700 dark:text-red-400">Without Our Product</h3>
            </div>
            <div className="space-y-6">
              {withoutProduct.map((item, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-medium text-red-700 dark:text-red-400">{item.title}</h4>
                  <p className="text-red-600 dark:text-red-300/90">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 