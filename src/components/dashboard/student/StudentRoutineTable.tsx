"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface RoutinePeriod {
  time: string;
  subject: string;
  teacher: string;
  room: string;
  type: string;
  status: string;
}

interface StudentRoutineTableProps {
  routine: RoutinePeriod[];
  shiftTitle?: string;
}

export default function StudentRoutineTable({
  routine,
  shiftTitle = "Shift 1 Morning Schedule • CST Department",
}: StudentRoutineTableProps) {
  return (
    <Card className="border-[#e2e8e4] shadow-xs">
      <CardHeader className="pb-3 border-b border-[#e2e8e4]/80 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-[#0f1f17]">
            Today&apos;s Class Routine
          </CardTitle>
          <p className="text-xs text-[#5a6b62] mt-0.5">{shiftTitle}</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#f0f7f3] text-[#0a4b32]">
          Active Term
        </span>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 divide-y divide-[#e2e8e4]">
        {routine.map((item, idx) => (
          <div
            key={idx}
            className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#0a4b32]">
                  {item.time}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#e2e8e4] text-[#0f1f17] font-semibold">
                  {item.type}
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#0f1f17]">{item.subject}</h4>
              <p className="text-xs text-[#5a6b62]">
                Instructor: <span className="font-medium text-[#0f1f17]">{item.teacher}</span> • Room: {item.room}
              </p>
            </div>
            <span className="text-xs font-semibold text-[#0a4b32] self-start sm:self-center px-2 py-1 rounded bg-[#f0f7f3] border border-[#dce3df]">
              Room Confirmed
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

