import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentDashboardSkeleton() {
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

      {/* 2-Column Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Main Content (Enrolled Subjects & Recent Results) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-[#e2e8e4] p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#f0f4f1]">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-5 w-16 rounded-md" />
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="py-3 flex items-center justify-between gap-4 border-b border-[#f0f4f1] last:border-0"
              >
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-48 rounded" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-7 w-20 rounded-lg" />
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8e4] p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#f0f4f1]">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-16 rounded-md" />
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="py-3 flex items-center justify-between gap-4 border-b border-[#f0f4f1] last:border-0"
              >
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-52 rounded" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Skeleton (Attendance logs & Quick Links) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#e2e8e4] p-5 space-y-4">
            <Skeleton className="h-5 w-36 pb-1" />
            <div className="p-4 rounded-xl bg-gray-50 flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="space-y-1">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

