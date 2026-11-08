import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResultsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Banner & Quick Actions Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white border border-[#dce3df] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0a4b32]/40" />
            <Skeleton className="h-3 w-36 rounded-full" />
          </div>
          <Skeleton className="h-7 sm:h-8 w-72 sm:w-96 rounded-lg mt-2" />
          <Skeleton className="h-4 w-60 sm:w-80 rounded mt-1.5" />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Master Overview PDF button */}
          <Skeleton className="h-10 w-36 rounded-xl" />
          {/* Doc Guidelines button */}
          <Skeleton className="h-10 w-10 rounded-xl" />
          {/* Enter Results button */}
          <Skeleton className="h-10 w-32 rounded-xl" />
          {/* 3-dots Menu button */}
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </div>

      {/* Search & Filter Bar Skeleton */}
      <div className="p-4 rounded-xl bg-white border border-[#dce3df] shadow-xs flex flex-wrap items-center gap-3">
        {/* Semester Filter */}
        <Skeleton className="h-9 w-36 rounded-md" />
        {/* Exam Type Filter */}
        <Skeleton className="h-9 w-40 rounded-md" />
        {/* Status Filter */}
        <Skeleton className="h-9 w-36 rounded-md" />
        {/* Search Field */}
        <Skeleton className="h-9 flex-1 min-w-[220px] rounded-md" />
      </div>

      {/* Results Card Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-[#dce3df] p-5 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Badges: Exam Type + Status */}
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-28 rounded-full" />
              </div>

              {/* Exam Name & Subject */}
              <Skeleton className="h-5 w-3/4 rounded-md mt-3" />
              <Skeleton className="h-4 w-1/2 rounded-md mt-1.5" />

              {/* Metadata Grid */}
              <div className="mt-3 pt-3 border-t border-[#f0f4f1] grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Skeleton className="h-2.5 w-20 rounded" />
                  <Skeleton className="h-4 w-28 rounded" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-2.5 w-16 rounded" />
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
              </div>

              {/* Marks Entry Progress Box */}
              <div className="mt-3 p-2 rounded-lg bg-[#f4f7f5] flex items-center justify-between">
                <Skeleton className="h-3.5 w-24 rounded" />
                <Skeleton className="h-3.5 w-32 rounded" />
              </div>
            </div>

            {/* Card Actions Footer */}
            <div className="pt-3 border-t border-[#f0f4f1] flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="w-8 h-8 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
