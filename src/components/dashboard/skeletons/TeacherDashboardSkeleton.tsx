import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeacherDashboardSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Welcome Banner Skeleton */}
      <div className="bg-[#073825]/90 rounded-2xl p-6 sm:p-7 relative overflow-hidden">
        <div className="space-y-3">
          <Skeleton className="h-6 w-48 bg-white/10 rounded-full" />
          <Skeleton className="h-8 w-72 sm:w-96 bg-white/20 rounded-xl" />
          <Skeleton className="h-4 w-full max-w-xl bg-white/10 rounded-lg" />
        </div>
      </div>

      {/* KPI Metrics Grid Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-3.5 sm:p-5 bg-white rounded-2xl border border-[#e2e8e4] shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl" />
            </div>
            <div className="space-y-1.5 mt-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-24 rounded-lg" />
            </div>
            <div className="mt-2 pt-2 border-t border-[#f0f4f1]">
              <Skeleton className="h-2.5 w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Action Hub Banner Skeleton */}
      <div className="bg-white rounded-3xl p-6 border border-[#dce3df] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40 rounded-full" />
          <Skeleton className="h-6 w-64 rounded-lg" />
          <Skeleton className="h-3.5 w-80 max-w-full rounded-md" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      {/* 2-Column Schedule & Tools Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e2e8e4] p-5 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#f0f4f1]">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-6 w-16 rounded-md" />
          </div>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="py-3 flex items-center justify-between gap-4 border-b border-[#f0f4f1] last:border-0"
            >
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-4.5 w-60 rounded-md" />
                <Skeleton className="h-3 w-44" />
              </div>
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-[#e2e8e4] p-5 space-y-3">
          <Skeleton className="h-5 w-36 pb-2" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

