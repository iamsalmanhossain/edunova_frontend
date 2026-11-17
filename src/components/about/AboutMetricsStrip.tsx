"use client";

import React from "react";
import { Layers, GraduationCap, Users, ShieldCheck } from "lucide-react";
import Container from "@/components/shared/Container";

export default function AboutMetricsStrip() {
  return (
    <div className="relative -mt-6 sm:-mt-10 z-20">
      <Container size="wide">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-[#e2e8e4] shadow-sm flex items-center gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#eef5f1] text-[#0a4b32] flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-base font-extrabold text-[#0f1f17]">4 Departments</p>
              <p className="text-[10px] sm:text-xs text-gray-500 truncate">CST, FOOD, ENT, RAC</p>
            </div>
          </div>

          <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-[#e2e8e4] shadow-sm flex items-center gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-base font-extrabold text-[#0f1f17]">8 Semesters</p>
              <p className="text-[10px] sm:text-xs text-gray-500 truncate">4-Year BTEB Diploma</p>
            </div>
          </div>

          <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-[#e2e8e4] shadow-sm flex items-center gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-base font-extrabold text-[#0f1f17]">Dual Shifts</p>
              <p className="text-[10px] sm:text-xs text-gray-500 truncate">1st &amp; 2nd Shift Intake</p>
            </div>
          </div>

          <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-[#e2e8e4] shadow-sm flex items-center gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-base font-extrabold text-[#0f1f17]">BTEB Accredited</p>
              <p className="text-[10px] sm:text-xs text-gray-500 truncate">Practical Engineering</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
