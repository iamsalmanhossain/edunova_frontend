"use client";

import React, { useState, useEffect, useMemo } from "react";
import { academicFeaturesService } from "@/services/academic-features.service";
import { appToast } from "@/store/useToastStore";
import { appConfirm } from "@/store/useConfirmStore";
import { ClassDiaryEntry } from "@/types/academic-features";
import { TeacherSubject } from "@/types/teacher";
import { Button } from "@/components/ui/button";
import CreateDiaryModal from "./CreateDiaryModal";
import {
  BookOpen,
  Plus,
  Trash2,
  Calendar,
  ExternalLink,
  Bell,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Filter,
  RotateCcw,
  Layers,
  FileText,
} from "lucide-react";
import Pagination from "@/components/ui/pagination";

interface TeacherDiaryListProps {
  subjects: TeacherSubject[];
  currentShift: "FIRST_SHIFT" | "SECOND_SHIFT";
}

export default function TeacherDiaryList({
  subjects,
  currentShift,
}: TeacherDiaryListProps) {
  const [entries, setEntries] = useState<ClassDiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  // Pagination state (10 entries per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Filter subjects strictly based on selected semester
  const availableSubjects = useMemo(() => {
    if (selectedSemester === "all") return subjects;
    return subjects.filter((s) => s.semester === Number(selectedSemester));
  }, [subjects, selectedSemester]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSemester, selectedSubject]);

  const totalPages = Math.ceil(entries.length / pageSize) || 1;

  const paginatedEntries = useMemo(() => {
    if (entries.length > pageSize) {
      const startIndex = (currentPage - 1) * pageSize;
      return entries.slice(startIndex, startIndex + pageSize);
    }
    return entries;
  }, [entries, currentPage, pageSize]);

  // When selected semester changes, ensure selectedSubject remains valid
  const handleSemesterChange = (newSem: string) => {
    setSelectedSemester(newSem);
    if (newSem === "all") {
      setSelectedSubject("all");
    } else {
      const semNum = Number(newSem);
      const matching = subjects.filter((s) => s.semester === semNum);
      if (!matching.some((s) => s.id === selectedSubject)) {
        setSelectedSubject("all");
      }
    }
  };

  const handleResetFilters = () => {
    setSelectedSemester("all");
    setSelectedSubject("all");
  };

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await academicFeaturesService.getClassDiaryEntries({
        subjectId: selectedSubject !== "all" ? selectedSubject : undefined,
        semester: selectedSemester !== "all" ? Number(selectedSemester) : undefined,
        shift: currentShift,
      });
      setEntries(res || []);
    } catch (err) {
      console.warn("Could not load class diary entries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [selectedSubject, selectedSemester, currentShift]);

  const handleDelete = async (id: string) => {
    const confirmed = await appConfirm({
      title: "Remove Class Diary Entry",
      message:
        "Are you sure you want to remove this class diary entry? Attached lesson notes and lecture topics will be removed.",
      confirmText: "Delete Entry",
      variant: "destructive",
    });
    if (!confirmed) return;
    try {
      setDeleteLoadingId(id);
      await academicFeaturesService.deleteClassDiary(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      appToast.success("Class diary entry removed successfully.", "Diary Deleted");
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to delete diary entry. Please try again.";
      appToast.error(msg, "Delete Failed");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const hasActiveFilter = selectedSemester !== "all" || selectedSubject !== "all";

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* 1. Header Bar with Responsive Actions */}
      <div className="relative overflow-hidden bg-white border border-[#dce3df] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute right-0 top-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />

        <div className="space-y-1 relative z-10 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f0f7f3] border border-[#dce9e1] text-[10px] sm:text-[11px] font-bold text-[#0a4b32]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0a4b32] animate-pulse" />
            <span>Digital Class Diary</span>
          </div>
          <h1 className="text-base sm:text-xl font-extrabold text-[#0f1f17] tracking-tight">
            Lecture Notes &amp; Daily Class Logs
          </h1>
          <p className="text-[11px] sm:text-xs text-[#5a6b62] leading-relaxed max-w-xl">
            Log chapters taught, attach study materials, and broadcast upcoming exam schedules to students.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <Button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="w-full sm:w-auto h-10 px-4 text-xs font-bold bg-[#0a4b32] hover:bg-[#073825] text-white shadow-xs cursor-pointer flex items-center justify-center gap-2 rounded-xl transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-[#c48b28]" />
            <span>New Class Entry</span>
          </Button>
        </div>
      </div>

      {/* 2. Responsive Cascading Filter Bar (Semester FIRST, Subject SECOND) */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#dce3df] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#0a4b32]" />
            <span className="text-xs sm:text-sm font-bold text-[#0f1f17]">
              Filter Class Entries
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#5a6b62]">
            <span className="font-semibold text-[#0f1f17]">
              {entries.length}
            </span>{" "}
            {entries.length === 1 ? "entry found" : "entries found"}
            {hasActiveFilter && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0a4b32] hover:underline ml-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Dropdown Filters Grid: Mobile 1 or 2 col, Desktop Flex */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:flex sm:items-center gap-2.5">
          {/* STEP 1: Semester Filter (Placed FIRST) */}
          <div className="w-full sm:w-44">
            <label className="block text-[10px] font-bold text-[#5a6b62] mb-1 uppercase tracking-wider">
              1. Choose Semester
            </label>
            <div className="relative">
              <select
                value={selectedSemester}
                onChange={(e) => handleSemesterChange(e.target.value)}
                className="w-full h-9.5 rounded-xl border border-[#dce3df] bg-[#fbfcfb] px-3 text-xs text-[#0f1f17] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0a4b32]/20 focus:border-[#0a4b32] cursor-pointer transition-all"
              >
                <option value="all">All Semesters (1–7)</option>
                {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* STEP 2: Subject Filter (Placed SECOND, filtered strictly by chosen Semester) */}
          <div className="w-full sm:w-64">
            <label className="block text-[10px] font-bold text-[#5a6b62] mb-1 uppercase tracking-wider">
              2. Filter by Subject
            </label>
            <div className="relative">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full h-9.5 rounded-xl border border-[#dce3df] bg-[#fbfcfb] px-3 text-xs text-[#0f1f17] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0a4b32]/20 focus:border-[#0a4b32] cursor-pointer transition-all"
              >
                <option value="all">
                  {selectedSemester === "all"
                    ? "All Assigned Subjects"
                    : `All Semester ${selectedSemester} Subjects (${availableSubjects.length})`}
                </option>
                {availableSubjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} – {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Active Filter Pill */}
          {selectedSemester !== "all" && (
            <div className="hidden md:flex items-center gap-1.5 self-end pb-1">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-[#0a4b32] border border-emerald-200">
                Filtered: Semester {selectedSemester} ({availableSubjects.length} subjects)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Diary Entries List */}
      {loading ? (
        <div className="p-8 sm:p-12 text-center text-xs sm:text-sm text-[#5a6b62] bg-white rounded-2xl border border-[#dce3df] shadow-xs space-y-2">
          <div className="w-7 h-7 border-2 border-[#0a4b32] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-semibold text-[#0f1f17]">Loading class diary logs...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="p-8 sm:p-14 text-center bg-white rounded-2xl sm:rounded-3xl border border-[#dce3df] shadow-xs space-y-3 px-4">
          <div className="w-12 h-12 rounded-2xl bg-[#f0f7f3] border border-[#dce9e1] text-[#0a4b32] flex items-center justify-center mx-auto shadow-2xs">
            <BookOpen className="w-6 h-6 text-[#0a4b32]" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#0f1f17]">
              {hasActiveFilter
                ? "No Diary Entries Found for Selected Filter"
                : "No Class Diary Entries Yet"}
            </h3>
            <p className="text-[11px] sm:text-xs text-[#5a6b62] max-w-sm mx-auto mt-1 leading-relaxed">
              {hasActiveFilter
                ? "There are no recorded class diary entries matching the selected semester or subject. Try resetting filters or create a new entry."
                : "Start logging your daily lecture topics, sharing downloadable PDF note links with students, and announcing class tests."}
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-2 flex-wrap">
            <Button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="text-xs font-bold bg-[#0a4b32] hover:bg-[#073825] text-white rounded-xl h-9 px-4 gap-1.5 shadow-xs cursor-pointer active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 text-[#c48b28]" />
              <span>Create Class Entry</span>
            </Button>
            {hasActiveFilter && (
              <Button
                type="button"
                variant="outline"
                onClick={handleResetFilters}
                className="text-xs font-bold border-[#dce3df] text-[#5a6b62] hover:text-[#0f1f17] rounded-xl h-9 px-3"
              >
                <span>Reset Filters</span>
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            key={currentPage}
            className="space-y-3 sm:space-y-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-300"
          >
            {paginatedEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-[#dce3df] shadow-xs hover:border-[#0a4b32]/40 transition-all space-y-3 relative group"
              >
              {/* Card Top: Subject Name, Semester Badge, Date, Delete Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#f0f4f1]">
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-mono font-extrabold text-[#0a4b32] bg-[#0a4b32]/10 px-2 py-0.5 rounded-md border border-[#0a4b32]/20">
                    {entry.subject?.code || "SUB"}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#0f1f17] truncate">
                    {entry.subject?.name || "Subject"}
                  </span>
                  <span className="text-[10px] sm:text-xs text-[#5a6b62] font-semibold">
                    • Semester {entry.semester}{" "}
                    <span className="hidden xs:inline">
                      ({entry.shift === "SECOND_SHIFT" ? "Shift 2" : "Shift 1"})
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-1 sm:pt-0">
                  <span className="text-[11px] sm:text-xs text-[#5a6b62] font-medium flex items-center gap-1.5 bg-[#fbfcfb] px-2 py-1 rounded-lg border border-[#eef2ef]">
                    <Calendar className="w-3.5 h-3.5 text-[#0a4b32]" />
                    <span>
                      {new Date(
                        entry.entryDate || entry.date || Date.now()
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id)}
                    disabled={deleteLoadingId === entry.id}
                    title="Delete entry"
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chapter & Topics */}
              <div className="space-y-1">
                <h2 className="text-xs sm:text-sm font-extrabold text-[#0a4b32] flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#c48b28] shrink-0" />
                  <span>{entry.chapter}</span>
                </h2>
                <p className="text-xs text-[#2c3e35] whitespace-pre-wrap leading-relaxed pl-5">
                  {entry.topicsCovered}
                </p>
              </div>

              {/* Next Class Plan */}
              {entry.nextClassPlan && (
                <div className="text-xs bg-[#f7faf8] p-3 rounded-xl border border-[#e2e8e4] text-[#0f1f17] flex items-start gap-2">
                  <span className="font-bold text-[#0a4b32] shrink-0">
                    Next Class Plan:
                  </span>
                  <span className="text-[#3c4e45] leading-relaxed">
                    {entry.nextClassPlan}
                  </span>
                </div>
              )}

              {/* Exam Announcement & Notes Download Link */}
              <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2.5 pt-1">
                {entry.hasExamAnnouncement && entry.examTitle ? (
                  <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/90 text-xs text-amber-900 font-medium">
                    <Bell className="w-3.5 h-3.5 text-[#c48b28] shrink-0" />
                    <span className="text-[11px] sm:text-xs">
                      <strong className="font-extrabold">{entry.examTitle}</strong> on{" "}
                      {entry.examDate
                        ? new Date(entry.examDate).toLocaleDateString()
                        : "TBD"}
                      {entry.syllabus ? ` (${entry.syllabus})` : ""}
                    </span>
                  </div>
                ) : (
                  <div />
                )}

                {entry.notesUrl && (
                  <a
                    href={entry.notesUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#0a4b32] hover:text-[#073825] hover:bg-[#e4ece7] bg-[#f0f7f3] px-3.5 py-2 rounded-xl border border-[#dce3df] transition-colors cursor-pointer self-start xs:self-auto"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#0a4b32]" />
                    <span>Download Class Notes</span>
                    <ExternalLink className="w-3 h-3 opacity-70 ml-0.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={entries.length}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
            itemLabel="class entries"
            className="rounded-2xl border border-[#dce3df]"
          />
        </div>
      )}

      {/* Modal */}
      <CreateDiaryModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        subjects={subjects}
        currentShift={currentShift}
        onSuccess={fetchEntries}
      />
    </div>
  );
}
