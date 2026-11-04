import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentAttendanceSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e4] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64 rounded-lg" />
          <Skeleton className="h-4 w-80 rounded" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-[#e2e8e4] space-y-2">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-2.5 w-32" />
          </div>
        ))}
      </div>

      {/* Subject Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-[#e2e8e4] space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <Skeleton className="h-5 w-44 rounded" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-8 w-14 rounded-full" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
              <Skeleton className="h-10 rounded-lg" />
              <Skeleton className="h-10 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

