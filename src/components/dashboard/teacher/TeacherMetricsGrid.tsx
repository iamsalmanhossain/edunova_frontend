"use client";

import React from "react";
import { Briefcase, Users, Clock, ClipboardList, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface TeacherMetricsProps {
  assignedCoursesCount?: number;
  studentsCount?: number;
  attendanceSubmissionRate?: string;
  pendingEvaluationsCount?: number;
}

export default function TeacherMetricsGrid({
  assignedCoursesCount = 3,
  studentsCount = 144,
  attendanceSubmissionRate = "98.5%",
  pendingEvaluationsCount = 1,
}: TeacherMetricsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {/* Assigned Courses */}
      <Card className="border-[#e2e8e4] shadow-xs">
        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#5a6b62]">Assigned Courses</p>
            <h3 className="text-2xl font-black text-[#0a4b32] mt-1">{assignedCoursesCount} Subjects</h3>
            <p className="text-[11px] text-[#5a6b62] mt-1">Shift 1 &amp; Shift 2</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#0a4b32]/10 text-[#0a4b32] flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      {/* Enrolled Students */}
      <Card className="border-[#e2e8e4] shadow-xs">
        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#5a6b62]">Enrolled Students</p>
            <h3 className="text-2xl font-black text-[#0a4b32] mt-1">{studentsCount} Students</h3>
            <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" />
              Active Attendance Roll
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#c48b28]/15 text-[#c48b28] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      {/* Attendance Submission Rate */}
      <Card className="border-[#e2e8e4] shadow-xs">
        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#5a6b62]">Attendance Submissions</p>
            <h3 className="text-2xl font-black text-[#0a4b32] mt-1">{attendanceSubmissionRate}</h3>
            <p className="text-[11px] text-[#5a6b62] mt-1">Daily records up to date</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#0a4b32]/10 text-[#0a4b32] flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      {/* Pending Evaluations */}
      <Card className="border-[#e2e8e4] shadow-xs">
        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#5a6b62]">Midterm Marks</p>
            <h3 className="text-2xl font-black text-[#0a4b32] mt-1">{pendingEvaluationsCount} Batch</h3>
            <p className="text-[11px] text-[#c48b28] font-medium mt-1">Pending submission</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#0a4b32]/10 text-[#0a4b32] flex items-center justify-center shrink-0">
            <ClipboardList className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

