import { ChevronRight, Play } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Hero1 = () => {
  return (
    <section className="mb-32 border-b pt-32">
      <div className="container">
        <div className="relative pb-16">
          <div className="magicpattern absolute inset-x-0 top-0 -z-10 flex h-full w-full items-center justify-center opacity-100" />
          <a
            href="#"
            className="mx-auto flex w-fit items-center gap-2 rounded-lg bg-muted p-3 sm:rounded-full sm:py-1 sm:pl-1 sm:pr-3"
          >
            <Badge className="hidden sm:block">New Release</Badge>
            <p className="flex items-center gap-1 text-sm">
              Get started with our new product release today
              <ChevronRight className="mt-0.5 size-4 shrink-0" />
            </p>
          </a>
          <h1 className="mx-auto my-5 max-w-(--breakpoint-lg) text-balance text-center text-3xl md:text-5xl">
            Generate your website in minutes with AI in your browser
          </h1>
          <p className="mx-auto max-w-(--breakpoint-md) text-center text-sm text-muted-foreground md:text-base">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia
            possimus fugit ab cumque consequuntur pariatur provident? Nulla
            consequuntur nisi eum!
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button>
              Get Started <ChevronRight className="ml-2 size-4" />
            </Button>
            <Button variant="outline">
              <Play className="mr-2 size-4" />
              Watch Demo
            </Button>
          </div>
          <div className="mt-5 flex justify-center">
            <a
              href="#"
              className="flex items-center gap-1 border-b border-dashed text-sm hover:border-solid hover:border-primary"
            >
              Schedule a call
              <ChevronRight className="size-3.5" />
            </a>
          </div>
        </div>
        <div className="rounded-t-lg border-x border-t px-1 pt-1">
          <Image
            src="https://shadcnblocks.com/images/block/placeholder.svg"
            alt="placeholder"
            className="max-h-80 w-full rounded-t-lg object-cover md:max-h-[430px]"
            fill
          />
        </div>
      </div>
    </section>
  );
};

export default Hero1;
