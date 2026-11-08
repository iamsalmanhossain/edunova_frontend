import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function StudentResultsSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e4] shadow-xs flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64 rounded-lg" />
          <Skeleton className="h-4 w-72 rounded" />
        </div>
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-[#e2e8e4] shadow-xs">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <Skeleton className="h-3 w-24 rounded" />
                <Skeleton className="h-7 w-16 rounded-lg mt-2" />
              </div>
              <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
