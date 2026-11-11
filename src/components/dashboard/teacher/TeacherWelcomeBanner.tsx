"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Award,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TeacherWelcomeBannerProps {
  userName: string;
  designation?: string;
  departmentName?: string;
  shift?: string;
  instituteName?: string;
  onOpenMasterOverview?: () => void;
}

export default function TeacherWelcomeBanner({
  userName,
  designation = "Senior Instructor",
  departmentName = "Computer Science & Technology",
  shift = "First Shift (Morning)",
  instituteName = "Kishoreganj Polytechnic Institute",
  onOpenMasterOverview,
}: TeacherWelcomeBannerProps) {
  const [greeting, setGreeting] = useState("Welcome");
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
        year: "numeric",
      })
    );
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#073825] via-[#0a4b32] to-[#042417] text-white p-4 sm:p-6 lg:p-8 shadow-lg shadow-[#0a4b32]/15 border border-[#0d593c]">
      {/* Ambient background decoration */}
      <div className="pointer-events-none absolute -right-16 -top-16 w-64 h-64 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-[#c48b28]/15 blur-2xl" />

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
        {/* Left: Faculty Details & Welcome Message */}
        <div className="space-y-2 sm:space-y-2.5 max-w-2xl min-w-0">
          {/* Top Info Chips */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Institute Chip */}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-200 text-[10px] sm:text-[11px] font-semibold backdrop-blur-xs border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c48b28] animate-pulse" />
              <span className="truncate">{instituteName}</span>
            </span>

            {/* Shift Indicator */}
            <span className="hidden xs:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-200 text-[10px] sm:text-[11px] font-semibold border border-amber-400/20">
              <Clock className="w-2.5 h-2.5 text-[#c48b28]" />
              <span>{shift}</span>
            </span>

            {/* Date Chip */}
            {formattedDate && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/20 text-white/80 text-[10px] sm:text-[11px] font-medium">
                <Calendar className="w-2.5 h-2.5 text-[#c48b28]" />
                <span>{formattedDate}</span>
              </span>
            )}
          </div>

          {/* Main Greeting Headline */}
          <div>
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              {greeting},{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-[#e2c17c]">
                {userName}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 font-medium mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span className="text-[#c48b28] font-bold">{designation}</span>
              <span className="text-white/40">•</span>
              <span className="text-white/90">{departmentName}</span>
            </p>
          </div>

          {/* Short Faculty Mission Statement */}
          <p className="text-[11px] sm:text-xs text-white/70 leading-relaxed line-clamp-2 max-w-xl">
            Welcome to your faculty workstation. Review today&apos;s teaching timetable, submit digital roll call, and track continuous midterm evaluations.
          </p>
        </div>

        {/* Right: Quick Action Buttons (Mobile-first responsive layout) */}
        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 shrink-0 pt-1 sm:pt-0">
          {onOpenMasterOverview && (
            <Button
              type="button"
              onClick={onOpenMasterOverview}
              className="w-full sm:w-auto h-10 sm:h-9 px-4 bg-[#c48b28] hover:bg-[#b07b22] text-white font-bold text-xs rounded-xl shadow-md shadow-[#c48b28]/20 gap-2 cursor-pointer transition-all active:scale-[0.98] border border-amber-400/30"
            >
              <FileSpreadsheet className="w-4 h-4 text-white" />
              <span>Master Overview PDF</span>
            </Button>
          )}

          <Link href="/dashboard/teacher/diary" className="w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto h-10 sm:h-9 px-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl gap-2 cursor-pointer transition-all active:scale-[0.98] border border-white/25 backdrop-blur-xs"
            >
              <BookOpen className="w-4 h-4 text-emerald-200" />
              <span>Class Diary</span>
            </Button>
          </Link>

          <Link href="/dashboard/teacher/results" className="w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto h-10 sm:h-9 px-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl gap-2 cursor-pointer transition-all active:scale-[0.98] border border-white/25 backdrop-blur-xs"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Marks &amp; Results</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
