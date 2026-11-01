"use client";

import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudentWelcomeBannerProps {
  userName: string;
  departmentName?: string;
  semesterText?: string;
  shiftText?: string;
}

export default function StudentWelcomeBanner({
  userName,
  semesterText = "4th Semester CST",
  shiftText = "Shift 1 (Morning)",
}: StudentWelcomeBannerProps) {
  return (
    <div className="bg-gradient-to-r from-[#073825] to-[#0a4b32] rounded-2xl p-5 sm:p-7 text-white shadow-md relative overflow-hidden">
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#c48b28]/15 to-transparent pointer-events-none" />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[11px] font-semibold mb-2 backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c48b28]" />
            <span>{shiftText} • {semesterText}</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            Welcome back, {userName}
          </h2>
          <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-2xl leading-relaxed">
            Kishoreganj Polytechnic Institute student portal is active. Review today&apos;s shift timetable, attendance percentages, and upcoming semester assessments.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            className="border-white/30 bg-white/10 hover:bg-white/20 text-white text-xs h-9 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Download Routine PDF
          </Button>
        </div>
      </div>
    </div>
  );
}

