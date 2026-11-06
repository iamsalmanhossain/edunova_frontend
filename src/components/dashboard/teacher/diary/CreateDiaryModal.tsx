"use client";

import React, { useState, useEffect } from "react";
import { academicFeaturesService } from "@/services/academic-features.service";
import { TeacherSubject } from "@/types/teacher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PdfUploader from "@/components/shared/PdfUploader";
import {
  X,
  BookOpen,
  Calendar,
  Bell,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Layers,
} from "lucide-react";

interface CreateDiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: TeacherSubject[];
  currentShift: "FIRST_SHIFT" | "SECOND_SHIFT";
  onSuccess: () => void;
}

export default function CreateDiaryModal({
  isOpen,
  onClose,
  subjects,
  currentShift,
  onSuccess,
}: CreateDiaryModalProps) {
  // Determine initial semester based on first subject or default to 1
  const initialSemester = subjects[0]?.semester || 1;
  const [semester, setSemester] = useState<number>(initialSemester);
  const [subjectId, setSubjectId] = useState<string>("");

  const [entryDate, setEntryDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [chapter, setChapter] = useState("");
  const [topicsCovered, setTopicsCovered] = useState("");
  const [nextClassPlan, setNextClassPlan] = useState("");
  const [notesUrl, setNotesUrl] = useState("");

  // Exam announcement
  const [hasExam, setHasExam] = useState(false);
  const [examTitle, setExamTitle] = useState("");
  const [examDate, setExamDate] = useState("");
  const [examType, setExamType] = useState<string>("CLASS_TEST");
  const [syllabus, setSyllabus] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter subjects strictly belonging to the chosen semester
  const availableSubjects = subjects.filter((s) => s.semester === semester);

  // When semester or subjects change, auto-select the first available subject
  useEffect(() => {
    if (availableSubjects.length > 0) {
      if (!subjectId || !availableSubjects.some((s) => s.id === subjectId)) {
        setSubjectId(availableSubjects[0].id);
      }
    } else {
      setSubjectId("");
    }
  }, [semester, subjects]);

  if (!isOpen) return null;

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSem = Number(e.target.value);
    setSemester(newSem);
    const matching = subjects.filter((s) => s.semester === newSem);
    if (matching.length > 0) {
      setSubjectId(matching[0].id);
    } else {
      setSubjectId("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId) {
      setError("Please select a subject assigned for this semester.");
      return;
    }
    if (!chapter.trim()) {
      setError("Please enter chapter name or unit.");
      return;
    }
    if (!topicsCovered.trim()) {
      setError("Please describe the topics covered today.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await academicFeaturesService.createClassDiary({
        subjectId,
        semester: Number(semester),
        shift: currentShift, // auto taken from teacher's current assigned shift
        entryDate,
        chapter: chapter.trim(),
        topicsCovered: topicsCovered.trim(),
        nextClassPlan: nextClassPlan.trim() || undefined,
        notesUrl: notesUrl.trim() || undefined,
        hasExamAnnouncement: hasExam,
        examTitle: hasExam ? examTitle.trim() : undefined,
        examDate: hasExam && examDate ? examDate : undefined,
        examType: hasExam ? (examType as any) : undefined,
        syllabus: hasExam ? syllabus.trim() : undefined,
      });

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to record diary entry";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const shiftLabel =
    currentShift === "SECOND_SHIFT"
      ? "2nd Shift (Day / Afternoon)"
      : "1st Shift (Morning)";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#dce3df]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0a4b32] text-white">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#c48b28]" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">New Class Diary &amp; Lecture Note</h2>
                <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-full">
                  {shiftLabel}
                </span>
              </div>
              <p className="text-[11px] text-white/80 mt-0.5">
                Log today's taught chapters, upcoming topics, and upload lecture note materials
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Row 1: Semester FIRST, Subject SECOND (Shift is AUTO) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Semester Selector */}
            <div>
              <label className="block text-xs font-bold text-[#0f1f17] mb-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-[#0a4b32]" />
                <span>Semester</span> <span className="text-rose-500">*</span>
              </label>
              <select
                value={semester}
                onChange={handleSemesterChange}
                className="w-full h-10 px-3 rounded-xl border border-[#dce3df] bg-white text-xs font-semibold text-[#0f1f17] focus:outline-none focus:ring-2 focus:ring-[#0a4b32]"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Subject Selector (Filtered automatically by chosen Semester) */}
            <div>
              <label className="block text-xs font-bold text-[#0f1f17] mb-1 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-[#0a4b32]" />
                <span>Subject</span> <span className="text-rose-500">*</span>
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                required
                disabled={availableSubjects.length === 0}
                className="w-full h-10 px-3 rounded-xl border border-[#dce3df] bg-white text-xs font-semibold text-[#0f1f17] focus:outline-none focus:ring-2 focus:ring-[#0a4b32] disabled:bg-gray-100 disabled:text-gray-400"
              >
                {availableSubjects.length === 0 ? (
                  <option value="">No subjects assigned for Semester {semester}</option>
                ) : (
                  availableSubjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Row 2: Date & Chapter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0f1f17] mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#0a4b32]" />
                <span>Class Date</span> <span className="text-rose-500">*</span>
              </label>
              <Input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                required
                className="h-10 text-xs rounded-xl border-[#dce3df]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0f1f17] mb-1">
                Chapter / Unit <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="e.g. Chapter 3: Data Structures"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                required
                className="h-10 text-xs rounded-xl border-[#dce3df]"
              />
            </div>
          </div>

          {/* Row 3: Topics Covered (Using shadcn Textarea) */}
          <div>
            <label className="block text-xs font-bold text-[#0f1f17] mb-1">
              Topics Covered Today <span className="text-rose-500">*</span>
            </label>
            <Textarea
              rows={3}
              placeholder="Detail the concepts, theorems, or practical code demonstrated in class..."
              value={topicsCovered}
              onChange={(e) => setTopicsCovered(e.target.value)}
              required
              className="resize-y"
            />
          </div>

          {/* Row 4: Next Class Plan */}
          <div>
            <label className="block text-xs font-bold text-[#0f1f17] mb-1">
              Next Class Plan (Optional)
            </label>
            <Input
              placeholder="e.g. Bring lab notebooks, algorithm tracing..."
              value={nextClassPlan}
              onChange={(e) => setNextClassPlan(e.target.value)}
              className="h-10 text-xs rounded-xl border-[#dce3df]"
            />
          </div>

          {/* Row 5: Lecture Notes PDF Upload (Using Shared Uploader) */}
          <div className="pt-1">
            <PdfUploader
              value={notesUrl}
              onChange={(url) => setNotesUrl(url)}
            />
          </div>

          {/* Row 6: Smart Exam Reminder Section */}
          <div className="pt-3 border-t border-[#dce3df]">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#f7faf8] border border-[#dce3df]">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#c48b28]" />
                <div>
                  <h4 className="text-xs font-bold text-[#0f1f17]">
                    Announce Upcoming Exam / Class Test
                  </h4>
                  <p className="text-[11px] text-[#5a6b62]">
                    Sync with students' smart countdown widget
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={hasExam}
                onChange={(e) => setHasExam(e.target.checked)}
                className="w-4 h-4 text-[#0a4b32] rounded focus:ring-[#0a4b32] cursor-pointer"
              />
            </div>

            {hasExam && (
              <div className="mt-3 p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-3 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0f1f17] mb-1">
                      Exam Type
                    </label>
                    <select
                      value={examType}
                      onChange={(e) => setExamType(e.target.value)}
                      className="w-full h-9 px-2 rounded-lg border border-[#dce3df] bg-white text-xs font-semibold"
                    >
                      <option value="CLASS_TEST">Class Test</option>
                      <option value="QUIZ">Quiz</option>
                      <option value="MID_TERM">Mid Term</option>
                      <option value="SEMESTER_FINAL">Final Exam</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0f1f17] mb-1">
                      Exam Title
                    </label>
                    <Input
                      placeholder="e.g. CT 2: Memory Management"
                      value={examTitle}
                      onChange={(e) => setExamTitle(e.target.value)}
                      className="h-9 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0f1f17] mb-1">
                      Exam Date
                    </label>
                    <Input
                      type="date"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      className="h-9 text-xs bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0f1f17] mb-1">
                    Exam Syllabus / Topics
                  </label>
                  <Input
                    placeholder="Chapters 2 & 3, Paging algorithms, Numerical problems"
                    value={syllabus}
                    onChange={(e) => setSyllabus(e.target.value)}
                    className="h-9 text-xs bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 flex items-center justify-end gap-2 border-t border-[#dce3df]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="text-xs h-10 px-4 rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || availableSubjects.length === 0}
              className="bg-[#0a4b32] hover:bg-[#073825] text-white text-xs font-bold h-10 px-5 rounded-xl cursor-pointer"
            >
              {loading ? "Publishing Entry..." : "Publish Diary Entry"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
