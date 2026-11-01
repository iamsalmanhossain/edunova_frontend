"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface TeacherLectureItem {
  time: string;
  subject: string;
  semester: string;
  department: string;
  room: string;
  studentsCount: number;
}

interface TeacherScheduleListProps {
  schedule: TeacherLectureItem[];
  onOpenRollCall?: (item: TeacherLectureItem) => void;
}

export default function TeacherScheduleList({
  schedule,
  onOpenRollCall,
}: TeacherScheduleListProps) {
  return (
    <Card className="border-[#e2e8e4] shadow-xs">
      <CardHeader className="pb-3 border-b border-[#e2e8e4]/80 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-[#0f1f17]">
            Today&apos;s Lecture Schedule
          </CardTitle>
          <p className="text-xs text-[#5a6b62] mt-0.5">
            Academic Sessions for Kishoreganj Polytechnic Institute
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#f0f7f3] text-[#0a4b32]">
          Today
        </span>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 divide-y divide-[#e2e8e4]">
        {schedule.map((item, idx) => (
          <div
            key={idx}
            className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#0a4b32]">
                  {item.time}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#f0f7f3] text-[#0a4b32] font-semibold">
                  {item.semester}
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#0f1f17]">{item.subject}</h4>
              <p className="text-xs text-[#5a6b62]">
                Venue: <span className="font-medium text-[#0f1f17]">{item.room}</span> • Enrolled: {item.studentsCount} Students
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenRollCall?.(item)}
              className="self-start sm:self-center h-8 text-xs border-[#dce3df] text-[#0a4b32] hover:bg-[#0a4b32] hover:text-white cursor-pointer"
            >
              Open Roll Call
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

