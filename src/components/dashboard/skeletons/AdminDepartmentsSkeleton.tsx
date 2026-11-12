import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDepartmentsSkeleton() {
  return (
    <div className="h-[calc(100vh-125px)] sm:h-[calc(100vh-140px)] flex flex-col space-y-4 max-w-7xl mx-auto overflow-hidden animate-in fade-in duration-200">
      {/* 1. Top Header Banner Skeleton */}
      <div className="shrink-0 bg-gradient-to-br from-[#073825] via-[#0a4b32] to-[#042417] rounded-2xl p-4 sm:p-5 text-white shadow-lg border border-[#0d593c]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-4 w-40 bg-white/20 rounded-full" />
            <Skeleton className="h-7 sm:h-8 w-64 sm:w-80 bg-white/20 rounded-xl" />
            <Skeleton className="h-3 w-full max-w-md bg-white/10 rounded-lg" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8.5 w-32 bg-white/20 rounded-xl" />
            <Skeleton className="h-8.5 w-24 bg-white/15 rounded-xl" />
          </div>
        </div>
      </div>

      {/* 2. Main 2-Column Layout */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 overflow-hidden">
        {/* Left Column: Departments Skeleton */}
        <div className="h-full flex flex-col bg-white rounded-2xl border border-[#e2e8e4] shadow-xs overflow-hidden">
          <div className="p-3.5 sm:p-4 border-b border-[#f0f4f1] flex items-center justify-between shrink-0">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="flex-1 p-3 space-y-2.5 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-[#e2e8e4] bg-[#fcfdfc] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-12 rounded" />
                  <Skeleton className="w-4 h-4 rounded-full" />
                </div>
                <Skeleton className="h-4 w-40 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Subjects Table Skeleton */}
        <div className="lg:col-span-2 h-full flex flex-col bg-white rounded-2xl border border-[#e2e8e4] shadow-xs overflow-hidden">
          <div className="p-3.5 sm:p-4 border-b border-[#e2e8e4]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <div className="space-y-1 flex-1">
              <Skeleton className="h-5 w-64 rounded-md" />
              <Skeleton className="h-3 w-48 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-28 rounded-xl" />
              <Skeleton className="h-8 w-28 rounded-xl" />
            </div>
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-[#f0f4f1] last:border-0"
              >
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-48 rounded" />
                  <Skeleton className="h-3 w-28 rounded" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-16 rounded-md" />
                  <Skeleton className="h-6 w-20 rounded-md" />
                  <Skeleton className="h-6 w-16 rounded-md" />
                  <Skeleton className="h-7 w-7 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
