import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#0a4b32] text-white hover:bg-[#073825] shadow-sm active:translate-y-[0.5px]",
        gold:
          "bg-[#c48b28] text-white hover:bg-[#b07b22] shadow-sm font-semibold active:translate-y-[0.5px]",
        outline:
          "border border-[#0a4b32]/25 bg-white text-[#0a4b32] hover:bg-[#f0f7f3] hover:border-[#0a4b32]/40",
        outlineGold:
          "border border-[#c48b28]/35 bg-white text-[#9a6a16] hover:bg-[#fefaf0] hover:border-[#c48b28]",
        secondary:
          "bg-[#f0f7f3] text-[#0a4b32] hover:bg-[#e2efe8] font-medium",
        ghost:
          "text-[#0f1f17] hover:bg-[#f0f7f3] hover:text-[#0a4b32]",
        link:
          "text-[#0a4b32] underline-offset-4 hover:underline p-0 h-auto font-normal",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-6 text-base font-semibold",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

