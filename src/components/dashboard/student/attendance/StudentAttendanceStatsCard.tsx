"use client";

import React from "react";
import { StudentAttendanceStatsData, StudentSubjectAttendanceItem } from "@/types/student";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BookOpen,
  Clock,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

interface StudentAttendanceStatsCardProps {
  stats: StudentAttendanceStatsData;
}

export default function StudentAttendanceStatsCard({ stats }: StudentAttendanceStatsCardProps) {
  const rawSummary = stats.summary || {
    totalClassesHeld: 0,
    totalPresent: 0,
    totalAbsent: 0,
    overallPercentage: stats.overallPercentage ?? 0,
  };

  // Safe classes held count prevents 0 when attended classes > 0
  const safeTotalHeld = Math.max(
    rawSummary.totalClassesHeld,
    rawSummary.totalPresent + rawSummary.totalAbsent
  );

  const overallPct = rawSummary.overallPercentage;
  const isZeroSession = safeTotalHeld === 0 && rawSummary.totalPresent === 0;

  // Determine overall status text & styling
  let overallStatusText = "No classes recorded yet";
  let overallDotClass = "bg-gray-400";
  let overallTextColor = "text-[#5a6b62]";

  if (!isZeroSession) {
    if (overallPct >= 80) {
      overallStatusText = "Excellent (≥80%)";
      overallDotClass = "bg-emerald-500";
      overallTextColor = "text-emerald-700";
    } else if (overallPct >= 60) {
      overallStatusText = "Warning (60% - 79%)";
      overallDotClass = "bg-amber-500";
      overallTextColor = "text-amber-700";
    } else {
      overallStatusText = "Critical Shortage (<60%)";
      overallDotClass = "bg-rose-500";
      overallTextColor = "text-rose-700";
    }
  }

  const getStatusColor = (percentage: number) => {
    if (percentage >= 80) return "text-emerald-800 bg-emerald-50 border-emerald-200";
    if (percentage >= 60) return "text-amber-800 bg-amber-50 border-amber-200";
    return "text-rose-800 bg-rose-50 border-rose-200";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-emerald-600";
    if (percentage >= 60) return "bg-amber-500";
    return "bg-rose-600";
  };

  const kpis = [
    {
      title: "Overall Attendance",
      value: `${overallPct}%`,
      subtitle: overallStatusText,
      subtitleColor: overallTextColor,
      accentDot: overallDotClass,
      icon: Clock,
      iconBg: "bg-emerald-500/10 text-[#0a4b32] border-emerald-500/20",
    },
    {
      title: "Total Classes Held",
      value: `${safeTotalHeld}`,
      unit: "Classes",
      subtitle: "Conducted by faculty",
      subtitleColor: "text-[#5a6b62]",
      accentDot: "bg-blue-500",
      icon: BookOpen,
      iconBg: "bg-blue-500/10 text-blue-800 border-blue-500/20",
    },
    {
      title: "Attended Classes",
      value: `${rawSummary.totalPresent}`,
      unit: "Classes",
      subtitle: "Verified presence",
      subtitleColor: "text-emerald-700",
      accentDot: "bg-emerald-500",
      icon: CheckCircle2,
      iconBg: "bg-emerald-500/10 text-emerald-800 border-emerald-500/20",
    },
    {
      title: "Absent Classes",
      value: `${rawSummary.totalAbsent}`,
      unit: "Classes",
      subtitle: "Missed sessions",
      subtitleColor: rawSummary.totalAbsent > 0 ? "text-rose-600" : "text-[#5a6b62]",
      accentDot: rawSummary.totalAbsent > 0 ? "bg-rose-500" : "bg-gray-400",
      icon: XCircle,
      iconBg: "bg-rose-500/10 text-rose-800 border-rose-500/20",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Global KPI Metrics - 2x2 on Mobile, 4-col on Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {kpis.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <Card
              key={idx}
              className="border-[#e2e8e4] bg-white rounded-2xl shadow-xs overflow-hidden min-h-[105px] sm:min-h-[120px] flex flex-col justify-between"
            >
              <CardContent className="p-3 sm:p-4 lg:p-5 flex flex-col justify-between h-full">
                {/* Top Row: Icon */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 border ${item.iconBg}`}
                  >
                    <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>

                {/* Middle: Title & Value */}
                <div className="mt-2 sm:mt-3">
                  <p className="text-[11px] sm:text-xs font-semibold text-[#5a6b62] truncate">
                    {item.title}
                  </p>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xl sm:text-2xl font-black text-[#0f1f17] tracking-tight">
                      {item.value}
                    </span>
                    {item.unit && (
                      <span className="text-[10px] sm:text-xs text-[#5a6b62] font-semibold">
                        {item.unit}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom: Subtitle with Status Dot */}
                <div className="mt-2 pt-2 border-t border-[#f0f4f1] flex items-center gap-1.5 min-w-0">
                  <span className={`w-1.5 h-1.5 rounded-full ${item.accentDot} shrink-0`} />
                  <p className={`text-[10px] sm:text-[11px] font-medium truncate ${item.subtitleColor}`}>
                    {item.subtitle}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 2. Subject-Wise Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#0f1f17]">
              Subject-Wise Attendance Breakdown
            </h3>
            <p className="text-[11px] sm:text-xs text-[#5a6b62]">
              Theory and laboratory attendance statistics per enrolled curriculum module
            </p>
          </div>
          {stats.subjects && stats.subjects.length > 0 && (
            <Badge
              variant="outline"
              className="text-xs bg-[#0a4b32]/10 text-[#0a4b32] border-[#0a4b32]/20 font-bold shrink-0"
            >
              {stats.subjects.length} Subjects
            </Badge>
          )}
        </div>

        {(!stats.subjects || stats.subjects.length === 0) ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#e2e8e4] text-[#5a6b62] space-y-2">
            <BookOpen className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-xs sm:text-sm font-semibold text-[#0f1f17]">
              No subject attendance records found
            </p>
            <p className="text-xs text-[#5a6b62]">
              Attendance percentages will appear here as your teachers take roll calls.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {stats.subjects.map((subj: StudentSubjectAttendanceItem) => {
              const isExamEligible = subj.attendancePercentage >= 75;
              return (
                <Card
                  key={subj.subjectId}
                  className="border-[#e2e8e4] bg-white rounded-2xl shadow-xs hover:border-[#0a4b32]/30 transition-all overflow-hidden flex flex-col justify-between"
                >
                  <CardContent className="p-3.5 sm:p-5 space-y-3.5 flex flex-col justify-between h-full">
                    <div>
                      {/* Subject Top Row: Code, Credits, Title & Percentage Badge */}
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#0a4b32] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                              {subj.subjectCode}
                            </span>
                            <span className="text-[10px] sm:text-[11px] text-[#5a6b62] bg-[#f0f4f1] px-1.5 py-0.5 rounded font-medium">
                              {subj.credit} Credits
                            </span>
                          </div>
                          <h4
                            className="text-xs sm:text-sm font-bold text-[#0f1f17] line-clamp-1"
                            title={subj.subjectName}
                          >
                            {subj.subjectName}
                          </h4>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs font-black px-2.5 py-1 shrink-0 ${getStatusColor(
                            subj.attendancePercentage
                          )}`}
                        >
                          {subj.attendancePercentage}%
                        </Badge>
                      </div>

                      {/* Overall Subject Progress Bar */}
                      <div className="space-y-1.5 mt-3">
                        <div className="h-2 w-full bg-[#e2e8e4] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${getProgressColor(
                              subj.attendancePercentage
                            )}`}
                            style={{ width: `${Math.min(100, Math.max(0, subj.attendancePercentage))}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] sm:text-[11px] text-[#5a6b62]">
                          <span>
                            Present: <strong className="text-[#0f1f17]">{subj.presentClasses}</strong> / {subj.totalClassesHeld}
                          </span>
                          <span>
                            Absent: <strong className={subj.absentClasses > 0 ? "text-rose-600" : "text-[#5a6b62]"}>{subj.absentClasses}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Theory & Practical Breakdown Grid */}
                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#f0f4f1] mt-3">
                        {/* Theory Box */}
                        <div className="p-2 sm:p-2.5 rounded-xl bg-[#fcfdfc] border border-[#eef2ef]">
                          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-[#0f1f17] mb-0.5">
                            <span>Theory</span>
                            <span className={subj.breakdown.theory.percentage >= 75 ? "text-emerald-700 font-bold" : "text-amber-700 font-bold"}>
                              {subj.breakdown.theory.percentage}%
                            </span>
                          </div>
                          <p className="text-[10px] text-[#5a6b62]">
                            {subj.breakdown.theory.present}/{subj.breakdown.theory.classesHeld} classes
                          </p>
                        </div>

                        {/* Practical Box */}
                        <div className="p-2 sm:p-2.5 rounded-xl bg-[#fcfdfc] border border-[#eef2ef]">
                          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-[#0f1f17] mb-0.5">
                            <span>Practical</span>
                            <span className={subj.breakdown.practical.percentage >= 75 ? "text-emerald-700 font-bold" : "text-amber-700 font-bold"}>
                              {subj.breakdown.practical.percentage}%
                            </span>
                          </div>
                          <p className="text-[10px] text-[#5a6b62]">
                            {subj.breakdown.practical.present}/{subj.breakdown.practical.classesHeld} labs
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Examination Clearance Status Pill */}
                    <div className="pt-2 border-t border-[#f0f4f1] flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px]">
                        {isExamEligible ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Exam Eligible</span>
                          </span>
                        ) : (
                          <span className="text-amber-700 font-semibold flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Shortage (&lt;75%)</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#5a6b62]">
                        Min 75% required
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
