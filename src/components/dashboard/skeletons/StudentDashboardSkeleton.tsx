import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentDashboardSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* 1. Welcome Banner Skeleton */}
      <div className="bg-[#073825]/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-2 sm:space-y-2.5 flex-1">
            <Skeleton className="h-5 w-36 sm:w-48 bg-white/15 rounded-full" />
            <Skeleton className="h-7 sm:h-9 w-56 sm:w-80 bg-white/20 rounded-xl" />
            <Skeleton className="h-3.5 sm:h-4 w-full max-w-lg bg-white/10 rounded-lg" />
          </div>
          <Skeleton className="h-9 w-full sm:w-44 bg-white/15 rounded-xl shrink-0" />
        </div>
      </div>

      {/* 2. KPI Metrics Grid Skeleton - 2 Columns on Mobile, 4 on Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-3 sm:p-4 lg:p-5 bg-white rounded-2xl border border-[#e2e8e4] shadow-xs flex flex-col justify-between min-h-[110px] sm:min-h-[120px]"
          >
            {/* Top icon */}
            <div className="flex items-center justify-between">
              <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl" />
              <Skeleton className="w-3.5 h-3.5 rounded" />
            </div>

            {/* Middle Values */}
            <div className="mt-2.5 sm:mt-3 space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 sm:h-7 w-20 sm:w-24 rounded-lg" />
            </div>

            {/* Bottom subtitle row */}
            <div className="mt-2 pt-2 border-t border-[#f0f4f1] flex items-center gap-1.5">
              <Skeleton className="w-1.5 h-1.5 rounded-full shrink-0" />
              <Skeleton className="h-2.5 w-20 sm:w-24" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Main 2-Column Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column (Courses & Results) */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Enrolled Courses Skeleton */}
          <div className="bg-white rounded-2xl border border-[#e2e8e4] p-4 sm:p-5 space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#f0f4f1]">
              <div className="space-y-1">
                <Skeleton className="h-5 w-40 sm:w-48" />
                <Skeleton className="h-3 w-28 sm:w-36" />
              </div>
              <Skeleton className="h-6 w-16 rounded-md" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl border border-[#e2e8e4] bg-[#fcfdfc] space-y-2.5"
                >
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-16 rounded" />
                    <Skeleton className="h-4 w-14 rounded" />
                  </div>
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-3 w-24 pt-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Results Skeleton */}
          <div className="bg-white rounded-2xl border border-[#e2e8e4] p-4 sm:p-5 space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#f0f4f1]">
              <div className="space-y-1">
                <Skeleton className="h-5 w-36 sm:w-44" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="h-4 w-16 rounded" />
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="py-3 flex items-center justify-between gap-3 border-b border-[#f0f4f1] last:border-0"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-36 sm:w-48 rounded" />
                    <Skeleton className="h-4 w-12 rounded" />
                  </div>
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-7 w-16 sm:w-20 rounded-lg shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (Exams, Attendance & Quick Links) */}
        <div className="space-y-4 sm:space-y-6">
          {/* Upcoming Exam Reminder Skeleton */}
          <div className="bg-white rounded-2xl border border-[#e2e8e4] p-4 sm:p-5 space-y-3">
            <div className="flex justify-between items-center pb-2.5 border-b border-[#f0f4f1]">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="p-3.5 rounded-xl border border-[#e2e8e4] space-y-2 bg-[#fcfdfc]">
              <div className="flex justify-between items-start">
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-4 w-40 rounded" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          </div>

          {/* Recent Attendance Skeleton */}
          <div className="bg-white rounded-2xl border border-[#e2e8e4] p-4 sm:p-5 space-y-3">
            <div className="flex justify-between items-center pb-2.5 border-b border-[#f0f4f1]">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-14" />
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="py-2.5 flex items-center justify-between gap-3 border-b border-[#f0f4f1] last:border-0"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <Skeleton className="h-3.5 w-32 rounded" />
                  <Skeleton className="h-2.5 w-24" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full shrink-0" />
              </div>
            ))}
          </div>

          {/* Quick Access Skeleton */}
          <div className="bg-white rounded-2xl border border-[#e2e8e4] p-4 space-y-2">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
