"use client";

import React, { useState, useEffect } from "react";
import { academicFeaturesService } from "@/services/academic-features.service";
import { teacherService } from "@/services/teacher.service";
import { AttendanceRegisterData } from "@/types/academic-features";
import { TeacherSubject } from "@/types/teacher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { appToast } from "@/store/useToastStore";
import {
  FileSpreadsheet,
  FileText,
  Calendar,
  Filter,
  Download,
  AlertCircle,
  CheckCircle2,
  Users,
  Search,
} from "lucide-react";

interface AttendanceRegisterMatrixProps {
  currentShift: "FIRST_SHIFT" | "SECOND_SHIFT";
}

export default function AttendanceRegisterMatrix({
  currentShift,
}: AttendanceRegisterMatrixProps) {
  const [subjects, setSubjects] = useState<TeacherSubject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [selectedShift, setSelectedShift] = useState<"FIRST_SHIFT" | "SECOND_SHIFT">(currentShift);

  // Default dates: 1st day of current month to today
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const today = now.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState<string>(firstDay);
  const [endDate, setEndDate] = useState<string>(today);

  const [data, setData] = useState<AttendanceRegisterData | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Load teacher subjects
  useEffect(() => {
    let mounted = true;
    async function loadSubjects() {
      try {
        const res = await teacherService.getMarksSubjects();
        if (mounted && res?.data && res.data.length > 0) {
          const mapped = res.data.map((d) => ({
            id: d.id,
            code: d.code,
            name: d.name,
            semester: d.semester,
          }));
          setSubjects(mapped);
          setSelectedSubject(mapped[0]?.id || "");
          if (mapped[0]?.semester) {
            setSelectedSemester(mapped[0].semester);
          }
        }
      } catch (err) {
        console.warn("Could not load subjects for attendance register:", err);
      }
    }
    loadSubjects();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedSubject(id);
    const sub = subjects.find((s) => s.id === id);
    if (sub && sub.semester) {
      setSelectedSemester(sub.semester);
    }
  };

  const handleFetchRegister = async () => {
    if (!selectedSubject) {
      setError("Please select a subject.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await academicFeaturesService.getAttendanceRegister({
        subjectId: selectedSubject,
        semester: selectedSemester,
        startDate,
        endDate,
        shift: selectedShift,
      });
      setData(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load attendance register";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Fetch register when subject loads
  useEffect(() => {
    if (selectedSubject) {
      handleFetchRegister();
    }
  }, [selectedSubject]);

  const handleDownloadPdf = async () => {
    if (!selectedSubject) return;
    try {
      setDownloadingPdf(true);
      const curSub = subjects.find((s) => s.id === selectedSubject);
      const safeSubName = curSub ? curSub.name.replace(/[^a-zA-Z0-9_-]/g, "_") : "Subject";
      const filename = `Attendance_Register_${safeSubName}_Sem${selectedSemester}_${startDate}_to_${endDate}.pdf`;

      await academicFeaturesService.downloadAttendanceRegisterPdf({
        subjectId: selectedSubject,
        semester: selectedSemester,
        startDate,
        endDate,
        shift: selectedShift,
        filename,
      });
      appToast.success("Attendance register PDF downloaded successfully!", "PDF Exported");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to download Attendance Register PDF.";
      appToast.error(msg, "Export Failed");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadExcel = async () => {
    if (!selectedSubject) return;
    try {
      setDownloadingExcel(true);
      const curSub = subjects.find((s) => s.id === selectedSubject);
      const safeSubName = curSub ? curSub.name.replace(/[^a-zA-Z0-9_-]/g, "_") : "Subject";
      const filename = `Attendance_Register_${safeSubName}_Sem${selectedSemester}_${startDate}_to_${endDate}.xlsx`;

      await academicFeaturesService.downloadAttendanceRegisterExcel({
        subjectId: selectedSubject,
        semester: selectedSemester,
        startDate,
        endDate,
        shift: selectedShift,
        filename,
      });
      appToast.success("Attendance register Excel downloaded successfully!", "Excel Exported");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to download Attendance Register Excel.";
      appToast.error(msg, "Export Failed");
    } finally {
      setDownloadingExcel(false);
    }
  };

  const filteredStudents = data?.students?.filter((st) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      st.rollNo?.toLowerCase().includes(term) ||
      st.name?.toLowerCase().includes(term)
    );
  }) || [];

  return (
    <div className="space-y-5">
      {/* Filters & Range Picker */}
      <div className="p-5 rounded-2xl bg-white border border-[#dce3df] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#f0f4f1]">
          <div>
            <h3 className="text-base font-bold text-[#0f1f17] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#0a4b32]" />
              <span>Multi-Date Attendance Register</span>
            </h3>
            <p className="text-xs text-[#5a6b62]">
              View date-by-date attendance roll and export formal landscape reports
            </p>
          </div>

          {/* Export Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf || !data}
              variant="outline"
              className="h-9 px-3 text-xs font-bold border-[#0a4b32] text-[#0a4b32] hover:bg-[#0a4b32] hover:text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-rose-600" />
              <span>{downloadingPdf ? "Generating..." : "Export PDF (Landscape)"}</span>
            </Button>

            <Button
              onClick={handleDownloadExcel}
              disabled={downloadingExcel || !data}
              variant="outline"
              className="h-9 px-3 text-xs font-bold border-emerald-600 text-emerald-800 hover:bg-emerald-700 hover:text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>{downloadingExcel ? "Preparing..." : "Export Excel (.xlsx)"}</span>
            </Button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Subject */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold text-[#5a6b62] mb-1">
              Select Subject
            </label>
            <select
              value={selectedSubject}
              onChange={handleSubjectChange}
              className="w-full h-9 px-2.5 rounded-lg border border-[#dce3df] bg-white text-xs font-semibold text-[#0f1f17] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="block text-[11px] font-bold text-[#5a6b62] mb-1">
              Semester
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(Number(e.target.value))}
              className="w-full h-9 px-2.5 rounded-lg border border-[#dce3df] bg-white text-xs font-semibold text-[#0f1f17] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-[11px] font-bold text-[#5a6b62] mb-1">
              From Date
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-9 text-xs rounded-lg"
            />
          </div>

          {/* End Date & Refresh */}
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-[#5a6b62] mb-1">
                To Date
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-9 text-xs rounded-lg"
              />
            </div>

            <Button
              onClick={handleFetchRegister}
              disabled={loading}
              className="h-9 px-3 bg-[#0a4b32] hover:bg-[#073825] text-white text-xs font-bold rounded-lg cursor-pointer shrink-0"
            >
              {loading ? "..." : "Load"}
            </Button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Register Summary KPI */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-white border border-[#dce3df] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5a6b62]">
                Total Enrolled
              </span>
              <div className="text-xl font-black text-[#0f1f17] mt-0.5">
                {data.summary?.totalStudents ?? data.students?.length ?? 0}
              </div>
            </div>
            <Users className="w-8 h-8 text-[#0a4b32]/30" />
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#dce3df] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5a6b62]">
                Total Class Days
              </span>
              <div className="text-xl font-black text-[#0a4b32] mt-0.5">
                {data.summary?.totalClassDays ?? data.dates?.length ?? 0} Days
              </div>
            </div>
            <Calendar className="w-8 h-8 text-[#0a4b32]/30" />
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#dce3df] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5a6b62]">
                Avg Attendance Rate
              </span>
              <div className="text-xl font-black text-[#c48b28] mt-0.5">
                {data.summary?.averageAttendanceRate != null
                  ? `${data.summary.averageAttendanceRate}%`
                  : "N/A"}
              </div>
            </div>
            <CheckCircle2 className="w-8 h-8 text-[#c48b28]/30" />
          </div>
        </div>
      )}

      {/* Live Matrix Table */}
      <div className="rounded-2xl bg-white border border-[#dce3df] shadow-xs overflow-hidden">
        {/* Table Search Header */}
        <div className="p-3 bg-[#f7faf8] border-b border-[#dce3df] flex items-center justify-between gap-3">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter by roll or student name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8 pl-8 pr-2 rounded-lg border border-[#dce3df] bg-white text-xs outline-none focus:border-[#0a4b32]"
            />
          </div>

          <span className="text-[11px] text-[#5a6b62] font-semibold">
            Showing {filteredStudents.length} students
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-[#5a6b62]">
            Loading attendance register matrix...
          </div>
        ) : !data || data.students?.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#5a6b62]">
            No attendance records found for this date range and subject.
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[550px] relative">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#0a4b32] text-white sticky top-0 z-10 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 sticky left-0 z-20 bg-[#0a4b32] min-w-[70px]">
                    Roll No
                  </th>
                  <th className="py-2.5 px-3 sticky left-[70px] z-20 bg-[#0a4b32] min-w-[140px]">
                    Student Name
                  </th>
                  {data.dates?.map((dateStr) => {
                    const d = new Date(dateStr);
                    const formatted = `${d.getDate()} ${d.toLocaleString("default", {
                      month: "short",
                    })}`;
                    return (
                      <th
                        key={dateStr}
                        className="py-2 px-2 text-center min-w-[42px] border-l border-[#136142]"
                      >
                        {formatted}
                      </th>
                    );
                  })}
                  <th className="py-2.5 px-3 text-center min-w-[55px] bg-[#073825] border-l border-[#136142]">
                    P
                  </th>
                  <th className="py-2.5 px-3 text-center min-w-[55px] bg-[#073825] border-l border-[#136142]">
                    A
                  </th>
                  <th className="py-2.5 px-3 text-center min-w-[65px] bg-[#073825] border-l border-[#136142]">
                    %
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#f0f4f1]">
                {filteredStudents.map((st, idx) => (
                  <tr
                    key={st.studentId || idx}
                    className="hover:bg-[#f7faf8] transition-colors"
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-[#0a4b32] sticky left-0 bg-white group-hover:bg-[#f7faf8] z-10 border-r border-[#f0f4f1]">
                      {st.rollNo}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#0f1f17] sticky left-[70px] bg-white group-hover:bg-[#f7faf8] z-10 border-r border-[#f0f4f1] truncate max-w-[140px]">
                      {st.name}
                    </td>

                    {data.dates?.map((dateStr) => {
                      const status = st.attendanceMap?.[dateStr] || "-";
                      let badge = (
                        <span className="text-gray-300 font-bold">-</span>
                      );
                      if (status === "P") {
                        badge = (
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold inline-flex items-center justify-center text-[10px]">
                            P
                          </span>
                        );
                      } else if (status === "A") {
                        badge = (
                          <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 font-bold inline-flex items-center justify-center text-[10px]">
                            A
                          </span>
                        );
                      } else if (status === "L") {
                        badge = (
                          <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold inline-flex items-center justify-center text-[10px]">
                            L
                          </span>
                        );
                      }

                      return (
                        <td
                          key={dateStr}
                          className="py-2 px-1 text-center border-r border-[#f0f4f1]"
                        >
                          {badge}
                        </td>
                      );
                    })}

                    <td className="py-2.5 px-2 text-center font-bold text-emerald-700 bg-emerald-50/30">
                      {st.totalPresent}
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold text-rose-700 bg-rose-50/30">
                      {st.totalAbsent}
                    </td>
                    <td className="py-2.5 px-2 text-center font-black text-[#0f1f17] bg-gray-50">
                      {st.percentage != null ? `${st.percentage}%` : "0%"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

