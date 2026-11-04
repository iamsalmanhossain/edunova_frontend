import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDepartmentsSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e4] shadow-xs flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64 rounded-lg" />
          <Skeleton className="h-4 w-80 rounded" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-[#e2e8e4] space-y-3">
            <div className="flex justify-between items-start">
              <Skeleton className="h-5 w-40 rounded" />
              <Skeleton className="h-6 w-14 rounded-md" />
            </div>
            <Skeleton className="h-4 w-48 rounded" />
            <Skeleton className="h-8 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

