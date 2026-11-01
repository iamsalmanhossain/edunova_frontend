"use client";

import React from "react";
import { CreditCard, CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentFeeStatus() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#e2e8e4] shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#f0f4f1]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0a4b32] flex items-center justify-center font-bold">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#0f1f17]">
              Semester Tuition & Dues Clearance
            </h3>
            <p className="text-[10px] text-[#5a6b62]">
              BTEB Academic Session 2026–2027 • 4th Semester CST
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
          Fees Cleared
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-2.5 rounded-xl bg-[#f7faf8] border border-[#e8efe9]">
          <span className="text-[10px] text-[#5a6b62] font-semibold block">Semester Tuition</span>
          <span className="text-sm font-extrabold text-[#0a4b32]">৳ 4,500</span>
          <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">Paid in Full</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#f7faf8] border border-[#e8efe9]">
          <span className="text-[10px] text-[#5a6b62] font-semibold block">Midterm Exam Fee</span>
          <span className="text-sm font-extrabold text-[#0a4b32]">৳ 850</span>
          <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">Cleared</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#f7faf8] border border-[#e8efe9]">
          <span className="text-[10px] text-[#5a6b62] font-semibold block">Lab & Workshop</span>
          <span className="text-sm font-extrabold text-[#0a4b32]">৳ 1,200</span>
          <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">Waived (Merit)</span>
        </div>
        <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80">
          <span className="text-[10px] text-amber-800 font-semibold block">Current Dues</span>
          <span className="text-sm font-extrabold text-emerald-700">৳ 0.00</span>
          <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">Eligible for Admit</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 text-xs">
        <div className="flex items-center gap-1.5 text-[#5a6b62] text-[11px]">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Electronic Admit Card has been generated for Midterm Exams</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-[11px] font-bold text-[#0a4b32] border-[#0a4b32]/30 hover:bg-[#0a4b32] hover:text-white cursor-pointer"
        >
          <Download className="w-3 h-3 mr-1" />
          Download Admit
        </Button>
      </div>
    </div>
  );
}
