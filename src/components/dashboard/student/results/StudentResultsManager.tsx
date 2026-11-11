"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AuthUser } from "@/types/auth";
import { StudentResultsResponse } from "@/types/student";
import { studentService } from "@/services/student.service";
import StudentResultsStatsCard from "./StudentResultsStatsCard";
import StudentResultsList from "./StudentResultsList";
import StudentExamDetailModal from "./StudentExamDetailModal";
import StudentResultsSkeleton from "@/components/dashboard/skeletons/StudentResultsSkeleton";
import { downloadSecureFile } from "@/utils/fileDownload";
import { appToast } from "@/store/useToastStore";
import { Award, RefreshCw, AlertCircle, FileCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudentResultsManagerProps {
  user: AuthUser;
}

export default function StudentResultsManager({ user }: StudentResultsManagerProps) {
  const [data, setData] = useState<StudentResultsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filters, setFilters] = useState({
    semester: "",
    examType: "ALL",
  });

  // Modal & Download states
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const loadResults = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await studentService.getResults({
        semester: filters.semester ? Number(filters.semester) : undefined,
        examType: filters.examType !== "ALL" ? filters.examType : undefined,
      });
      setData(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load examination results";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadResults();
  }, [loadResults]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadResults();
    setIsRefreshing(false);
  };

  const handleDownloadPdf = async (examId: string, subjectName: string, examName?: string) => {
    try {
      setDownloadingId(examId);
      const cleanSub = subjectName
        ? subjectName.trim().replace(/[^a-zA-Z0-9_\-\s]/g, "").replace(/\s+/g, "_")
        : "Academic";
      const cleanExam = examName
        ? examName.trim().replace(/[^a-zA-Z0-9_\-\s]/g, "").replace(/\s+/g, "_")
        : "Marksheet";
      await downloadSecureFile(
        `/dashboard/student/results/${examId}/pdf?download=true`,
        `${cleanSub}_${cleanExam}_Transcript.pdf`
      );
      appToast.success("Official result PDF downloaded successfully!", "Marksheet Downloaded");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error downloading marks record.";
      appToast.error(msg, "Download Failed");
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading && !data) {
    return <StudentResultsSkeleton />;
  }

  const rollNo = user.studentProfile?.rollNo || data?.student?.rollNo || "N/A";
  const regNo = user.studentProfile?.registrationNo || data?.student?.registrationNo || "N/A";
  const deptName = user.studentProfile?.department?.name || "Diploma Engineering";
  const shiftText =
    user.studentProfile?.shift === "SECOND_SHIFT" ? "Shift 2 (Day)" : "Shift 1 (Morning)";

  return (
    <div className="space-y-4 sm:space-y-5 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* 1. Header Banner - Matching Signature Theme */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#073825] via-[#0a4b32] to-[#042417] text-white p-4 sm:p-6 shadow-lg shadow-[#0a4b32]/10 border border-[#0d593c]">
        {/* Ambient background decoration */}
        <div className="pointer-events-none absolute -right-12 -top-12 w-48 h-48 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-8 -bottom-8 w-40 h-40 rounded-full bg-[#c48b28]/15 blur-2xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            {/* Pill & Identity */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/12 text-white text-[10px] sm:text-[11px] font-semibold border border-white/15 backdrop-blur-xs">
                <Award className="w-3 h-3 text-[#c48b28]" />
                <span>Roll: {rollNo} • Reg: {regNo}</span>
              </div>
              <span className="hidden xs:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-[10px] font-bold border border-emerald-400/25">
                <ShieldCheck className="w-3 h-3 text-[#c48b28]" />
                <span>BTEB Standard Marksheets</span>
              </span>
            </div>

            {/* Title */}
            <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Examinations &amp; Marksheets</span>
            </h1>

            {/* Subtext */}
            <p className="text-[11px] sm:text-xs text-emerald-100/80 max-w-xl leading-relaxed">
              Official evaluation records, cumulative GPA, letter grades, and printable PDF marksheets authorized by Kishoreganj Polytechnic Institute faculty.
            </p>
          </div>

          {/* Refresh Action */}
          <div className="shrink-0 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-8.5 sm:h-9 px-3.5 rounded-xl border-white/25 bg-white/12 hover:bg-white/20 active:scale-[0.98] text-white text-xs font-bold transition-all shadow-xs cursor-pointer backdrop-blur-xs gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#c48b28] ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Updating..." : "Refresh Results"}</span>
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3.5 sm:p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{error}</span>
        </div>
      )}

      {/* 2. Stats KPI Cards */}
      <StudentResultsStatsCard stats={data?.stats || null} />

      {/* 3. Results List with Mobile Cards */}
      <StudentResultsList
        results={data?.results || []}
        filters={filters}
        onFilterChange={handleFilterChange}
        onViewDetails={(examId) => setSelectedExamId(examId)}
        onDownloadPdf={handleDownloadPdf}
        downloadingId={downloadingId}
        loading={loading}
      />

      {/* 4. Exam Details Modal */}
      <StudentExamDetailModal
        examId={selectedExamId}
        onClose={() => setSelectedExamId(null)}
      />
    </div>
  );
}
