"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  X,
  Loader2,
  AlertCircle,
  Building2,
  GraduationCap,
  Calendar,
  Users,
  Award,
  CheckCircle2,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { academicFeaturesService } from "@/services/academic-features.service";
import { SubjectMasterOverviewData } from "@/types/academic-features";

interface MasterSubjectOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects?: Array<{ id: string; name: string; code: string; semester: number }>;
  defaultSubjectId?: string;
  defaultSemester?: number;
  currentShift?: "FIRST_SHIFT" | "SECOND_SHIFT";
}

export default function MasterSubjectOverviewModal({
  isOpen,
  onClose,
  subjects = [],
  defaultSubjectId = "",
  defaultSemester = 4,
}: MasterSubjectOverviewModalProps) {
  const [selectedSemester, setSelectedSemester] = useState<number>(defaultSemester);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(defaultSubjectId);

  const [data, setData] = useState<SubjectMasterOverviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter subjects for the selected semester
  const availableSubjects = subjects.filter((s) => s.semester === selectedSemester);

  useEffect(() => {
    if (availableSubjects.length > 0 && (!selectedSubjectId || !availableSubjects.some((s) => s.id === selectedSubjectId))) {
      setSelectedSubjectId(availableSubjects[0].id);
    }
  }, [selectedSemester, availableSubjects, selectedSubjectId]);

  // Fetch overview whenever subjectId or semester changes
  useEffect(() => {
    if (!isOpen || !selectedSubjectId) return;

    let isSubscribed = true;
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const res = await academicFeaturesService.getMasterSubjectOverview(
          selectedSubjectId,
          selectedSemester
        );
        if (isSubscribed) {
          setData(res);
        }
      } catch (err: any) {
        console.error("Failed to load master subject overview:", err);
        if (isSubscribed) {
          setError(err?.message || "Failed to load master overview data.");
        }
      } finally {
        if (isSubscribed) setLoading(false);
      }
    }
    loadData();
    return () => {
      isSubscribed = false;
    };
  }, [isOpen, selectedSubjectId, selectedSemester]);

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    if (!selectedSubjectId) return;
    try {
      setDownloading(true);
      await academicFeaturesService.downloadMasterSubjectOverviewPdf(
        selectedSubjectId,
        selectedSemester,
        data?.subjectName
      );
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in select-none">
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[92vh] max-h-[92vh] flex flex-col shadow-2xl border border-[#e2e8e4] overflow-hidden">
        {/* Modal Top Header */}
        <div className="p-3.5 sm:p-4 border-b border-[#e2e8e4] bg-[#f8faf9] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#0a4b32] text-white flex items-center justify-center shadow-xs shrink-0">
              <Award className="w-4 h-4 text-[#c48b28]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-extrabold text-[#0f1f17] truncate flex items-center gap-2">
                <span>Semester &amp; Subject Master Overview Matrix</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Comprehensive Academic Report
                </span>
              </h2>
              <p className="text-[11px] text-[#5a6b62] truncate">
                Aggregated student attendance records, all conducted exams, total percentages, and letter grades
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={handleDownloadPdf}
              disabled={downloading || loading || !data}
              className="h-8.5 px-3 bg-[#0a4b32] hover:bg-[#073825] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#c48b28]" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-[#c48b28]" />
                  <span>Export Master PDF (Landscape)</span>
                </>
              )}
            </Button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-3 bg-white border-b border-[#e2e8e4] flex flex-wrap items-center gap-3 shrink-0">
          {/* Semester Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#5a6b62]">Semester:</span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(Number(e.target.value))}
              className="h-8 px-2 text-xs font-bold bg-[#fbfdfc] border border-[#dce3df] rounded-lg focus:outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Selector */}
          <div className="flex items-center gap-1.5 min-w-[200px] flex-1">
            <span className="text-xs font-bold text-[#5a6b62]">Subject:</span>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="h-8 px-2 text-xs font-medium bg-[#fbfdfc] border border-[#dce3df] rounded-lg flex-1 focus:outline-none truncate"
            >
              {availableSubjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.code} - {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Metric Strip */}
        {data && (
          <div className="px-4 py-2.5 bg-[#f0f7f3] border-b border-[#dce3df] grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0a4b32]" />
              <div>
                <span className="text-[10px] text-[#5a6b62] block leading-tight">Total Classes Held</span>
                <span className="text-xs font-extrabold text-[#0f1f17]">{data.totalClassesHeld} Classes</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#0a4b32]" />
              <div>
                <span className="text-[10px] text-[#5a6b62] block leading-tight">Class Avg Attendance</span>
                <span className="text-xs font-extrabold text-[#0a4b32]">{data.classAvgAttendance}%</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#c48b28]" />
              <div>
                <span className="text-[10px] text-[#5a6b62] block leading-tight">Class Avg Marks</span>
                <span className="text-xs font-extrabold text-[#c48b28]">{data.classAvgMarksPct}%</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#0a4b32]" />
              <div>
                <span className="text-[10px] text-[#5a6b62] block leading-tight">Total Evaluated</span>
                <span className="text-xs font-extrabold text-[#0f1f17]">{data.students.length} Students</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area (Scrollable Data Grid) */}
        <div className="flex-1 overflow-auto p-3 sm:p-4">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-7 h-7 animate-spin text-[#0a4b32]" />
              <p className="text-xs text-[#5a6b62]">Aggregating attendance records &amp; all examination marks...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : !data || data.students.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-[#fbfdfc] rounded-xl border border-dashed border-[#dce3df]">
              <FileText className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-xs font-bold text-[#0f1f17]">No student marks or attendance found for this subject yet.</p>
              <p className="text-[11px] text-[#5a6b62] mt-0.5">Please take attendance or enter marks for this subject first.</p>
            </div>
          ) : (
            <div className="border border-[#e2e8e4] rounded-xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#103663] text-white text-[11px] font-bold">
                      <th className="py-2.5 px-3 border-r border-[#1a487d]">SL</th>
                      <th className="py-2.5 px-3 border-r border-[#1a487d]">Roll No</th>
                      <th className="py-2.5 px-3 border-r border-[#1a487d] min-w-[150px]">Student Name</th>
                      <th className="py-2.5 px-3 border-r border-[#1a487d] text-center min-w-[110px]">
                        Attendance (P/H)
                      </th>
                      {data.exams.map((ex) => (
                        <th key={ex.examId} className="py-2.5 px-3 border-r border-[#1a487d] text-center min-w-[90px]">
                          <div>{ex.examName}</div>
                          <div className="text-[9px] text-[#93c5fd] font-normal">Max: {ex.totalMarks}</div>
                        </th>
                      ))}
                      <th className="py-2.5 px-3 border-r border-[#1a487d] text-center">Total Marks</th>
                      <th className="py-2.5 px-3 border-r border-[#1a487d] text-center">Grade</th>
                      <th className="py-2.5 px-3 border-r border-[#1a487d] text-center">GPA</th>
                      <th className="py-2.5 px-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8e4] text-[#0f1f17]">
                    {data.students.map((st, idx) => (
                      <tr
                        key={st.studentId}
                        className={idx % 2 === 0 ? "bg-white hover:bg-[#f8faf9]" : "bg-[#fcfdfc] hover:bg-[#f8faf9]"}
                      >
                        <td className="py-2 px-3 font-semibold border-r border-[#e2e8e4]">{st.sl}</td>
                        <td className="py-2 px-3 font-extrabold text-[#0a4b32] border-r border-[#e2e8e4]">{st.rollNo}</td>
                        <td className="py-2 px-3 font-medium border-r border-[#e2e8e4] truncate max-w-[200px]">
                          {st.studentName}
                        </td>
                        <td className="py-2 px-3 border-r border-[#e2e8e4] text-center">
                          <span className="font-bold text-[#0a4b32]">{st.totalPresent}</span>
                          <span className="text-[#5a6b62]">/{st.totalClassesHeld} </span>
                          <span className="text-[10px] text-gray-500 font-semibold">({st.attendancePercentage}%)</span>
                        </td>
                        {data.exams.map((ex) => {
                          const m = st.examMarks[ex.examId];
                          return (
                            <td key={ex.examId} className="py-2 px-3 border-r border-[#e2e8e4] text-center">
                              {m ? (
                                <div>
                                  <span className="font-bold">{m.obtainedMarks}</span>
                                  <span className="text-[10px] ml-1 text-gray-500 font-semibold">({m.grade})</span>
                                </div>
                              ) : (
                                <span className="text-gray-300">-</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="py-2 px-3 border-r border-[#e2e8e4] text-center font-extrabold">
                          {st.totalMarksObtained} <span className="text-[10px] text-gray-400 font-normal">/ {st.totalMaxMarks}</span>
                        </td>
                        <td className="py-2 px-3 border-r border-[#e2e8e4] text-center">
                          <span
                            className={`px-2 py-0.5 rounded-md font-extrabold text-[10px] ${
                              st.overallGrade === "F"
                                ? "bg-red-100 text-red-700"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {st.overallGrade}
                          </span>
                        </td>
                        <td className="py-2 px-3 border-r border-[#e2e8e4] text-center font-bold">
                          {st.overallGradePoint.toFixed(2)}
                        </td>
                        <td className="py-2 px-3 font-medium text-[11px] text-[#5a6b62]">
                          {st.remarks || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-3 bg-[#f8faf9] border-t border-[#e2e8e4] flex items-center justify-between text-xs text-[#5a6b62] shrink-0">
          <div>
            Institute: <strong className="text-[#0f1f17]">{data?.instituteName || "Polytechnic Institute"}</strong> &bull; Dept: <strong className="text-[#0f1f17]">{data?.departmentName || "CST"}</strong>
          </div>
          <Button
            onClick={onClose}
            variant="outline"
            className="h-8 px-3 text-xs rounded-xl cursor-pointer"
          >
            Close Window
          </Button>
        </div>
      </div>
    </div>
  );
}
