import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminAuditLogsSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e4] shadow-xs flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-7 w-60 rounded-lg" />
          <Skeleton className="h-4 w-72 rounded" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-[#e2e8e4] flex gap-3">
        <Skeleton className="h-10 w-48 rounded-xl" />
      </div>

      <div className="bg-white rounded-2xl border border-[#e2e8e4] p-5 space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="py-3 flex items-center justify-between border-b border-[#f0f4f1] last:border-0">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-44 rounded" />
              <Skeleton className="h-3 w-64 rounded" />
            </div>
            <Skeleton className="h-7 w-28 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

