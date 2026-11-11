"use client";

import React from "react";
import Link from "next/link";
import {
  ClipboardCheck,
  AlertTriangle,
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TeacherGradebookOverview() {
  const pendingAssessments = [
    {
      course: "Microprocessor & Interfacing (66651)",
      semester: "4th Sem CST (Shift 1)",
      type: "Practical Lab Assessment",
      totalStudents: 50,
      submittedCount: 50,
      status: "Ready to Publish",
      percentage: 100,
      badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
      barColor: "bg-emerald-500",
    },
    {
      course: "Database Management System (66652)",
      semester: "5th Sem CST (Shift 1)",
      type: "Midterm Continuous Assessment",
      totalStudents: 50,
      submittedCount: 38,
      status: "12 Marks Pending",
      percentage: 76,
      badge: "bg-amber-100 text-amber-900 border-amber-200",
      barColor: "bg-[#c48b28]",
    },
  ];

  const defaulters = [
    {
      roll: "6121003",
      name: "Sabbir Hossain",
      department: "CST",
      semester: "2nd",
      attendance: "68.0%",
      status: "Non-Collegiate Alert",
      isCritical: true,
    },
    {
      roll: "6121017",
      name: "Rakib Chowdhury",
      department: "CST",
      semester: "2nd",
      attendance: "72.0%",
      status: "Warning Issued",
      isCritical: false,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* 1. Continuous Assessments & Grading Progress */}
      <Card className="border-[#e2e8e4] shadow-xs bg-white rounded-2xl overflow-hidden">
        <CardHeader className="p-4 sm:p-5 pb-3 border-b border-[#f0f4f1] flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0a4b32]/10 text-[#0a4b32] flex items-center justify-center shrink-0">
              <ClipboardCheck className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-xs sm:text-sm font-bold text-[#0f1f17]">
                Continuous Assessment &amp; Marks
              </CardTitle>
              <p className="text-[10px] sm:text-[11px] text-[#5a6b62]">
                Midterm &amp; Practical Lab Submissions
              </p>
            </div>
          </div>
          <Link href="/dashboard/teacher/results">
            <span className="text-[11px] font-bold text-[#0a4b32] hover:underline flex items-center gap-1 cursor-pointer">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        </CardHeader>

        <CardContent className="p-3 sm:p-5 space-y-3">
          {pendingAssessments.map((item, idx) => (
            <div
              key={idx}
              className="p-3 sm:p-3.5 rounded-xl bg-[#f8faf9] border border-[#e8efe9] space-y-2.5 transition-all hover:border-[#0a4b32]/30"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-[#0f1f17] truncate">
                    {item.course}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-[#5a6b62] mt-0.5">
                    {item.semester} • {item.type}
                  </p>
                </div>
                <span
                  className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${item.badge}`}
                >
                  {item.status}
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[#5a6b62] font-semibold">
                  <span>Grading Progress</span>
                  <span>
                    {item.submittedCount}/{item.totalStudents} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full h-1.5 sm:h-2 bg-[#e2e8e4] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.barColor}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#e2e8e4]/60 text-xs">
                <span className="text-[10px] sm:text-[11px] text-[#5a6b62]">
                  {item.percentage === 100
                    ? "✓ All student marks entered"
                    : "⚠️ Pending entries remain"}
                </span>
                <Link href="/dashboard/teacher/results">
                  <span className="text-[11px] font-bold text-[#0a4b32] hover:text-[#073825] flex items-center gap-1 cursor-pointer">
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Open Sheet</span>
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 2. Low Attendance Watchlist (< 75%) */}
      <Card className="border-[#e2e8e4] shadow-xs bg-white rounded-2xl overflow-hidden">
        <CardHeader className="p-4 sm:p-5 pb-3 border-b border-[#f0f4f1] flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-xs sm:text-sm font-bold text-[#0f1f17]">
                Attendance Defaulters Watchlist
              </CardTitle>
              <p className="text-[10px] sm:text-[11px] text-[#5a6b62]">
                Students below BTEB mandatory 75% threshold
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
            {defaulters.length} At Risk
          </span>
        </CardHeader>

        <CardContent className="p-3 sm:p-4 space-y-2">
          {defaulters.map((d) => (
            <div
              key={d.roll}
              className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-red-50/40 border border-red-100/80 transition-colors hover:bg-red-50/70"
            >
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-mono font-bold text-[#0f1f17] text-xs">
                    {d.roll}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-white text-[#5a6b62] font-semibold border border-red-200">
                    {d.department} {d.semester}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#0f1f17] truncate">
                  {d.name}
                </p>
              </div>

              <div className="text-right shrink-0 pl-2">
                <span className="text-xs sm:text-sm font-extrabold text-red-600 block">
                  {d.attendance}
                </span>
                <span className="text-[9px] font-bold text-amber-800">
                  {d.status}
                </span>
              </div>
            </div>
          ))}

          <div className="pt-2 text-center">
            <Link href="/dashboard/teacher/attendance">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-bold text-[#0a4b32] hover:bg-[#f0f7f3] h-8 w-full cursor-pointer"
              >
                <span>View Full Department Attendance Matrix</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
