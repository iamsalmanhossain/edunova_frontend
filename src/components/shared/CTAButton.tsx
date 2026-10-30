import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CTAButtonProps extends ButtonProps {
  href: string;
  showArrow?: boolean;
}

export default function CTAButton({
  href,
  children,
  showArrow = true,
  className,
  variant = "default",
  size = "default",
  ...props
}: CTAButtonProps) {
  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={cn("group transition-all duration-200", className)}
      {...props}
    >
      <Link href={href} className="inline-flex items-center gap-2">
        <span>{children}</span>
        {showArrow && (
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        )}
      </Link>
    </Button>
  );
}

