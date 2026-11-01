"use client";

import React, { useState } from "react";
import { CheckCircle2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudentAttendanceRecord {
  roll: string;
  name: string;
  present: boolean;
}

export default function TeacherAttendanceAction() {
  const [submitted, setSubmitted] = useState(false);
  const [students, setStudents] = useState<StudentAttendanceRecord[]>([
    { roll: "619801", name: "Tanvir Ahmed", present: true },
    { roll: "619802", name: "Fatima Akter", present: true },
    { roll: "619803", name: "Sabbir Hossain", present: false },
    { roll: "619804", name: "Ayesha Siddiqua", present: true },
    { roll: "619805", name: "Mehedi Hasan", present: true },
  ]);

  const toggleStatus = (roll: string) => {
    if (submitted) return;
    setStudents((prev) =>
      prev.map((s) => (s.roll === roll ? { ...s, present: !s.present } : s))
    );
  };

  const presentCount = students.filter((s) => s.present).length;
  const absentCount = students.length - presentCount;

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#e2e8e4] shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#f0f4f1]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#0f1f17]">
              Live Lecture Attendance Sheet
            </h3>
            <p className="text-[10px] text-[#5a6b62]">
              Microprocessor & Interfacing (66651) • 4th Sem CST (Shift 1)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
            Present: {presentCount}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-700 font-bold border border-red-200">
            Absent: {absentCount}
          </span>
        </div>
      </div>

      {submitted ? (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">
              Today&apos;s attendance submitted to academic registry ({presentCount}/{students.length} present).
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSubmitted(false)}
            className="h-6 text-[10px] text-[#0a4b32] border-[#0a4b32]/30 cursor-pointer"
          >
            Edit Sheet
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-1.5">
            {students.map((student) => (
              <div
                key={student.roll}
                className="flex items-center justify-between p-2 rounded-xl bg-[#f7faf8] border border-[#e8efe9] text-xs hover:border-[#0a4b32]/30 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono font-bold text-[#0a4b32] text-[11px] w-14 shrink-0">
                    {student.roll}
                  </span>
                  <span className="font-medium text-[#0f1f17] truncate">{student.name}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleStatus(student.roll)}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                      student.present
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                    }`}
                  >
                    P
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleStatus(student.roll)}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                      !student.present
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white text-red-700 border-red-300 hover:bg-red-50"
                    }`}
                  >
                    A
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[10px] text-[#5a6b62]">
              Tap P (Present) or A (Absent) then finalize submission
            </span>
            <Button
              onClick={() => setSubmitted(true)}
              className="h-8 text-xs bg-[#0a4b32] hover:bg-[#073825] text-white font-bold cursor-pointer"
            >
              Submit Attendance
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
