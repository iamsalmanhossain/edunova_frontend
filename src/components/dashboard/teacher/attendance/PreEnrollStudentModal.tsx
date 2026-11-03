"use client";

import React, { useState } from "react";
import { X, Plus, Trash2, UserPlus, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { teacherService } from "@/services/teacher.service";
import { PreEnrollStudentItem } from "@/types/teacher";

interface PreEnrollStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultSemester?: number;
}

interface StudentRow extends PreEnrollStudentItem {
  id: string; // local temporary key
}

export default function PreEnrollStudentModal({
  isOpen,
  onClose,
  onSuccess,
  defaultSemester = 1,
}: PreEnrollStudentModalProps) {
  const [semester, setSemester] = useState<number>(defaultSemester);
  const [session, setSession] = useState<string>("2024-2025");
  const [students, setStudents] = useState<StudentRow[]>([
    {
      id: "row-1",
      name: "",
      rollNo: "",
      registrationNo: "",
      phone: "",
      gender: "MALE",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddRow = () => {
    setStudents((prev) => [
      ...prev,
      {
        id: `row-${Date.now()}`,
        name: "",
        rollNo: "",
        registrationNo: "",
        phone: "",
        gender: "MALE",
      },
    ]);
  };

  const handleRemoveRow = (id: string) => {
    if (students.length === 1) return;
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const handleFieldChange = (id: string, field: keyof PreEnrollStudentItem, val: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: val } : s))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessResult(null);

    // Validation
    const invalidRow = students.find((s) => !s.name.trim() || !s.rollNo.trim());
    if (invalidRow) {
      setError("Every student must have a valid full name and class/board roll number.");
      return;
    }

    setLoading(true);
    try {
      const payloadStudents: PreEnrollStudentItem[] = students.map((s) => ({
        name: s.name.trim(),
        rollNo: s.rollNo.trim(),
        registrationNo: s.registrationNo?.trim() || undefined,
        phone: s.phone?.trim() || undefined,
        gender: s.gender || "MALE",
        guardianName: s.guardianName?.trim() || undefined,
        guardianPhone: s.guardianPhone?.trim() || undefined,
      }));

      const res = await teacherService.preEnrollStudents({
        semester: Number(semester),
        session: session.trim() || undefined,
        students: payloadStudents,
      });

      setSuccessResult(
        `Successfully pre-enrolled ${res.enrolledCount} student(s)! ${
          res.skippedCount > 0 ? `(${res.skippedCount} were already enrolled)` : ""
        }`
      );

      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to pre-enroll students. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-[#dce3df] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eef2ef] bg-[#f9fbf9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0a4b32] flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0f1f17]">
                Student Pre-Enrollment Roster
              </h2>
              <p className="text-xs text-[#5a6b62]">
                Enroll new students to make them eligible for attendance and academic tracking
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successResult && (
            <div className="flex items-center gap-2 p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successResult}</span>
            </div>
          )}

          {/* Academic Semester & Session */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#fafbf9] border border-[#eef2ef]">
            <div>
              <label className="block text-xs font-bold text-[#0f1f17] mb-1.5">
                Target Semester *
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-[#dce3df] bg-white focus:outline-none focus:ring-2 focus:ring-[#0a4b32]"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s} ({s === 1 ? "1st" : s === 2 ? "2nd" : s === 3 ? "3rd" : `${s}th`})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0f1f17] mb-1.5">
                Academic Session
              </label>
              <input
                type="text"
                value={session}
                onChange={(e) => setSession(e.target.value)}
                placeholder="2024-2025"
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-[#dce3df] bg-white focus:outline-none focus:ring-2 focus:ring-[#0a4b32]"
              />
            </div>
          </div>

          {/* Students Roster Entry Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#0f1f17] uppercase tracking-wider">
                Student Entries ({students.length})
              </h3>
              <Button
                type="button"
                onClick={handleAddRow}
                variant="outline"
                size="sm"
                className="h-7 text-xs border-[#dce3df] text-[#0a4b32] hover:bg-emerald-50 gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Another Row
              </Button>
            </div>

            <div className="space-y-2.5">
              {students.map((student, idx) => (
                <div
                  key={student.id}
                  className="p-3 bg-white rounded-2xl border border-[#eef2ef] shadow-2xs hover:border-emerald-200 transition-all flex flex-col md:flex-row items-center gap-2.5"
                >
                  <div className="w-6 h-6 rounded-full bg-[#f0f4f1] text-[#0a4b32] font-bold text-[10px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 flex-1 w-full">
                    <div>
                      <input
                        type="text"
                        placeholder="Full Student Name *"
                        value={student.name}
                        onChange={(e) => handleFieldChange(student.id, "name", e.target.value)}
                        required
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Board Roll No *"
                        value={student.rollNo}
                        onChange={(e) => handleFieldChange(student.id, "rollNo", e.target.value)}
                        required
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Registration No (Optional)"
                        value={student.registrationNo || ""}
                        onChange={(e) =>
                          handleFieldChange(student.id, "registrationNo", e.target.value)
                        }
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={student.phone || ""}
                        onChange={(e) => handleFieldChange(student.id, "phone", e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveRow(student.id)}
                    disabled={students.length === 1}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-30 cursor-pointer shrink-0"
                    title="Remove row"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-[#eef2ef] flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="border-[#dce3df] text-[#5a6b62]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#0a4b32] hover:bg-[#073825] text-white gap-2 cursor-pointer"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Enrolling..." : "Confirm Pre-Enrollment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
