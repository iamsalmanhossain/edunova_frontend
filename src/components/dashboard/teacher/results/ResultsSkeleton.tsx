import React from "react";

export default function ResultsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-[#dce3df]">
        <div className="space-y-2">
          <div className="h-6 w-56 bg-[#e6ede8] rounded-md" />
          <div className="h-4 w-96 bg-[#e6ede8] rounded-md" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-36 bg-[#e6ede8] rounded-xl" />
          <div className="h-10 w-36 bg-[#e6ede8] rounded-xl" />
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="p-4 rounded-xl bg-white border border-[#dce3df] flex flex-wrap gap-3">
        <div className="h-9 w-40 bg-[#e6ede8] rounded-md" />
        <div className="h-9 w-40 bg-[#e6ede8] rounded-md" />
        <div className="h-9 w-40 bg-[#e6ede8] rounded-md" />
        <div className="h-9 w-60 bg-[#e6ede8] rounded-md" />
      </div>

      {/* Card Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white border border-[#dce3df] space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-5 w-24 bg-[#e6ede8] rounded-full" />
              <div className="h-5 w-20 bg-[#e6ede8] rounded-full" />
            </div>
            <div className="h-5 w-3/4 bg-[#e6ede8] rounded-md" />
            <div className="space-y-2">
              <div className="h-3.5 w-1/2 bg-[#e6ede8] rounded-md" />
              <div className="h-3.5 w-2/3 bg-[#e6ede8] rounded-md" />
            </div>
            <div className="pt-3 border-t border-[#f0f4f1] flex justify-between items-center">
              <div className="h-4 w-28 bg-[#e6ede8] rounded-md" />
              <div className="h-8 w-24 bg-[#e6ede8] rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

