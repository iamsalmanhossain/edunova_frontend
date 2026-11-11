"use client";

import React from "react";
import { StudentResultsStats } from "@/types/student";
import { Card, CardContent } from "@/components/ui/card";
import { Award, BookOpen, CheckCircle2, XCircle, TrendingUp, ShieldCheck } from "lucide-react";

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
    if (gpa >= 3.25) return "B+ (Above Average)";
    if (gpa >= 3.0) return "B (Average)";
    if (gpa >= 2.0) return "C / D (Pass)";
    return gpa > 0 ? "F (Fail)" : "No evaluations yet";
  };

  const isCleanSheet = safeStats.failedCount === 0;

  const kpis = [
    {
      title: "Cumulative GPA",
      value: safeStats.gpa > 0 ? safeStats.gpa.toFixed(2) : "0.00",
      unit: "/ 4.00",
      subtitle: getGpaGrade(safeStats.gpa),
      subtitleColor: safeStats.gpa >= 3.5 ? "text-[#c48b28]" : "text-[#5a6b62]",
      accentDot: safeStats.gpa >= 3.75 ? "bg-[#c48b28]" : safeStats.gpa > 0 ? "bg-emerald-500" : "bg-gray-400",
      icon: Award,
      iconBg: "bg-amber-500/10 text-amber-800 border-amber-500/20",
    },
    {
      title: "Published Subjects",
      value: `${safeStats.totalSubjects}`,
      unit: "Courses",
      subtitle: "Evaluated by faculty",
      subtitleColor: "text-[#5a6b62]",
      accentDot: "bg-blue-500",
      icon: BookOpen,
      iconBg: "bg-blue-500/10 text-blue-800 border-blue-500/20",
    },
    {
      title: "Passed Subjects",
      value: `${safeStats.passedCount}`,
      unit: "Passed",
      subtitle: "Standard pass met",
      subtitleColor: "text-emerald-700",
      accentDot: "bg-emerald-500",
      icon: CheckCircle2,
      iconBg: "bg-emerald-500/10 text-emerald-800 border-emerald-500/20",
    },
    {
      title: "Referred / Backlog",
      value: `${safeStats.failedCount}`,
      unit: safeStats.failedCount === 1 ? "Subject" : "Subjects",
      subtitle: isCleanSheet ? "Clean academic sheet" : "Requires supplementary",
      subtitleColor: isCleanSheet ? "text-emerald-700" : "text-rose-600",
      accentDot: isCleanSheet ? "bg-emerald-500" : "bg-rose-500",
      icon: isCleanSheet ? ShieldCheck : XCircle,
      iconBg: isCleanSheet
        ? "bg-emerald-500/10 text-emerald-800 border-emerald-500/20"
        : "bg-rose-500/10 text-rose-800 border-rose-500/20",
      numberColor: isCleanSheet ? "text-[#0f1f17]" : "text-rose-700",
    },
  ];

  return (
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
                  <span
                    className={`text-xl sm:text-2xl font-black tracking-tight ${
                      item.numberColor || "text-[#0f1f17]"
                    }`}
                  >
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
                <p
                  className={`text-[10px] sm:text-[11px] font-medium truncate ${item.subtitleColor}`}
                >
                  {item.subtitle}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
