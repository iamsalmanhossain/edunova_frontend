import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResultsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-white border border-[#dce3df] flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64 rounded-lg" />
          <Skeleton className="h-4 w-80 rounded" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>
      <div className="p-4 rounded-xl bg-white border border-[#dce3df] flex gap-3">
        <Skeleton className="h-9 w-36 rounded-md" />
        <Skeleton className="h-9 w-40 rounded-md" />
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-[#dce3df] space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
            <Skeleton className="h-5 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
