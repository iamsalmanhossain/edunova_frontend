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
import { Award, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudentResultsManagerProps {
  user: AuthUser;
}

export default function StudentResultsManager({ user }: StudentResultsManagerProps) {
  const [data, setData] = useState<StudentResultsResponse | null>(null);
  const [loading, setLoading] = useState(true);
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
    } catch (err: unknown) {
      alert("Failed to download result PDF: " + (err instanceof Error ? err.message : "Error"));
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading && !data) {
    return <StudentResultsSkeleton />;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e4] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#0a4b32]/10 text-[#0a4b32] flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#0f1f17]">
                Examinations &amp; Marksheets
              </h1>
              <p className="text-xs sm:text-sm text-[#5a6b62]">
                Student Roll: {user.studentProfile?.rollNo || data?.student?.rollNo || "N/A"} • Registration:{" "}
                {user.studentProfile?.registrationNo || data?.student?.registrationNo || "N/A"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadResults}
            className="h-9 px-3 rounded-xl border-[#e2e8e4] text-xs font-semibold text-[#0a4b32]"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      <StudentResultsStatsCard stats={data?.stats || null} />

      {/* Results List */}
      <StudentResultsList
        results={data?.results || []}
        filters={filters}
        onFilterChange={handleFilterChange}
        onViewDetails={(examId) => setSelectedExamId(examId)}
        onDownloadPdf={handleDownloadPdf}
        downloadingId={downloadingId}
        loading={loading}
      />

      {/* Exam Details Modal */}
      <StudentExamDetailModal
        examId={selectedExamId}
        onClose={() => setSelectedExamId(null)}
      />
    </div>
  );
}
