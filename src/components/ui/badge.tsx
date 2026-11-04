import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#0a4b32] text-white shadow hover:bg-[#0a4b32]/90",
        secondary:
          "border-transparent bg-[#f0f7f3] text-[#0a4b32] hover:bg-[#e2efe8]",
        gold:
          "border-[#c48b28]/30 bg-[#fdf8ee] text-[#9a6a16]",
        outline:
          "border-[#e2e8e4] text-[#0f1f17]",
        destructive:
          "border-transparent bg-red-500 text-white shadow hover:bg-red-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      suppressHydrationWarning
      {...props}
    />
  );
}

export { Badge, badgeVariants };

