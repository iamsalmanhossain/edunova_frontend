"use client";

import React from "react";
import { StudentAttendanceHistoryItem, StudentSubjectAttendanceItem } from "@/types/student";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  User,
  Clock,
  RotateCcw,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StudentAttendanceHistoryListProps {
  records: StudentAttendanceHistoryItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  subjects: StudentSubjectAttendanceItem[];
  filters: {
    subjectId: string;
    type: "ALL" | "THEORY" | "PRACTICAL";
    startDate: string;
    endDate: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onPageChange: (newPage: number) => void;
  loading: boolean;
}

export default function StudentAttendanceHistoryList({
  records,
  meta,
  subjects,
  filters,
  onFilterChange,
  onPageChange,
  loading,
}: StudentAttendanceHistoryListProps) {
  const hasActiveFilters =
    Boolean(filters.subjectId) ||
    filters.type !== "ALL" ||
    Boolean(filters.startDate) ||
    Boolean(filters.endDate);

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* 1. Filter Bar - Mobile Responsive Controls */}
      <Card className="border-[#e2e8e4] bg-white rounded-2xl shadow-xs overflow-hidden">
        <CardContent className="p-3 sm:p-4 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Session Type & Subject Filter Group */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1 min-w-0">
              {/* Type Filter Buttons */}
              <div className="inline-flex rounded-xl bg-[#f0f4f1] p-1 border border-[#e2e8e4] shrink-0">
                {(["ALL", "THEORY", "PRACTICAL"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => onFilterChange("type", t)}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      filters.type === t
                        ? "bg-[#0a4b32] text-white shadow-xs"
                        : "text-[#5a6b62] hover:text-[#0f1f17]"
                    }`}
                  >
                    {t === "ALL" ? "All Sessions" : t === "THEORY" ? "Theory Only" : "Practical Lab"}
                  </button>
                ))}
              </div>

              {/* Subject Filter Select */}
              <div className="w-full sm:max-w-xs">
                <select
                  value={filters.subjectId}
                  onChange={(e) => onFilterChange("subjectId", e.target.value)}
                  className="w-full h-9 px-3 text-xs font-medium rounded-xl border border-[#e2e8e4] bg-[#fcfdfc] text-[#0f1f17] focus:outline-none focus:ring-2 focus:ring-[#0a4b32]/10 focus:border-[#0a4b32] cursor-pointer"
                >
                  <option value="">All Subjects</option>
                  {subjects.map((s) => (
                    <option key={s.subjectId} value={s.subjectId}>
                      {s.subjectCode} - {s.subjectName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date Filters & Reset Button */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0f4f1]">
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs text-[#5a6b62]">
                  <span className="shrink-0 text-[11px] font-semibold">From:</span>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => onFilterChange("startDate", e.target.value)}
                    className="w-full h-8.5 px-2 text-xs rounded-xl border border-[#e2e8e4] bg-[#fcfdfc] text-[#0f1f17] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                  />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#5a6b62]">
                  <span className="shrink-0 text-[11px] font-semibold">To:</span>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => onFilterChange("endDate", e.target.value)}
                    className="w-full h-8.5 px-2 text-xs rounded-xl border border-[#e2e8e4] bg-[#fcfdfc] text-[#0f1f17] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                  />
                </div>
              </div>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onFilterChange("subjectId", "");
                    onFilterChange("type", "ALL");
                    onFilterChange("startDate", "");
                    onFilterChange("endDate", "");
                  }}
                  className="h-8.5 px-2.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl cursor-pointer self-end sm:self-auto gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Attendance Records Table & Mobile Cards */}
      <Card className="border-[#e2e8e4] bg-white rounded-2xl shadow-xs overflow-hidden">
        <CardHeader className="p-3.5 sm:p-5 border-b border-[#e2e8e4]/80 flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle className="text-sm sm:text-base font-bold text-[#0f1f17]">
              Verified Attendance Logs
            </CardTitle>
            <p className="text-[11px] sm:text-xs text-[#5a6b62]">
              Showing {records.length} records of {meta.total} total sessions
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 sm:p-5 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2.5 border-b border-[#f0f4f1] last:border-0"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <Skeleton className="h-4 w-44 rounded" />
                    <Skeleton className="h-3 w-28 rounded" />
                  </div>
                  <Skeleton className="h-6 w-18 rounded-full" />
                </div>
              ))}
            </div>
          ) : records.length === 0 ? (
            <div className="p-8 sm:p-12 text-center text-[#5a6b62] space-y-2">
              <Clock className="w-8 h-8 mx-auto text-gray-300" />
              <p className="text-xs sm:text-sm font-bold text-[#0f1f17]">
                No attendance entries found
              </p>
              <p className="text-xs text-[#5a6b62]">
                {hasActiveFilters
                  ? "Try clearing or adjusting your search filters to view logs."
                  : "Attendance sessions recorded by your instructors will appear here."}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View (Hidden on mobile) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#fcfdfc] text-xs font-semibold text-[#5a6b62] border-b border-[#e2e8e4]">
                    <tr>
                      <th className="py-3 px-4">Session Date</th>
                      <th className="py-3 px-4">Subject &amp; Code</th>
                      <th className="py-3 px-4">Session Type</th>
                      <th className="py-3 px-4">Instructor</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f4f1] text-[#0f1f17]">
                    {records.map((r) => (
                      <tr key={r.id} className="hover:bg-[#fcfdfc] transition-colors">
                        <td className="py-3.5 px-4 font-medium whitespace-nowrap text-xs">
                          {new Date(r.session.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-[#0f1f17] text-xs block">
                            {r.session.subject.name}
                          </span>
                          <span className="text-[11px] text-[#5a6b62] font-mono">
                            {r.session.subject.code}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge
                            variant="outline"
                            className="text-[10px] font-bold bg-[#f0f4f1] border-[#e2e8e4] text-[#0f1f17]"
                          >
                            {r.session.type}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-[#5a6b62]">
                          {r.session.teacher?.user?.name || "Faculty Member"}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <Badge
                            className={`text-xs font-bold px-2.5 py-0.5 ${
                              r.status === "PRESENT"
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200"
                                : "bg-rose-100 text-rose-800 hover:bg-rose-100 border-rose-200"
                            }`}
                          >
                            {r.status === "PRESENT" ? (
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Present
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <XCircle className="w-3 h-3 text-rose-700" /> Absent
                              </span>
                            )}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View (Visible on mobile/tablet) */}
              <div className="md:hidden p-3 space-y-2.5">
                {records.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-xl border border-[#e2e8e4] bg-[#fcfdfc] space-y-2"
                  >
                    {/* Top row: Date & Status Pill */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-[#5a6b62] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#0a4b32]" />
                        <span>
                          {new Date(r.session.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </span>

                      <Badge
                        className={`text-[10px] font-bold px-2 py-0.5 ${
                          r.status === "PRESENT"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : "bg-rose-100 text-rose-800 border-rose-200"
                        }`}
                      >
                        {r.status === "PRESENT" ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-700" /> Present
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <XCircle className="w-2.5 h-2.5 text-rose-700" /> Absent
                          </span>
                        )}
                      </Badge>
                    </div>

                    {/* Middle row: Subject details & Type */}
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-bold text-[#0f1f17] truncate">
                          {r.session.subject.name}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#eef2ef] text-[#0a4b32] shrink-0 font-mono">
                          {r.session.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5a6b62] font-mono">
                        Code: {r.session.subject.code}
                      </p>
                    </div>

                    {/* Bottom row: Instructor */}
                    {r.session.teacher?.user?.name && (
                      <div className="pt-1.5 border-t border-[#f0f4f1] text-[10px] text-[#5a6b62] flex items-center gap-1">
                        <User className="w-3 h-3 text-[#718077]" />
                        <span>Instructor: <strong className="text-[#0f1f17]">{r.session.teacher.user.name}</strong></span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination Controls */}
          {meta.totalPages > 1 && (
            <div className="p-3 sm:p-4 border-t border-[#e2e8e4] flex items-center justify-between gap-2">
              <span className="text-[11px] sm:text-xs text-[#5a6b62]">
                Page {meta.page} of {meta.totalPages}
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page <= 1}
                  onClick={() => onPageChange(meta.page - 1)}
                  className="h-8 px-2.5 rounded-xl border-[#e2e8e4] text-xs cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-0.5" />
                  <span>Prev</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => onPageChange(meta.page + 1)}
                  className="h-8 px-2.5 rounded-xl border-[#e2e8e4] text-xs cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
