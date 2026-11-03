"use client";

import React from "react";
import { BookOpen, School, Calendar, Layers, Hash, Award } from "lucide-react";
import { StudentProfileData } from "@/types/user";

interface StudentAcademicInfoCardProps {
  studentProfile?: StudentProfileData | null;
}

export default function StudentAcademicInfoCard({
  studentProfile,
}: StudentAcademicInfoCardProps) {
  const shiftText =
    studentProfile?.shift === "SECOND_SHIFT" ? "2nd Shift (Day)" : "1st Shift (Morning)";

  const items = [
    {
      label: "Academic Institute",
      value: studentProfile?.institute?.name || "Kishoreganj Polytechnic Institute",
      sub: studentProfile?.institute?.code ? `Code: ${studentProfile.institute.code}` : undefined,
      icon: School,
    },
    {
      label: "Department / Discipline",
      value: studentProfile?.department?.name || "Computer Science & Technology",
      sub: studentProfile?.department?.code ? `Code: ${studentProfile.department.code}` : undefined,
      icon: BookOpen,
    },
    {
      label: "Class Roll Number",
      value: studentProfile?.rollNo || "Not Specified",
      sub: "Board Examination Roll",
      icon: Hash,
    },
    {
      label: "Registration Number",
      value: studentProfile?.registrationNo || "Not Specified",
      sub: "BTEB Official Registration",
      icon: Award,
    },
    {
      label: "Current Semester",
      value: studentProfile?.semester ? `${studentProfile.semester}th Semester` : "Enrolled",
      sub: "Diploma in Engineering",
      icon: Layers,
    },
    {
      label: "Academic Session",
      value: studentProfile?.session || "Not Specified",
      sub: shiftText,
      icon: Calendar,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#e2e8e4] shadow-xs">
      <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-[#f0f4f1]">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
          <BookOpen className="w-4 h-4 text-emerald-700" />
        </div>
        <div>
          <h2 className="text-sm font-extrabold text-[#0f1f17]">
            Academic Credentials & Enrollment
          </h2>
          <p className="text-[11px] text-[#5a6b62]">
            Official institutional enrollment and diploma verification records
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#fafbf9] border border-[#eef2ef] flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100/60 text-[#0a4b32] flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-[#7a8c82] uppercase tracking-wider">
                  {item.label}
                </p>
                <p className="text-xs sm:text-sm font-bold text-[#0f1f17] truncate mt-0.5">
                  {item.value}
                </p>
                {item.sub && (
                  <p className="text-[10px] text-[#5a6b62] truncate mt-0.5">
                    {item.sub}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

