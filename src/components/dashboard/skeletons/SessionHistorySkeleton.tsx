import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SessionHistorySkeleton() {
  return (
    <div className="space-y-3 animate-in fade-in duration-200">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="p-4 rounded-2xl border border-[#eef2ef] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="space-y-2 flex-1">
            <div className="flex gap-2">
              <Skeleton className="h-4 w-48 rounded-md" />
              <Skeleton className="h-4 w-20 rounded-full" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="flex items-center gap-4">
            <div className="space-y-1 text-right">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-2.5 w-16" />
            </div>
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

