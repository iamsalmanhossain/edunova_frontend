"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  Users,
  Send,
  Loader2,
  AlertCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { teacherService } from "@/services/teacher.service";
import {
  TeacherSubject,
  AttendanceEligibleStudent,
  AttendanceRecordItem,
} from "@/types/teacher";

interface TakeAttendanceCardProps {
  departmentId: string;
  defaultSemester?: number;
  onAttendanceSaved?: () => void;
  onOpenPreEnrollModal?: () => void;
}

export default function TakeAttendanceCard({
  departmentId,
  defaultSemester = 1,
  onAttendanceSaved,
  onOpenPreEnrollModal,
}: TakeAttendanceCardProps) {
  const [semester, setSemester] = useState<number>(defaultSemester);
  const [subjects, setSubjects] = useState<TeacherSubject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [date, setDate] = useState<string>(() => new Date().toISOString().split("T")[0]);
  const [type, setType] = useState<"THEORY" | "PRACTICAL">("THEORY");
  const [sessionRemarks, setSessionRemarks] = useState<string>("");

  const [students, setStudents] = useState<AttendanceEligibleStudent[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<
    Record<string, { status: "PRESENT" | "ABSENT"; remarks: string }>
  >({});

  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load subjects whenever semester or departmentId changes
  useEffect(() => {
    let mounted = true;
    async function loadSubjects() {
      if (!departmentId) return;
      try {
        setLoadingSubjects(true);
        const list = await teacherService.getSubjects(departmentId, semester);
        if (mounted) {
          setSubjects(list);
          if (list.length > 0) {
            setSelectedSubjectId(list[0].id);
          } else {
            setSelectedSubjectId("");
            setStudents([]);
          }
        }
      } catch (err: unknown) {
        console.error("Failed to load subjects", err);
      } finally {
        if (mounted) setLoadingSubjects(false);
      }
    }
    loadSubjects();
    return () => {
      mounted = false;
    };
  }, [departmentId, semester]);

  // Load eligible students whenever selectedSubjectId or semester changes
  useEffect(() => {
    let mounted = true;

    async function loadStudents() {
      if (!selectedSubjectId) {
        return;
      }

      // Guard against race conditions: verify the selected subject belongs to current semester
      const activeSubject = subjects.find((s) => s.id === selectedSubjectId);
      if (!activeSubject || activeSubject.semester !== semester) {
        return;
      }

      const targetSemester = activeSubject.semester;

      try {
        setLoadingStudents(true);
        setError(null);
        const res = await teacherService.getEligibleAttendanceStudents(
          selectedSubjectId,
          targetSemester
        );
        if (mounted) {
          const list = res.students || [];
          setStudents(list);

          // Default all students to PRESENT
          const initialRecord: Record<
            string,
            { status: "PRESENT" | "ABSENT"; remarks: string }
          > = {};
          list.forEach((s) => {
            initialRecord[s.id] = { status: "PRESENT", remarks: "" };
          });
          setAttendanceRecords(initialRecord);
          setLoadingStudents(false);
        }
      } catch (err: unknown) {
        console.error("Failed to load attendance students", err);
        if (mounted) {
          const errObj = err as { message?: string };
          setError(errObj.message || "Failed to load eligible students for this subject.");
          setLoadingStudents(false);
        }
      }
    }

    loadStudents();
    return () => {
      mounted = false;
    };
  }, [selectedSubjectId, semester, subjects]);

  // Quick Batch Handlers
  const handleMarkAll = (status: "PRESENT" | "ABSENT") => {
    setAttendanceRecords((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((id) => {
        next[id] = { ...next[id], status };
      });
      return next;
    });
  };

  const handleInvertAll = () => {
    setAttendanceRecords((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((id) => {
        next[id] = {
          ...next[id],
          status: next[id].status === "PRESENT" ? "ABSENT" : "PRESENT",
        };
      });
      return next;
    });
  };

  const handleToggleStudent = (studentId: string) => {
    setAttendanceRecords((prev) => {
      const cur = prev[studentId]?.status || "PRESENT";
      return {
        ...prev,
        [studentId]: {
          ...prev[studentId],
          status: cur === "PRESENT" ? "ABSENT" : "PRESENT",
        },
      };
    });
  };

  const handleStudentRemark = (studentId: string, remarks: string) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  // Live Stats calculation
  const totalStudents = students.length;
  const presentCount = Object.values(attendanceRecords).filter(
    (r) => r.status === "PRESENT"
  ).length;
  const absentCount = totalStudents - presentCount;
  const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  // Submit attendance session
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!selectedSubjectId) {
      setError("Please select an academic subject before proceeding.");
      return;
    }
    if (students.length === 0) {
      setError("No students found in this roster. Please pre-enroll students or check the semester.");
      return;
    }

    setSubmitting(true);
    try {
      const records: AttendanceRecordItem[] = students.map((s) => ({
        studentId: s.id, // studentProfileId
        status: attendanceRecords[s.id]?.status || "PRESENT",
        remarks: attendanceRecords[s.id]?.remarks?.trim() || undefined,
      }));

      await teacherService.createAttendanceSession({
        subjectId: selectedSubjectId,
        semester: Number(semester),
        date,
        type,
        remarks: sessionRemarks.trim() || undefined,
        records,
      });

      setSuccessMsg(
        `Attendance recorded successfully! Present: ${presentCount}, Absent: ${absentCount} (${attendanceRate}%)`
      );
      onAttendanceSaved?.();

      setTimeout(() => {
        setSuccessMsg(null);
      }, 4000);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to submit attendance session.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#dce3df] shadow-xs overflow-hidden">
      {/* Header bar */}
      <div className="p-5 sm:p-6 border-b border-[#eef2ef] bg-[#fafbf9] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-[#0f1f17]">
              Daily Digital Roll Call &amp; Attendance Entry
            </h2>
          </div>
          <p className="text-xs text-[#5a6b62] mt-1">
            Select semester, course subject, and session date to record attendance
          </p>
        </div>

        {/* Attendance Live Counter Widget */}
        <div className="flex items-center gap-2 sm:gap-3 bg-white px-3 sm:px-4 py-2 rounded-2xl border border-[#e2e8e4] shadow-2xs">
          <div className="text-center px-2">
            <span className="text-[10px] text-[#5a6b62] uppercase font-bold block">Total</span>
            <span className="text-sm font-extrabold text-[#0f1f17]">{totalStudents}</span>
          </div>
          <div className="w-px h-6 bg-[#eef2ef]" />
          <div className="text-center px-2">
            <span className="text-[10px] text-emerald-600 uppercase font-bold block">Present</span>
            <span className="text-sm font-extrabold text-emerald-700">{presentCount}</span>
          </div>
          <div className="w-px h-6 bg-[#eef2ef]" />
          <div className="text-center px-2">
            <span className="text-[10px] text-red-600 uppercase font-bold block">Absent</span>
            <span className="text-sm font-extrabold text-red-600">{absentCount}</span>
          </div>
          <div className="w-px h-6 bg-[#eef2ef]" />
          <div className="text-center px-2">
            <span className="text-[10px] text-[#c48b28] uppercase font-bold block">Rate</span>
            <span className="text-sm font-extrabold text-[#0a4b32]">{attendanceRate}%</span>
          </div>
        </div>
      </div>

      {/* Form Controls */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
        {error && (
          <div className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl animate-in fade-in">
            <Sparkles className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        {/* Filter Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#f9fbf9] border border-[#eef2ef]">
          {/* Semester Selector */}
          <div>
            <label className="block text-xs font-bold text-[#0f1f17] mb-1.5">
              Semester Level *
            </label>
            <select
              value={semester}
              onChange={(e) => {
                const newSem = Number(e.target.value);
                setSemester(newSem);
                setSelectedSubjectId("");
                setStudents([]);
              }}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-[#dce3df] bg-white focus:outline-none focus:ring-2 focus:ring-[#0a4b32]"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Semester {s} ({s === 1 ? "1st" : s === 2 ? "2nd" : s === 3 ? "3rd" : `${s}th`})
                </option>
              ))}
            </select>
          </div>

          {/* Subject Selector */}
          <div>
            <label className="block text-xs font-bold text-[#0f1f17] mb-1.5 flex items-center justify-between">
              <span>Course / Subject *</span>
              {loadingSubjects && <Loader2 className="w-3 h-3 animate-spin text-[#0a4b32]" />}
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              disabled={loadingSubjects || subjects.length === 0}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-[#dce3df] bg-white focus:outline-none focus:ring-2 focus:ring-[#0a4b32] disabled:bg-slate-100"
            >
              {subjects.length === 0 ? (
                <option value="">No subjects offered in this semester</option>
              ) : (
                subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.code} - {sub.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-[#0f1f17] mb-1.5">
              Session Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-[#dce3df] bg-white focus:outline-none focus:ring-2 focus:ring-[#0a4b32]"
            />
          </div>

          {/* Class Type */}
          <div>
            <label className="block text-xs font-bold text-[#0f1f17] mb-1.5">
              Class Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType("THEORY")}
                className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  type === "THEORY"
                    ? "bg-[#0a4b32] text-white border-[#0a4b32] shadow-xs"
                    : "bg-white text-[#5a6b62] border-[#dce3df] hover:bg-slate-50"
                }`}
              >
                THEORY
              </button>
              <button
                type="button"
                onClick={() => setType("PRACTICAL")}
                className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  type === "PRACTICAL"
                    ? "bg-[#0a4b32] text-white border-[#0a4b32] shadow-xs"
                    : "bg-white text-[#5a6b62] border-[#dce3df] hover:bg-slate-50"
                }`}
              >
                PRACTICAL
              </button>
            </div>
          </div>
        </div>

        {/* Quick Batch Actions & Pre-enroll Callout */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#5a6b62]">Quick Actions:</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleMarkAll("PRESENT")}
              className="h-7 text-xs border-emerald-200 text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
            >
              Mark All Present
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleMarkAll("ABSENT")}
              className="h-7 text-xs border-red-200 text-red-800 bg-red-50 hover:bg-red-100"
            >
              Mark All Absent
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleInvertAll}
              className="h-7 text-xs border-slate-200 text-[#5a6b62] hover:bg-slate-100 gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Invert
            </Button>
          </div>

          {onOpenPreEnrollModal && (
            <button
              type="button"
              onClick={onOpenPreEnrollModal}
              className="text-xs font-bold text-[#0a4b32] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              Missing students? Pre-enroll now
            </button>
          )}
        </div>

        {/* Student Roster Cards */}
        {loadingStudents ? (
          <div className="space-y-2 pt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="grid grid-cols-12 items-center px-4 py-3 bg-white border border-[#f0f4f1] rounded-2xl gap-3"
              >
                <div className="col-span-2 sm:col-span-1">
                  <Skeleton className="h-4 w-10 font-mono" />
                </div>
                <div className="col-span-4 sm:col-span-5 flex items-center gap-2.5">
                  <Skeleton className="w-7 h-7 rounded-full shrink-0" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-2.5 w-40" />
                  </div>
                </div>
                <div className="col-span-3 sm:col-span-3">
                  <Skeleton className="h-7 w-full rounded-lg" />
                </div>
                <div className="col-span-3 sm:col-span-3 flex justify-end">
                  <Skeleton className="h-7 w-20 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : students.length === 0 ? (
          <div className="py-12 text-center rounded-2xl border-2 border-dashed border-[#e2e8e4] p-8 space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-[#0f1f17]">
              No students enrolled for Semester {semester}
            </p>
            <p className="text-xs text-[#5a6b62] max-w-md mx-auto">
              Please use the Pre-Enrollment tool to register students for Semester {semester} or select another semester.
            </p>
            {onOpenPreEnrollModal && (
              <Button
                type="button"
                onClick={onOpenPreEnrollModal}
                className="bg-[#0a4b32] text-white hover:bg-[#073825] text-xs font-bold"
              >
                Pre-Enroll Students
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-12 px-4 py-2 text-[11px] font-bold text-[#5a6b62] uppercase tracking-wider bg-[#f4f7f5] rounded-xl">
              <span className="col-span-2 sm:col-span-1">Roll No</span>
              <span className="col-span-4 sm:col-span-5">Student Information</span>
              <span className="col-span-3 sm:col-span-3">Remarks / Notes</span>
              <span className="col-span-3 sm:col-span-3 text-right">Attendance Status</span>
            </div>

            <div className="divide-y divide-[#f0f4f1] border border-[#eef2ef] rounded-2xl overflow-hidden">
              {students.map((student) => {
                const isPresent = attendanceRecords[student.id]?.status === "PRESENT";
                return (
                  <div
                    key={student.id}
                    className={`grid grid-cols-12 items-center px-4 py-2.5 transition-colors ${
                      isPresent ? "bg-white hover:bg-emerald-50/30" : "bg-red-50/40 hover:bg-red-50/60"
                    }`}
                  >
                    {/* Roll */}
                    <div className="col-span-2 sm:col-span-1">
                      <span className="font-mono font-extrabold text-xs text-[#0a4b32]">
                        {student.rollNo}
                      </span>
                    </div>

                    {/* Student Info */}
                    <div className="col-span-4 sm:col-span-5 flex items-center gap-2.5 min-w-0 pr-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                          isPresent
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {student.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#0f1f17] truncate leading-tight">
                          {student.user.name}
                        </p>
                        <p className="text-[10px] text-[#5a6b62] truncate">
                          {student.registrationNo ? `Reg: ${student.registrationNo}` : student.user.email}
                        </p>
                      </div>
                    </div>

                    {/* Remarks Input */}
                    <div className="col-span-3 sm:col-span-3 pr-2">
                      <input
                        type="text"
                        placeholder="e.g. Late 10m"
                        value={attendanceRecords[student.id]?.remarks || ""}
                        onChange={(e) => handleStudentRemark(student.id, e.target.value)}
                        className="w-full px-2.5 py-1 text-xs rounded-lg border border-[#e2e8e4] bg-white focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                      />
                    </div>

                    {/* Present / Absent Button */}
                    <div className="col-span-3 sm:col-span-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleToggleStudent(student.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
                          isPresent
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        }`}
                      >
                        {isPresent ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>PRESENT</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>ABSENT</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Global Remarks & Submit */}
        <div className="pt-4 border-t border-[#eef2ef] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:max-w-md">
            <input
              type="text"
              placeholder="Session notes or chapter covered (optional)"
              value={sessionRemarks}
              onChange={(e) => setSessionRemarks(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#dce3df] bg-[#fafbf9] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
            />
          </div>

          <Button
            type="submit"
            disabled={submitting || students.length === 0}
            className="w-full sm:w-auto bg-[#0a4b32] hover:bg-[#073825] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-[#0a4b32]/10 gap-2 cursor-pointer"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {submitting ? "Submitting Session..." : "Submit Attendance Session"}
          </Button>
        </div>
      </form>
    </div>
  );
}
