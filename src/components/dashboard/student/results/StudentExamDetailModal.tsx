"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Award,
  BookOpen,
  Calendar,
  User,
  Download,
  Loader2,
  AlertCircle,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadSecureFile } from "@/utils/fileDownload";
import { Badge } from "@/components/ui/badge";
import { studentService } from "@/services/student.service";
import { StudentExamDetailData } from "@/types/student";

interface StudentExamDetailModalProps {
  examId: string | null;
  onClose: () => void;
}

export default function StudentExamDetailModal({
  examId,
  onClose,
}: StudentExamDetailModalProps) {
  const [data, setData] = useState<StudentExamDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!examId) return;
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const detail = await studentService.getResultDetails(examId!);
        if (mounted) setData(detail);
      } catch (err: unknown) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load result details");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [examId]);

  if (!examId) return null;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const rawSub = data?.subject?.name || data?.subject?.code || "Academic";
      const rawExam = data?.examName || "Result";
      const cleanSub = rawSub.trim().replace(/[^a-zA-Z0-9_\-\s]/g, "").replace(/\s+/g, "_");
      const cleanExam = rawExam.trim().replace(/[^a-zA-Z0-9_\-\s]/g, "").replace(/\s+/g, "_");
      await downloadSecureFile(
        `/dashboard/student/results/${examId}/pdf?download=true`,
        `${cleanSub}_${cleanExam}_Transcript.pdf`
      );
    } catch (err: unknown) {
      alert("Failed to download PDF: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-[#dce3df] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#e2e8e4] flex items-center justify-between bg-[#fcfdfc]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0a4b32]/10 text-[#0a4b32] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#0f1f17]">
                Exam Marksheet Details
              </h3>
              <p className="text-xs text-[#5a6b62]">
                Official evaluation record
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-[#0a4b32] animate-spin" />
              <p className="text-xs text-[#5a6b62]">Fetching official marks record...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          ) : data ? (
            <div className="space-y-4">
              {/* Exam Info Card */}
              <div className="p-4 rounded-2xl bg-[#f0f4f1]/50 border border-[#e2e8e4] space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs bg-[#0a4b32] text-white font-bold">
                    {data.examType.replace(/_/g, " ")}
                  </Badge>
                  <span className="text-xs text-[#5a6b62]">
                    Semester {data.semester} • {data.session || "Current Session"}
                  </span>
                </div>
                <h4 className="text-base font-black text-[#0f1f17]">
                  {data.subject.name}
                </h4>
                <p className="text-xs text-[#5a6b62] font-mono">
                  Subject Code: {data.subject.code}
                </p>
              </div>

              {/* Marks Highlight Box */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#fcfdfc] border border-[#e2e8e4] text-center">
                  <span className="text-[11px] font-semibold text-[#5a6b62] block">
                    Marks Obtained
                  </span>
                  <span className="text-xl font-black text-[#0a4b32]">
                    {data.obtainedMarks} <span className="text-xs text-[#5a6b62] font-normal">/ {data.totalMarks}</span>
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#fcfdfc] border border-[#e2e8e4] text-center">
                  <span className="text-[11px] font-semibold text-[#5a6b62] block">
                    Percentage
                  </span>
                  <span className="text-xl font-black text-[#0f1f17]">
                    {data.percentage}%
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#fcfdfc] border border-[#e2e8e4] text-center">
                  <span className="text-[11px] font-semibold text-[#5a6b62] block">
                    Grade Point
                  </span>
                  <span className={`text-xl font-black ${
                    data.grade === "A+" || data.grade === "A"
                      ? "text-emerald-700"
                      : data.grade === "F"
                      ? "text-rose-700"
                      : "text-blue-700"
                  }`}>
                    {data.grade} ({data.gradePoint.toFixed(2)})
                  </span>
                </div>
              </div>

              {/* Remarks & Teacher Info */}
              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-[#5a6b62] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Evaluator / Instructor:
                  </span>
                  <span className="font-bold text-[#0f1f17]">
                    {data.teacherName || "Assigned Faculty"}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                  <span className="text-[#5a6b62] font-semibold">Teacher Remarks / Notes:</span>
                  <p className="text-[#0f1f17] italic">
                    &quot;{data.remarks || "Performance verified according to BTEB criteria."}&quot;
                  </p>
                </div>

                {data.publishedAt && (
                  <p className="text-[11px] text-[#5a6b62] text-right">
                    Published Date: {new Date(data.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#e2e8e4] bg-[#fcfdfc] flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl border-[#e2e8e4] text-xs h-9"
          >
            Close
          </Button>
          <Button
            onClick={handleDownload}
            disabled={downloading || loading || !data}
            className="bg-[#0a4b32] hover:bg-[#073825] text-white rounded-xl text-xs h-9 font-bold px-4 flex items-center gap-1.5"
          >
            {downloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            Download Marksheet PDF
          </Button>
        </div>
      </div>
    </div>
  );
}

