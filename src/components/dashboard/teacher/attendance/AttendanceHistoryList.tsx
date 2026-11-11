"use client";

import React, { useEffect, useState } from "react";
import {
  Calendar,
  History,
  Eye,
  AlertCircle,
  FileText,
  Filter,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { teacherService } from "@/services/teacher.service";
import { AttendanceSessionHistoryItem } from "@/types/teacher";
import AttendanceSessionDetailModal from "./AttendanceSessionDetailModal";
import SessionHistorySkeleton from "@/components/dashboard/skeletons/SessionHistorySkeleton";

interface AttendanceHistoryListProps {
  refreshTrigger?: number;
}

export default function AttendanceHistoryList({
  refreshTrigger = 0,
}: AttendanceHistoryListProps) {
  const [sessions, setSessions] = useState<AttendanceSessionHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Filters: Category (THEORY / PRACTICAL), Semester
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [semesterFilter, setSemesterFilter] = useState<string>("ALL");
  const [internalRefresh, setInternalRefresh] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function loadHistory() {
      try {
        setLoading(true);
        setError(null);
        const res = await teacherService.getAttendanceHistory({
          type: typeFilter !== "ALL" ? typeFilter : undefined,
          semester: semesterFilter !== "ALL" ? Number(semesterFilter) : undefined,
          limit: 50,
        });
        if (mounted) {
          const list = res.sessions || [];
          setSessions(list);
          setLoading(false);
        }
      } catch (err: unknown) {
        console.error("Failed to load attendance history", err);
        if (mounted) {
          setError("Failed to load attendance session history.");
          setLoading(false);
        }
      }
    }

    loadHistory();
    return () => {
      mounted = false;
    };
  }, [refreshTrigger, typeFilter, semesterFilter, internalRefresh]);

  // Client-side fallback filter
  const displayedSessions = sessions.filter((s) => {
    if (typeFilter !== "ALL" && s.type !== typeFilter) return false;
    if (semesterFilter !== "ALL" && s.semester !== Number(semesterFilter)) return false;
    return true;
  });

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#dce3df] shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-[#eef2ef] bg-[#fafbf9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-xl bg-emerald-100 text-[#0a4b32]">
            <History className="w-4 h-4 text-emerald-800" />
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#0f1f17] tracking-tight">
              Attendance Session Logs &amp; History
            </h2>
            <p className="text-xs text-[#5a6b62] mt-0.5 font-medium">
              Past roll call sessions, lecture dates, class types, and student turnouts
            </p>
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#f0f7f3] text-[#0a4b32] self-start sm:self-auto border border-emerald-100">
          Total Sessions: {displayedSessions.length}
        </span>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3.5 sm:p-5 bg-white border-b border-[#eef2ef] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Pills (All, Theory, Practical) */}
        <div className="flex items-center gap-1 p-1 bg-[#f4f7f5] rounded-xl border border-[#e2e8e4] self-start sm:self-auto overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setTypeFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              typeFilter === "ALL"
                ? "bg-[#0a4b32] text-white shadow-xs"
                : "text-[#5a6b62] hover:text-[#0f1f17]"
            }`}
          >
            All Classes
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter("THEORY")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              typeFilter === "THEORY"
                ? "bg-[#0a4b32] text-white shadow-xs"
                : "text-[#5a6b62] hover:text-[#0f1f17]"
            }`}
          >
            Theory
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter("PRACTICAL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              typeFilter === "PRACTICAL"
                ? "bg-[#0a4b32] text-white shadow-xs"
                : "text-[#5a6b62] hover:text-[#0f1f17]"
            }`}
          >
            Practical
          </button>
        </div>

        {/* Semester Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Filter className="w-3.5 h-3.5 text-[#5a6b62]" />
          <span className="text-xs font-bold text-[#5a6b62]">Semester:</span>
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold rounded-xl border border-[#dce3df] bg-white text-[#0f1f17] focus:outline-none focus:ring-2 focus:ring-[#0a4b32] cursor-pointer"
          >
            <option value="ALL">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7].map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Body List */}
      <div className="p-4 sm:p-6">
        {loading ? (
          <SessionHistorySkeleton />
        ) : error ? (
          <div className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : displayedSessions.length === 0 ? (
          <div className="py-12 text-center rounded-2xl border-2 border-dashed border-[#e2e8e4] p-8 space-y-2">
            <FileText className="w-9 h-9 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-[#0f1f17]">
              No matching attendance sessions found
            </p>
            <p className="text-xs text-[#5a6b62]">
              Try adjusting your class type or semester filter.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedSessions.map((session) => {
              const presentCount = session.presentCount ?? 0;
              const totalCount = session.totalCount ?? (session._count?.records || 0);
              const rate =
                totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

              return (
                <div
                  key={session.id}
                  className="p-3.5 sm:p-4 rounded-2xl border border-[#eef2ef] hover:border-emerald-200 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-xs sm:text-sm text-[#0f1f17]">
                        {session.subject?.code} - {session.subject?.name}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Semester {session.semester}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          session.type === "THEORY"
                            ? "bg-blue-50 text-blue-800 border-blue-200"
                            : "bg-purple-50 text-purple-800 border-purple-200"
                        }`}
                      >
                        {session.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#5a6b62] flex-wrap">
                      <span className="flex items-center gap-1 font-semibold text-[#0f1f17]">
                        <Calendar className="w-3.5 h-3.5 text-[#0a4b32]" />
                        {new Date(session.date).toLocaleDateString()}
                      </span>
                      {session.remarks && (
                        <span className="text-amber-800 text-[11px] truncate max-w-xs bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          {session.remarks}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-[#f0f4f1]">
                    <div className="text-left sm:text-right">
                      <p className="text-xs sm:text-sm font-black text-[#0a4b32]">
                        {rate}% ({presentCount}/{totalCount})
                      </p>
                      <p className="text-[10px] text-[#5a6b62] font-semibold">Attendance Turnout</p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveSessionId(session.id)}
                      className="h-8 px-3 text-xs font-bold text-[#0a4b32] border-[#dce3df] hover:bg-emerald-50 gap-1.5 cursor-pointer rounded-xl"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View &amp; Edit</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Session Details & Edit Modal */}
      <AttendanceSessionDetailModal
        sessionId={activeSessionId}
        onClose={() => setActiveSessionId(null)}
        onSessionUpdated={() => setInternalRefresh((p) => p + 1)}
      />
    </div>
  );
}
