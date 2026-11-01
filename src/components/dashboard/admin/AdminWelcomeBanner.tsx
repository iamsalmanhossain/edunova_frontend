"use client";

import React from "react";

interface AdminWelcomeBannerProps {
  adminName: string;
  instituteName?: string;
  apiStatusText?: string;
}

export default function AdminWelcomeBanner({
  adminName,
  instituteName = "Kishoreganj Polytechnic Institute",
  apiStatusText = "API v1 Connected",
}: AdminWelcomeBannerProps) {
  return (
    <div className="bg-gradient-to-r from-[#073825] to-[#0a4b32] rounded-2xl p-5 sm:p-7 text-white shadow-md relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[11px] font-semibold mb-2 backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c48b28]" />
            <span>Administrative Operations • {instituteName}</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            System Admin Console — {adminName}
          </h2>
          <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-2xl leading-relaxed">
            Unified governance dashboard for student admissions, teacher verifications, academic shifts, and enterprise infrastructure management.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-mono text-emerald-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {apiStatusText}
          </span>
        </div>
      </div>
    </div>
  );
}

