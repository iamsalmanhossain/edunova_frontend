import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminStudentsSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e4] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64 rounded-lg" />
          <Skeleton className="h-4 w-80 rounded" />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#e2e8e4] flex flex-wrap gap-3">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-10 w-36 rounded-xl" />
        <Skeleton className="h-10 w-36 rounded-xl" />
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-[#e2e8e4] p-5 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0f4f1] last:border-0"
          >
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4.5 w-52 rounded" />
              <Skeleton className="h-3 w-44" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

