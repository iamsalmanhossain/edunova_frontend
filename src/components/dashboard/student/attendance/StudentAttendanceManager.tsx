"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AuthUser } from "@/types/auth";
import {
  StudentAttendanceStatsData,
  StudentAttendanceHistoryItem,
} from "@/types/student";
import { studentService } from "@/services/student.service";
import StudentAttendanceStatsCard from "./StudentAttendanceStatsCard";
import StudentAttendanceHistoryList from "./StudentAttendanceHistoryList";
import StudentAttendanceSkeleton from "@/components/dashboard/skeletons/StudentAttendanceSkeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Clock, RefreshCw, AlertCircle, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudentAttendanceManagerProps {
  user: AuthUser;
}

export default function StudentAttendanceManager({ user }: StudentAttendanceManagerProps) {
  const [activeTab, setActiveTab] = useState<"stats" | "history">("stats");
  const [statsData, setStatsData] = useState<StudentAttendanceStatsData | null>(null);
  const [historyRecords, setHistoryRecords] = useState<StudentAttendanceHistoryItem[]>([]);
  const [historyMeta, setHistoryMeta] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters for history
  const [filters, setFilters] = useState({
    subjectId: "",
    type: "ALL" as "ALL" | "THEORY" | "PRACTICAL",
    startDate: "",
    endDate: "",
  });

  // 1. Fetch Stats
  const loadStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      setError(null);
      const res = await studentService.getAttendanceStats();
      setStatsData(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load attendance statistics";
      setError(msg);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // 2. Fetch History
  const loadHistory = useCallback(async (page = 1) => {
    try {
      setLoadingHistory(true);
      setError(null);
      const res = await studentService.getAttendanceHistory({
        subjectId: filters.subjectId || undefined,
        type: filters.type,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        page,
        limit: 20,
      });
      setHistoryRecords(res.data);
      setHistoryMeta(res.meta);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load attendance logs";
      setError(msg);
    } finally {
      setLoadingHistory(false);
    }
  }, [filters]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    if (activeTab === "history") {
      loadHistory(1);
    }
  }, [activeTab, loadHistory]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (newPage: number) => {
    loadHistory(newPage);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (activeTab === "stats") {
      await loadStats();
    } else {
      await loadHistory(historyMeta.page);
    }
    setIsRefreshing(false);
  };

  if (loadingStats && !statsData) {
    return <StudentAttendanceSkeleton />;
  }

  const deptName = user.studentProfile?.department?.name || "Computer Science & Technology";
  const deptCode = user.studentProfile?.department?.code || "CST";
  const shiftText =
    user.studentProfile?.shift === "SECOND_SHIFT" ? "Shift 2 (Day)" : "Shift 1 (Morning)";

  return (
    <div className="space-y-4 sm:space-y-5 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* 1. Modern Header Banner - High contrast & Mobile Optimized */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#073825] via-[#0a4b32] to-[#042417] text-white p-4 sm:p-6 shadow-lg shadow-[#0a4b32]/10 border border-[#0d593c]">
        {/* Ambient background decoration */}
        <div className="pointer-events-none absolute -right-12 -top-12 w-48 h-48 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-8 -bottom-8 w-40 h-40 rounded-full bg-[#c48b28]/15 blur-2xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            {/* Dept & Shift Badge Row */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/12 text-white text-[10px] sm:text-[11px] font-semibold border border-white/15 backdrop-blur-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c48b28] shrink-0" />
                <span className="truncate">{shiftText} • {deptName}</span>
              </div>
              <span className="hidden xs:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-[10px] font-bold border border-emerald-400/25">
                <ShieldCheck className="w-3 h-3 text-[#c48b28]" />
                <span>Verified Roll Call</span>
              </span>
            </div>

            {/* Title */}
            <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Student Attendance Record</span>
            </h1>

            {/* Subtext */}
            <p className="text-[11px] sm:text-xs text-emerald-100/80 max-w-xl leading-relaxed">
              Official institutional roll call records, session logs &amp; subject-wise presence percentages required for BTEB semester examination clearance.
            </p>
          </div>

          {/* Refresh Action Button */}
          <div className="shrink-0 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-8.5 sm:h-9 px-3.5 rounded-xl border-white/25 bg-white/12 hover:bg-white/20 active:scale-[0.98] text-white text-xs font-bold transition-all shadow-xs cursor-pointer backdrop-blur-xs gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#c48b28] ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Updating..." : "Refresh Logs"}</span>
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3.5 sm:p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{error}</span>
        </div>
      )}

      {/* 2. Responsive Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "stats" | "history")}
        className="space-y-4 sm:space-y-5"
      >
        <TabsList className="bg-[#f0f4f1] p-1 rounded-2xl border border-[#e2e8e4] grid grid-cols-2 w-full sm:max-w-md h-auto">
          <TabsTrigger
            value="stats"
            className="rounded-xl text-xs font-bold data-[state=active]:bg-[#0a4b32] data-[state=active]:text-white data-[state=active]:shadow-xs flex items-center justify-center gap-1.5 py-2 transition-all cursor-pointer"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Subject Breakdown</span>
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-xl text-xs font-bold data-[state=active]:bg-[#0a4b32] data-[state=active]:text-white data-[state=active]:shadow-xs flex items-center justify-center gap-1.5 py-2 transition-all cursor-pointer"
          >
            <Clock className="w-4 h-4" />
            <span>Attendance Logs</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="focus-visible:outline-none">
          {statsData && <StudentAttendanceStatsCard stats={statsData} />}
        </TabsContent>

        <TabsContent value="history" className="focus-visible:outline-none">
          <StudentAttendanceHistoryList
            records={historyRecords}
            meta={historyMeta}
            subjects={statsData?.subjects || []}
            filters={filters}
            onFilterChange={handleFilterChange}
            onPageChange={handlePageChange}
            loading={loadingHistory}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
