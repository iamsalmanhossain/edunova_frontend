"use client";

import React, { useState, useEffect, useMemo } from "react";
import { academicFeaturesService } from "@/services/academic-features.service";
import { ClassDiaryEntry } from "@/types/academic-features";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Calendar,
  ExternalLink,
  Bell,
  Sparkles,
  Search,
  Bookmark,
  ArrowRight,
  Clock,
  X,
  Download,
  AlertCircle,
  FileCheck,
} from "lucide-react";

export default function StudentDiaryTimeline() {
  const [entries, setEntries] = useState<ClassDiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("ALL");

  useEffect(() => {
    let mounted = true;
    async function loadDiary() {
      try {
        setLoading(true);
        const res = await academicFeaturesService.getStudentDiaryEntries();
        if (mounted) {
          setEntries(res.entries || []);
        }
      } catch (err) {
        console.warn("Could not load student class diary:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadDiary();
    return () => {
      mounted = false;
    };
  }, []);

  // Extract unique subjects for mobile-friendly quick filter chips
  const subjectList = useMemo(() => {
    const map = new Map<string, { code: string; name: string }>();
    entries.forEach((e) => {
      const code = e.subject?.code || e.subjectCode || "";
      const name = e.subject?.name || e.subjectName || "";
      if (code && name && !map.has(code)) {
        map.set(code, { code, name });
      }
    });
    return Array.from(map.values());
  }, [entries]);

  // Filter entries by search term and selected subject
  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      // 1. Subject filter
      if (selectedSubject !== "ALL") {
        const code = e.subject?.code || e.subjectCode;
        if (code !== selectedSubject) return false;
      }

      // 2. Search term
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        e.subject?.name?.toLowerCase().includes(term) ||
        e.subject?.code?.toLowerCase().includes(term) ||
        e.subjectName?.toLowerCase().includes(term) ||
        e.subjectCode?.toLowerCase().includes(term) ||
        e.chapter?.toLowerCase().includes(term) ||
        e.topicsCovered?.toLowerCase().includes(term) ||
        e.topicsTaught?.toLowerCase().includes(term) ||
        e.nextClassPlan?.toLowerCase().includes(term) ||
        e.examTitle?.toLowerCase().includes(term)
      );
    });
  }, [entries, searchTerm, selectedSubject]);

  return (
    <div className="space-y-3.5 sm:space-y-5 max-w-5xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* 1. Header Banner - Optimized for Mobile Screen Height */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#073825] via-[#0a4b32] to-[#042417] text-white p-4 sm:p-6 shadow-lg shadow-[#0a4b32]/10 border border-[#0d593c]">
        {/* Ambient background decoration */}
        <div className="pointer-events-none absolute -right-10 -top-10 w-48 h-48 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-8 -bottom-8 w-40 h-40 rounded-full bg-[#c48b28]/15 blur-2xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0">
            {/* Top Badge & Counter Pill */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/12 text-white text-[10px] sm:text-[11px] font-semibold border border-white/15 backdrop-blur-xs">
                <BookOpen className="w-3 h-3 text-[#c48b28]" />
                <span>Class Diary &amp; Lecture Notes</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#c48b28]/25 text-[#ffd782] text-[10px] sm:text-[11px] font-bold border border-[#c48b28]/40">
                <Sparkles className="w-3 h-3 text-[#c48b28]" />
                <span>{entries.length} Classes Logged</span>
              </span>
            </div>

            {/* Title */}
            <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight">
              Daily Class Journal &amp; Notes
            </h1>

            {/* Subtext */}
            <p className="text-[11px] sm:text-xs text-emerald-100/80 max-w-2xl leading-relaxed line-clamp-2 sm:line-clamp-none">
              Keep up with daily classroom coverage, study lecture materials shared by teachers, and prepare for announced class tests.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Interactive Search & Quick Subject Filters */}
      <div className="bg-white rounded-2xl border border-[#dce3df] p-2.5 sm:p-3 shadow-xs space-y-2">
        {/* Search input field */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by subject, chapter, or lecture topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9.5 pl-9 pr-9 text-xs font-medium text-[#0f1f17] bg-[#fcfdfc] border border-[#e2e8e4] focus:border-[#0a4b32] focus:bg-white rounded-xl outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-[#0a4b32]/10"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Subject Filter Chips (Scrollable on mobile) */}
        {subjectList.length > 0 && (
          <div className="pt-1 border-t border-[#f0f4f1] flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => setSelectedSubject("ALL")}
              className={`px-3 py-1 text-[11px] font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                selectedSubject === "ALL"
                  ? "bg-[#0a4b32] text-white shadow-xs"
                  : "bg-[#f0f4f1] text-[#5a6b62] hover:bg-[#e2e8e4] hover:text-[#0f1f17]"
              }`}
            >
              All Subjects ({entries.length})
            </button>
            {subjectList.map((subj) => {
              const count = entries.filter(
                (e) => (e.subject?.code || e.subjectCode) === subj.code
              ).length;
              const isSelected = selectedSubject === subj.code;
              return (
                <button
                  key={subj.code}
                  type="button"
                  onClick={() => setSelectedSubject(subj.code)}
                  className={`px-3 py-1 text-[11px] font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#0a4b32] text-white shadow-xs"
                      : "bg-[#f0f4f1] text-[#5a6b62] hover:bg-[#e2e8e4] hover:text-[#0f1f17]"
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-80">{subj.code}</span>
                  <span className="truncate max-w-[140px]">{subj.name}</span>
                  <span
                    className={`text-[9px] px-1 rounded ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-[#e2e8e4] text-[#5a6b62]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Diary Timeline Entries List */}
      {loading ? (
        /* Loading Skeleton with matching card structure */
        <div className="space-y-3 sm:space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-[#dce3df] shadow-xs space-y-3 animate-pulse"
            >
              <div className="flex justify-between items-center pb-2.5 border-b border-[#f0f4f1]">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-16 rounded-md" />
                  <Skeleton className="h-5 w-36 rounded-md" />
                </div>
                <Skeleton className="h-4 w-24 rounded" />
              </div>
              <Skeleton className="h-4 w-48 rounded" />
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredEntries.length === 0 ? (
        /* Empty State */
        <div className="p-8 sm:p-12 text-center bg-white rounded-2xl border border-[#dce3df] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0a4b32] flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6 text-[#0a4b32]" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-[#0f1f17]">
            No Class Diary Entries Found
          </h3>
          <p className="text-xs text-[#5a6b62] max-w-sm mx-auto leading-relaxed">
            {searchTerm || selectedSubject !== "ALL"
              ? "No lecture records match your selected filter or search keyword."
              : "Your teachers haven't recorded any lecture notes for this semester yet."}
          </p>
          {(searchTerm || selectedSubject !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedSubject("ALL");
              }}
              className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-[#0a4b32] bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer"
            >
              <span>Reset Search &amp; Filters</span>
            </button>
          )}
        </div>
      ) : (
        /* Card Timeline Feed - Clean, mobile optimized */
        <div className="space-y-3 sm:space-y-4">
          {filteredEntries.map((entry) => {
            const subjectCode =
              entry.subject?.code || entry.subjectCode || "SUB";
            const subjectName =
              entry.subject?.name || entry.subjectName || "Subject";
            const rawDate = entry.entryDate || entry.date || Date.now();
            const formattedDate = new Date(rawDate).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            // Chapter display formatting: if "2" -> "Chapter 2"
            const rawChapter = (entry.chapter || "").trim();
            const chapterTitle =
              /^\d+$/.test(rawChapter)
                ? `Chapter ${rawChapter}`
                : rawChapter || "General Class Topic";

            const topicsText = entry.topicsCovered || entry.topicsTaught || "";
            const notesUrl = entry.notesUrl || entry.classNoteUrl;
            const hasExamAlert = entry.hasExamAnnouncement || entry.hasExam;

            return (
              <div
                key={entry.id}
                className="p-3.5 sm:p-5 rounded-2xl bg-white border border-[#dce3df] shadow-xs hover:border-[#0a4b32]/40 transition-all space-y-3"
              >
                {/* Card Top Row: Subject identity, Semester badge, and Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 pb-2.5 border-b border-[#f0f4f1]">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
                    <span className="font-mono text-[10px] sm:text-[11px] font-black text-[#0a4b32] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {subjectCode}
                    </span>
                    <h3 className="text-xs sm:text-sm font-extrabold text-[#0f1f17] truncate">
                      {subjectName}
                    </h3>
                    <span className="text-[10px] sm:text-[11px] text-[#5a6b62] font-semibold bg-[#f0f4f1] px-1.5 py-0.5 rounded">
                      Sem {entry.semester}
                    </span>
                  </div>

                  <span className="text-[10px] sm:text-xs text-[#5a6b62] font-medium flex items-center gap-1 self-start sm:self-auto">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#0a4b32]" />
                    <span>{formattedDate}</span>
                  </span>
                </div>

                {/* Chapter & Lesson Topic Header */}
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#0a4b32]/10 text-[#0a4b32] flex items-center justify-center shrink-0 mt-0.5">
                    <Bookmark className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-[#0a4b32] tracking-tight">
                      {chapterTitle}
                    </h4>
                  </div>
                </div>

                {/* Topics Covered Box */}
                {topicsText && (
                  <div className="rounded-xl bg-[#f9faf9] border border-[#e8ecea] p-3 text-xs text-[#1e2f27] space-y-1">
                    <p className="text-[10px] font-bold text-[#5a6b62] uppercase tracking-wider flex items-center gap-1">
                      <FileCheck className="w-3 h-3 text-[#0a4b32]" />
                      <span>Topics Covered in Class</span>
                    </p>
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {topicsText}
                    </p>
                  </div>
                )}

                {/* Preparation for Next Class Box */}
                {entry.nextClassPlan && (
                  <div className="rounded-xl bg-emerald-50/70 border border-emerald-200/70 p-2.5 sm:p-3 text-xs text-[#0f1f17] flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-[#0a4b32] block text-[11px] sm:text-xs">
                        Preparation for Next Class:
                      </span>
                      <p className="text-[#2c3e35] mt-0.5 leading-relaxed text-[11px] sm:text-xs">
                        {entry.nextClassPlan}
                      </p>
                    </div>
                  </div>
                )}

                {/* Exam Announcement Warning Pill */}
                {hasExamAlert && entry.examTitle && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-bold flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
                    <Bell className="w-3.5 h-3.5 text-[#c48b28] shrink-0" />
                    <span className="truncate">
                      Exam Alert: {entry.examTitle}
                      {entry.examDate && (
                        <span className="font-medium text-amber-800 ml-1">
                          • {new Date(entry.examDate).toLocaleDateString()}
                        </span>
                      )}
                    </span>
                  </div>
                )}

                {/* Download Notes Action Button - Mobile full width */}
                {notesUrl && (
                  <div className="pt-1">
                    <a
                      href={notesUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0a4b32] hover:bg-[#073825] active:scale-[0.98] transition-all shadow-xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-[#c48b28]" />
                      <span>Download Lecture Notes (PDF)</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
