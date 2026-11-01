"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface StudentCourseItem {
  code: string;
  name: string;
  credits: number;
  progress: number;
  teacher: string;
}

interface StudentCourseProgressProps {
  courses: StudentCourseItem[];
}

export default function StudentCourseProgress({ courses }: StudentCourseProgressProps) {
  return (
    <Card className="border-[#e2e8e4] shadow-xs">
      <CardHeader className="pb-3 border-b border-[#e2e8e4]/80">
        <CardTitle className="text-base font-bold text-[#0f1f17]">
          Enrolled Subjects &amp; Syllabus Progress
        </CardTitle>
        <p className="text-xs text-[#5a6b62]">
          Curriculum approved by Bangladesh Technical Education Board (BTEB)
        </p>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 space-y-4">
        {courses.map((c) => (
          <div key={c.code} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#0f1f17]">
                {c.name} <span className="text-[#5a6b62] font-normal">({c.code})</span>
              </span>
              <span className="font-bold text-[#0a4b32]">{c.progress}% completed</span>
            </div>
            <div className="w-full h-2 bg-[#e2e8e4] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0a4b32] rounded-full transition-all"
                style={{ width: `${c.progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#5a6b62]">
              <span>Teacher: {c.teacher}</span>
              <span>{c.credits} Credits</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

