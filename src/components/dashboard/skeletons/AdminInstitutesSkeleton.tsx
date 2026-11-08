import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminInstitutesSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Top Banner / Header Skeleton */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e4] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64 rounded-lg" />
          <Skeleton className="h-4 w-96 rounded" />
        </div>
        <Skeleton className="h-10 w-44 rounded-xl" />
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-[#e2e8e4] space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-7 w-20 rounded" />
            <Skeleton className="h-3 w-36 rounded" />
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#e2e8e4] flex flex-col sm:flex-row gap-3 justify-between items-center">
        <Skeleton className="h-10 w-full sm:w-80 rounded-xl" />
        <div className="flex gap-2 w-full sm:w-auto">
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      {/* Cards/Table Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-[#e2e8e4] space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-5 w-48 rounded" />
                <Skeleton className="h-4 w-24 rounded" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full rounded" />
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
              <Skeleton className="h-4 w-24 rounded" />
              <div className="flex gap-1.5">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

