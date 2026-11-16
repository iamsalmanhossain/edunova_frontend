"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StaffLoadingSkeletonProps {
  count?: number;
}

export default function StaffLoadingSkeleton({ count = 8 }: StaffLoadingSkeletonProps) {
  const items = Array.from({ length: count });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((_, index) => (
        <Card
          key={index}
          className="overflow-hidden border border-[#e2e8e4] bg-white rounded-xl shadow-xs animate-pulse"
        >
          {/* Skeleton Image */}
          <div className="h-52 w-full bg-gray-200/80" />

          {/* Skeleton Content */}
          <CardContent className="p-4 sm:p-5 space-y-3">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded-md w-3/4" />
              <div className="h-3 bg-gray-200 rounded-md w-1/2" />
              <div className="h-3 bg-gray-200 rounded-md w-2/3" />
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div className="h-3 bg-gray-200 rounded-md w-24" />
              <div className="h-3 bg-gray-200 rounded-md w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
