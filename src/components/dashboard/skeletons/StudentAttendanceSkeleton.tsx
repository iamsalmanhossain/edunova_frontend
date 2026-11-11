import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentAttendanceSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-5 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* 1. Header Banner Skeleton */}
      <div className="bg-[#073825]/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs border border-[#0d593c]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-48 bg-white/15 rounded-full" />
            <Skeleton className="h-7 sm:h-8 w-60 sm:w-80 bg-white/20 rounded-xl" />
            <Skeleton className="h-3.5 w-full max-w-md bg-white/10 rounded-lg" />
          </div>
          <Skeleton className="h-9 w-28 bg-white/15 rounded-xl shrink-0" />
        </div>
      </div>

      {/* 2. Tabs Skeleton */}
      <div className="h-10 w-full sm:max-w-md bg-gray-200 rounded-2xl animate-pulse" />

      {/* 3. Summary KPI Cards - 2x2 on Mobile, 4 on Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-3 sm:p-4 lg:p-5 rounded-2xl border border-[#e2e8e4] shadow-xs flex flex-col justify-between min-h-[105px] sm:min-h-[120px]"
          >
            <div className="flex justify-between items-center">
              <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl" />
            </div>
            <div className="mt-2.5 space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 sm:h-7 w-20 rounded-lg" />
            </div>
            <div className="mt-2 pt-2 border-t border-[#f0f4f1] flex items-center gap-1.5">
              <Skeleton className="w-1.5 h-1.5 rounded-full" />
              <Skeleton className="h-2.5 w-24" />
            </div>
          </div>
        ))}
      </div>

      {/* 4. Subject Breakdown Cards Grid */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-48 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e2e8e4] shadow-xs space-y-3"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="h-5 w-44 rounded" />
                </div>
                <Skeleton className="h-7 w-14 rounded-full" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                <Skeleton className="h-12 rounded-xl" />
                <Skeleton className="h-12 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
