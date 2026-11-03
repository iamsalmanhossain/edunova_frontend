"use client";

import React from "react";
import { User, Mail, Phone, Calendar, ShieldCheck, Key } from "lucide-react";
import { UserProfile } from "@/types/user";

interface AdminPersonalInfoCardProps {
  profile: UserProfile;
}

export default function AdminPersonalInfoCard({
  profile,
}: AdminPersonalInfoCardProps) {
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

  const fields = [
    {
      label: "Administrator Name",
      value: profile.name,
      icon: User,
    },
    {
      label: "Governance Email",
      value: profile.email,
      icon: Mail,
    },
    {
      label: "Official Phone",
      value: profile.phone || "Not Provided",
      icon: Phone,
    },
    {
      label: "Account ID",
      value: profile.id,
      icon: Key,
    },
    {
      label: "Account Created At",
      value: formatDate(profile.createdAt),
      icon: Calendar,
    },
    {
      label: "Email Verification",
      value: profile.emailVerifiedAt ? "Verified Cryptographically" : "Verified",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#e2e8e4] shadow-xs">
      <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-[#f0f4f1]">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
          <User className="w-4 h-4 text-[#0a4b32]" />
        </div>
        <div>
          <h2 className="text-sm font-extrabold text-[#0f1f17]">
            Administrative Identity Records
          </h2>
          <p className="text-[11px] text-[#5a6b62]">
            System administrator details, official correspondence contact, and credentials
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map((field, idx) => {
          const Icon = field.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#fafbf9] border border-[#eef2ef] flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0a4b32] flex items-center justify-center shrink-0 mt-0.5">
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

