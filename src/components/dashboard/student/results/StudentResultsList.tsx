"use client";

import React from "react";
import { StudentPublishedResultItem } from "@/types/student";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Eye,
  Award,
  CheckCircle2,
  XCircle,
  Loader2,
  User,
  Filter,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StudentResultsListProps {
  results: StudentPublishedResultItem[];
  filters: {
    semester: string;
    examType: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onViewDetails: (examId: string) => void;
  onDownloadPdf: (examId: string, subjectName: string, examName?: string) => void;
  downloadingId: string | null;
  loading: boolean;
}

export default function StudentResultsList({
  results,
  filters,
  onFilterChange,
  onViewDetails,
  onDownloadPdf,
  downloadingId,
  loading,
}: StudentResultsListProps) {
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

  return (
    <div className="space-y-4">
      {/* 1. Filter Controls */}
      <Card className="border-[#e2e8e4] shadow-xs">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Semester Filter */}
              <select
                value={filters.semester}
                onChange={(e) => onFilterChange("semester", e.target.value)}
                className="h-9 px-3 text-xs font-semibold rounded-xl border border-[#e2e8e4] bg-white text-[#0f1f17] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
              >
                {semesters.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>

              {/* Exam Type Filter */}
              <select
                value={filters.examType}
                onChange={(e) => onFilterChange("examType", e.target.value)}
                className="h-9 px-3 text-xs font-semibold rounded-xl border border-[#e2e8e4] bg-white text-[#0f1f17] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
              >
                {examTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {(filters.semester || filters.examType !== "ALL") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onFilterChange("semester", "");
                  onFilterChange("examType", "ALL");
                }}
                className="h-9 px-2.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl"
              >
                Reset Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 2. Published Marksheets List */}
      <Card className="border-[#e2e8e4] shadow-xs overflow-hidden">
        <CardHeader className="p-4 sm:p-5 border-b border-[#e2e8e4]/80 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-[#0f1f17]">
              Published Examination Marksheets
            </CardTitle>
            <p className="text-xs text-[#5a6b62]">
              Official evaluation records authorized by department faculty
            </p>
          </div>
          <Badge variant="outline" className="text-xs bg-[#0a4b32]/10 text-[#0a4b32] border-[#0a4b32]/20 font-bold">
            {results.length} Published
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-5 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2 border-b border-[#f0f4f1] last:border-0">
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
            <div className="p-12 text-center text-[#5a6b62]">
              <FileText className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-semibold">No published marksheets found</p>
              <p className="text-xs mt-1">There are no matching exam marks matching your filter selection.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#fcfdfc] text-xs font-semibold text-[#5a6b62] border-b border-[#e2e8e4]">
                    <tr>
                      <th className="py-3 px-4">Subject & Code</th>
                      <th className="py-3 px-4">Examination</th>
                      <th className="py-3 px-4">Score / Total</th>
                      <th className="py-3 px-4">Grade & GPA</th>
                      <th className="py-3 px-4">Teacher / Remarks</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f4f1] text-[#0f1f17]">
                    {results.map((r) => (
                      <tr key={r.markId} className="hover:bg-[#fcfdfc] transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-[#0f1f17]">{r.subject.name}</span>
                          <span className="block text-xs text-[#5a6b62] font-mono">
                            {r.subject.code} • Sem {r.semester}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-[#0f1f17]">{r.examName}</span>
                          <span className="block text-xs text-[#5a6b62]">
                            {r.examType.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium">
                          <span className="font-bold text-[#0a4b32]">{r.obtainedMarks}</span>
                          <span className="text-xs text-[#5a6b62]"> / {r.totalMarks} ({r.percentage}%)</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge
                            className={`text-xs font-black ${
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
                          <span className="italic truncate max-w-[180px] block">
                            {r.remarks || "No remarks added"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onViewDetails(r.examId)}
                              className="h-8 px-2.5 rounded-xl border-[#e2e8e4] text-xs font-semibold hover:border-[#0a4b32] text-[#0f1f17]"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1 text-[#0a4b32]" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={downloadingId === r.examId}
                              onClick={() => onDownloadPdf(r.examId, r.subject.name || r.subject.code, r.examName)}
                              className="h-8 px-2.5 rounded-xl border-[#e2e8e4] text-xs font-semibold hover:bg-emerald-50 text-emerald-800"
                            >
                              {downloadingId === r.examId ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                              ) : (
                                <Download className="w-3.5 h-3.5 mr-1" />
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

              {/* Mobile Cards View */}
              <div className="md:hidden divide-y divide-[#f0f4f1]">
                {results.map((r) => (
                  <div key={r.markId} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-[#0f1f17]">{r.subject.name}</h4>
                        <p className="text-xs text-[#5a6b62]">
                          {r.subject.code} • {r.examName}
                        </p>
                      </div>
                      <Badge
                        className={`text-xs font-black shrink-0 ${
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

                    <div className="flex items-center justify-between text-xs bg-[#fcfdfc] p-2.5 rounded-xl border border-[#f0f4f1]">
                      <span className="text-[#5a6b62]">Marks:</span>
                      <span className="font-bold text-[#0a4b32]">
                        {r.obtainedMarks} / {r.totalMarks} ({r.percentage}%)
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(r.examId)}
                        className="flex-1 min-h-[44px] rounded-xl text-xs font-semibold cursor-pointer border-[#dce3df] hover:border-[#0a4b32]"
                      >
                        <Eye className="w-4 h-4 mr-1.5 text-[#0a4b32]" /> Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={downloadingId === r.examId}
                        onClick={() => onDownloadPdf(r.examId, r.subject.name || r.subject.code, r.examName)}
                        className="flex-1 min-h-[44px] rounded-xl text-xs font-semibold text-emerald-800 border-emerald-200 hover:bg-emerald-50 cursor-pointer"
                      >
                        {downloadingId === r.examId ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                        ) : (
                          <Download className="w-4 h-4 mr-1.5" />
                        )}
                        PDF Marksheet
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

