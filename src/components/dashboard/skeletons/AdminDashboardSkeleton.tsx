import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardSkeleton() {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-4 sm:p-5 bg-white rounded-2xl border border-[#e2e8e4] shadow-xs flex items-center justify-between"
          >
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-28 rounded-lg" />
              <Skeleton className="h-2.5 w-20" />
            </div>
            <Skeleton className="w-11 h-11 rounded-xl" />
          </div>
        ))}
      </div>

      {/* 2-Column Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-[#e2e8e4] p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#f0f4f1]">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-5 w-20 rounded-md" />
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="py-3 flex items-center justify-between gap-4 border-b border-[#f0f4f1] last:border-0"
              >
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-44 rounded" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20 rounded-xl" />
                  <Skeleton className="h-8 w-20 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-[#e2e8e4] p-5 space-y-4">
            <Skeleton className="h-5 w-40" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="py-2.5 border-b border-[#f0f4f1] last:border-0 space-y-1.5">
                <Skeleton className="h-3.5 w-full rounded" />
                <Skeleton className="h-2.5 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

