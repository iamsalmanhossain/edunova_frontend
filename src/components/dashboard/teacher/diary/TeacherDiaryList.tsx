"use client";

import React, { useState, useEffect } from "react";
import { academicFeaturesService } from "@/services/academic-features.service";
import { appToast } from "@/store/useToastStore";
import { appConfirm } from "@/store/useConfirmStore";
import { ClassDiaryEntry } from "@/types/academic-features";
import { TeacherSubject } from "@/types/teacher";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";

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
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedSemester, setSelectedSemester] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

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
      message: "Are you sure you want to remove this class diary entry? Attached lesson notes and lecture topics will be removed.",
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
      const msg = err instanceof Error ? err.message : "Failed to delete diary entry. Please try again.";
      appToast.error(msg, "Delete Failed");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#dce3df] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0a4b32]" />
            <span className="text-[10px] font-bold tracking-widest text-[#0a4b32] uppercase">
              Digital Class Diary
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#0f1f17] mt-0.5">
            Lecture Notes & Daily Class Logs
          </h2>
          <p className="text-xs text-[#5a6b62]">
            Log chapters taught, attach study materials, and broadcast upcoming exam schedules to students
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="h-10 px-4 text-xs font-bold bg-[#0a4b32] hover:bg-[#073825] text-white shadow-xs cursor-pointer flex items-center gap-1.5 rounded-xl shrink-0"
        >
          <Plus className="w-4 h-4 text-[#c48b28]" />
          <span>New Class Entry</span>
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white border border-[#dce3df] shadow-xs flex flex-wrap items-center gap-3">
        {/* Subject Filter */}
        <div className="w-48">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full h-9 rounded-md border border-[#dce3df] bg-white px-2.5 text-xs text-[#0f1f17] font-medium focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
          >
            <option value="all">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} - {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Semester Filter */}
        <div className="w-36">
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="w-full h-9 rounded-md border border-[#dce3df] bg-white px-2.5 text-xs text-[#0f1f17] font-medium focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
          >
            <option value="all">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-[#5a6b62] ml-auto font-medium">
          Showing {entries.length} log {entries.length === 1 ? "entry" : "entries"}
        </div>
      </div>

      {/* Entries List */}
      {loading ? (
        <div className="p-8 text-center text-sm text-[#5a6b62] bg-white rounded-2xl border border-[#dce3df]">
          Loading diary entries...
        </div>
      ) : entries.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#dce3df] space-y-3">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="text-sm font-bold text-[#0f1f17]">No Diary Entries Yet</h3>
          <p className="text-xs text-[#5a6b62] max-w-sm mx-auto">
            Start logging your daily lectures, sharing note links with students, and announcing class tests.
          </p>
          <Button
            onClick={() => setIsCreateOpen(true)}
            variant="outline"
            className="text-xs font-bold border-[#0a4b32] text-[#0a4b32] hover:bg-[#0a4b32] hover:text-white rounded-xl"
          >
            Create First Entry
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="p-5 rounded-2xl bg-white border border-[#dce3df] shadow-xs hover:border-[#0a4b32]/40 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#f0f4f1]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold text-[#0a4b32] bg-[#0a4b32]/10 px-2 py-0.5 rounded">
                    {entry.subject?.code || "SUB"}
                  </span>
                  <span className="text-sm font-bold text-[#0f1f17]">
                    {entry.subject?.name || "Subject"}
                  </span>
                  <span className="text-xs text-[#5a6b62]">
                    • Semester {entry.semester} ({entry.shift === "SECOND_SHIFT" ? "Shift 2" : "Shift 1"})
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#5a6b62] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#0a4b32]" />
                    {new Date(entry.entryDate || entry.date || Date.now()).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    disabled={deleteLoadingId === entry.id}
                    title="Delete entry"
                    className="p-1 text-gray-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chapter & Topics */}
              <div>
                <h4 className="text-sm font-bold text-[#0a4b32] flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  {entry.chapter}
                </h4>
                <p className="text-xs text-[#2c3e35] mt-1 whitespace-pre-wrap leading-relaxed">
                  {entry.topicsCovered}
                </p>
              </div>

              {/* Next Class Plan */}
              {entry.nextClassPlan && (
                <div className="text-xs bg-[#f7faf8] p-2.5 rounded-xl border border-[#e2e8e4] text-[#0f1f17]">
                  <span className="font-bold text-[#0a4b32]">Next Class Plan:</span>{" "}
                  {entry.nextClassPlan}
                </div>
              )}

              {/* Exam Announcement & Notes Link */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                {entry.hasExamAnnouncement && entry.examTitle ? (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                    <Bell className="w-3.5 h-3.5 text-[#c48b28] shrink-0" />
                    <span>
                      <strong className="font-bold">{entry.examTitle}</strong> on{" "}
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
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0a4b32] hover:underline bg-[#f0f7f3] px-3 py-1.5 rounded-xl border border-[#dce3df]"
                  >
                    <span>Download Class Notes</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
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
