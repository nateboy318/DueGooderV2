"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import { ChevronRight, Star, Zap } from "lucide-react";
import { useRef } from "react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: "Alice Johnson",
    role: "CEO & Founder",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=John",
    content:
      "This platform has revolutionized the way we manage projects. It is incredibly user-friendly and efficient.",
  },
  {
    name: "David Lee",
    role: "CTO",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Jane",
    content:
      "I have been impressed with the seamless integration and functionality. It has made our tech operations much smoother.",
  },
  {
    name: "Mark Thompson",
    role: "COO",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=David",
    content:
      "Managing our day-to-day tasks has never been easier. The interface is intuitive and saves us a lot of time.",
  },
  {
    name: "Emily Carter",
    role: "Tech Lead",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Emily",
    content:
      "The tools provided have significantly improved our team’s workflow and collaboration. Highly recommend it!",
  },
  {
    name: "Sophia Turner",
    role: "Designer",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Sophia",
    content:
      "From a design perspective, the flexibility and ease of use are outstanding. This has become an indispensable tool for our team.",
  },
  {
    name: "James Wilson",
    role: "Developer",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=James",
    content:
      "As a developer, I appreciate the robust features and simplicity. It has streamlined our processes considerably.",
  },
];

const Testimonial2 = () => {
  const plugin = useRef(
    AutoScroll({
      startDelay: 500,
      speed: 0.7,
    }),
  );

  return (
    <section className="py-32">
      <div className="container flex flex-col items-center gap-4">
        <div className="flex items-center gap-1 text-sm font-semibold">
          <Zap className="h-6 w-auto fill-primary" />
          Rated 5 stars by 1000+ clients
        </div>
        <h2 className="text-center text-3xl font-semibold lg:text-4xl">
          Meet our happy clients
        </h2>
        <p className="text-center text-muted-foreground lg:text-lg">
          Join a global network of thought leaders, product developers,
        </p>
        <a href="#" className="flex items-center gap-1 font-semibold">
          View all testimonials
          <ChevronRight className="mt-0.5 h-4 w-auto" />
        </a>
      </div>
      <div className="lg:container">
        <div className="mt-16 space-y-4">
          <Carousel
            opts={{
              loop: true,
            }}
            plugins={[plugin.current]}
            onMouseLeave={() => plugin.current.play()}
            className="relative before:absolute before:bottom-0 before:left-0 before:top-0 before:z-10 before:w-36 before:bg-linear-to-r before:from-background before:to-transparent after:absolute after:bottom-0 after:right-0 after:top-0 after:z-10 after:w-36 after:bg-linear-to-l after:from-background after:to-transparent"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="basis-auto">
                  <Card className="max-w-96 select-none p-6">
                    <div className="flex justify-between">
                      <div className="mb-4 flex gap-4">
                        <Avatar className="size-14 rounded-full ring-1 ring-input">
                          <AvatarImage
                            src={testimonial.avatar}
                            alt={testimonial.name}
                          />
                        </Avatar>
                        <div>
                          <p className="font-medium">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Star className="size-5 fill-amber-500 text-amber-500" />
                        <Star className="size-5 fill-amber-500 text-amber-500" />
                        <Star className="size-5 fill-amber-500 text-amber-500" />
                        <Star className="size-5 fill-amber-500 text-amber-500" />
                        <Star className="size-5 fill-amber-500 text-amber-500" />
                      </div>
                    </div>
                    <q className="leading-7 text-muted-foreground">
                      {testimonial.content}
                    </q>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonial2;
