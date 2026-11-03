import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePageSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Profile Header Banner Skeleton */}
      <div className="bg-[#073825]/90 rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col sm:flex-row items-center gap-6">
        <Skeleton className="w-24 h-24 rounded-full bg-white/20 shrink-0" />
        <div className="space-y-3 flex-1 text-center sm:text-left">
          <Skeleton className="h-7 w-56 bg-white/20 rounded-xl mx-auto sm:mx-0" />
          <Skeleton className="h-4 w-72 bg-white/10 rounded-md mx-auto sm:mx-0" />
          <div className="flex gap-2 justify-center sm:justify-start">
            <Skeleton className="h-6 w-28 bg-white/10 rounded-full" />
            <Skeleton className="h-6 w-24 bg-white/10 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-10 w-36 bg-white/20 rounded-xl" />
      </div>

      {/* Academic / Professional Info Card Skeleton */}
      <div className="bg-white rounded-3xl border border-[#dce3df] p-6 space-y-4 shadow-xs">
        <Skeleton className="h-5 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-[#fafbf9] border border-[#eef2ef] space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
      </div>

      {/* Personal Info Card Skeleton */}
      <div className="bg-white rounded-3xl border border-[#dce3df] p-6 space-y-4 shadow-xs">
        <Skeleton className="h-5 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-[#fafbf9] border border-[#eef2ef] space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-36" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

