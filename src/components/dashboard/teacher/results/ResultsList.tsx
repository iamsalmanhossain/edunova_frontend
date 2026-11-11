"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  FileSpreadsheet,
  FileText,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  Eye,
  AlertCircle,
  Code2,
  BookOpen,
  MoreVertical,
  X,
  ChevronDown,
  Sparkles,
  Award,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/ui/pagination";
import { teacherService } from "@/services/teacher.service";
import {
  TeacherResultListItem,
  TeacherSubject,
  ExamType,
  ResultPublicationStatus,
} from "@/types/teacher";
import ResultsSkeleton from "./ResultsSkeleton";
import CreateResultModal from "./CreateResultModal";
import ImportExcelModal from "./ImportExcelModal";
import PasteJsonModal from "./PasteJsonModal";
import ResultGuideModal from "./ResultGuideModal";
import MasterSubjectOverviewModal from "./MasterSubjectOverviewModal";
import { downloadClassPdfFile, downloadClassExcelFile } from "@/utils/fileDownload";
import { appConfirm } from "@/store/useConfirmStore";

interface ResultsListProps {
  currentShift: "FIRST_SHIFT" | "SECOND_SHIFT";
}

export default function ResultsList({ currentShift }: ResultsListProps) {
  const [results, setResults] = useState<TeacherResultListItem[]>([]);
  const [subjects, setSubjects] = useState<TeacherSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedSemester, setSelectedSemester] = useState<string>("all");
  const [selectedExamType, setSelectedExamType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [refreshIndex, setRefreshIndex] = useState(0);

  // Pagination (10 exams per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Modals & Menus
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isPasteJsonOpen, setIsPasteJsonOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isMasterOverviewOpen, setIsMasterOverviewOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [importMode, setImportMode] = useState<"csv" | "excel">("excel");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Close 3-dots dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        // Load subjects
        try {
          const subRes = await teacherService.getMarksSubjects();
          if (mounted && subRes?.data && subRes.data.length > 0) {
            setSubjects(
              subRes.data.map((d) => ({
                id: d.id,
                code: d.code,
                name: d.name,
                semester: d.semester,
              }))
            );
          } else {
            const overviewRes = await teacherService.getOverview();
            if (mounted && (overviewRes as unknown as { subjects?: TeacherSubject[] })?.subjects) {
              setSubjects((overviewRes as unknown as { subjects: TeacherSubject[] }).subjects);
            }
          }
        } catch {
          // Fallback if subjects fail to load
        }

        const res = await teacherService.getResults({
          semester: selectedSemester !== "all" ? Number(selectedSemester) : undefined,
          examType: selectedExamType !== "all" ? (selectedExamType as ExamType) : undefined,
          status: selectedStatus !== "all" ? (selectedStatus as ResultPublicationStatus) : undefined,
          search: searchTerm.trim() || undefined,
        });

        if (mounted) {
          setResults(res.results || []);
          setError(null);
          setLoading(false);
        }
      } catch (err: unknown) {
        const errorObj = err as { message?: string };
        if (mounted) {
          setError(errorObj.message || "Failed to load examination results.");
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [selectedSemester, selectedExamType, selectedStatus, searchTerm, refreshIndex]);

  // Handle Publish Toggle
  const handleTogglePublish = async (id: string, currentStatus: ResultPublicationStatus) => {
    try {
      setActionLoadingId(id);
      const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
      await teacherService.updatePublicationStatus(id, newStatus);
      setResults((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      showToast(
        newStatus === "PUBLISHED"
          ? "Exam marks published to students successfully!"
          : "Exam marked as Draft."
      );
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      showToast(errorObj.message || "Failed to update publication status.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Delete
  const handleDeleteResult = async (id: string, examName: string) => {
    const confirmed = await appConfirm({
      title: "Delete Examination Results",
      message: `Are you sure you want to permanently delete examination "${examName}" and all associated student marks? This cannot be undone.`,
      confirmText: "Delete Exam",
      variant: "destructive",
    });
    if (!confirmed) return;

    try {
      setActionLoadingId(id);
      await teacherService.deleteResult(id);
      setResults((prev) => prev.filter((r) => r.id !== id));
      showToast(`Exam "${examName}" deleted successfully.`);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      showToast(errorObj.message || "Failed to delete result.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle PDF Download
  const handleDownloadPdf = async (id: string, subjectName?: string, examName?: string) => {
    try {
      setActionLoadingId(`pdf-${id}`);
      await downloadClassPdfFile(id, subjectName, examName);
      showToast("Class Result PDF downloaded successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to download PDF marksheet.";
      showToast(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Excel Export
  const handleDownloadExcel = async (id: string, subjectName?: string, examName?: string) => {
    try {
      setActionLoadingId(`excel-${id}`);
      await downloadClassExcelFile(id, subjectName, examName);
      showToast("Class Result Excel spreadsheet downloaded successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to download Excel spreadsheet.";
      showToast(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Reset pagination on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSemester, selectedExamType, selectedStatus, searchTerm]);

  const totalPages = Math.ceil(results.length / pageSize) || 1;

  const paginatedResults = useMemo(() => {
    if (results.length > pageSize) {
      const startIndex = (currentPage - 1) * pageSize;
      return results.slice(startIndex, startIndex + pageSize);
    }
    return results;
  }, [results, currentPage, pageSize]);

  const hasActiveFilters =
    selectedSemester !== "all" ||
    selectedExamType !== "all" ||
    selectedStatus !== "all" ||
    searchTerm.trim() !== "";

  if (loading && results.length === 0) {
    return <ResultsSkeleton />;
  }

  const handleResetFilters = () => {
    setSelectedSemester("all");
    setSelectedExamType("all");
    setSelectedStatus("all");
    setSearchTerm("");
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-24 sm:pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#073825] text-white shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-[#c48b28]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner & Quick Actions */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-50/50 via-white to-slate-50/40 border border-[#dce3df] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-emerald-100 text-[#0a4b32]">
                <Award className="w-4 h-4 text-emerald-800" />
              </span>
              <span className="text-[11px] font-black tracking-widest text-[#0a4b32] uppercase">
                Marks &amp; Examinations
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0f1f17] tracking-tight mt-1">
              Student Marks &amp; Results
            </h1>
            <p className="text-xs text-[#5a6b62] mt-0.5 font-medium">
              Record student marks, manage midterms, publish results, and generate official marksheets
            </p>
          </div>

          {/* Action Buttons: Redesigned for Mobile Ergonomics */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            {/* Primary Action Button: Enter Results */}
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="h-10 px-4 text-xs font-black bg-[#0a4b32] hover:bg-[#073825] text-white shadow-sm cursor-pointer flex items-center justify-center gap-2 rounded-xl transition-all"
            >
              <Plus className="w-4 h-4 text-[#c48b28]" />
              <span>Enter Exam Results</span>
            </Button>

            {/* Secondary Actions Row */}
            <div className="flex items-center gap-2">
              {/* Master Overview Export */}
              <Button
                onClick={() => setIsMasterOverviewOpen(true)}
                variant="outline"
                className="flex-1 sm:flex-initial h-10 px-3 text-xs font-bold border-[#dce3df] bg-white hover:bg-[#f0f7f3] text-[#0a4b32] cursor-pointer flex items-center justify-center gap-1.5 rounded-xl transition-all shadow-2xs"
                title="Export Landscape Subject Master Overview PDF"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#0a4b32]" />
                <span className="text-xs">Master Overview</span>
                <span className="text-[10px] bg-emerald-100 text-[#0a4b32] px-1 py-0.2 rounded font-black">PDF</span>
              </Button>

              {/* Guidelines & Documentation */}
              <Button
                onClick={() => setIsGuideOpen(true)}
                variant="outline"
                className="h-10 w-10 p-0 border-[#dce3df] bg-white hover:bg-[#f0f7f3] hover:text-[#0a4b32] cursor-pointer flex items-center justify-center rounded-xl transition-colors shadow-2xs shrink-0"
                title="Result Guidelines & Rules"
                aria-label="Result Guidelines & Rules"
              >
                <BookOpen className="w-4 h-4 text-[#0a4b32]" />
              </Button>

              {/* 3-Dots Menu Dropdown */}
              <div className="relative" ref={menuRef}>
                <Button
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  variant="outline"
                  className={`h-10 w-10 p-0 border-[#dce3df] bg-white hover:bg-[#f0f7f3] hover:text-[#0a4b32] cursor-pointer flex items-center justify-center rounded-xl transition-all shadow-2xs shrink-0 ${
                    isMenuOpen ? "bg-[#f0f7f3] text-[#0a4b32] border-[#0a4b32]" : ""
                  }`}
                  title="More Import Options"
                  aria-label="More Import Options"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>

                {isMenuOpen && (
                  <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl bg-white border border-[#dce3df] shadow-2xl py-1.5 animate-in fade-in zoom-in-95 duration-150 divide-y divide-[#f0f4f1]">
                    <div className="p-1 space-y-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsPasteJsonOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-[#0f1f17] hover:bg-[#f0f7f3] hover:text-[#0a4b32] rounded-xl transition-colors text-left cursor-pointer"
                      >
                        <Code2 className="w-4 h-4 text-[#c48b28] shrink-0" />
                        <div>
                          <div className="font-bold">Paste JSON Result</div>
                          <div className="text-[10px] text-[#5a6b62]">Import marks via raw JSON</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setImportMode("csv");
                          setIsImportOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-[#0f1f17] hover:bg-[#f0f7f3] hover:text-[#0a4b32] rounded-xl transition-colors text-left cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                        <div>
                          <div className="font-bold">Import from CSV</div>
                          <div className="text-[10px] text-[#5a6b62]">Upload comma-separated file</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setImportMode("excel");
                          setIsImportOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-[#0f1f17] hover:bg-[#f0f7f3] hover:text-[#0a4b32] rounded-xl transition-colors text-left cursor-pointer"
                      >
                        <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <div className="font-bold">Import from Excel</div>
                          <div className="text-[10px] text-[#5a6b62]">Upload spreadsheet (.xlsx)</div>
                        </div>
                      </button>
                    </div>

                    <div className="p-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsGuideOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#5a6b62] hover:bg-[#f0f7f3] hover:text-[#0a4b32] rounded-xl transition-colors text-left cursor-pointer"
                      >
                        <BookOpen className="w-4 h-4 text-[#0a4b32] shrink-0" />
                        <span>Documentation &amp; Rules</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-3 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Compact, Modern Filter Bar */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#dce3df] shadow-xs space-y-3">
        {/* Row 1: Search Field */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#5a6b62] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by exam name or course subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-9 pr-8 text-xs font-semibold rounded-xl border border-[#dce3df] bg-white text-[#0f1f17] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0a4b32]"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Row 2: 3 Compact Dropdowns Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-2">
          {/* Semester Filter */}
          <div className="relative">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full h-8.5 pl-2.5 pr-7 rounded-xl border border-[#dce3df] bg-[#fafbf9] text-xs font-bold text-[#0f1f17] focus:outline-none focus:ring-2 focus:ring-[#0a4b32] appearance-none cursor-pointer truncate"
            >
              <option value="all">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#5a6b62] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Exam Type Filter */}
          <div className="relative">
            <select
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
              className="w-full h-8.5 pl-2.5 pr-7 rounded-xl border border-[#dce3df] bg-[#fafbf9] text-xs font-bold text-[#0f1f17] focus:outline-none focus:ring-2 focus:ring-[#0a4b32] appearance-none cursor-pointer truncate"
            >
              <option value="all">All Exam Types</option>
              <option value="MID_TERM">Midterm</option>
              <option value="CLASS_TEST">Class Test</option>
              <option value="FINAL">Final</option>
              <option value="QUIZ">Quiz</option>
              <option value="ASSIGNMENT">Assignment</option>
              <option value="LAB">Lab / Practical</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#5a6b62] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-8.5 pl-2.5 pr-7 rounded-xl border border-[#dce3df] bg-[#fafbf9] text-xs font-bold text-[#0f1f17] focus:outline-none focus:ring-2 focus:ring-[#0a4b32] appearance-none cursor-pointer truncate"
            >
              <option value="all">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#5a6b62] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Filter Summary & Reset Pill */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-[#f0f4f1] flex items-center justify-between text-[11px] text-[#5a6b62]">
            <span>Filters active: showing {results.length} exam result{results.length === 1 ? "" : "s"}</span>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[#0a4b32] font-bold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Results Grid / Empty State */}
      {results.length === 0 ? (
        <div className="p-8 sm:p-12 text-center bg-white rounded-2xl sm:rounded-3xl border-2 border-dashed border-[#dce3df] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0a4b32] flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-[#0f1f17]">No Examination Results Found</h3>
          <p className="text-xs text-[#5a6b62] max-w-md mx-auto">
            {hasActiveFilters
              ? "No exams match your filter criteria. Try resetting the filters or searching with another keyword."
              : "No exam marks recorded yet. Click 'Enter Exam Results' to submit marks for your students."}
          </p>
          <div className="pt-2">
            {hasActiveFilters ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleResetFilters}
                className="h-9 px-4 text-xs font-bold border-[#dce3df] text-[#0a4b32] rounded-xl cursor-pointer"
              >
                Clear All Filters
              </Button>
            ) : (
              <Button
                onClick={() => setIsCreateOpen(true)}
                className="h-9 px-5 text-xs font-black bg-[#0a4b32] hover:bg-[#073825] text-white rounded-xl shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 mr-1 text-[#c48b28]" />
                Enter First Exam Result
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            key={currentPage}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 animate-in fade-in-50 slide-in-from-bottom-2 duration-300"
          >
            {paginatedResults.map((item) => {
              const isPublished = item.status === "PUBLISHED";
              const isLoadingThis = actionLoadingId === item.id;
              const marksEntered = item.stats?.marksEnteredCount ?? 0;
              const totalStudents = item.stats?.totalEligibleStudents ?? 0;
              const completionPct = totalStudents > 0 ? Math.round((marksEntered / totalStudents) * 100) : 0;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#dce3df] p-4 sm:p-5 shadow-xs hover:border-emerald-200 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    {/* Status & Type Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#0a4b32] border border-emerald-100 uppercase tracking-wider">
                        {item.examType.replace("_", " ")}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(item.id, item.status)}
                        disabled={isLoadingThis}
                        title="Click to toggle publication status"
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors cursor-pointer ${
                          isPublished
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                        }`}
                      >
                        {isPublished ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Exam Name & Subject */}
                    <h3 className="text-sm sm:text-base font-black text-[#0f1f17] mt-2.5 leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs font-bold text-[#0a4b32] mt-0.5 truncate">
                      {item.subject?.code} - {item.subject?.name}
                    </p>

                    {/* Metadata Grid */}
                    <div className="mt-3 pt-3 border-t border-[#f0f4f1] grid grid-cols-2 gap-2 text-xs text-[#5a6b62]">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#8a9b92] block">
                          Semester &amp; Session
                        </span>
                        <span className="font-bold text-[#0f1f17]">
                          Sem {item.semester} • {item.session}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#8a9b92] block">
                          Total Marks
                        </span>
                        <span className="font-bold text-[#0f1f17]">
                          {item.totalMarks} {item.passMarks ? `(Pass: ${item.passMarks})` : ""}
                        </span>
                      </div>
                    </div>

                    {/* Marks Entry Progress Bar */}
                    {totalStudents > 0 && (
                      <div className="mt-3 p-2.5 rounded-xl bg-[#fafbf9] border border-[#f0f4f1] space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#5a6b62]">
                          <span>Marks Entry Progress:</span>
                          <span className="text-[#0f1f17]">
                            {marksEntered} / {totalStudents} Students ({completionPct}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-[#eaf4ef] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full transition-all"
                            style={{ width: `${completionPct}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Actions Footer */}
                  <div className="pt-3 border-t border-[#f0f4f1] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleDownloadPdf(item.id, item.subject?.name, item.name)}
                        disabled={actionLoadingId === `pdf-${item.id}`}
                        title="Download PDF Marksheet"
                        className="w-8 h-8 rounded-xl bg-[#f0f4f1] hover:bg-[#e4ece7] text-[#0f1f17] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadExcel(item.id, item.subject?.name, item.name)}
                        disabled={actionLoadingId === `excel-${item.id}`}
                        title="Export to Excel"
                        className="w-8 h-8 rounded-xl bg-[#f0f4f1] hover:bg-[#e4ece7] text-[#0f1f17] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteResult(item.id, item.name)}
                        disabled={isLoadingThis}
                        title="Delete Exam"
                        className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <Link href={`/dashboard/teacher/results/${item.id}`}>
                      <Button
                        variant="outline"
                        className="h-8.5 px-3 text-xs font-black border-[#0a4b32] text-[#0a4b32] hover:bg-[#0a4b32] hover:text-white cursor-pointer flex items-center gap-1.5 rounded-xl transition-all shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Marksheet</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={results.length}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
            itemLabel="exam results"
            className="rounded-2xl border border-[#dce3df]"
          />
        </div>
      )}

      {/* Modals */}
      <CreateResultModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        subjects={subjects}
        currentShift={currentShift}
        existingResults={results}
        onResultCreated={() => {
          setIsCreateOpen(false);
          setRefreshIndex((p) => p + 1);
        }}
      />

      <ImportExcelModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        subjects={subjects}
        currentShift={currentShift}
        importMode={importMode}
        onImportSuccess={() => {
          setIsImportOpen(false);
          setRefreshIndex((p) => p + 1);
        }}
      />

      <PasteJsonModal
        isOpen={isPasteJsonOpen}
        onClose={() => setIsPasteJsonOpen(false)}
        subjects={subjects}
        onImportSuccess={() => {
          setIsPasteJsonOpen(false);
          setRefreshIndex((p) => p + 1);
        }}
      />

      <ResultGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <MasterSubjectOverviewModal
        isOpen={isMasterOverviewOpen}
        onClose={() => setIsMasterOverviewOpen(false)}
        subjects={subjects}
        currentShift={currentShift}
      />
    </div>
  );
}
