import { Star } from "lucide-react";
import React from "react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Hero2 = () => {
  return (
    <section className="py-32">
      <div className="container text-center">
        <div className="mx-auto flex max-w-(--breakpoint-lg) flex-col gap-6">
          <h1 className="text-3xl font-extrabold lg:text-6xl">
            Generate your website in minutes with AI in your browser
          </h1>
          <p className="text-balance text-muted-foreground lg:text-lg">
            We are a team of developers who are passionate about creating
            beautiful and functional websites with AI in your browser.
          </p>
        </div>
        <Button size="lg" className="mt-10">
            Get Started
        </Button>
        <div className="mx-auto mt-10 flex w-fit flex-col items-center gap-4 sm:flex-row">
          <span className="mx-4 inline-flex items-center -space-x-4">
            <Avatar className="size-14 border bg-white">
              <AvatarImage
                src="https://api.dicebear.com/9.x/lorelei/svg?seed=John"
                alt="placeholder"
              />
            </Avatar>
            <Avatar className="size-14 border bg-white">
              <AvatarImage
                src="https://api.dicebear.com/9.x/lorelei/svg?seed=Jane"
                alt="placeholder"
              />
            </Avatar>
            <Avatar className="size-14 border bg-white">
              <AvatarImage
                src="https://api.dicebear.com/9.x/lorelei/svg?seed=David"
                alt="placeholder"
              />
            </Avatar>
            <Avatar className="size-14 border bg-white">
              <AvatarImage
                src="https://api.dicebear.com/9.x/lorelei/svg?seed=Emily"
                alt="placeholder"
              />
            </Avatar>
            <Avatar className="size-14 border bg-white">
              <AvatarImage
                src="https://api.dicebear.com/9.x/lorelei/svg?seed=Michael"
                alt="placeholder"
              />
            </Avatar>
          </span>
          <div>
            <div className="flex items-center gap-1">
              <Star className="size-5 fill-yellow-400 text-yellow-400" />
              <Star className="size-5 fill-yellow-400 text-yellow-400" />
              <Star className="size-5 fill-yellow-400 text-yellow-400" />
              <Star className="size-5 fill-yellow-400 text-yellow-400" />
              <Star className="size-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">5.0</span>
            </div>
            <p className="text-left font-medium text-muted-foreground">
              from 200+ reviews
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero2;
