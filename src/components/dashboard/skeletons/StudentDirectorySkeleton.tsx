import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentDirectorySkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Top Banner Skeleton */}
      <div className="bg-white rounded-3xl border border-[#dce3df] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-72 rounded-xl" />
          <Skeleton className="h-4 w-96 max-w-full rounded-md" />
        </div>
        <Skeleton className="h-10 w-44 rounded-xl" />
      </div>

      {/* Search & Filter Bar Skeleton */}
      <div className="bg-white rounded-2xl border border-[#dce3df] p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <Skeleton className="h-10 w-full sm:w-72 rounded-xl" />
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-3xl border border-[#dce3df] shadow-xs overflow-hidden p-4 space-y-3">
        <Skeleton className="h-10 w-full rounded-xl" />
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="p-3.5 flex items-center justify-between gap-4 border-b border-[#f0f4f1] last:border-0"
          >
            <Skeleton className="h-4 w-16 font-mono" />
            <div className="flex items-center gap-3 flex-1 max-w-xs">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-2.5 w-44" />
              </div>
            </div>
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

