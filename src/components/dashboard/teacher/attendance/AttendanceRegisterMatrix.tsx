"use client";

import React, { useState, useEffect, useMemo } from "react";
import { academicFeaturesService } from "@/services/academic-features.service";
import { teacherService } from "@/services/teacher.service";
import { AttendanceRegisterData } from "@/types/academic-features";
import { TeacherSubject } from "@/types/teacher";
import { Button } from "@/components/ui/button";
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
  LayoutGrid,
  Table as TableIcon,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  Loader2,
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
  const [loadingSubjects, setLoadingSubjects] = useState<boolean>(false);
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

  // Mobile View Switcher: "table" (2D matrix) or "cards" (student summary cards)
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Load teacher subjects dynamically for the selected semester
  useEffect(() => {
    let mounted = true;
    async function loadSubjects() {
      try {
        setLoadingSubjects(true);
        const res = await teacherService.getMarksSubjects(selectedSemester);
        if (mounted && res?.data) {
          const mapped: TeacherSubject[] = res.data.map((d) => ({
            id: d.id,
            code: d.code,
            name: d.name,
            semester: d.semester,
          }));
          setSubjects(mapped);
          if (mapped.length > 0) {
            setSelectedSubject(mapped[0].id);
          } else {
            setSelectedSubject("");
          }
        }
      } catch (err) {
        console.warn("Could not load subjects for attendance register:", err);
      } finally {
        if (mounted) {
          setLoadingSubjects(false);
        }
      }
    }
    loadSubjects();
    return () => {
      mounted = false;
    };
  }, [selectedSemester]);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(e.target.value);
  };

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sem = Number(e.target.value);
    setSelectedSemester(sem);
    setData(null);
  };

  const handleFetchRegister = async () => {
    if (!selectedSubject) {
      setError("Please select a course subject.");
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

  // Auto fetch register when subject loads
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

  const filteredStudents = useMemo(() => {
    if (!data?.students) return [];
    if (!searchTerm.trim()) return data.students;
    const term = searchTerm.toLowerCase().trim();
    return data.students.filter(
      (st) =>
        st.rollNo?.toLowerCase().includes(term) ||
        st.name?.toLowerCase().includes(term)
    );
  }, [data?.students, searchTerm]);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Top Card: Title, Export Actions & Filters */}
      <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-[#dce3df] shadow-xs space-y-4">
        {/* Header row with Title and Export Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f0f4f1]">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#0f1f17] flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-emerald-100 text-[#0a4b32]">
                <Calendar className="w-4 h-4 text-emerald-800" />
              </span>
              <span>Multi-Date Attendance Register</span>
            </h3>
            <p className="text-xs text-[#5a6b62] mt-0.5">
              View date-by-date student roll sheet and export official landscape reports
            </p>
          </div>

          {/* Export Action Buttons: Responsive Grid on Mobile */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
            <Button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf || !data}
              variant="outline"
              className="h-9 px-3 text-xs font-bold border-[#0a4b32] text-[#0a4b32] hover:bg-[#0a4b32] hover:text-white rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <FileText className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="truncate">{downloadingPdf ? "Generating..." : "Export PDF"}</span>
            </Button>

            <Button
              onClick={handleDownloadExcel}
              disabled={downloadingExcel || !data}
              variant="outline"
              className="h-9 px-3 text-xs font-bold border-emerald-600 text-emerald-800 hover:bg-emerald-700 hover:text-white rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">{downloadingExcel ? "Preparing..." : "Export Excel"}</span>
            </Button>
          </div>
        </div>

        {/* Filter Controls Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          {/* 1. Semester (First) */}
          <div className="sm:col-span-1 lg:col-span-2">
            <label className="block text-[11px] font-black text-[#5a6b62] uppercase tracking-wider mb-1">
              Semester *
            </label>
            <div className="relative">
              <select
                value={selectedSemester}
                onChange={handleSemesterChange}
                className="w-full h-9 pl-3 pr-8 rounded-xl border border-[#dce3df] bg-white text-xs font-bold text-[#0f1f17] focus:outline-none focus:ring-2 focus:ring-[#0a4b32] appearance-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#5a6b62] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 2. Subject (Filtered by Semester) */}
          <div className="sm:col-span-2 lg:col-span-4">
            <label className="block text-[11px] font-black text-[#5a6b62] uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Select Subject *</span>
              {loadingSubjects && <Loader2 className="w-3 h-3 animate-spin text-[#0a4b32]" />}
            </label>
            <div className="relative">
              <select
                value={selectedSubject}
                onChange={handleSubjectChange}
                disabled={loadingSubjects || subjects.length === 0}
                className="w-full h-9 pl-3 pr-8 rounded-xl border border-[#dce3df] bg-white text-xs font-bold text-[#0f1f17] focus:outline-none focus:ring-2 focus:ring-[#0a4b32] disabled:bg-slate-100 disabled:text-slate-400 appearance-none cursor-pointer truncate"
              >
                {subjects.length === 0 ? (
                  <option value="">No subjects in Semester {selectedSemester}</option>
                ) : (
                  subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.name}
                    </option>
                  ))
                )}
              </select>
              <ChevronDown className="w-4 h-4 text-[#5a6b62] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Start Date */}
          <div className="sm:col-span-1 lg:col-span-2">
            <label className="block text-[11px] font-black text-[#5a6b62] uppercase tracking-wider mb-1">
              From Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-[#dce3df] bg-white text-xs font-bold text-[#0f1f17] focus:outline-none focus:ring-2 focus:ring-[#0a4b32] cursor-pointer"
            />
          </div>

          {/* End Date */}
          <div className="sm:col-span-1 lg:col-span-2">
            <label className="block text-[11px] font-black text-[#5a6b62] uppercase tracking-wider mb-1">
              To Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-[#dce3df] bg-white text-xs font-bold text-[#0f1f17] focus:outline-none focus:ring-2 focus:ring-[#0a4b32] cursor-pointer"
            />
          </div>

          {/* Load Button */}
          <div className="sm:col-span-1 lg:col-span-2">
            <Button
              onClick={handleFetchRegister}
              disabled={loading}
              className="w-full h-9 bg-[#0a4b32] hover:bg-[#073825] text-white text-xs font-black rounded-xl cursor-pointer shadow-sm transition-all"
            >
              {loading ? "Loading..." : "Load Register"}
            </Button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Summary Cards */}
      {data && (
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#dce3df] shadow-2xs flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#5a6b62] block truncate">
                Enrolled
              </span>
              <div className="text-base sm:text-xl font-black text-[#0f1f17] mt-0.5">
                {data.summary?.totalStudents ?? data.students?.length ?? 0}
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0a4b32] flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#dce3df] shadow-2xs flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#5a6b62] block truncate">
                Class Days
              </span>
              <div className="text-base sm:text-xl font-black text-[#0a4b32] mt-0.5">
                {data.summary?.totalClassDays ?? data.dates?.length ?? 0}
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0a4b32] flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#dce3df] shadow-2xs flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#5a6b62] block truncate">
                Avg Turnout
              </span>
              <div className="text-base sm:text-xl font-black text-[#c48b28] mt-0.5">
                {data.summary?.averageAttendanceRate != null
                  ? `${data.summary.averageAttendanceRate}%`
                  : "N/A"}
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#c48b28] flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* Main Register Table & Card Container */}
      <div className="rounded-2xl sm:rounded-3xl bg-white border border-[#dce3df] shadow-xs overflow-hidden">
        {/* Table Toolbar: Search & Mobile View Switcher */}
        <div className="p-3 sm:p-4 bg-[#f8faf9] border-b border-[#dce3df] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 max-w-full sm:max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter by roll or student name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-xl border border-[#dce3df] bg-white text-xs font-semibold text-[#0f1f17] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0a4b32]"
            />
          </div>

          {/* Right Controls: View Switcher & Counter */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            {/* View Switcher for Mobile & Tablet */}
            <div className="flex sm:hidden items-center gap-1 p-0.5 bg-[#eef2ef] rounded-lg">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md text-xs font-bold transition-all ${
                  viewMode === "table"
                    ? "bg-white text-[#0a4b32] shadow-2xs"
                    : "text-[#5a6b62]"
                }`}
                title="Table Matrix View"
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`p-1.5 rounded-md text-xs font-bold transition-all ${
                  viewMode === "cards"
                    ? "bg-white text-[#0a4b32] shadow-2xs"
                    : "text-[#5a6b62]"
                }`}
                title="Student Roster Cards"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

            <span className="text-[11px] text-[#5a6b62] font-bold">
              Showing {filteredStudents.length} Students
            </span>
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="p-12 text-center text-xs text-[#5a6b62] space-y-2">
            <div className="w-6 h-6 border-2 border-[#0a4b32] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-semibold">Loading attendance register matrix...</p>
          </div>
        ) : !data || data.students?.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#5a6b62] space-y-2">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-bold text-[#0f1f17]">No attendance sessions found</p>
            <p className="text-[11px]">Please choose another date range or subject.</p>
          </div>
        ) : (
          <>
            {/* 1. Mobile Cards View (Optional mobile-first toggle) */}
            {viewMode === "cards" && (
              <div className="block sm:hidden p-3 space-y-2.5">
                {filteredStudents.map((st) => (
                  <div
                    key={st.studentId || st.rollNo}
                    className="p-3.5 rounded-2xl border border-[#eef2ef] bg-[#fafbf9] space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono font-black text-xs px-2 py-0.5 rounded-lg bg-[#eaf4ef] text-[#0a4b32] shrink-0">
                          {String(st.rollNo || "").replace(/^#+/, "")}
                        </span>
                        <p className="font-bold text-xs text-[#0f1f17] truncate">
                          {st.name}
                        </p>
                      </div>
                      <span className="text-xs font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 shrink-0">
                        {st.percentage != null ? `${st.percentage}%` : "0%"}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#eef2ef] text-center text-[11px]">
                      <div className="bg-white p-1.5 rounded-lg border border-[#eef2ef]">
                        <span className="text-[#5a6b62] block text-[10px]">Present</span>
                        <span className="font-extrabold text-emerald-700">{st.totalPresent}</span>
                      </div>
                      <div className="bg-white p-1.5 rounded-lg border border-[#eef2ef]">
                        <span className="text-[#5a6b62] block text-[10px]">Absent</span>
                        <span className="font-extrabold text-rose-600">{st.totalAbsent}</span>
                      </div>
                      <div className="bg-white p-1.5 rounded-lg border border-[#eef2ef]">
                        <span className="text-[#5a6b62] block text-[10px]">Total</span>
                        <span className="font-extrabold text-[#0f1f17]">
                          {(st.totalPresent || 0) + (st.totalAbsent || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 2. Matrix Table View (With 100% Guaranteed Sticky 2D Freeze) */}
            <div className={viewMode === "cards" ? "hidden sm:block" : "block"}>
              {/* Mobile Scroll Hint */}
              <div className="sm:hidden px-3 py-1.5 bg-emerald-50/60 border-b border-emerald-100 text-[10px] text-[#0a4b32] font-semibold flex items-center justify-between">
                <span>Swipe horizontally to view dates</span>
                <span className="font-mono">Scroll &rarr;</span>
              </div>

              <div className="overflow-auto max-h-[550px] relative">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-white font-bold uppercase text-[10px] tracking-wider">
                      {/* Fixed Top-Left Frozen Corner: Roll No */}
                      <th className="sticky top-0 left-0 z-30 bg-[#0a4b32] w-20 min-w-[80px] max-w-[80px] py-3 px-3 shadow-xs border-r border-[#136142]">
                        Roll No
                      </th>

                      {/* Fixed Top-Left Frozen Corner: Student Name */}
                      <th className="sticky top-0 left-[80px] z-30 bg-[#0a4b32] w-36 min-w-[140px] max-w-[140px] py-3 px-3 shadow-xs border-r border-[#136142]">
                        Student Name
                      </th>

                      {/* Scrollable Date Column Headers */}
                      {data.dates?.map((dateStr) => {
                        const d = new Date(dateStr);
                        const formatted = `${d.getDate()} ${d.toLocaleString("default", {
                          month: "short",
                        })}`;
                        return (
                          <th
                            key={dateStr}
                            className="sticky top-0 z-20 bg-[#0a4b32] py-2.5 px-2 text-center min-w-[46px] border-r border-[#136142]"
                          >
                            <span className="block leading-tight">{formatted}</span>
                          </th>
                        );
                      })}

                      {/* Summary Column Headers */}
                      <th className="sticky top-0 z-20 py-3 px-3 text-center min-w-[50px] bg-[#073825] border-r border-[#136142]">
                        P
                      </th>
                      <th className="sticky top-0 z-20 py-3 px-3 text-center min-w-[50px] bg-[#073825] border-r border-[#136142]">
                        A
                      </th>
                      <th className="sticky top-0 z-20 py-3 px-3 text-center min-w-[60px] bg-[#073825]">
                        %
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#f0f4f1]">
                    {filteredStudents.map((st, idx) => (
                      <tr
                        key={st.studentId || idx}
                        className="hover:bg-[#f7faf8] transition-colors group"
                      >
                        {/* Frozen Column 1: Roll No */}
                        <td className="sticky left-0 z-10 bg-white group-hover:bg-[#f7faf8] w-20 min-w-[80px] max-w-[80px] py-2.5 px-3 font-mono font-black text-[#0a4b32] border-r border-[#eef2ef] shadow-2xs">
                          {String(st.rollNo || "").replace(/^#+/, "")}
                        </td>

                        {/* Frozen Column 2: Student Name */}
                        <td className="sticky left-[80px] z-10 bg-white group-hover:bg-[#f7faf8] w-36 min-w-[140px] max-w-[140px] py-2.5 px-3 font-bold text-[#0f1f17] border-r border-[#eef2ef] truncate shadow-2xs">
                          {st.name}
                        </td>

                        {/* Date Status Cells */}
                        {data.dates?.map((dateStr) => {
                          const status = st.attendanceMap?.[dateStr] || "-";
                          let badge = (
                            <span className="text-slate-300 font-bold">-</span>
                          );
                          if (status === "P") {
                            badge = (
                              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-black inline-flex items-center justify-center text-[10px]">
                                P
                              </span>
                            );
                          } else if (status === "A") {
                            badge = (
                              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 font-black inline-flex items-center justify-center text-[10px]">
                                A
                              </span>
                            );
                          } else if (status === "L") {
                            badge = (
                              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-black inline-flex items-center justify-center text-[10px]">
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

                        {/* Totals Summary Cells */}
                        <td className="py-2.5 px-2 text-center font-bold text-emerald-700 bg-emerald-50/20 border-r border-[#f0f4f1]">
                          {st.totalPresent}
                        </td>
                        <td className="py-2.5 px-2 text-center font-bold text-rose-700 bg-rose-50/20 border-r border-[#f0f4f1]">
                          {st.totalAbsent}
                        </td>
                        <td className="py-2.5 px-2 text-center font-black text-[#0f1f17] bg-slate-50">
                          {st.percentage != null ? `${st.percentage}%` : "0%"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
