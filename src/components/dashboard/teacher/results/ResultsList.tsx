"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        // Load subjects for creating results
        const overviewRes = await teacherService.getOverview();
        if (mounted) {
          if (overviewRes && (overviewRes as unknown as { subjects?: TeacherSubject[] }).subjects) {
            setSubjects((overviewRes as unknown as { subjects: TeacherSubject[] }).subjects);
          } else {
            setSubjects([
              { id: "s-cst-401", code: "66641", name: "Data Structure & Algorithms", semester: 4 },
              { id: "s-cst-402", code: "66642", name: "Database Management Systems", semester: 4 },
              { id: "s-cst-601", code: "66661", name: "Web Development & Frameworks", semester: 6 },
            ]);
          }
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
    if (!window.confirm(`Are you sure you want to delete "${examName}" and all associated student marks?`)) {
      return;
    }

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
  const handleDownloadPdf = async (id: string, examName: string) => {
    try {
      setActionLoadingId(`pdf-${id}`);
      const blob = await teacherService.downloadClassPdf(id, true);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${examName.replace(/\s+/g, "_")}_Marksheet.pdf`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 1000);
      showToast("Class Result PDF downloaded successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to download PDF marksheet.";
      showToast(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Excel Export
  const handleDownloadExcel = async (id: string, examName: string) => {
    try {
      setActionLoadingId(`excel-${id}`);
      const blob = await teacherService.downloadClassExcel(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${examName.replace(/\s+/g, "_")}_Marksheet.xlsx`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 1000);
      showToast("Class Result Excel spreadsheet downloaded successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to download Excel spreadsheet.";
      showToast(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading && results.length === 0) {
    return <ResultsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-[#073825] text-white shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-[#c48b28]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white border border-[#dce3df] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0a4b32]" />
            <span className="text-[10px] font-bold tracking-widest text-[#0a4b32] uppercase">
              Marks & Examinations
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f1f17] mt-1">
            Student Marks & Results Management
          </h1>
          <p className="text-xs text-[#5a6b62] mt-0.5">
            Submit marks, publish class exam results, and export PDF/Excel marksheets
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            onClick={() => setIsImportOpen(true)}
            variant="outline"
            className="h-10 px-4 text-xs font-bold border-[#dce3df] hover:bg-[#f0f7f3] hover:text-[#0a4b32] cursor-pointer flex items-center gap-1.5 rounded-xl"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Import Excel
          </Button>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="h-10 px-4 text-xs font-bold bg-[#0a4b32] hover:bg-[#073825] text-white shadow-xs cursor-pointer flex items-center gap-1.5 rounded-xl"
          >
            <Plus className="w-4 h-4 text-[#c48b28]" />
            Enter Results
          </Button>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-3 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-xl bg-white border border-[#dce3df] shadow-xs flex flex-wrap items-center gap-3">
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

        {/* Exam Type Filter */}
        <div className="w-40">
          <select
            value={selectedExamType}
            onChange={(e) => setSelectedExamType(e.target.value)}
            className="w-full h-9 rounded-md border border-[#dce3df] bg-white px-2.5 text-xs text-[#0f1f17] font-medium focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
          >
            <option value="all">All Exam Types</option>
            <option value="MID_TERM">Midterm</option>
            <option value="CLASS_TEST">Class Test</option>
            <option value="FINAL">Final</option>
            <option value="QUIZ">Quiz</option>
            <option value="ASSIGNMENT">Assignment</option>
            <option value="LAB">Lab / Practical</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-36">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full h-9 rounded-md border border-[#dce3df] bg-white px-2.5 text-xs text-[#0f1f17] font-medium focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
          >
            <option value="all">All Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>

        {/* Search Field */}
        <div className="flex-1 min-w-[220px] relative">
          <Search className="w-3.5 h-3.5 text-[#5a6b62] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            placeholder="Search by exam name or course subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 pl-8 text-xs bg-white"
          />
        </div>
      </div>

      {/* Results Grid */}
      {results.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#dce3df] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0a4b32]/10 text-[#0a4b32] flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-[#0f1f17]">No Examination Results Found</h3>
          <p className="text-xs text-[#5a6b62] max-w-md mx-auto">
            No exams matching your filter criteria. Click &quot;Enter Results&quot; to submit a new exam marksheet or &quot;Import Excel&quot; to upload spreadsheet data.
          </p>
          <div className="pt-2">
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="h-9 px-4 text-xs font-bold bg-[#0a4b32] hover:bg-[#073825] text-white cursor-pointer"
            >
              Enter First Exam Result
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((item) => {
            const isPublished = item.status === "PUBLISHED";
            const isLoadingThis = actionLoadingId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#dce3df] p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Status & Type Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#f0f7f3] text-[#0a4b32] uppercase tracking-wider">
                      {item.examType.replace("_", " ")}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(item.id, item.status)}
                      disabled={isLoadingThis}
                      title="Click to toggle publication status"
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 transition-colors cursor-pointer ${
                        isPublished
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                      }`}
                    >
                      {isPublished ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Published
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 text-amber-600" />
                          Draft
                        </>
                      )}
                    </button>
                  </div>

                  {/* Exam Name & Subject */}
                  <h3 className="text-base font-extrabold text-[#0f1f17] mt-2.5">
                    {item.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#0a4b32] mt-0.5">
                    {item.subject?.code} - {item.subject?.name}
                  </p>

                  {/* Metadata */}
                  <div className="mt-3 pt-3 border-t border-[#f0f4f1] grid grid-cols-2 gap-2 text-xs text-[#5a6b62]">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8a9b92] block">
                        Semester & Session
                      </span>
                      <span className="font-semibold text-[#0f1f17]">
                        Sem {item.semester} • {item.session}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8a9b92] block">
                        Total Marks
                      </span>
                      <span className="font-semibold text-[#0f1f17]">
                        {item.totalMarks} {item.passMarks ? `(Pass: ${item.passMarks})` : ""}
                      </span>
                    </div>
                  </div>

                  {/* Marks Entry Progress */}
                  {item.stats && (
                    <div className="mt-2.5 p-2 rounded-lg bg-[#f4f7f5] text-[11px] text-[#5a6b62] flex items-center justify-between font-medium">
                      <span>Entered Marks:</span>
                      <span className="font-bold text-[#0f1f17]">
                        {item.stats.marksEnteredCount ?? 0} / {item.stats.totalEligibleStudents ?? 0} Students
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-[#f0f4f1] flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDownloadPdf(item.id, item.name)}
                      disabled={actionLoadingId === `pdf-${item.id}`}
                      title="Download PDF Marksheet"
                      className="w-8 h-8 rounded-lg bg-[#f0f4f1] hover:bg-[#e4ece7] text-[#0f1f17] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadExcel(item.id, item.name)}
                      disabled={actionLoadingId === `excel-${item.id}`}
                      title="Export to Excel"
                      className="w-8 h-8 rounded-lg bg-[#f0f4f1] hover:bg-[#e4ece7] text-[#0f1f17] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteResult(item.id, item.name)}
                      disabled={isLoadingThis}
                      title="Delete Exam"
                      className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <Link href={`/dashboard/teacher/results/${item.id}`}>
                    <Button
                      variant="outline"
                      className="h-8 px-3 text-xs font-bold border-[#0a4b32] text-[#0a4b32] hover:bg-[#0a4b32] hover:text-white cursor-pointer flex items-center gap-1 rounded-lg"
                    >
                      <Eye className="w-3 h-3" />
                      Marksheet
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <CreateResultModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        subjects={subjects}
        currentShift={currentShift}
        onResultCreated={() => setRefreshIndex((p) => p + 1)}
      />

      <ImportExcelModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        subjects={subjects}
        currentShift={currentShift}
        onImportSuccess={() => setRefreshIndex((p) => p + 1)}
      />
    </div>
  );
}
