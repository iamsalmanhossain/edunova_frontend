"use client";

import React from "react";
import { Clock, Award, BookOpen, GraduationCap, CheckCircle2, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface StudentMetricsProps {
  attendanceRate?: string;
  cgpa?: string;
  enrolledSubjectsCount?: number;
  creditHours?: number;
  rollNo?: string;
  registrationNo?: string;
}

export default function StudentMetricsGrid({
  attendanceRate = "94.2%",
  cgpa = "3.82",
  enrolledSubjectsCount = 5,
  creditHours = 16,
  rollNo = "619820",
  registrationNo = "1502123456",
}: StudentMetricsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {/* Attendance KPI */}
      <Card className="border-[#e2e8e4] shadow-xs">
        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#5a6b62]">Overall Attendance</p>
            <h3 className="text-2xl font-black text-[#0a4b32] mt-1">{attendanceRate}</h3>
            <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" />
              Good standing (&gt;75%)
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#0a4b32]/10 text-[#0a4b32] flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      {/* Merit / CGPA */}
      <Card className="border-[#e2e8e4] shadow-xs">
        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#5a6b62]">Cumulative Merit / CGPA</p>
            <h3 className="text-2xl font-black text-[#0a4b32] mt-1">{cgpa}</h3>
            <p className="text-[11px] text-[#c48b28] font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              Top 5% in Department
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#c48b28]/15 text-[#c48b28] flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      {/* Enrolled Courses */}
      <Card className="border-[#e2e8e4] shadow-xs">
        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#5a6b62]">Enrolled Courses</p>
            <h3 className="text-2xl font-black text-[#0a4b32] mt-1">{enrolledSubjectsCount} Subjects</h3>
            <p className="text-[11px] text-[#5a6b62] mt-1">{creditHours} Total Credit Hours</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#0a4b32]/10 text-[#0a4b32] flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      {/* Official Credentials */}
      <Card className="border-[#e2e8e4] shadow-xs">
        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#5a6b62]">Official Roll &amp; Reg</p>
            <h3 className="text-lg font-bold text-[#0f1f17] mt-1">Roll: {rollNo}</h3>
            <p className="text-[11px] text-[#5a6b62]">Reg: {registrationNo}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#0a4b32]/10 text-[#0a4b32] flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

