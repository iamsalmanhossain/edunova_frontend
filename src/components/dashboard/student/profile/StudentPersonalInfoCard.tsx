"use client";

import React from "react";
import { User, Phone, Mail, Droplet, Calendar, HeartHandshake, MapPin } from "lucide-react";
import { UserProfile } from "@/types/user";

interface StudentPersonalInfoCardProps {
  profile: UserProfile;
}

export default function StudentPersonalInfoCard({
  profile,
}: StudentPersonalInfoCardProps) {
  const student = profile.studentProfile;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "Not Provided";
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

  const infoFields = [
    {
      label: "Full Name",
      value: profile.name,
      icon: User,
    },
    {
      label: "Institutional Email",
      value: profile.email,
      icon: Mail,
    },
    {
      label: "Contact Phone",
      value: profile.phone || "Not Provided",
      icon: Phone,
    },
    {
      label: "Gender",
      value: student?.gender ? student.gender.charAt(0) + student.gender.slice(1).toLowerCase() : "Not Specified",
      icon: User,
    },
    {
      label: "Date of Birth",
      value: formatDate(student?.dateOfBirth),
      icon: Calendar,
    },
    {
      label: "Blood Group",
      value: student?.bloodGroup || "Not Specified",
      icon: Droplet,
    },
    {
      label: "Guardian / Father's Name",
      value: student?.guardianName || "Not Provided",
      icon: HeartHandshake,
    },
    {
      label: "Guardian Contact Phone",
      value: student?.guardianPhone || "Not Provided",
      icon: Phone,
    },
    {
      label: "Present Address",
      value: student?.address || "Not Provided",
      icon: MapPin,
      fullWidth: true,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#e2e8e4] shadow-xs">
      <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-[#f0f4f1]">
        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
          <User className="w-4 h-4 text-[#c48b28]" />
        </div>
        <div>
          <h2 className="text-sm font-extrabold text-[#0f1f17]">
            Personal Information & Guardian Details
          </h2>
          <p className="text-[11px] text-[#5a6b62]">
            Contact details, identification, and emergency guardian correspondence
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {infoFields.map((field, idx) => {
          const Icon = field.icon;
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl bg-[#fafbf9] border border-[#eef2ef] flex items-start gap-3 ${
                field.fullWidth ? "sm:col-span-2 lg:col-span-4" : ""
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#c48b28] flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-[#7a8c82] uppercase tracking-wider">
                  {field.label}
                </p>
                <p className="text-xs sm:text-sm font-bold text-[#0f1f17] break-words mt-0.5">
                  {field.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

