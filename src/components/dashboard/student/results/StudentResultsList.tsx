"use client";

import React, { useState, useMemo, useEffect } from "react";
import { StudentPublishedResultItem } from "@/types/student";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Eye,
  Loader2,
  User,
  RotateCcw,
  Search,
  X,
  BookOpen,
  Filter,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StudentResultsListProps {
  results: StudentPublishedResultItem[];
  filters: {
    semester: string;
    examType: string;
  };
  currentSemester?: number;
  onFilterChange: (key: string, value: string) => void;
  onViewDetails: (examId: string) => void;
  onDownloadPdf: (examId: string, subjectName: string, examName?: string) => void;
  downloadingId: string | null;
  loading: boolean;
}

export default function StudentResultsList({
  results,
  filters,
  currentSemester,
  onFilterChange,
  onViewDetails,
  onDownloadPdf,
  downloadingId,
  loading,
}: StudentResultsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("ALL");

  const examTypes = [
    { label: "All Exam Types", value: "ALL" },
    { label: "Mid-Term Examination", value: "MID_TERM" },
    { label: "Final Semester Examination", value: "FINAL" },
    { label: "Class Assessment Test", value: "CLASS_TEST" },
    { label: "Quiz Evaluation", value: "QUIZ" },
    { label: "Lab / Practical Viva", value: "LAB_VIVA" },
  ];

  const semesters = [
    { label: "All Semesters", value: "" },
    { label: "Semester 1", value: "1" },
    { label: "Semester 2", value: "2" },
    { label: "Semester 3", value: "3" },
    { label: "Semester 4", value: "4" },
    { label: "Semester 5", value: "5" },
    { label: "Semester 6", value: "6" },
    { label: "Semester 7", value: "7" },
  ];

  // Extract distinct subjects from current result items
  const availableSubjects = useMemo(() => {
    const map = new Map<string, { id: string; name: string; code: string }>();
    results.forEach((r) => {
      if (r.subject?.id && !map.has(r.subject.id)) {
        map.set(r.subject.id, {
          id: r.subject.id,
          name: r.subject.name || "Subject",
          code: r.subject.code || "",
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [results]);

  // If selected subject is no longer in results, gracefully fallback to ALL
  useEffect(() => {
    if (selectedSubject !== "ALL" && !availableSubjects.some((s) => s.id === selectedSubject)) {
      setSelectedSubject("ALL");
    }
  }, [availableSubjects, selectedSubject]);

  // Real-time filter results by subject and search keyword
  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      // 1. Subject Filter
      if (selectedSubject !== "ALL" && r.subject?.id !== selectedSubject) {
        return false;
      }

      // 2. Search Keyword Filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const subjectName = r.subject?.name?.toLowerCase() || "";
        const subjectCode = r.subject?.code?.toLowerCase() || "";
        const examName = r.examName?.toLowerCase() || "";
        const teacherName = r.teacherName?.toLowerCase() || "";
        const grade = r.grade?.toLowerCase() || "";

        const matches =
          subjectName.includes(q) ||
          subjectCode.includes(q) ||
          examName.includes(q) ||
          teacherName.includes(q) ||
          grade === q;

        if (!matches) return false;
      }

      return true;
    });
  }, [results, selectedSubject, searchTerm]);

  const defaultSemesterStr = currentSemester ? String(currentSemester) : "";
  const hasActiveFilters =
    (filters.semester !== defaultSemesterStr && (filters.semester !== "" || defaultSemesterStr !== "")) ||
    filters.examType !== "ALL" ||
    selectedSubject !== "ALL" ||
    searchTerm.trim().length > 0;

  const handleResetFilters = () => {
    onFilterChange("semester", defaultSemesterStr);
    onFilterChange("examType", "ALL");
    setSelectedSubject("ALL");
    setSearchTerm("");
  };

  const selectedSubjectObj = availableSubjects.find((s) => s.id === selectedSubject);

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* 1. Filter & Search Controls */}
      <Card className="border-[#e2e8e4] bg-white rounded-2xl shadow-xs overflow-hidden">
        <CardContent className="p-3 sm:p-4 space-y-3">
          {/* Main Controls: Search bar + Select dropdowns */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5 sm:gap-3">
            {/* Live Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#718077] pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by subject, code, exam title, teacher..."
                className="w-full h-9.5 pl-9 pr-8 text-xs font-medium rounded-xl border border-[#e2e8e4] bg-[#fcfdfc] text-[#0f1f17] placeholder:text-[#88998f] focus:outline-none focus:ring-2 focus:ring-[#0a4b32]/10 focus:border-[#0a4b32] transition-colors"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Select dropdowns grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 shrink-0 lg:w-[540px]">
              {/* Semester Filter - Auto-selected to student's active semester */}
              <div className="relative">
                <select
                  value={filters.semester}
                  onChange={(e) => onFilterChange("semester", e.target.value)}
                  className="w-full h-9.5 px-3 text-xs font-semibold rounded-xl border border-[#e2e8e4] bg-[#fcfdfc] text-[#0f1f17] focus:outline-none focus:ring-2 focus:ring-[#0a4b32]/10 focus:border-[#0a4b32] cursor-pointer"
                >
                  {semesters.map((s) => {
                    const isCurrent = s.value && currentSemester && String(currentSemester) === s.value;
                    return (
                      <option key={s.value} value={s.value}>
                        {isCurrent ? `${s.label} (Current)` : s.label}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Subject Filter */}
              <div className="relative">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full h-9.5 px-3 text-xs font-semibold rounded-xl border border-[#e2e8e4] bg-[#fcfdfc] text-[#0f1f17] focus:outline-none focus:ring-2 focus:ring-[#0a4b32]/10 focus:border-[#0a4b32] cursor-pointer truncate"
                  title={selectedSubjectObj ? selectedSubjectObj.name : "All Subjects"}
                >
                  <option value="ALL">
                    All Subjects {availableSubjects.length > 0 ? `(${availableSubjects.length})` : ""}
                  </option>
                  {availableSubjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.code ? `${sub.code} - ` : ""}{sub.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Exam Type Filter */}
              <div className="relative">
                <select
                  value={filters.examType}
                  onChange={(e) => onFilterChange("examType", e.target.value)}
                  className="w-full h-9.5 px-3 text-xs font-semibold rounded-xl border border-[#e2e8e4] bg-[#fcfdfc] text-[#0f1f17] focus:outline-none focus:ring-2 focus:ring-[#0a4b32]/10 focus:border-[#0a4b32] cursor-pointer"
                >
                  {examTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reset Button (Desktop & responsive) */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-9 px-3 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl cursor-pointer self-end lg:self-auto shrink-0 gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </Button>
            )}
          </div>

          {/* Active Filter Badges & Semester Indicator */}
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5 text-[11px]">
            {/* Current semester indicator pill */}
            {currentSemester && filters.semester === String(currentSemester) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#0a4b32] font-semibold border border-emerald-200/80">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0a4b32]" />
                Enrolled: Semester {currentSemester}
              </span>
            )}

            {/* Filter chips with dismiss */}
            {selectedSubject !== "ALL" && selectedSubjectObj && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0a4b32]/10 text-[#0a4b32] font-semibold border border-[#0a4b32]/20">
                <BookOpen className="w-3 h-3" />
                <span className="truncate max-w-[160px] sm:max-w-[220px]">
                  {selectedSubjectObj.code ? `${selectedSubjectObj.code}: ` : ""}{selectedSubjectObj.name}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedSubject("ALL")}
                  className="hover:text-rose-600 p-0.5 cursor-pointer ml-0.5"
                  title="Remove subject filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 font-semibold border border-blue-200">
                <Search className="w-3 h-3" />
                <span>&quot;{searchTerm}&quot;</span>
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="hover:text-rose-600 p-0.5 cursor-pointer ml-0.5"
                  title="Clear search query"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.examType !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 font-semibold border border-amber-200">
                <Filter className="w-3 h-3" />
                <span>{filters.examType.replace(/_/g, " ")}</span>
                <button
                  type="button"
                  onClick={() => onFilterChange("examType", "ALL")}
                  className="hover:text-rose-600 p-0.5 cursor-pointer ml-0.5"
                  title="Clear exam type"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 2. Published Marksheets List */}
      <Card className="border-[#e2e8e4] bg-white rounded-2xl shadow-xs overflow-hidden">
        <CardHeader className="p-3.5 sm:p-5 border-b border-[#e2e8e4]/80 flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle className="text-sm sm:text-base font-bold text-[#0f1f17]">
              Published Examination Marksheets
            </CardTitle>
            <p className="text-[11px] sm:text-xs text-[#5a6b62]">
              Official evaluation records authorized by department faculty
            </p>
          </div>
          <Badge
            variant="outline"
            className="text-xs bg-[#0a4b32]/10 text-[#0a4b32] border-[#0a4b32]/20 font-bold shrink-0"
          >
            {filteredResults.length !== results.length
              ? `${filteredResults.length} of ${results.length} Published`
              : `${results.length} Published`}
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2.5 border-b border-[#f0f4f1] last:border-0"
                >
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-52 rounded" />
                    <Skeleton className="h-3 w-36 rounded" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-16 rounded-lg" />
                    <Skeleton className="h-8 w-24 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 sm:p-12 text-center text-[#5a6b62] space-y-2">
              <FileText className="w-8 h-8 mx-auto text-gray-300" />
              <p className="text-xs sm:text-sm font-bold text-[#0f1f17]">
                No published marksheets found
              </p>
              <p className="text-xs text-[#5a6b62]">
                {filters.semester
                  ? `No marks published yet for Semester ${filters.semester}.`
                  : "Your examination marks will appear here once instructors publish them."}
              </p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="p-8 sm:p-12 text-center text-[#5a6b62] space-y-2.5">
              <FileText className="w-8 h-8 mx-auto text-gray-300" />
              <p className="text-xs sm:text-sm font-bold text-[#0f1f17]">
                No matching marksheets found
              </p>
              <p className="text-xs text-[#5a6b62] max-w-sm mx-auto">
                {searchTerm
                  ? `No evaluation records matched "${searchTerm}". Try checking for spelling mistakes or clearing filters.`
                  : "No marksheet records matched your selected subject or exam type filter."}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="h-8.5 px-3 text-xs font-semibold rounded-xl border-[#e2e8e4] hover:bg-gray-50 text-[#0f1f17] cursor-pointer mt-1"
              >
                Clear Filters &amp; Search
              </Button>
            </div>
          ) : (
            <>
              {/* Desktop Table View (md:block) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#fcfdfc] text-xs font-semibold text-[#5a6b62] border-b border-[#e2e8e4]">
                    <tr>
                      <th className="py-3 px-4">Subject &amp; Code</th>
                      <th className="py-3 px-4">Examination</th>
                      <th className="py-3 px-4">Score / Total</th>
                      <th className="py-3 px-4">Grade &amp; GPA</th>
                      <th className="py-3 px-4">Teacher / Remarks</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f4f1] text-[#0f1f17]">
                    {filteredResults.map((r) => (
                      <tr key={r.markId} className="hover:bg-[#fcfdfc] transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-[#0f1f17] text-xs block">
                            {r.subject.name}
                          </span>
                          <span className="text-[11px] text-[#5a6b62] font-mono">
                            {r.subject.code} • Sem {r.semester}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-[#0f1f17] text-xs block">
                            {r.examName}
                          </span>
                          <span className="text-[10px] text-[#5a6b62] uppercase tracking-wider">
                            {r.examType.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-xs">
                          <span className="font-bold text-[#0a4b32]">{r.obtainedMarks}</span>
                          <span className="text-[#5a6b62]"> / {r.totalMarks} ({r.percentage}%)</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge
                            className={`text-xs font-black px-2.5 py-0.5 ${
                              r.grade === "A+" || r.grade === "A"
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200"
                                : r.grade === "F"
                                ? "bg-rose-100 text-rose-800 hover:bg-rose-100 border-rose-200"
                                : "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200"
                            }`}
                          >
                            {r.grade} ({r.gradePoint.toFixed(2)})
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-[#5a6b62]">
                          <span className="block font-medium text-[#0f1f17]">{r.teacherName || "Instructor"}</span>
                          <span className="italic truncate max-w-[180px] block text-[11px]">
                            {r.remarks || "No remarks added"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onViewDetails(r.examId)}
                              className="h-8 px-2.5 rounded-xl border-[#e2e8e4] text-xs font-semibold hover:border-[#0a4b32] text-[#0f1f17] cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1 text-[#0a4b32]" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={downloadingId === r.examId}
                              onClick={() => onDownloadPdf(r.examId, r.subject.name || r.subject.code, r.examName)}
                              className="h-8 px-2.5 rounded-xl border-[#e2e8e4] text-xs font-semibold hover:bg-emerald-50 text-emerald-800 cursor-pointer"
                            >
                              {downloadingId === r.examId ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                              ) : (
                                <Download className="w-3.5 h-3.5 mr-1 text-[#0a4b32]" />
                              )}
                              PDF
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View (md:hidden) */}
              <div className="md:hidden p-3 space-y-2.5">
                {filteredResults.map((r) => (
                  <div
                    key={r.markId}
                    className="p-3.5 rounded-xl border border-[#e2e8e4] bg-[#fcfdfc] space-y-2.5"
                  >
                    {/* Top row: Subject Code, Semester, Grade Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <span className="font-mono text-[10px] font-black text-[#0a4b32] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                            {r.subject.code}
                          </span>
                          <span className="text-[10px] text-[#5a6b62] bg-[#f0f4f1] px-1.5 py-0.5 rounded font-medium">
                            Sem {r.semester}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-[#0f1f17] line-clamp-1">
                          {r.subject.name}
                        </h4>
                      </div>

                      <Badge
                        className={`text-xs font-black shrink-0 px-2 py-0.5 ${
                          r.grade === "A+" || r.grade === "A"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : r.grade === "F"
                            ? "bg-rose-100 text-rose-800 border-rose-200"
                            : "bg-blue-100 text-blue-800 border-blue-200"
                        }`}
                      >
                        {r.grade} ({r.gradePoint.toFixed(2)})
                      </Badge>
                    </div>

                    {/* Examination details */}
                    <div className="flex items-center justify-between text-[11px] text-[#5a6b62]">
                      <span className="font-semibold text-[#0f1f17] truncate">{r.examName}</span>
                      <span className="text-[10px] uppercase font-bold text-[#0a4b32] bg-emerald-50/80 px-1.5 py-0.2 rounded border border-emerald-100 shrink-0">
                        {r.examType.replace(/_/g, " ")}
                      </span>
                    </div>

                    {/* Score Breakdown Pill */}
                    <div className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-[#e8ecea]">
                      <span className="text-[#5a6b62] text-[11px]">Marks Obtained:</span>
                      <span className="font-bold text-[#0a4b32]">
                        {r.obtainedMarks} / {r.totalMarks} ({r.percentage}%)
                      </span>
                    </div>

                    {/* Instructor / Remarks info if available */}
                    {r.teacherName && (
                      <div className="text-[10px] text-[#5a6b62] flex items-center gap-1 pt-0.5">
                        <User className="w-3 h-3 text-[#718077]" />
                        <span>Evaluator: <strong className="text-[#0f1f17]">{r.teacherName}</strong></span>
                      </div>
                    )}

                    {/* Action Buttons: Details & PDF download */}
                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(r.examId)}
                        className="flex-1 h-9 rounded-xl text-xs font-bold cursor-pointer border-[#dce3df] hover:border-[#0a4b32] text-[#0f1f17] gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#0a4b32]" />
                        <span>View Details</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={downloadingId === r.examId}
                        onClick={() => onDownloadPdf(r.examId, r.subject.name || r.subject.code, r.examName)}
                        className="flex-1 h-9 rounded-xl text-xs font-bold text-emerald-800 border-emerald-200 hover:bg-emerald-50 cursor-pointer gap-1"
                      >
                        {downloadingId === r.examId ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0a4b32]" />
                        ) : (
                          <Download className="w-3.5 h-3.5 text-[#0a4b32]" />
                        )}
                        <span>Marksheet PDF</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
