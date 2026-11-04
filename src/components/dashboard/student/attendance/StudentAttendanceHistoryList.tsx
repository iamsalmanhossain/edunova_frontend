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
  return (
    <div className="space-y-4">
      {/* 1. Filter Bar */}
      <Card className="border-[#e2e8e4] shadow-xs">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Type Filter Buttons */}
              <div className="inline-flex rounded-xl bg-[#f0f4f1] p-1 border border-[#e2e8e4]">
                {(["ALL", "THEORY", "PRACTICAL"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => onFilterChange("type", t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      filters.type === t
                        ? "bg-[#0a4b32] text-white shadow-xs"
                        : "text-[#5a6b62] hover:text-[#0f1f17]"
                    }`}
                  >
                    {t === "ALL" ? "All Sessions" : t === "THEORY" ? "Theory Only" : "Practical Lab"}
                  </button>
                ))}
              </div>

              {/* Subject Filter */}
              <select
                value={filters.subjectId}
                onChange={(e) => onFilterChange("subjectId", e.target.value)}
                className="h-9 px-3 text-xs font-medium rounded-xl border border-[#e2e8e4] bg-white text-[#0f1f17] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
              >
                <option value="">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.subjectId} value={s.subjectId}>
                    {s.subjectCode} - {s.subjectName}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-[#5a6b62]">
                <span>From:</span>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => onFilterChange("startDate", e.target.value)}
                  className="h-9 px-2 text-xs rounded-xl border border-[#e2e8e4] bg-white text-[#0f1f17] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#5a6b62]">
                <span>To:</span>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => onFilterChange("endDate", e.target.value)}
                  className="h-9 px-2 text-xs rounded-xl border border-[#e2e8e4] bg-white text-[#0f1f17] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                />
              </div>
              {(filters.subjectId || filters.type !== "ALL" || filters.startDate || filters.endDate) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onFilterChange("subjectId", "");
                    onFilterChange("type", "ALL");
                    onFilterChange("startDate", "");
                    onFilterChange("endDate", "");
                  }}
                  className="h-9 px-2.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Attendance Records Table & Mobile Cards */}
      <Card className="border-[#e2e8e4] shadow-xs overflow-hidden">
        <CardHeader className="p-4 sm:p-5 border-b border-[#e2e8e4]/80 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-[#0f1f17]">
              Verified Attendance Logs
            </CardTitle>
            <p className="text-xs text-[#5a6b62]">
              Showing {records.length} records of {meta.total} total sessions
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[#f0f4f1] last:border-0">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-48 rounded" />
                    <Skeleton className="h-3 w-32 rounded" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))}
            </div>
          ) : records.length === 0 ? (
            <div className="p-12 text-center text-[#5a6b62]">
              <Clock className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-semibold">No attendance entries found</p>
              <p className="text-xs mt-1">Try clearing or adjusting your search filters.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#fcfdfc] text-xs font-semibold text-[#5a6b62] border-b border-[#e2e8e4]">
                    <tr>
                      <th className="py-3 px-4">Session Date</th>
                      <th className="py-3 px-4">Subject & Code</th>
                      <th className="py-3 px-4">Session Type</th>
                      <th className="py-3 px-4">Instructor</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f4f1] text-[#0f1f17]">
                    {records.map((r) => (
                      <tr key={r.id} className="hover:bg-[#fcfdfc] transition-colors">
                        <td className="py-3.5 px-4 font-medium whitespace-nowrap">
                          {new Date(r.session.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-[#0f1f17]">{r.session.subject.name}</span>
                          <span className="block text-xs text-[#5a6b62] font-mono">
                            {r.session.subject.code}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant="outline" className="text-xs bg-[#f0f4f1] border-[#e2e8e4] text-[#0f1f17]">
                            {r.session.type}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-[#5a6b62]">
                          {r.session.teacher?.user?.name || "Faculty Member"}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <Badge
                            className={`text-xs font-bold ${
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

              {/* Mobile Cards View */}
              <div className="md:hidden divide-y divide-[#f0f4f1]">
                {records.map((r) => (
                  <div key={r.id} className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#5a6b62]">
                        {new Date(r.session.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <Badge
                        className={`text-[11px] font-bold ${
                          r.status === "PRESENT"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : "bg-rose-100 text-rose-800 border-rose-200"
                        }`}
                      >
                        {r.status}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0f1f17]">{r.session.subject.name}</h4>
                      <p className="text-xs text-[#5a6b62]">
                        {r.session.subject.code} • {r.session.type}
                      </p>
                    </div>
                    {r.session.teacher?.user?.name && (
                      <p className="text-[11px] text-[#5a6b62] flex items-center gap-1">
                        <User className="w-3 h-3" /> {r.session.teacher.user.name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination Controls */}
          {meta.totalPages > 1 && (
            <div className="p-4 border-t border-[#e2e8e4] flex items-center justify-between">
              <span className="text-xs text-[#5a6b62]">
                Page {meta.page} of {meta.totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page <= 1}
                  onClick={() => onPageChange(meta.page - 1)}
                  className="h-8 px-2.5 rounded-xl border-[#e2e8e4] text-xs"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => onPageChange(meta.page + 1)}
                  className="h-8 px-2.5 rounded-xl border-[#e2e8e4] text-xs"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

