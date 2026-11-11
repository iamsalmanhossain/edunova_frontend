"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Users,
  Clock,
  ClipboardList,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
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
  const cards = [
    {
      title: "Assigned Courses",
      value: `${assignedCoursesCount}`,
      unit: "Subjects",
      subtitle: "Shift 1 & Shift 2",
      href: "/dashboard/teacher/students",
      icon: BookOpen,
      iconBg: "bg-emerald-500/10 text-[#0a4b32] border-emerald-500/20",
      accentDot: "bg-[#0a4b32]",
    },
    {
      title: "Enrolled Students",
      value: `${studentsCount}`,
      unit: "Students",
      subtitle: "Active Roster",
      href: "/dashboard/teacher/students",
      icon: Users,
      iconBg: "bg-amber-500/10 text-amber-800 border-amber-500/20",
      accentDot: "bg-[#c48b28]",
    },
    {
      title: "Attendance Rate",
      value: attendanceSubmissionRate,
      unit: "Average",
      subtitle: "Monthly Submissions",
      href: "/dashboard/teacher/attendance",
      icon: CheckCircle2,
      iconBg: "bg-teal-500/10 text-teal-800 border-teal-500/20",
      accentDot: "bg-teal-600",
    },
    {
      title: "Midterm Marks",
      value: `${pendingEvaluationsCount}`,
      unit: "Batch",
      subtitle: "Gradebook Status",
      href: "/dashboard/teacher/results",
      icon: ClipboardList,
      iconBg: "bg-indigo-500/10 text-indigo-800 border-indigo-500/20",
      accentDot: "bg-indigo-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {cards.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <Link
            key={index}
            href={item.href}
            className="group block focus:outline-none"
          >
            <Card className="h-full border-[#e2e8e4] bg-white hover:border-[#0a4b32]/40 hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98] rounded-2xl overflow-hidden">
              <CardContent className="p-3.5 sm:p-5 flex flex-col justify-between h-full">
                {/* Card Top: Icon & Micro Label */}
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 border ${item.iconBg} transition-transform group-hover:scale-105`}
                  >
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#718077] opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>

                {/* Card Middle: Values */}
                <div className="mt-3">
                  <p className="text-[11px] sm:text-xs font-semibold text-[#5a6b62] line-clamp-1">
                    {item.title}
                  </p>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xl sm:text-2xl font-black text-[#0f1f17] tracking-tight group-hover:text-[#0a4b32] transition-colors">
                      {item.value}
                    </span>
                    <span className="text-[10px] sm:text-xs text-[#5a6b62] font-semibold">
                      {item.unit}
                    </span>
                  </div>
                </div>

                {/* Card Bottom: Subtitle with Status Dot */}
                <div className="mt-2 pt-2 border-t border-[#f0f4f1] flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${item.accentDot} shrink-0`} />
                  <p className="text-[10px] sm:text-[11px] text-[#5a6b62] font-medium truncate">
                    {item.subtitle}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
