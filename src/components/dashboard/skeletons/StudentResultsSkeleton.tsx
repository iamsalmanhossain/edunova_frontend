import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentResultsSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e4] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64 rounded-lg" />
          <Skeleton className="h-4 w-72 rounded" />
        </div>
      </div>

      {/* GPA & Marks KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-[#e2e8e4] space-y-2">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-2.5 w-32" />
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#e2e8e4] flex flex-wrap gap-3">
        <Skeleton className="h-10 w-44 rounded-xl" />
        <Skeleton className="h-10 w-44 rounded-xl" />
        <Skeleton className="h-10 w-44 rounded-xl" />
      </div>

      {/* Results Table / Cards */}
      <div className="bg-white rounded-2xl border border-[#e2e8e4] p-5 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 last:border-0"
          >
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4.5 w-56 rounded" />
              <Skeleton className="h-3 w-40" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-7 w-16 rounded-lg" />
              <Skeleton className="h-7 w-12 rounded-lg" />
              <Skeleton className="h-9 w-24 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

