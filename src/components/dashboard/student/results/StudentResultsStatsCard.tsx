"use client";

import React from "react";
import { StudentResultsStats } from "@/types/student";
import { Card, CardContent } from "@/components/ui/card";
import { Award, BookOpen, CheckCircle2, XCircle, TrendingUp } from "lucide-react";

interface StudentResultsStatsCardProps {
  stats: StudentResultsStats | null;
}

export default function StudentResultsStatsCard({ stats }: StudentResultsStatsCardProps) {
  const safeStats = stats || {
    totalSubjects: 0,
    passedCount: 0,
    failedCount: 0,
    gpa: 0,
  };

  const getGpaGrade = (gpa: number) => {
    if (gpa >= 4.0) return "A+ (Outstanding)";
    if (gpa >= 3.75) return "A (Very Good)";
    if (gpa >= 3.5) return "A- (Good)";
    if (gpa >= 3.0) return "B (Satisfactory)";
    if (gpa >= 2.0) return "C / D (Pass)";
    return gpa > 0 ? "F (Fail)" : "N/A";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. GPA */}
      <Card className="border-[#e2e8e4] shadow-xs">
        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#5a6b62]">Cumulative GPA</p>
            <h3 className="text-2xl font-black text-[#0a4b32] mt-1">
              {safeStats.gpa.toFixed(2)}
            </h3>
            <p className="text-[11px] text-[#c48b28] font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              Scale 4.00 • {getGpaGrade(safeStats.gpa)}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#0a4b32]/10 text-[#0a4b32] flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      {/* 2. Evaluated Subjects */}
      <Card className="border-[#e2e8e4] shadow-xs">
        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#5a6b62]">Published Subjects</p>
            <h3 className="text-2xl font-black text-[#0f1f17] mt-1">
              {safeStats.totalSubjects}
            </h3>
            <p className="text-[11px] text-[#5a6b62] font-medium mt-1">
              Course examinations evaluated
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      {/* 3. Passed Subjects */}
      <Card className="border-[#e2e8e4] shadow-xs">
        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#5a6b62]">Passed Subjects</p>
            <h3 className="text-2xl font-black text-emerald-700 mt-1">
              {safeStats.passedCount}
            </h3>
            <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" />
              Standard pass criteria met
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      {/* 4. Failed / Backlog */}
      <Card className="border-[#e2e8e4] shadow-xs">
        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#5a6b62]">Referred / Backlog</p>
            <h3 className="text-2xl font-black text-rose-700 mt-1">
              {safeStats.failedCount}
            </h3>
            <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1 mt-1">
              <XCircle className="w-3 h-3" />
              {safeStats.failedCount === 0 ? "Clean academic sheet" : "Requires supplementary exam"}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

