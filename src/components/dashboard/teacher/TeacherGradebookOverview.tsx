"use client";

import React from "react";
import { ClipboardCheck, AlertTriangle, FileSpreadsheet } from "lucide-react";

export default function TeacherGradebookOverview() {
  const pendingAssessments = [
    {
      course: "Microprocessor & Interfacing (66651)",
      semester: "4th Sem CST (Shift 1)",
      type: "Practical Lab Quiz 2",
      totalStudents: 52,
      submittedCount: 52,
      status: "Ready for Publication",
      badge: "bg-emerald-100 text-emerald-800",
    },
    {
      course: "Computer Architecture & Organization",
      semester: "4th Sem CST (Shift 2)",
      type: "Midterm Continuous Assessment",
      totalStudents: 48,
      submittedCount: 36,
      status: "12 Marks Pending",
      badge: "bg-amber-100 text-amber-800",
    },
  ];

  const defaulters = [
    { roll: "619803", name: "Sabbir Hossain", attendance: "68.4%", status: "Non-Collegiate Alert" },
    { roll: "619827", name: "Rakib Chowdhury", attendance: "71.0%", status: "Warning Issued" },
  ];

  return (
    <div className="space-y-4">
      {/* Assessment Submissions */}
      <div className="bg-white rounded-2xl p-5 border border-[#e2e8e4] shadow-xs space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-[#f0f4f1]">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-[#0a4b32]" />
            <h3 className="text-xs sm:text-sm font-bold text-[#0f1f17]">
              Semester Continuous Assessment & Marks
            </h3>
          </div>
          <span className="text-[10px] text-[#5a6b62]">BTEB Midterm Term 2026</span>
        </div>

        <div className="space-y-2">
          {pendingAssessments.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#f7faf8] border border-[#e8efe9] space-y-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#0f1f17]">{item.course}</h4>
                  <p className="text-[10px] text-[#5a6b62]">{item.semester} • {item.type}</p>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${item.badge}`}>
                  {item.status}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-[#e2e8e4]/60 text-xs">
                <span className="text-[11px] text-[#5a6b62]">
                  Graded: <strong className="text-[#0f1f17]">{item.submittedCount}/{item.totalStudents}</strong>
                </span>
                <button
                  type="button"
                  className="text-[11px] font-bold text-[#0a4b32] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3 h-3" />
                  <span>Open Mark Sheet</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Defaulters Watchlist */}
      <div className="bg-white rounded-2xl p-5 border border-[#e2e8e4] shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#f0f4f1]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs sm:text-sm font-bold text-[#0f1f17]">
              Low Attendance Watchlist (&lt; 75%)
            </h3>
          </div>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
            2 Students
          </span>
        </div>

        <div className="space-y-1.5">
          {defaulters.map((d) => (
            <div
              key={d.roll}
              className="flex items-center justify-between p-2 rounded-xl bg-red-50/50 border border-red-100 text-xs"
            >
              <div>
                <span className="font-mono font-bold text-[#0f1f17] text-[11px]">{d.roll}</span>
                <span className="text-xs text-[#5a6b62] ml-2 font-medium">{d.name}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-red-600 block">{d.attendance}</span>
                <span className="text-[9px] text-amber-700 font-semibold">{d.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
