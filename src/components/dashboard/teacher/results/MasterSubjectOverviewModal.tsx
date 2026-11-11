"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  X,
  Loader2,
  AlertCircle,
  Calendar,
  Users,
  Award,
  BarChart3,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { academicFeaturesService } from "@/services/academic-features.service";
import { teacherService } from "@/services/teacher.service";
import { SubjectMasterOverviewData } from "@/types/academic-features";

interface MasterSubjectOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects?: Array<{ id: string; name: string; code: string; semester: number }>;
  defaultSubjectId?: string;
  defaultSemester?: number;
  currentShift?: "FIRST_SHIFT" | "SECOND_SHIFT";
}

const getSemesterName = (sem: number) => {
  if (sem === 1) return "1st Semester";
  if (sem === 2) return "2nd Semester";
  if (sem === 3) return "3rd Semester";
  return `${sem}th Semester`;
};

export default function MasterSubjectOverviewModal({
  isOpen,
  onClose,
  subjects = [],
  defaultSubjectId = "",
  defaultSemester = 4,
}: MasterSubjectOverviewModalProps) {
  const [selectedSemester, setSelectedSemester] = useState<number>(defaultSemester);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(defaultSubjectId);
  const [semesterSubjects, setSemesterSubjects] = useState<
    Array<{ id: string; name: string; code: string; semester: number }>
  >([]);

  const [data, setData] = useState<SubjectMasterOverviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Dynamically sync subjects for the selected semester
  useEffect(() => {
    let isSubscribed = true;

    async function loadSubjects() {
      // First check if passed props contain matching subjects
      const matchingFromProps = subjects.filter((s) => s.semester === selectedSemester);
      if (matchingFromProps.length > 0) {
        if (isSubscribed) {
          setSemesterSubjects(matchingFromProps);
          if (!selectedSubjectId || !matchingFromProps.some((s) => s.id === selectedSubjectId)) {
            setSelectedSubjectId(matchingFromProps[0].id);
          }
        }
        return;
      }

      // If no matching subjects in props, dynamically query department subjects for this semester
      try {
        const res = await teacherService.getMarksSubjects(selectedSemester);
        if (isSubscribed && res?.data && res.data.length > 0) {
          setSemesterSubjects(res.data);
          if (!selectedSubjectId || !res.data.some((s) => s.id === selectedSubjectId)) {
            setSelectedSubjectId(res.data[0].id);
          }
        } else if (isSubscribed) {
          setSemesterSubjects([]);
          setSelectedSubjectId("");
        }
      } catch (err) {
        console.error("Failed to fetch semester subjects:", err);
      }
    }

    if (isOpen) {
      loadSubjects();
    }

    return () => {
      isSubscribed = false;
    };
  }, [isOpen, selectedSemester, subjects]);

  // 2. Fetch Master Overview data whenever selected subject or semester changes
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
      } catch (err: unknown) {
        console.error("Failed to load master subject overview:", err);
        if (isSubscribed) {
          const msg =
            err instanceof Error ? err.message : "Failed to load master overview data.";
          setError(msg);
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

  // 3. Export PDF
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
      console.error("Master PDF Download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in select-none">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-6xl h-[92vh] max-h-[92vh] flex flex-col shadow-2xl border border-[#dce3df] overflow-hidden">
        {/* Modal Top Header */}
        <div className="p-3.5 sm:p-5 border-b border-[#e2e8e4] bg-[#fafbf9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#0a4b32] text-white flex items-center justify-center shadow-xs shrink-0">
              <Award className="w-5 h-5 text-[#c48b28]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-black text-[#0f1f17] truncate flex items-center gap-2">
                <span>Master Academic &amp; Attendance Report</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Consolidated PDF
                </span>
              </h2>
              <p className="text-[11px] text-[#5a6b62] truncate">
                Comprehensive evaluation linking daily attendance (Present/Absent) with Class Tests, Viva &amp; Midterm exam marks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <Button
              onClick={handleDownloadPdf}
              disabled={downloading || loading || !data}
              className="h-9 px-3.5 bg-[#0a4b32] hover:bg-[#073825] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
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

        {/* Filter Toolbar: Semester & Subject Selector */}
        <div className="p-3 sm:p-4 bg-white border-b border-[#e2e8e4] flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          {/* Semester Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#5a6b62] shrink-0">Semester:</span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(Number(e.target.value))}
              className="h-9 px-3 text-xs font-bold bg-[#fafbf9] border border-[#dce3df] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0a4b32] cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                <option key={s} value={s}>
                  {getSemesterName(s)}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Selector */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xs font-bold text-[#5a6b62] shrink-0">Subject:</span>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="h-9 px-3 text-xs font-bold bg-[#fafbf9] border border-[#dce3df] rounded-xl flex-1 focus:outline-none focus:ring-2 focus:ring-[#0a4b32] truncate cursor-pointer"
            >
              {semesterSubjects.length === 0 ? (
                <option value="">No subjects found for this semester</option>
              ) : (
                semesterSubjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.code} - {sub.name}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Summary Metric Strip */}
        {data && (
          <div className="px-4 py-2.5 bg-[#f0f7f3] border-b border-[#dce3df] grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0a4b32] shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-[#5a6b62] block leading-tight font-medium">Classes Held (T | P)</span>
                <span className="text-xs font-black text-[#0f1f17]">
                  {data.totalClassesHeld} ({data.theoryClassesHeld} T | {data.practicalClassesHeld} P)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#0a4b32] shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-[#5a6b62] block leading-tight font-medium">Class Avg Attendance</span>
                <span className="text-xs font-black text-[#0a4b32]">{data.classAvgAttendance}%</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#c48b28] shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-[#5a6b62] block leading-tight font-medium">Class Avg Score</span>
                <span className="text-xs font-black text-[#c48b28]">{data.classAvgMarksPct}%</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#0a4b32] shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-[#5a6b62] block leading-tight font-medium">Total Evaluated</span>
                <span className="text-xs font-black text-[#0f1f17]">{data.students.length} Students</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area (Scrollable Data Grid) */}
        <div className="flex-1 overflow-auto p-3 sm:p-4">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-2.5">
              <Loader2 className="w-8 h-8 animate-spin text-[#0a4b32]" />
              <p className="text-xs font-semibold text-[#5a6b62]">
                Consolidating student attendance records &amp; all examination marks...
              </p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : !data || data.students.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-[#fbfdfc] rounded-2xl border border-dashed border-[#dce3df]">
              <FileText className="w-10 h-10 text-gray-300 mb-2" />
              <p className="text-sm font-bold text-[#0f1f17]">No records found for this subject and semester.</p>
              <p className="text-xs text-[#5a6b62] mt-1">
                Please take attendance or enter examination marks for this subject first.
              </p>
            </div>
          ) : (
            <div className="border border-[#e2e8e4] rounded-2xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#073825] text-white text-[10px] sm:text-[11px] font-bold">
                      <th className="py-2.5 px-3 border-r border-[#1a4a35]">SL</th>
                      <th className="py-2.5 px-3 border-r border-[#1a4a35]">Roll / ID</th>
                      <th className="py-2.5 px-3 border-r border-[#1a4a35] min-w-[130px]">Student Name</th>

                      {/* Theory Attendance: Present, Absent, Attd % */}
                      <th className="py-2.5 px-1.5 border-r border-[#1a4a35] text-center text-emerald-200 min-w-[38px]" title="Theory Present">
                        T.Pres
                      </th>
                      <th className="py-2.5 px-1.5 border-r border-[#1a4a35] text-center text-rose-200 min-w-[38px]" title="Theory Absent">
                        T.Abs
                      </th>
                      <th className="py-2.5 px-1.5 border-r border-[#1a4a35] text-center text-amber-200 min-w-[45px]" title="Theory Attendance %">
                        T.%
                      </th>

                      {/* Practical Attendance: Present, Absent, Attd % */}
                      <th className="py-2.5 px-1.5 border-r border-[#1a4a35] text-center text-emerald-200 min-w-[38px]" title="Practical Present">
                        P.Pres
                      </th>
                      <th className="py-2.5 px-1.5 border-r border-[#1a4a35] text-center text-rose-200 min-w-[38px]" title="Practical Absent">
                        P.Abs
                      </th>
                      <th className="py-2.5 px-1.5 border-r border-[#1a4a35] text-center text-amber-200 min-w-[45px]" title="Practical Attendance %">
                        P.%
                      </th>

                      {/* Dynamic Exams: CT-1, CT-2, Viva, Midterm, etc. */}
                      {data.exams.map((ex) => (
                        <th
                          key={ex.examId}
                          className="py-2.5 px-3 border-r border-[#1a4a35] text-center min-w-[85px]"
                        >
                          <div>{ex.examName}</div>
                          <div className="text-[9px] text-amber-200/90 font-normal">Max: {ex.totalMarks}</div>
                        </th>
                      ))}
                      {/* Performance Summary */}
                      <th className="py-2.5 px-3 border-r border-[#1a4a35] text-center min-w-[80px]">Total Marks</th>
                      <th className="py-2.5 px-3 border-r border-[#1a4a35] text-center min-w-[55px]">Score %</th>
                      <th className="py-2.5 px-3 border-r border-[#1a4a35] text-center min-w-[50px]">Grade</th>
                      <th className="py-2.5 px-3 min-w-[100px]">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8e4] text-[#0f1f17]">
                    {data.students.map((st, idx) => (
                      <tr
                        key={st.studentId}
                        className={idx % 2 === 0 ? "bg-white hover:bg-[#f8faf9]" : "bg-[#fcfdfc] hover:bg-[#f8faf9]"}
                      >
                        <td className="py-2 px-3 font-semibold text-slate-500 border-r border-[#e2e8e4]">{st.sl}</td>
                        <td className="py-2 px-3 font-mono font-extrabold text-[#0a4b32] border-r border-[#e2e8e4]">
                          {st.rollNo.replace(/^#+/, "")}
                        </td>
                        <td className="py-2 px-3 font-bold border-r border-[#e2e8e4] truncate max-w-[170px]">
                          {st.studentName}
                        </td>

                        {/* Theory Attendance Columns */}
                        <td className="py-2 px-1.5 border-r border-[#e2e8e4] text-center font-bold text-emerald-700">
                          {st.theoryPresent ?? 0}
                        </td>
                        <td className="py-2 px-1.5 border-r border-[#e2e8e4] text-center font-bold text-rose-600">
                          {st.theoryAbsent ?? 0}
                        </td>
                        <td className="py-2 px-1.5 border-r border-[#e2e8e4] text-center font-extrabold text-xs">
                          <span
                            className={
                              (st.theoryAttdPct ?? 0) >= 75
                                ? "text-emerald-700"
                                : (st.theoryAttdPct ?? 0) >= 60
                                  ? "text-amber-600"
                                  : "text-rose-600"
                            }
                          >
                            {st.theoryAttdPct ?? 0}%
                          </span>
                        </td>

                        {/* Practical Attendance Columns */}
                        <td className="py-2 px-1.5 border-r border-[#e2e8e4] text-center font-bold text-emerald-700">
                          {st.practicalPresent ?? 0}
                        </td>
                        <td className="py-2 px-1.5 border-r border-[#e2e8e4] text-center font-bold text-rose-600">
                          {st.practicalAbsent ?? 0}
                        </td>
                        <td className="py-2 px-1.5 border-r border-[#e2e8e4] text-center font-extrabold text-xs">
                          <span
                            className={
                              (st.practicalAttdPct ?? 0) >= 75
                                ? "text-emerald-700"
                                : (st.practicalAttdPct ?? 0) >= 60
                                  ? "text-amber-600"
                                  : "text-rose-600"
                            }
                          >
                            {st.practicalAttdPct ?? 0}%
                          </span>
                        </td>

                        {/* Dynamic Exam Marks */}
                        {data.exams.map((ex) => {
                          const m = st.examMarks[ex.examId];
                          return (
                            <td key={ex.examId} className="py-2 px-3 border-r border-[#e2e8e4] text-center">
                              {m && m.obtainedMarks !== null ? (
                                <div className="space-x-1">
                                  <span
                                    className={`font-black ${
                                      m.grade === "F" ? "text-rose-600" : "text-[#0f1f17]"
                                    }`}
                                  >
                                    {m.obtainedMarks}
                                  </span>
                                  {m.grade && (
                                    <span className="text-[10px] text-gray-500 font-semibold">({m.grade})</span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>
                          );
                        })}

                        {/* Summary */}
                        <td className="py-2 px-3 border-r border-[#e2e8e4] text-center font-black">
                          {data.exams.length > 0 ? (
                            <>
                              <span>{st.totalMarksObtained}</span>
                              <span className="text-[10px] text-gray-400 font-normal"> / {st.totalMaxMarks}</span>
                            </>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="py-2 px-3 border-r border-[#e2e8e4] text-center font-extrabold text-xs">
                          {data.exams.length > 0 ? (
                            <span
                              className={
                                st.overallPercentage >= 60
                                  ? "text-emerald-700"
                                  : st.overallPercentage >= 40
                                    ? "text-amber-600"
                                    : "text-rose-600"
                              }
                            >
                              {st.overallPercentage}%
                            </span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="py-2 px-3 border-r border-[#e2e8e4] text-center">
                          {data.exams.length > 0 ? (
                            <span
                              className={`px-2 py-0.5 rounded-md font-black text-[10px] ${
                                st.overallGrade === "F"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-emerald-100 text-emerald-800"
                              }`}
                            >
                              {st.overallGrade}
                            </span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="py-2 px-3 font-medium text-[11px] text-[#5a6b62]">
                          {st.remarks || "—"}
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
        <div className="p-3.5 bg-[#fafbf9] border-t border-[#e2e8e4] flex items-center justify-between text-xs text-[#5a6b62] shrink-0">
          <div>
            Institute: <strong className="text-[#0f1f17]">{data?.instituteName || "Polytechnic Institute"}</strong> &bull; Dept:{" "}
            <strong className="text-[#0f1f17]">{data?.departmentName || "CST"}</strong>
          </div>
          <Button
            onClick={onClose}
            variant="outline"
            className="h-8.5 px-3.5 text-xs font-bold rounded-xl cursor-pointer"
          >
            Close Window
          </Button>
        </div>
      </div>
    </div>
  );
}
