"use client";

import React from "react";
import { Briefcase, School, BookOpen, Calendar, Clock, FileText } from "lucide-react";
import { TeacherProfileData } from "@/types/user";

interface TeacherProfessionalInfoCardProps {
  teacherProfile?: TeacherProfileData | null;
}

export default function TeacherProfessionalInfoCard({
  teacherProfile,
}: TeacherProfessionalInfoCardProps) {
  const shiftText =
    teacherProfile?.shift === "SECOND_SHIFT" ? "2nd Shift (Day)" : "1st Shift (Morning)";

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "Not Specified";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const items = [
    {
      label: "Institutional Affiliation",
      value: teacherProfile?.institute?.name || "Kishoreganj Polytechnic Institute",
      sub: teacherProfile?.institute?.code ? `Code: ${teacherProfile.institute.code}` : undefined,
      icon: School,
    },
    {
      label: "Department / Technology",
      value: teacherProfile?.department?.name || "Computer Science & Technology",
      sub: teacherProfile?.department?.code ? `Discipline: ${teacherProfile.department.code}` : undefined,
      icon: BookOpen,
    },
    {
      label: "Academic Designation",
      value: teacherProfile?.designation || "Instructor",
      sub: "Official Faculty Rank",
      icon: Briefcase,
    },
    {
      label: "Educational Qualification",
      value: teacherProfile?.qualification || "Not Specified",
      sub: "Degrees & Certifications",
      icon: BookOpen,
    },
    {
      label: "Teaching Shift",
      value: shiftText,
      sub: "Shift Schedule Assignment",
      icon: Clock,
    },
    {
      label: "Date of Joining",
      value: formatDate(teacherProfile?.dateOfJoining),
      sub: "Campus Appointment Date",
      icon: Calendar,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#e2e8e4] shadow-xs">
      <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-[#f0f4f1]">
        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
          <Briefcase className="w-4 h-4 text-[#c48b28]" />
        </div>
        <div>
          <h2 className="text-sm font-extrabold text-[#0f1f17]">
            Professional & Academic Appointment
          </h2>
          <p className="text-[11px] text-[#5a6b62]">
            Official faculty rank, discipline appointment, and teaching shifts
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
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#c48b28] flex items-center justify-center shrink-0 mt-0.5">
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

      {/* Faculty Bio / Summary */}
      {teacherProfile?.bio && (
        <div className="mt-5 p-4 rounded-xl bg-[#f8faf8] border border-[#e2ece5]">
          <div className="flex items-center gap-2 mb-2 text-[#0a4b32]">
            <FileText className="w-4 h-4 text-[#c48b28]" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Faculty Biography & Research Profile
            </h3>
          </div>
          <p className="text-xs text-[#2a3b31] leading-relaxed whitespace-pre-line">
            {teacherProfile.bio}
          </p>
        </div>
      )}
    </div>
  );
}

