import { ArrowRight } from "lucide-react";

interface JourneyStep {
  emoji: string;
  text: string;
}

export function ProblemStatement() {
  const steps: JourneyStep[] = [
    {
      emoji: "👨‍💻",
      text: "8 hrs to add Stripe",
    },
    {
      emoji: "😪",
      text: "Struggle to find time",
    },
    {
      emoji: "😔",
      text: "Quit project",
    },
  ];

  return (
    <section className="py-24 px-4 md:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 text-foreground">
          80% of startups fail because<br />founders never launch
        </h2>
        
        <p className="text-xl md:text-2xl text-center mb-16 text-muted-foreground">
          Emails, DNS records, user authentication... There&apos;s so much going on.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-8">
              <div className="flex flex-col items-center gap-3 bg-card dark:bg-card/80 p-6 rounded-lg border border-border shadow-sm">
                <span className="text-4xl md:text-5xl" role="img" aria-label="emoji">
                  {step.emoji}
                </span>
                <span className="text-lg md:text-xl text-center text-card-foreground">
                  {step.text}
                </span>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="hidden md:block w-8 h-8 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 