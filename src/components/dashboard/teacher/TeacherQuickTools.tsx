"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Users,
  Award,
  BookOpen,
  Calendar,
  ChevronRight,
  Sparkles,
  FileSpreadsheet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TeacherQuickToolsProps {
  onOpenMasterOverview?: () => void;
}

export default function TeacherQuickTools({ onOpenMasterOverview }: TeacherQuickToolsProps) {
  const tools = [
    {
      label: "Master Overview PDF",
      desc: "Theory & practical attendance + all marks",
      onClick: onOpenMasterOverview,
      icon: FileSpreadsheet,
      color: "text-[#0a4b32] bg-emerald-500/10 border-emerald-500/20",
      badge: "Master PDF",
    },
    {
      label: "Take Attendance",
      desc: "Live subject roll call & logs",
      href: "/dashboard/teacher/attendance",
      icon: CheckCircle2,
      color: "text-[#0a4b32] bg-emerald-500/10 border-emerald-500/20",
      badge: "Fast Launch",
    },
    {
      label: "Class Diary & Notes",
      desc: "Log lectures, chapters & tasks",
      href: "/dashboard/teacher/diary",
      icon: BookOpen,
      color: "text-amber-800 bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Marks & Results",
      desc: "Midterm continuous assessment",
      href: "/dashboard/teacher/results",
      icon: Award,
      color: "text-[#c48b28] bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Student Roll Sheet",
      desc: "Roster by shift & semester",
      href: "/dashboard/teacher/students",
      icon: Users,
      color: "text-teal-800 bg-teal-500/10 border-teal-500/20",
    },
    {
      label: "Academic Calendar",
      desc: "Exam timetables & public holidays",
      href: "/academics/calendar",
      icon: Calendar,
      color: "text-blue-800 bg-blue-500/10 border-blue-500/20",
    },
  ];

  return (
    <Card className="border-[#e2e8e4] shadow-xs bg-white rounded-2xl overflow-hidden">
      <CardHeader className="p-4 sm:p-5 pb-3 border-b border-[#f0f4f1] flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm sm:text-base font-bold text-[#0f1f17]">
            Faculty Quick Actions
          </CardTitle>
          <p className="text-[11px] sm:text-xs text-[#5a6b62] mt-0.5">
            Essential academic management shortcuts
          </p>
        </div>
        <span className="w-2 h-2 rounded-full bg-[#0a4b32] animate-pulse" />
      </CardHeader>

      <CardContent className="p-2 sm:p-3 space-y-1 sm:space-y-1.5">
        {tools.map((item, idx) => {
          const IconComp = item.icon;
          const innerContent = (
            <>
              <div className="flex items-center gap-3 min-w-0 text-left">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${item.color} transition-transform group-hover:scale-105`}
                >
                  <IconComp className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs sm:text-sm font-bold text-[#0f1f17] group-hover:text-[#0a4b32] transition-colors truncate">
                      {item.label}
                    </p>
                    {item.badge && (
                      <span className="hidden xs:inline-block text-[9px] font-extrabold px-1.5 py-0.2 rounded-md bg-[#0a4b32] text-white">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-[#5a6b62] truncate">
                    {item.desc}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-[#718077] opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
            </>
          );

          if (item.onClick) {
            return (
              <button
                key={idx}
                type="button"
                onClick={item.onClick}
                className="w-full group flex items-center justify-between p-2.5 sm:p-3 rounded-xl hover:bg-[#f4f7f5] transition-all cursor-pointer border border-transparent hover:border-[#e2e8e4] active:scale-[0.99]"
              >
                {innerContent}
              </button>
            );
          }

          return (
            <Link
              key={idx}
              href={item.href || "#"}
              className="group flex items-center justify-between p-2.5 sm:p-3 rounded-xl hover:bg-[#f4f7f5] transition-all cursor-pointer border border-transparent hover:border-[#e2e8e4] active:scale-[0.99]"
            >
              {innerContent}
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
