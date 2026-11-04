"use client";

import React from "react";
import { StudentAttendanceStatsData, StudentSubjectAttendanceItem } from "@/types/student";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertTriangle, BookOpen, Clock } from "lucide-react";

interface StudentAttendanceStatsCardProps {
  stats: StudentAttendanceStatsData;
}

export default function StudentAttendanceStatsCard({ stats }: StudentAttendanceStatsCardProps) {
  const summary = stats.summary || {
    totalClassesHeld: 0,
    totalPresent: 0,
    totalAbsent: 0,
    overallPercentage: stats.overallPercentage ?? 0,
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 80) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (percentage >= 60) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-rose-700 bg-rose-50 border-rose-200";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-emerald-600";
    if (percentage >= 60) return "bg-amber-500";
    return "bg-rose-600";
  };

  return (
    <div className="space-y-6">
      {/* 1. Global KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Percentage */}
        <Card className="border-[#e2e8e4] shadow-xs">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#5a6b62]">Overall Attendance</p>
              <h3 className="text-2xl font-black text-[#0a4b32] mt-1">
                {summary.overallPercentage}%
              </h3>
              <p className="text-[11px] font-medium mt-1 flex items-center gap-1">
                {summary.overallPercentage >= 80 ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Excellent Standing (&ge;80%)
                  </span>
                ) : summary.overallPercentage >= 60 ? (
                  <span className="text-amber-600 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Warning (60% - 79%)
                  </span>
                ) : (
                  <span className="text-rose-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> Critical Shortage (&lt;60%)
                  </span>
                )}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#0a4b32]/10 text-[#0a4b32] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Classes Held */}
        <Card className="border-[#e2e8e4] shadow-xs">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#5a6b62]">Total Classes Held</p>
              <h3 className="text-2xl font-black text-[#0f1f17] mt-1">
                {summary.totalClassesHeld}
              </h3>
              <p className="text-[11px] text-[#5a6b62] font-medium mt-1">
                Conducted by department faculty
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Present Classes */}
        <Card className="border-[#e2e8e4] shadow-xs">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#5a6b62]">Attended Classes</p>
              <h3 className="text-2xl font-black text-emerald-700 mt-1">
                {summary.totalPresent}
              </h3>
              <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Verified presence
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Absent Classes */}
        <Card className="border-[#e2e8e4] shadow-xs">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#5a6b62]">Absent Classes</p>
              <h3 className="text-2xl font-black text-rose-700 mt-1">
                {summary.totalAbsent}
              </h3>
              <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                Missed sessions
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Subject-Wise Cards Grid */}
      <div>
        <h3 className="text-base font-bold text-[#0f1f17] mb-3">
          Subject-Wise Attendance Breakdown
        </h3>
        {(!stats.subjects || stats.subjects.length === 0) ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#e2e8e4] text-[#5a6b62]">
            No subject attendance records found for this academic session.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.subjects.map((subj: StudentSubjectAttendanceItem) => (
              <Card
                key={subj.subjectId}
                className="border-[#e2e8e4] shadow-xs hover:border-[#0a4b32]/30 transition-all overflow-hidden"
              >
                <CardContent className="p-4 sm:p-5 space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[11px] font-mono font-semibold text-[#5a6b62] bg-[#f0f4f1] px-1.5 py-0.5 rounded">
                          {subj.subjectCode}
                        </span>
                        <span className="text-[11px] text-[#5a6b62]">
                          • {subj.credit} Credits
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#0f1f17] truncate" title={subj.subjectName}>
                        {subj.subjectName}
                      </h4>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs font-black px-2.5 py-1 ${getStatusColor(
                        subj.attendancePercentage
                      )}`}
                    >
                      {subj.attendancePercentage}%
                    </Badge>
                  </div>

                  {/* Overall Subject Progress Bar */}
                  <div className="space-y-1">
                    <div className="h-2 w-full bg-[#e2e8e4] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${getProgressColor(
                          subj.attendancePercentage
                        )}`}
                        style={{ width: `${Math.min(100, subj.attendancePercentage)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-[#5a6b62]">
                      <span>Present: {subj.presentClasses} / {subj.totalClassesHeld}</span>
                      <span>Absent: {subj.absentClasses}</span>
                    </div>
                  </div>

                  {/* Theory & Practical Breakdown */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#f0f4f1]">
                    {/* Theory */}
                    <div className="p-2.5 rounded-xl bg-[#fcfdfc] border border-[#eef2ef]">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-[#0f1f17] mb-1">
                        <span>Theory</span>
                        <span className={subj.breakdown.theory.percentage >= 75 ? "text-emerald-700" : "text-amber-700"}>
                          {subj.breakdown.theory.percentage}%
                        </span>
                      </div>
                      <p className="text-[10px] text-[#5a6b62]">
                        {subj.breakdown.theory.present} / {subj.breakdown.theory.classesHeld} classes
                      </p>
                    </div>

                    {/* Practical */}
                    <div className="p-2.5 rounded-xl bg-[#fcfdfc] border border-[#eef2ef]">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-[#0f1f17] mb-1">
                        <span>Practical</span>
                        <span className={subj.breakdown.practical.percentage >= 75 ? "text-emerald-700" : "text-amber-700"}>
                          {subj.breakdown.practical.percentage}%
                        </span>
                      </div>
                      <p className="text-[10px] text-[#5a6b62]">
                        {subj.breakdown.practical.present} / {subj.breakdown.practical.classesHeld} labs
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
