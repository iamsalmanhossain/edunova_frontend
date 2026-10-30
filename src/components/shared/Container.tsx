import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}

export default function Container({
  children,
  className,
  size = "default",
  ...props
}: ContainerProps) {
  const sizeClasses = {
    narrow: "max-w-6xl",
    default: "max-w-[1560px]",
    wide: "max-w-[1720px]",
  };

  return (
    <div
      className={cn(
        "mx-auto w-full px-3 xs:px-4 sm:px-6 lg:px-10 max-w-full min-w-0",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
