"use client";

import React from "react";
import { ShieldAlert, KeyRound, Server, CheckCircle2, Lock, History } from "lucide-react";
import { UserProfile } from "@/types/user";

interface AdminSecurityInfoCardProps {
  profile: UserProfile;
}

export default function AdminSecurityInfoCard({
  profile,
}: AdminSecurityInfoCardProps) {
  const isSuperAdmin = profile.role === "SUPER_ADMIN";

  const securityBadges = [
    {
      label: "Privilege Tier",
      value: isSuperAdmin ? "Root Governance (Super Admin)" : "Institutional Admin",
      sub: "Unrestricted enterprise access level",
      icon: ShieldAlert,
    },
    {
      label: "Authentication Security",
      value: "JWT Access + Refresh Token Rotation",
      sub: "Http-only secure bearer perimeter",
      icon: KeyRound,
    },
    {
      label: "Institutional Perimeter",
      value: "Kishoreganj Polytechnic Institute",
      sub: "BTEB campus governance node",
      icon: Server,
    },
    {
      label: "Account Status",
      value: profile.status || "ACTIVE",
      sub: "Full system administrative rights",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#e2e8e4] shadow-xs">
      <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-[#f0f4f1]">
        <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center font-bold">
          <Lock className="w-4 h-4 text-purple-700" />
        </div>
        <div>
          <h2 className="text-sm font-extrabold text-[#0f1f17]">
            Security Perimeter & Governance Control
          </h2>
          <p className="text-[11px] text-[#5a6b62]">
            Cryptographic authentication, enterprise audit authorization, and system controls
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {securityBadges.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#fafbf9] border border-[#eef2ef] flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
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

      <div className="mt-5 p-4 rounded-xl bg-[#fbfcfb] border border-[#e5ebe6] flex items-center gap-3">
        <History className="w-5 h-5 text-[#0a4b32] shrink-0" />
        <div className="text-xs">
          <p className="font-bold text-[#0f1f17]">
            Enterprise System Audit Logging Enabled
          </p>
          <p className="text-[#5a6b62]">
            All administrative student approvals, faculty authorizations, and department updates are logged for compliance.
          </p>
        </div>
      </div>
    </div>
  );
}

