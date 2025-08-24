import { Zap } from "lucide-react";

import { Button } from "@/components/ui/button";

const CTA1 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className='flex h-[620px] items-center justify-center rounded-3xl bg-[linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.6)),url("https://images.unsplash.com/photo-1536735561749-fc87494598cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxNzd8fHx8fHwyfHwxNzIzNjM0NDc0fA&ixlib=rb-4.0.3&q=80&w=1080")] bg-cover bg-center'>
          <div className="flex flex-col gap-8 p-4 text-center text-primary-foreground">
            <div className="flex items-center justify-center gap-2 text-2xl font-medium">
              <Zap className="h-full w-7" /> Faster
            </div>
            <h2 className="text-5xl font-bold">Build your website faster.</h2>
            <div className="flex flex-col justify-center gap-2 sm:flex-row">
              <Button
                size="lg"
                className="bg-background text-primary hover:bg-background"
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-0 bg-background/20 backdrop-blur-xs hover:bg-background/30 hover:text-primary-foreground"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA1;
