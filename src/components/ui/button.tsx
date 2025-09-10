import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium \
rounded-md transition-all duration-200 ease-in-out \
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 \
disabled:pointer-events-none disabled:opacity-50 \
[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-black text-white hover:bg-black/90 hover:ring-2 hover:ring-offset-2 hover:ring-black hover:shadow-lg h-9 px-5 hover:cursor-pointer",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:ring-4 hover:ring-offset-2 hover:ring-destructive/50 hover:cursor-pointer",
        outline:
          "border-2 border-border bg-transparent text-foreground hover:bg-black hover:text-white  hover:cursor-pointer",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-black hover:ring-4 hover:ring-offset-2 hover:ring-secondary/50 hover:cursor-pointer",
        ghost: "bg-transparent hover:bg-black hover:text-accent-foreground hover:ring-4 hover:ring-offset-2 hover:ring-accent/50 hover:cursor-pointer",
        link: "bg-transparent text-primary underline-offset-4 hover:underline",
        disable:
          "border border-input bg-transparent text-muted-foreground cursor-not-allowed",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "size-10 p-0",
      },
      rounded: {
        default: "rounded-md",
        sm: "rounded-sm",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
