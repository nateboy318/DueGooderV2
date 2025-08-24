"use client";

import { Bolt, Cloud, MessagesSquare, Star } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";

const features = [
  {
    id: "feature-1",
    title: "Beautiful Design",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia possimus fugit ab cumque consequuntur pariatur provident? Nulla consequuntur nisi eum!",
    icon: Cloud,
    image: "https://placehold.co/1024x768/svg?text=Beautiful+Design",
  },
  {
    id: "feature-2",
    title: "Responsive Layout",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia possimus fugit ab cumque consequuntur pariatur provident? Nulla consequuntur nisi eum!",
    icon: Star,
    image: "https://placehold.co/1024x768/svg?text=Responsive+Layout",
  },
  {
    id: "feature-3",
    title: "Easy to Use",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia possimus fugit ab cumque consequuntur pariatur provident? Nulla consequuntur nisi eum!",
    icon: Bolt,
    image: "https://placehold.co/1024x768/svg?text=Easy+to+Use",
  },
  {
    id: "feature-4",
    title: "SEO Optimized",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia possimus fugit ab cumque consequuntur pariatur provident? Nulla consequuntur nisi eum!",
    icon: MessagesSquare,
    image: "https://placehold.co/1024x768/svg?text=SEO+Optimized",
  },
];

const FeatureAccordion = () => {
  const [selection, setSelection] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    carouselApi.scrollTo(selection);
  }, [carouselApi, selection]);
  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setSelection(carouselApi.selectedScrollSnap());
    };
    carouselApi.on("select", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  return (
    <section className="py-32">
      <div className="overflow-x-auto">
        <div className="container flex w-fit flex-col-reverse gap-4 md:flex-row md:gap-8 lg:gap-16">
          <ul className="flex flex-row items-start gap-3 md:w-1/2 md:flex-col md:gap-4">
            {features.map((feature, i) => (
              <li
                key={feature.id}
                className="group relative flex w-[min(24rem,80vw)] shrink-0 cursor-pointer transition md:w-full md:overflow-hidden md:rounded-lg md:px-4 md:py-6 md:data-open:bg-accent lg:p-6"
                data-open={selection === i ? "true" : undefined}
                onClick={() => setSelection(i)}
              >
                <feature.icon className="mr-3 size-5 shrink-0 lg:mr-6 lg:size-6" />
                <div>
                  <div className="mb-3 h-5 text-sm font-semibold text-accent-foreground md:text-muted-foreground md:group-hover:text-accent-foreground md:group-data-open:text-accent-foreground lg:mb-4 lg:text-lg">
                    {feature.title}
                  </div>
                  <div className="text-xs text-muted-foreground md:hidden md:text-sm md:group-data-open:block lg:text-base">
                    {feature.description}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <ul className="flex w-fit gap-3 md:hidden">
            {features.map((feature) => (
              <li
                key={feature.id}
                className="md:aspect-w-1 md:aspect-h-1 h-[min(24rem,80vw)] w-[min(24rem,80vw)] shrink-0 md:h-auto md:w-full"
              >
                <div className="overflow-clip rounded-lg border border-border bg-accent">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={1024}
                    height={768}
                    className="aspect-square h-full w-full"
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="hidden overflow-clip rounded-lg border border-border bg-accent md:block md:w-1/2">
            <Carousel
              setApi={setCarouselApi}
              className="aspect-square h-full w-full [&>div]:h-full"
            >
              <CarouselContent className="mx-0 h-full w-full">
                {features.map((feature) => (
                  <CarouselItem key={feature.id} className="px-0">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      width={1024}
                      height={768}
                      className="h-full w-full object-cover object-center"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureAccordion;
