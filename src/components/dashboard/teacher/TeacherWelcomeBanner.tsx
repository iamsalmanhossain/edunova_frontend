"use client";

import React from "react";
import { PlusCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TeacherWelcomeBannerProps {
  userName: string;
  designation?: string;
  departmentName?: string;
  onTakeAttendance?: () => void;
  onUploadMaterials?: () => void;
}

export default function TeacherWelcomeBanner({
  userName,
  designation = "Senior Instructor",
  departmentName = "Computer Science & Technology",
  onTakeAttendance,
  onUploadMaterials,
}: TeacherWelcomeBannerProps) {
  return (
    <div className="bg-gradient-to-r from-[#073825] to-[#0a4b32] rounded-2xl p-5 sm:p-7 text-white shadow-md relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[11px] font-semibold mb-2 backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c48b28]" />
            <span>{designation} • {departmentName}</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            Welcome, {userName}
          </h2>
          <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-2xl leading-relaxed">
            EduNova Academic Management System for Faculty. Access daily teaching timetables, submit shift attendance, and input continuous assessments.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <Button
            size="sm"
            onClick={onTakeAttendance}
            className="bg-[#c48b28] hover:bg-[#b07b22] text-white text-xs h-9 shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
            Take Attendance
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onUploadMaterials}
            className="border-white/30 bg-white/10 hover:bg-white/20 text-white text-xs h-9 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            Upload Materials
          </Button>
        </div>
      </div>
    </div>
  );
}

