"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileSpreadsheet,
  Download,
  Edit2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Award,
  Users,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { teacherService } from "@/services/teacher.service";
import {
  TeacherResultDetailData,
  TeacherResultDetailStudent,
  ResultPublicationStatus,
} from "@/types/teacher";
import EditSingleMarkModal from "./EditSingleMarkModal";
import {
  downloadClassPdfFile,
  downloadClassExcelFile,
  downloadStudentTranscriptPdf,
  downloadMarksTemplateFile,
} from "@/utils/fileDownload";

interface ResultMarksheetViewProps {
  resultId: string;
}

export default function ResultMarksheetView({ resultId }: ResultMarksheetViewProps) {
  const [data, setData] = useState<TeacherResultDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected student for editing marks
  const [selectedStudent, setSelectedStudent] = useState<TeacherResultDetailStudent | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Action loaders
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    let mounted = true;

    async function fetchMarksheet() {
      try {
        const res = await teacherService.getResultDetails(resultId);
        if (mounted) {
          setData(res);
          setError(null);
          setLoading(false);
        }
      } catch (err: unknown) {
        const errorObj = err as { message?: string };
        if (mounted) {
          setError(errorObj.message || "Failed to load class marksheet.");
          setLoading(false);
        }
      }
    }

    fetchMarksheet();
    return () => {
      mounted = false;
    };
  }, [resultId]);

  // Handle Publish Status Toggle
  const handleTogglePublish = async () => {
    if (!data) return;
    const currentStatus = data.exam.status;
    const newStatus: ResultPublicationStatus =
      currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

    try {
      setActionLoading("publish");
      await teacherService.updatePublicationStatus(resultId, newStatus);
      setData((prev) =>
        prev
          ? {
              ...prev,
              exam: {
                ...prev.exam,
                status: newStatus,
              },
            }
          : prev
      );
      showToast(
        newStatus === "PUBLISHED"
          ? "Marksheet published to students successfully!"
          : "Marksheet reverted to Draft."
      );
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      showToast(errorObj.message || "Failed to update publication status.");
    } finally {
      setActionLoading(null);
    }
  };

  // Class PDF Download
  const handleDownloadClassPdf = async () => {
    if (!data) return;
    try {
      setActionLoading("class-pdf");
      await downloadClassPdfFile(resultId, data.exam.subject?.name, data.exam.name);
      showToast("Class Result PDF downloaded successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to download PDF.";
      showToast(msg);
    } finally {
      setActionLoading(null);
    }
  };

  // Class Excel Download
  const handleDownloadClassExcel = async () => {
    if (!data) return;
    try {
      setActionLoading("class-excel");
      await downloadClassExcelFile(resultId, data.exam.subject?.name, data.exam.name);
      showToast("Class Result Excel spreadsheet downloaded successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to download Excel spreadsheet.";
      showToast(msg);
    } finally {
      setActionLoading(null);
    }
  };

  // Download Prefilled Excel Template
  const handleDownloadTemplate = async () => {
    if (!data) return;
    try {
      setActionLoading("template");
      await downloadMarksTemplateFile(resultId, data.exam.subject?.name, data.exam.name, "xlsx");
      showToast("Offline marks entry template downloaded successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to download template.";
      showToast(msg);
    } finally {
      setActionLoading(null);
    }
  };

  // Individual Student PDF Download
  const handleDownloadStudentPdf = async (studentId: string, studentName: string) => {
    try {
      setActionLoading(`student-${studentId}`);
      await downloadStudentTranscriptPdf(
        resultId,
        studentId,
        studentName,
        data?.exam?.subject?.name,
        data?.exam?.name
      );
      showToast(`Student result PDF downloaded for ${studentName}!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to download student PDF.";
      showToast(msg);
    } finally {
      setActionLoading(null);
    }
  };

  // On Single Mark Updated
  const handleMarkUpdated = (studentId: string, obtainedMarks: number, remarks?: string) => {
    if (!data) return;
    const totalMarks = data.exam.totalMarks || 100;
    const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;

    // Simple grading calculation
    let grade = "F";
    let gradePoint = 0.0;
    if (percentage >= 80) {
      grade = "A+";
      gradePoint = 4.0;
    } else if (percentage >= 75) {
      grade = "A";
      gradePoint = 3.75;
    } else if (percentage >= 70) {
      grade = "A-";
      gradePoint = 3.5;
    } else if (percentage >= 65) {
      grade = "B+";
      gradePoint = 3.25;
    } else if (percentage >= 60) {
      grade = "B";
      gradePoint = 3.0;
    } else if (percentage >= 55) {
      grade = "B-";
      gradePoint = 2.75;
    } else if (percentage >= 50) {
      grade = "C+";
      gradePoint = 2.5;
    } else if (percentage >= 45) {
      grade = "C";
      gradePoint = 2.25;
    } else if (percentage >= 40) {
      grade = "D";
      gradePoint = 2.0;
    }

    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        students: prev.students.map((s) => {
          if (s.studentId === studentId) {
            return {
              ...s,
              marksEntry: {
                id: s.marksEntry?.id || "temp-id",
                obtainedMarks,
                totalMarks,
                percentage,
                grade,
                gradePoint,
                remarks: remarks || null,
                status: percentage >= (data.exam.passMarks || 40) ? "PASS" : "FAIL",
                updatedAt: new Date().toISOString(),
              },
            };
          }
          return s;
        }),
      };
    });
    showToast("Student mark updated successfully!");
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-[#e6ede8] rounded-xl" />
        <div className="h-44 bg-white rounded-2xl border border-[#dce3df] p-6" />
        <div className="h-96 bg-white rounded-2xl border border-[#dce3df] p-6" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <Link href="/dashboard/teacher/results">
          <Button variant="outline" className="h-9 text-xs flex items-center gap-1.5 rounded-xl">
            <ArrowLeft className="w-4 h-4" />
            Back to Results
          </Button>
        </Link>
        <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <div>
            <p className="text-sm font-bold">Marksheet Not Available</p>
            <p className="text-xs text-red-700">{error || "Could not retrieve marksheet."}</p>
          </div>
        </div>
      </div>
    );
  }

  const isPublished = data.exam.status === "PUBLISHED";
  const filteredStudents = data.students.filter((s) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return s.name.toLowerCase().includes(term) || s.rollNo.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-[#073825] text-white shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-[#c48b28]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation & Toolbar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link href="/dashboard/teacher/results">
          <Button
            variant="outline"
            className="h-9 px-3.5 text-xs font-semibold border-[#dce3df] hover:bg-[#f0f7f3] hover:text-[#0a4b32] cursor-pointer flex items-center gap-1.5 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Results
          </Button>
        </Link>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={handleTogglePublish}
            disabled={actionLoading === "publish"}
            variant="outline"
            className={`h-9 px-3.5 text-xs font-bold cursor-pointer rounded-xl flex items-center gap-1.5 transition-colors ${
              isPublished
                ? "border-emerald-500 text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
                : "border-amber-500 text-amber-800 bg-amber-50 hover:bg-amber-100"
            }`}
          >
            {isPublished ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Published to Students
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-amber-600" />
                Draft (Click to Publish)
              </>
            )}
          </Button>

          <Button
            onClick={handleDownloadClassPdf}
            disabled={actionLoading === "class-pdf"}
            variant="outline"
            className="h-9 px-3.5 text-xs font-bold border-[#dce3df] hover:bg-[#f0f7f3] hover:text-[#0a4b32] cursor-pointer rounded-xl flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-[#0a4b32]" />
            PDF Marksheet
          </Button>

          <Button
            onClick={handleDownloadClassExcel}
            disabled={actionLoading === "class-excel"}
            variant="outline"
            className="h-9 px-3.5 text-xs font-bold border-[#dce3df] hover:bg-emerald-50 text-emerald-800 hover:text-emerald-900 cursor-pointer rounded-xl flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            Excel Export
          </Button>

          <Button
            onClick={handleDownloadTemplate}
            disabled={actionLoading === "template"}
            variant="outline"
            className="h-9 px-3.5 text-xs font-bold border-[#dce3df] hover:bg-[#f0f7f3] hover:text-[#0a4b32] cursor-pointer rounded-xl flex items-center gap-1.5"
            title="Download offline marks template pre-populated with student rolls"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            Template
          </Button>
        </div>
      </div>

      {/* Exam Header Overview Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#dce3df] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#f0f7f3] text-[#0a4b32] uppercase tracking-wider">
                {data.exam.examType.replace("_", " ")}
              </span>
              <span className="text-xs text-[#5a6b62]">
                Semester {data.exam.semester} • {data.exam.shift === "FIRST_SHIFT" ? "1st Shift" : "2nd Shift"} • Session {data.exam.session}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f1f17] mt-1">
              {data.exam.name}
            </h1>
            <p className="text-xs font-semibold text-[#0a4b32]">
              {data.exam.subject.code} - {data.exam.subject.name}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#f4f7f5] p-3.5 rounded-xl border border-[#e2e8e4]">
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-[#8a9b92] block">Total Marks</span>
              <span className="text-base font-extrabold text-[#0f1f17]">{data.exam.totalMarks}</span>
            </div>
            <div className="w-[1px] h-8 bg-[#dce3df]" />
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-[#8a9b92] block">Pass Marks</span>
              <span className="text-base font-extrabold text-[#0a4b32]">
                {data.exam.passMarks ?? Math.round(data.exam.totalMarks * 0.4)}
              </span>
            </div>
            <div className="w-[1px] h-8 bg-[#dce3df]" />
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-[#8a9b92] block">Students</span>
              <span className="text-base font-extrabold text-[#0f1f17]">{data.students.length}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-[#f0f4f1]">
          <div className="p-3 rounded-xl bg-[#f0f7f3] flex items-center gap-3">
            <Users className="w-5 h-5 text-[#0a4b32] shrink-0" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#0a4b32]">
                Enrolled Students
              </p>
              <p className="text-sm font-extrabold text-[#0f1f17]">
                {data.stats.totalEligibleStudents} Students
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 flex items-center gap-3">
            <Award className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Marks Recorded
              </p>
              <p className="text-sm font-extrabold text-emerald-900">
                {data.stats.marksEnteredCount} of {data.stats.totalEligibleStudents}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 flex items-center gap-3 col-span-2 sm:col-span-1">
            <Percent className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                Pending Marks
              </p>
              <p className="text-sm font-extrabold text-amber-900">
                {data.stats.pendingMarksCount} Students
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Class Marksheet Table Card */}
      <div className="bg-white rounded-2xl border border-[#dce3df] shadow-xs overflow-hidden space-y-4">
        {/* Table Search Header */}
        <div className="p-4 sm:p-5 border-b border-[#f0f4f1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-[#0f1f17]">Class Results Marksheet</h2>
            <p className="text-xs text-[#5a6b62]">
              Showing {filteredStudents.length} student records
            </p>
          </div>
          <div className="w-full sm:w-72 relative">
            <Search className="w-3.5 h-3.5 text-[#5a6b62] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              placeholder="Search by student name or roll..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 pl-8 text-xs bg-white"
            />
          </div>
        </div>

        {/* Marksheet Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#f0f7f3] text-[#0f1f17] font-bold border-b border-[#e2e8e4]">
              <tr>
                <th className="py-3 px-4 text-left">Roll No</th>
                <th className="py-3 px-4 text-left">Student Name</th>
                <th className="py-3 px-4 text-left">Reg No</th>
                <th className="py-3 px-4 text-center">Marks ({data.exam.totalMarks})</th>
                <th className="py-3 px-4 text-center">Percentage</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4 text-center">GPA</th>
                <th className="py-3 px-4 text-left">Remarks</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f4f1]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-xs text-[#5a6b62]">
                    No students matching &quot;{searchTerm}&quot;
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const entry = s.marksEntry;
                  const hasMark = entry !== null && entry !== undefined;
                  const isPass = hasMark && entry.obtainedMarks >= (data.exam.passMarks ?? 40);

                  return (
                    <tr key={s.studentId} className="hover:bg-[#f9fbfa] transition-colors">
                      <td className="py-3 px-4 font-bold text-[#0f1f17]">{s.rollNo}</td>
                      <td className="py-3 px-4 font-semibold text-[#0f1f17]">{s.name}</td>
                      <td className="py-3 px-4 text-[#5a6b62]">{s.registrationNo || "—"}</td>
                      <td className="py-3 px-4 text-center font-extrabold">
                        {hasMark ? (
                          <span className={isPass ? "text-[#0a4b32]" : "text-red-600"}>
                            {entry.obtainedMarks}
                          </span>
                        ) : (
                          <span className="text-[#8a9b92] italic">Pending</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-[#0f1f17]">
                        {hasMark ? `${entry.percentage.toFixed(1)}%` : "—"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {hasMark ? (
                          <span
                            className={`font-extrabold px-2 py-0.5 rounded-md ${
                              isPass ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {entry.grade}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-[#0f1f17]">
                        {hasMark ? entry.gradePoint.toFixed(2) : "—"}
                      </td>
                      <td className="py-3 px-4 text-[#5a6b62] max-w-[150px] truncate">
                        {entry?.remarks || "—"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedStudent(s);
                              setIsEditModalOpen(true);
                            }}
                            title="Edit Student Mark"
                            className="w-7 h-7 rounded-lg bg-[#f0f4f1] hover:bg-[#e4ece7] text-[#0f1f17] flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#0a4b32]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadStudentPdf(s.studentId, s.name)}
                            disabled={actionLoading === `student-${s.studentId}`}
                            title="Download Individual Student Result PDF"
                            className="w-7 h-7 rounded-lg bg-[#f0f4f1] hover:bg-[#e4ece7] text-[#0f1f17] flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Single Mark Modal */}
      <EditSingleMarkModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedStudent(null);
        }}
        resultId={resultId}
        totalMarks={data.exam.totalMarks}
        student={selectedStudent}
        onMarkUpdated={handleMarkUpdated}
      />
    </div>
  );
}
