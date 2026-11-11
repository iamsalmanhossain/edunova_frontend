"use client";

import React from "react";
import { Clock, ShieldAlert, CheckCircle2 } from "lucide-react";

interface TeacherApprovalAlertProps {
  status?: string;
  instituteName?: string;
}

export default function TeacherApprovalAlert({
  status = "APPROVED",
  instituteName = "Kishoreganj Polytechnic Institute",
}: TeacherApprovalAlertProps) {
  if (status !== "PENDING") return null;

  return (
    <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-400/40 p-3 sm:p-4 text-amber-950 shadow-xs flex items-start sm:items-center justify-between gap-3 animate-in fade-in">
      <div className="flex items-start sm:items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
          <Clock className="w-4 h-4 text-amber-700 animate-pulse" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-xs sm:text-sm font-bold text-amber-900 leading-tight">
              Faculty Verification: Under Institutional Review
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-200/80 text-amber-900 border border-amber-300">
              Pending Clearance
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-amber-800/85 mt-0.5 leading-relaxed">
            Your instructor profile for <span className="font-semibold text-amber-950">{instituteName}</span> is active. Full mark submission permissions will activate upon Principal or HOD authorization.
          </p>
        </div>
      </div>
    </div>
  );
}
