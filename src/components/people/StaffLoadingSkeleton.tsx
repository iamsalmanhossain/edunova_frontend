"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StaffLoadingSkeletonProps {
  count?: number;
}

export default function StaffLoadingSkeleton({ count = 8 }: StaffLoadingSkeletonProps) {
  const items = Array.from({ length: count });

  return (
    <div className="flex flex-wrap justify-center gap-6 w-full">
      {items.map((_, index) => (
        <div
          key={index}
          className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] max-w-sm flex"
        >
          <Card className="overflow-hidden border border-[#e2e8e4] bg-white rounded-xl shadow-xs animate-pulse w-full">
            <div className="h-52 w-full bg-gray-200/80" />
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
        </div>
      ))}
    </div>
  );
}
