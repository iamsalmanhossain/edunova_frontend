"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Download, Sparkles, Calendar, BookOpen } from "lucide-react";

interface StudentWelcomeBannerProps {
  userName: string;
  departmentName?: string;
  semesterText?: string;
  shiftText?: string;
}

export default function StudentWelcomeBanner({
  userName,
  semesterText = "2nd Semester CST",
  shiftText = "Shift 1 (Morning)",
}: StudentWelcomeBannerProps) {
  const [greeting, setGreeting] = useState("Welcome back");
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    const now = new Date();
    setFormattedDate(
      now.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    );
  }, []);

  // Sanitize any malformed semester text like "2th" into "2nd"
  const cleanSemesterText = semesterText
    .replace(/1th/gi, "1st")
    .replace(/2th/gi, "2nd")
    .replace(/3th/gi, "3rd");

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#073825] via-[#0a4b32] to-[#042417] text-white p-4 sm:p-6 lg:p-7 shadow-lg shadow-[#0a4b32]/10 border border-[#0d593c]">
      {/* Ambient background decoration */}
      <div className="pointer-events-none absolute -right-12 -top-12 w-52 h-52 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 -bottom-10 w-44 h-44 rounded-full bg-[#c48b28]/15 blur-2xl" />

      {/* Decorative subtle dot pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-4">
        <div className="space-y-1.5 sm:space-y-2 min-w-0 flex-1">
          {/* Shift & Semester Badge Row */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full bg-white/12 text-white text-[10px] sm:text-[11px] font-semibold backdrop-blur-xs border border-white/15">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c48b28] shrink-0" />
              <span className="truncate">{shiftText} • {cleanSemesterText}</span>
            </div>

            {formattedDate && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/20 text-white/80 text-[10px] font-medium border border-white/10">
                <Calendar className="w-3 h-3 text-[#c48b28]" />
                <span>{formattedDate}</span>
              </span>
            )}
          </div>

          {/* Student Welcome Heading */}
          <h2 className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>{greeting}, {userName}</span>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#c48b28] shrink-0 inline-block animate-pulse" />
          </h2>

          {/* Subtext description */}
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed line-clamp-2 sm:line-clamp-none">
            Kishoreganj Polytechnic Institute student portal is active. Review today&apos;s shift timetable, attendance percentages, and upcoming semester assessments.
          </p>
        </div>

        {/* Action Button: Download or view routine */}
        <div className="flex items-center gap-2 shrink-0 pt-1 md:pt-0">
          <Link
            href="/academics/routine"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold text-white bg-white/12 hover:bg-white/20 active:scale-[0.98] border border-white/25 backdrop-blur-md transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#c48b28] shrink-0" />
            <span>Download Routine PDF</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
