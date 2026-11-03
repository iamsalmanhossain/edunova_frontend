import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AttendancePageSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Page Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-72 sm:w-96 rounded-xl" />
          <Skeleton className="h-4 w-60 rounded-md" />
        </div>
        <Skeleton className="h-10 w-44 rounded-xl" />
      </div>

      {/* Tab Switcher Skeleton */}
      <div className="flex items-center gap-2 border-b border-[#dce3df] pb-2">
        <Skeleton className="h-9 w-36 rounded-xl" />
        <Skeleton className="h-9 w-32 rounded-xl" />
        <Skeleton className="h-9 w-36 rounded-xl" />
      </div>

      {/* Attendance Form Card Skeleton */}
      <div className="bg-white rounded-3xl border border-[#dce3df] p-6 space-y-6 shadow-xs">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#eef2ef]">
          <div className="space-y-2">
            <Skeleton className="h-6 w-64 rounded-lg" />
            <Skeleton className="h-3.5 w-80 rounded-md" />
          </div>
          <Skeleton className="h-12 w-64 rounded-2xl" />
        </div>

        {/* 4 Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#fafbf9] border border-[#eef2ef]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>

        {/* Quick Actions Bar */}
        <div className="flex justify-between items-center pt-2">
          <div className="flex gap-2">
            <Skeleton className="h-7 w-28 rounded-md" />
            <Skeleton className="h-7 w-28 rounded-md" />
            <Skeleton className="h-7 w-20 rounded-md" />
          </div>
          <Skeleton className="h-4 w-44" />
        </div>

        {/* Table Roster Skeletons */}
        <div className="space-y-2 pt-2">
          <Skeleton className="h-8 w-full rounded-xl" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-3 bg-white border border-[#f0f4f1] rounded-2xl flex items-center justify-between gap-4"
            >
              <Skeleton className="h-5 w-14 rounded-md" />
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3.5 w-40" />
                  <Skeleton className="h-2.5 w-28" />
                </div>
              </div>
              <Skeleton className="h-8 w-48 rounded-lg" />
              <Skeleton className="h-8 w-24 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

