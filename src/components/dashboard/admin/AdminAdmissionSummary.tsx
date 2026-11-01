"use client";

import React from "react";
import { TrendingUp } from "lucide-react";

export default function AdminAdmissionSummary() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#e2e8e4] shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#f0f4f1]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#0f1f17]">
              Shift Enrollments & Institutional Revenue
            </h3>
            <p className="text-[10px] text-[#5a6b62]">
              Academic Session 2026–2027 • All 4 Engineering Disciplines
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
          98.2% Collection
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 rounded-xl bg-[#f7faf8] border border-[#e8efe9]">
          <span className="text-[10px] text-[#5a6b62] font-semibold block">Shift 1 (Morning)</span>
          <span className="text-base font-extrabold text-[#0a4b32]">640</span>
          <span className="text-[9px] text-[#5a6b62] block mt-0.5">Enrolled Students</span>
        </div>
        <div className="p-3 rounded-xl bg-[#f7faf8] border border-[#e8efe9]">
          <span className="text-[10px] text-[#5a6b62] font-semibold block">Shift 2 (Day)</span>
          <span className="text-base font-extrabold text-[#0a4b32]">610</span>
          <span className="text-[9px] text-[#5a6b62] block mt-0.5">Enrolled Students</span>
        </div>
        <div className="p-3 rounded-xl bg-[#f7faf8] border border-[#e8efe9]">
          <span className="text-[10px] text-[#5a6b62] font-semibold block">Total Revenue</span>
          <span className="text-base font-extrabold text-[#0a4b32]">৳ 54.2L</span>
          <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">BTEB + Local Fees</span>
        </div>
        <div className="p-3 rounded-xl bg-[#f7faf8] border border-[#e8efe9]">
          <span className="text-[10px] text-[#5a6b62] font-semibold block">Pending Dues</span>
          <span className="text-base font-extrabold text-amber-700">৳ 95,000</span>
          <span className="text-[9px] text-amber-700 font-bold block mt-0.5">42 Accounts</span>
        </div>
      </div>
    </div>
  );
}
