"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  Users,
  Send,
  Loader2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Search,
  X,
  Calendar,
  BookOpen,
  Filter,
  MessageSquare,
  ChevronDown,
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

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PRESENT" | "ABSENT">("ALL");

  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [duplicateSessionWarning, setDuplicateSessionWarning] = useState<string | null>(null);
  const [checkingExistingSession, setCheckingExistingSession] = useState(false);

  // Check if attendance already exists for this subject, semester, date and type
  useEffect(() => {
    let mounted = true;
    if (!selectedSubjectId || !date) {
      setDuplicateSessionWarning(null);
      return;
    }

    async function checkExistingAttendance() {
      try {
        setCheckingExistingSession(true);
        const res = await teacherService.getAttendanceHistory({
          subjectId: selectedSubjectId,
          semester: Number(semester),
          startDate: date,
          endDate: date,
          type,
        });

        if (mounted) {
          const sessions = res?.sessions || [];
          const exists = sessions.some((s) => {
            const sDate = s.date?.split("T")[0];
            return (
              sDate === date &&
              (s.type === type || (type === "PRACTICAL" && (s.type as string) === "LAB"))
            );
          });

          if (exists) {
            const activeSub = subjects.find((s) => s.id === selectedSubjectId);
            const typeLabel = type === "PRACTICAL" ? "Practical (ব্যবহারিক)" : "Theory (তত্ত্বীয়)";
            setDuplicateSessionWarning(
              `এই তারিখে (${date}) '${activeSub?.name || "এই কোর্সের"}' ${typeLabel} উপস্থিতি ইতিমধ্যে গ্রহণ করা হয়েছে। একই তারিখে পুনরায় একই বিষয়ের হাজিরা দেওয়া যাবে না।`
            );
          } else {
            setDuplicateSessionWarning(null);
          }
        }
      } catch {
        if (mounted) setDuplicateSessionWarning(null);
      } finally {
        if (mounted) setCheckingExistingSession(false);
      }
    }

    checkExistingAttendance();

    return () => {
      mounted = false;
    };
  }, [selectedSubjectId, date, semester, type, subjects]);

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

  // Filtered students based on search query and status tab
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // 1. Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const nameMatch = student.user?.name?.toLowerCase().includes(query);
        const rollMatch = student.rollNo?.toLowerCase().includes(query);
        const regMatch = student.registrationNo?.toLowerCase().includes(query);
        const emailMatch = student.user?.email?.toLowerCase().includes(query);
        if (!nameMatch && !rollMatch && !regMatch && !emailMatch) {
          return false;
        }
      }

      // 2. Status filter
      if (statusFilter !== "ALL") {
        const currentStatus = attendanceRecords[student.id]?.status || "PRESENT";
        if (currentStatus !== statusFilter) {
          return false;
        }
      }

      return true;
    });
  }, [students, searchQuery, statusFilter, attendanceRecords]);

  // Submit attendance session
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!selectedSubjectId) {
      setError("Please select an academic subject before proceeding.");
      return;
    }
    if (duplicateSessionWarning) {
      setError(duplicateSessionWarning);
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
      }, 5000);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to submit attendance session.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#dce3df] shadow-xs overflow-hidden">
      {/* Header bar */}
      <div className="p-4 sm:p-6 border-b border-[#eef2ef] bg-[#fafbf9]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-emerald-100 text-[#0a4b32]">
                <CheckCircle2 className="w-4 h-4 text-emerald-800" />
              </span>
              <h2 className="text-base sm:text-lg font-black text-[#0f1f17] tracking-tight">
                Daily Digital Attendance &amp; Roll Call
              </h2>
            </div>
            <p className="text-xs text-[#5a6b62] mt-1">
              Select semester, subject, and date to record and submit student attendance
            </p>
          </div>

          {/* Attendance Live Counter Widget */}
          <div className="flex items-center justify-between sm:justify-start gap-2 bg-white px-3 sm:px-4 py-2 rounded-2xl border border-[#e2e8e4] shadow-2xs self-stretch lg:self-auto">
            <div className="text-center px-2 flex-1 sm:flex-initial">
              <span className="text-[10px] text-[#5a6b62] uppercase font-bold tracking-wider block">Total</span>
              <span className="text-sm font-black text-[#0f1f17]">{totalStudents}</span>
            </div>
            <div className="w-px h-6 bg-[#eef2ef]" />
            <div className="text-center px-2 flex-1 sm:flex-initial">
              <span className="text-[10px] text-emerald-600 uppercase font-bold tracking-wider block">Present</span>
              <span className="text-sm font-black text-emerald-700">{presentCount}</span>
            </div>
            <div className="w-px h-6 bg-[#eef2ef]" />
            <div className="text-center px-2 flex-1 sm:flex-initial">
              <span className="text-[10px] text-rose-600 uppercase font-bold tracking-wider block">Absent</span>
              <span className="text-sm font-black text-rose-600">{absentCount}</span>
            </div>
            <div className="w-px h-6 bg-[#eef2ef]" />
            <div className="text-center px-2 flex-1 sm:flex-initial">
              <span className="text-[10px] text-[#c48b28] uppercase font-bold tracking-wider block">Rate</span>
              <span className="text-sm font-black text-[#0a4b32]">{attendanceRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
        {/* Alerts */}
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 text-xs text-red-800 bg-red-50 border border-red-200 rounded-2xl">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2.5 p-3.5 text-xs text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-2xl animate-in fade-in">
            <Sparkles className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-bold">{successMsg}</span>
          </div>
        )}

        {/* Filter Selection Panel */}
        <div className="p-3.5 sm:p-5 rounded-2xl bg-[#f9fbf9] border border-[#eef2ef] space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* 1. Semester Selector */}
            <div>
              <label className="block text-xs font-bold text-[#0f1f17] mb-1.5">
                Semester Level *
              </label>
              <div className="relative">
                <select
                  value={semester}
                  onChange={(e) => {
                    const newSem = Number(e.target.value);
                    setSemester(newSem);
                    setSelectedSubjectId("");
                    setStudents([]);
                    setSearchQuery("");
                  }}
                  className="w-full pl-3 pr-8 py-2 text-xs font-bold rounded-xl border border-[#dce3df] bg-white text-[#0f1f17] focus:outline-none focus:ring-2 focus:ring-[#0a4b32] appearance-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                    <option key={s} value={s}>
                      Semester {s} ({s === 1 ? "1st" : s === 2 ? "2nd" : s === 3 ? "3rd" : `${s}th`})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#5a6b62] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 2. Subject Selector */}
            <div>
              <label className="block text-xs font-bold text-[#0f1f17] mb-1.5 flex items-center justify-between">
                <span>Course / Subject *</span>
                {loadingSubjects && <Loader2 className="w-3 h-3 animate-spin text-[#0a4b32]" />}
              </label>
              <div className="relative">
                <select
                  value={selectedSubjectId}
                  onChange={(e) => {
                    setSelectedSubjectId(e.target.value);
                    setSearchQuery("");
                  }}
                  disabled={loadingSubjects || subjects.length === 0}
                  className="w-full pl-3 pr-8 py-2 text-xs font-bold rounded-xl border border-[#dce3df] bg-white text-[#0f1f17] focus:outline-none focus:ring-2 focus:ring-[#0a4b32] disabled:bg-slate-100 disabled:text-slate-400 appearance-none cursor-pointer truncate"
                >
                  {subjects.length === 0 ? (
                    <option value="">No subjects in this semester</option>
                  ) : (
                    subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.code} - {sub.name}
                      </option>
                    ))
                  )}
                </select>
                <ChevronDown className="w-4 h-4 text-[#5a6b62] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 3. Session Date */}
            <div>
              <label className="block text-xs font-bold text-[#0f1f17] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#0a4b32]" />
                <span>Session Date *</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-[#dce3df] bg-white text-[#0f1f17] focus:outline-none focus:ring-2 focus:ring-[#0a4b32] cursor-pointer"
              />
            </div>

            {/* 4. Class Category Toggle */}
            <div>
              <label className="block text-xs font-bold text-[#0f1f17] mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#0a4b32]" />
                <span>Class Category</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-white rounded-xl border border-[#dce3df]">
                <button
                  type="button"
                  onClick={() => setType("THEORY")}
                  className={`py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                    type === "THEORY"
                      ? "bg-[#0a4b32] text-white shadow-xs"
                      : "text-[#5a6b62] hover:text-[#0f1f17]"
                  }`}
                >
                  THEORY
                </button>
                <button
                  type="button"
                  onClick={() => setType("PRACTICAL")}
                  className={`py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                    type === "PRACTICAL"
                      ? "bg-[#0a4b32] text-white shadow-xs"
                      : "text-[#5a6b62] hover:text-[#0f1f17]"
                  }`}
                >
                  PRACTICAL
                </button>
              </div>
            </div>
          </div>

          {selectedSubject && (
            <div className="pt-2 border-t border-[#eef2ef] flex items-center justify-between text-[11px] text-[#5a6b62]">
              <span className="truncate">
                Active: <strong className="text-[#0f1f17]">{selectedSubject.code} - {selectedSubject.name}</strong>
              </span>
              <span className="font-semibold text-emerald-800 shrink-0 ml-2">
                Semester {semester}
              </span>
            </div>
          )}
        </div>

        {/* Duplicate Attendance Warning */}
        {duplicateSessionWarning && (
          <div className="flex items-start gap-2.5 p-3.5 sm:p-4 text-xs text-amber-950 bg-amber-50/90 border border-amber-300 rounded-2xl animate-in fade-in shadow-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-amber-900">{duplicateSessionWarning}</p>
              <p className="text-[11px] text-amber-800">
                একই তারিখে একই বিষয়ের পুনরাবৃত্ত উপস্থিতি গ্রহণযোগ্য নয়। ক্লাসের ধরন (THEORY অথবা PRACTICAL) পরিবর্তন করতে পারেন অথবা ভিন্ন তারিখ নির্বাচন করুন।
              </p>
            </div>
          </div>
        )}

        {/* Toolbar: Student Search + Status Filter + Quick Batch Actions */}
        <div className="space-y-3">
          {/* Top Row: Search Input + Status Filter Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 max-w-full sm:max-w-md">
              <Search className="w-4 h-4 text-[#5a6b62] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, roll no, or reg no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs font-semibold rounded-xl border border-[#dce3df] bg-white text-[#0f1f17] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0a4b32]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Tabs: All, Present, Absent */}
            <div className="flex items-center gap-1 p-1 bg-[#f4f7f5] rounded-xl border border-[#e2e8e4] self-start sm:self-auto overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setStatusFilter("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === "ALL"
                    ? "bg-[#0a4b32] text-white shadow-xs"
                    : "text-[#5a6b62] hover:text-[#0f1f17]"
                }`}
              >
                All ({totalStudents})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("PRESENT")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === "PRESENT"
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "text-emerald-800 hover:bg-emerald-50"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Present ({presentCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("ABSENT")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === "ABSENT"
                    ? "bg-rose-700 text-white shadow-xs"
                    : "text-rose-800 hover:bg-rose-50"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Absent ({absentCount})
              </button>
            </div>
          </div>

          {/* Bottom Row: Quick Batch Buttons + Pre-enroll Callout */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-[#5a6b62] mr-1 hidden sm:inline">
                Quick Actions:
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleMarkAll("PRESENT")}
                className="h-7 text-[11px] font-bold border-emerald-200 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg cursor-pointer"
              >
                Mark All Present
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleMarkAll("ABSENT")}
                className="h-7 text-[11px] font-bold border-rose-200 text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg cursor-pointer"
              >
                Mark All Absent
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleInvertAll}
                className="h-7 text-[11px] font-bold border-slate-200 text-[#5a6b62] hover:bg-slate-100 rounded-lg gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Invert
              </Button>
            </div>

            {onOpenPreEnrollModal && (
              <button
                type="button"
                onClick={onOpenPreEnrollModal}
                className="text-xs font-bold text-[#0a4b32] hover:underline flex items-center gap-1.5 cursor-pointer ml-auto"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Pre-enroll Missing Students</span>
              </button>
            )}
          </div>
        </div>

        {/* Student Roster Area */}
        {loadingStudents ? (
          <div className="space-y-2.5 pt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="p-3.5 sm:p-4 bg-white border border-[#f0f4f1] rounded-2xl flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32 sm:w-48" />
                    <Skeleton className="h-3 w-20 sm:w-28" />
                  </div>
                </div>
                <Skeleton className="h-8 w-24 rounded-xl" />
              </div>
            ))}
          </div>
        ) : students.length === 0 ? (
          <div className="py-12 text-center rounded-2xl border-2 border-dashed border-[#e2e8e4] p-8 space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-extrabold text-[#0f1f17]">
              No students enrolled for Semester {semester}
            </p>
            <p className="text-xs text-[#5a6b62] max-w-md mx-auto">
              Please use the Pre-Enrollment tool to register students for Semester {semester} or select another semester.
            </p>
            {onOpenPreEnrollModal && (
              <Button
                type="button"
                onClick={onOpenPreEnrollModal}
                className="bg-[#0a4b32] text-white hover:bg-[#073825] text-xs font-bold rounded-xl cursor-pointer"
              >
                Pre-Enroll Students
              </Button>
            )}
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="py-10 text-center rounded-2xl border border-dashed border-[#dce3df] p-6 space-y-2">
            <Filter className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-[#0f1f17]">
              No students matched your search criteria
            </p>
            <p className="text-xs text-[#5a6b62]">
              Try clearing your search query or switching the status filter tab.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("ALL");
              }}
              className="text-xs font-bold text-[#0a4b32] border-[#dce3df] rounded-xl"
            >
              Reset Search &amp; Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Desktop Table Header */}
            <div className="hidden md:grid md:grid-cols-12 px-4 py-2.5 text-[11px] font-black text-[#5a6b62] uppercase tracking-wider bg-[#f4f7f5] rounded-xl border border-[#eef2ef]">
              <span className="col-span-2">Roll No</span>
              <span className="col-span-4">Student Details</span>
              <span className="col-span-3">Remarks / Note</span>
              <span className="col-span-3 text-right">Attendance Action</span>
            </div>

            {/* Student Items List */}
            <div className="space-y-2 sm:space-y-1.5">
              {filteredStudents.map((student) => {
                const isPresent = attendanceRecords[student.id]?.status === "PRESENT";
                return (
                  <div
                    key={student.id}
                    className={`rounded-2xl border transition-all ${
                      isPresent
                        ? "bg-white border-[#eef2ef] hover:border-emerald-200"
                        : "bg-rose-50/40 border-rose-200/80 hover:bg-rose-50/70"
                    }`}
                  >
                    {/* Desktop View (md+) */}
                    <div className="hidden md:grid md:grid-cols-12 items-center px-4 py-3 gap-3">
                      {/* Roll */}
                      <div className="col-span-2 flex items-center gap-1.5">
                        <span className="font-mono font-black text-xs px-2 py-0.5 rounded-md bg-[#eaf4ef] text-[#0a4b32]">
                          {String(student.rollNo || "").replace(/^#+/, "")}
                        </span>
                      </div>

                      {/* Student Info */}
                      <div className="col-span-4 flex items-center gap-2.5 min-w-0 pr-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                            isPresent
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {student.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#0f1f17] truncate leading-tight">
                            {student.user.name}
                          </p>
                          <p className="text-[10px] text-[#5a6b62] truncate mt-0.5 font-medium">
                            {student.registrationNo ? `Reg: ${student.registrationNo}` : student.user.email}
                          </p>
                        </div>
                      </div>

                      {/* Remarks Input */}
                      <div className="col-span-3 pr-2">
                        <input
                          type="text"
                          placeholder="e.g. Late 10m / Leave"
                          value={attendanceRecords[student.id]?.remarks || ""}
                          onChange={(e) => handleStudentRemark(student.id, e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#e2e8e4] bg-white focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                        />
                      </div>

                      {/* Present / Absent Button */}
                      <div className="col-span-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleToggleStudent(student.id)}
                          className={`min-w-[105px] px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 ${
                            isPresent
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                              : "bg-rose-600 hover:bg-rose-700 text-white"
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

                    {/* Mobile & Small Device View (< md) */}
                    <div className="block md:hidden p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <span className="font-mono font-black text-xs px-2 py-1 rounded-lg bg-[#eaf4ef] text-[#0a4b32] shrink-0">
                            {String(student.rollNo || "").replace(/^#+/, "")}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#0f1f17] truncate leading-tight">
                              {student.user.name}
                            </p>
                            <p className="text-[10px] text-[#5a6b62] truncate mt-0.5">
                              {student.registrationNo ? `Reg: ${student.registrationNo}` : student.user.email}
                            </p>
                          </div>
                        </div>

                        {/* Status Toggle Button on Mobile */}
                        <button
                          type="button"
                          onClick={() => handleToggleStudent(student.id)}
                          className={`shrink-0 px-3 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 ${
                            isPresent
                              ? "bg-emerald-600 active:bg-emerald-700 text-white"
                              : "bg-rose-600 active:bg-rose-700 text-white"
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

                      {/* Optional Note Row on Mobile */}
                      <div className="flex items-center gap-1.5 pt-1 border-t border-[#f0f4f1]">
                        <MessageSquare className="w-3 h-3 text-slate-400 shrink-0" />
                        <input
                          type="text"
                          placeholder="Add note (e.g. Late, Sick leave)..."
                          value={attendanceRecords[student.id]?.remarks || ""}
                          onChange={(e) => handleStudentRemark(student.id, e.target.value)}
                          className="w-full px-2 py-1 text-xs rounded-lg border border-[#e2e8e4] bg-white focus:outline-none focus:ring-1 focus:ring-[#0a4b32] placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Global Remarks & Submit Bar */}
        <div className="pt-4 border-t border-[#eef2ef] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:max-w-md">
            <label className="block text-[11px] font-bold text-[#5a6b62] mb-1">
              Session Notes / Chapter Covered (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Chapter 3: Functions, practical lab experiments completed"
              value={sessionRemarks}
              onChange={(e) => setSessionRemarks(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#dce3df] bg-[#fafbf9] focus:outline-none focus:ring-2 focus:ring-[#0a4b32]"
            />
          </div>

          <Button
            type="submit"
            disabled={submitting || students.length === 0 || !!duplicateSessionWarning}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-black shadow-md gap-2 h-10 transition-all ${
              duplicateSessionWarning
                ? "bg-slate-300 text-slate-600 border border-slate-300 shadow-none cursor-not-allowed"
                : "bg-[#0a4b32] hover:bg-[#073825] text-white shadow-[#0a4b32]/10 cursor-pointer"
            }`}
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {submitting
              ? "Submitting Session..."
              : duplicateSessionWarning
              ? "ইতিমধ্যে গ্রহণ করা হয়েছে (Duplicate)"
              : `Submit Attendance (${presentCount} Present)`}
          </Button>
        </div>

        {/* Floating Bottom Quick Submit Bar on Mobile */}
        {students.length > 0 && (
          <div className="sm:hidden fixed bottom-4 left-3 right-3 z-30 p-2.5 bg-white/95 backdrop-blur-md border border-[#dce3df] rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2">
            <div className="min-w-0">
              <span className="text-[10px] text-[#5a6b62] font-bold block uppercase">Attendance Rate</span>
              <p className="text-xs font-black text-[#0f1f17] truncate">
                <span className="text-emerald-700">{presentCount} Present</span> •{" "}
                <span className="text-rose-600">{absentCount} Absent</span> ({attendanceRate}%)
              </p>
            </div>

            <Button
              type="button"
              disabled={submitting || !!duplicateSessionWarning}
              onClick={() => handleSubmit()}
              className={`px-4 py-2 rounded-xl text-xs font-black shadow-sm shrink-0 gap-1.5 h-9 ${
                duplicateSessionWarning
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-[#0a4b32] hover:bg-[#073825] text-white cursor-pointer"
              }`}
            >
              {submitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>{duplicateSessionWarning ? "গৃহীত" : "Submit"}</span>
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
