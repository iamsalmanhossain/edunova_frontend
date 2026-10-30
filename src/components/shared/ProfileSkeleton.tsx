import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ProfileSkeletonProps {
  className?: string;
  count?: number;
}

export default function ProfileSkeleton({
  className,
  count = 4,
}: ProfileSkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl overflow-hidden border border-[#e2e8e4] bg-white p-4 space-y-4"
        >
          <Skeleton className="h-52 w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
            <Skeleton className="h-3 w-2/3 rounded" />
          </div>
          <div className="pt-2 border-t border-[#e2e8e4] flex justify-between">
            <Skeleton className="h-3 w-1/4 rounded" />
            <Skeleton className="h-3 w-1/4 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

