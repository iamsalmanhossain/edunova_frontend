"use client";

import React from "react";
import Link from "next/link";
import { Clock, Award, BookOpen, GraduationCap, ChevronRight } from "lucide-react";
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
  attendanceRate = "0.0%",
  cgpa = "0.00",
  enrolledSubjectsCount = 0,
  creditHours = 0,
  rollNo = "N/A",
  registrationNo = "N/A",
}: StudentMetricsProps) {
  // 1. Dynamic Attendance Standing Calculation
  const numericRate =
    typeof attendanceRate === "string"
      ? parseFloat(attendanceRate.replace("%", "")) || 0
      : Number(attendanceRate) || 0;

  let attendanceStatusText = "No records yet";
  let attendanceDotClass = "bg-gray-400";
  let attendanceTextColor = "text-[#5a6b62]";

  if (numericRate >= 75) {
    attendanceStatusText = "Good standing (≥75%)";
    attendanceDotClass = "bg-emerald-500";
    attendanceTextColor = "text-emerald-700";
  } else if (numericRate > 0) {
    attendanceStatusText = "Low attendance (<75%)";
    attendanceDotClass = "bg-rose-500";
    attendanceTextColor = "text-rose-600";
  }

  // 2. Dynamic Merit / CGPA Standing
  const numericCgpa = parseFloat(cgpa) || 0;
  let cgpaStatusText = "Awaiting evaluations";
  let cgpaDotClass = "bg-[#c48b28]";

  if (numericCgpa >= 3.75) {
    cgpaStatusText = "First Class / Honors";
    cgpaDotClass = "bg-[#c48b28]";
  } else if (numericCgpa >= 3.0) {
    cgpaStatusText = "Good Academic Record";
    cgpaDotClass = "bg-emerald-500";
  } else if (numericCgpa > 0) {
    cgpaStatusText = "Active Passing Grade";
    cgpaDotClass = "bg-teal-600";
  }

  // 3. Safe Credit Hours
  const safeCredits = Number(creditHours) || enrolledSubjectsCount * 3;

  const cards = [
    {
      title: "Overall Attendance",
      value: attendanceRate,
      unit: "",
      subtitle: attendanceStatusText,
      subtitleColor: attendanceTextColor,
      accentDot: attendanceDotClass,
      href: "/dashboard/student/attendance",
      icon: Clock,
      iconBg: "bg-emerald-500/10 text-[#0a4b32] border-emerald-500/20",
    },
    {
      title: "Academic CGPA",
      value: cgpa,
      unit: "/ 4.00",
      subtitle: cgpaStatusText,
      subtitleColor: "text-[#5a6b62]",
      accentDot: cgpaDotClass,
      href: "/dashboard/student/results",
      icon: Award,
      iconBg: "bg-amber-500/10 text-amber-800 border-amber-500/20",
    },
    {
      title: "Enrolled Courses",
      value: `${enrolledSubjectsCount}`,
      unit: "Subjects",
      subtitle: `${safeCredits} Credit Hours`,
      subtitleColor: "text-[#5a6b62]",
      accentDot: "bg-[#0a4b32]",
      href: "#enrolled-subjects",
      icon: BookOpen,
      iconBg: "bg-teal-500/10 text-teal-800 border-teal-500/20",
    },
    {
      title: "Roll & Registration",
      value: `${rollNo}`,
      unit: "",
      subtitle: `Reg: ${registrationNo}`,
      subtitleColor: "text-[#5a6b62]",
      accentDot: "bg-indigo-600",
      href: "/dashboard/student/profile",
      icon: GraduationCap,
      iconBg: "bg-indigo-500/10 text-indigo-800 border-indigo-500/20",
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
            <Card className="h-full border-[#e2e8e4] bg-white hover:border-[#0a4b32]/40 hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98] rounded-2xl overflow-hidden min-h-[110px] sm:min-h-[120px]">
              <CardContent className="p-3 sm:p-4 lg:p-5 flex flex-col justify-between h-full">
                {/* Card Top: Icon & Micro Chevron */}
                <div className="flex items-center justify-between gap-1.5">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 border ${item.iconBg} transition-transform group-hover:scale-105`}
                  >
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#718077] opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>

                {/* Card Middle: Values & Title */}
                <div className="mt-2.5 sm:mt-3">
                  <p className="text-[11px] sm:text-xs font-semibold text-[#5a6b62] truncate">
                    {item.title}
                  </p>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg sm:text-2xl font-black text-[#0f1f17] tracking-tight group-hover:text-[#0a4b32] transition-colors truncate">
                      {item.value}
                    </span>
                    {item.unit && (
                      <span className="text-[10px] sm:text-xs text-[#5a6b62] font-semibold shrink-0">
                        {item.unit}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Bottom: Subtitle with Status Dot */}
                <div className="mt-2 pt-2 border-t border-[#f0f4f1] flex items-center gap-1.5 min-w-0">
                  <span className={`w-1.5 h-1.5 rounded-full ${item.accentDot} shrink-0`} />
                  <p className={`text-[10px] sm:text-[11px] font-medium truncate ${item.subtitleColor}`}>
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
