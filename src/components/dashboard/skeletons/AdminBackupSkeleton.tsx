import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminBackupSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-2 sm:px-4 animate-in fade-in duration-200">
      {/* 1. Header Banner Skeleton */}
      <div className="bg-[#073825]/90 rounded-2xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden border border-[#0d5c3d]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-44 bg-white/20 rounded-full" />
            <Skeleton className="h-8 sm:h-9 w-72 sm:w-96 bg-white/20 rounded-xl" />
            <Skeleton className="h-4 w-full max-w-xl bg-white/10 rounded-lg" />
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full md:w-auto">
            <Skeleton className="h-10 w-full sm:w-36 bg-white/15 rounded-xl" />
            <Skeleton className="h-10 w-full sm:w-40 bg-white/15 rounded-xl" />
            <Skeleton className="h-10 w-full sm:w-44 bg-emerald-400/30 rounded-xl" />
          </div>
        </div>
      </div>

      {/* 2. Metric & Info Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border border-[#e2e8e4] bg-white shadow-sm p-3 sm:p-5">
            <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 p-0">
              <Skeleton className="h-3 w-24 rounded" />
              <Skeleton className="w-4 h-4 rounded-full" />
            </CardHeader>
            <CardContent className="p-0 pt-2 space-y-1">
              <Skeleton className="h-7 w-20 rounded-lg" />
              <Skeleton className="h-3 w-32 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3. History & Table Skeleton */}
      <Card className="border border-[#e2e8e4] bg-white shadow-sm overflow-hidden">
        <CardHeader className="border-b border-[#f0f3f1] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Skeleton className="h-6 w-56 rounded-md" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-28 rounded-lg" />
            <Skeleton className="h-8 w-32 rounded-lg" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl border border-[#f0f3f1] bg-[#fbfcfb] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-64 rounded" />
                <Skeleton className="h-3 w-40 rounded" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-8 w-16 rounded-lg" />
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

