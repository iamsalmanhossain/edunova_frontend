import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function StudentResultsSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e2e8e4] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
          <div>
            <Skeleton className="h-6 sm:h-7 w-56 sm:w-72 rounded-lg" />
            <Skeleton className="h-3.5 w-60 sm:w-80 rounded mt-1.5" />
          </div>
        </div>
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>

      {/* GPA & Marks KPI Grid (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Cumulative GPA", w: "w-28" },
          { label: "Published Subjects", w: "w-32" },
          { label: "Passed Subjects", w: "w-28" },
          { label: "Referred / Backlog", w: "w-32" },
        ].map((item, idx) => (
          <Card key={idx} className="border-[#e2e8e4] shadow-xs">
            <CardContent className="p-4 sm:p-5 flex items-center justify-between">
              <div>
                <Skeleton className={`h-3 ${item.w} rounded`} />
                <Skeleton className="h-7 w-16 rounded-lg mt-2" />
                <Skeleton className="h-3 w-36 rounded mt-2" />
              </div>
              <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Bar */}
      <Card className="border-[#e2e8e4] shadow-xs">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <Skeleton className="h-9 w-36 rounded-xl" />
            <Skeleton className="h-9 w-44 rounded-xl" />
          </div>
        </CardContent>
      </Card>

      {/* Published Marksheets Table Card */}
      <Card className="border-[#e2e8e4] shadow-xs overflow-hidden">
        <CardHeader className="p-4 sm:p-5 border-b border-[#e2e8e4]/80 flex flex-row items-center justify-between">
          <div>
            <Skeleton className="h-5 w-60 rounded-md" />
            <Skeleton className="h-3.5 w-72 rounded mt-1.5" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#fcfdfc] border-b border-[#e2e8e4]">
                <tr>
                  <th className="py-3 px-4"><Skeleton className="h-3 w-24 rounded" /></th>
                  <th className="py-3 px-4"><Skeleton className="h-3 w-20 rounded" /></th>
                  <th className="py-3 px-4"><Skeleton className="h-3 w-24 rounded" /></th>
                  <th className="py-3 px-4"><Skeleton className="h-3 w-20 rounded" /></th>
                  <th className="py-3 px-4"><Skeleton className="h-3 w-28 rounded" /></th>
                  <th className="py-3 px-4 text-right"><Skeleton className="h-3 w-16 ml-auto rounded" /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f4f1]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="hover:bg-[#fcfdfc]">
                    <td className="py-3.5 px-4">
                      <Skeleton className="h-4 w-44 rounded" />
                      <Skeleton className="h-3 w-28 rounded mt-1.5" />
                    </td>
                    <td className="py-3.5 px-4">
                      <Skeleton className="h-4 w-32 rounded" />
                      <Skeleton className="h-3 w-20 rounded mt-1.5" />
                    </td>
                    <td className="py-3.5 px-4">
                      <Skeleton className="h-4 w-28 rounded" />
                    </td>
                    <td className="py-3.5 px-4">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </td>
                    <td className="py-3.5 px-4">
                      <Skeleton className="h-3.5 w-36 rounded" />
                      <Skeleton className="h-3 w-24 rounded mt-1" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Skeleton className="h-8 w-16 rounded-lg" />
                        <Skeleton className="h-8 w-16 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-xl border border-[#e2e8e4] space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-36 rounded" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-3.5 w-48 rounded" />
                <div className="flex items-center justify-between pt-2 border-t border-[#f0f4f1]">
                  <Skeleton className="h-4 w-20 rounded" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-16 rounded-lg" />
                    <Skeleton className="h-8 w-16 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
