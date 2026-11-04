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
import { BarChart3, Clock, RefreshCw, AlertCircle } from "lucide-react";
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

  if (loadingStats && !statsData) {
    return <StudentAttendanceSkeleton />;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e4] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-black text-[#0f1f17]">
              Student Attendance Record
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#5a6b62] mt-1">
            Department: {user.studentProfile?.department?.name || "Diploma Engineering"} • Shift:{" "}
            {user.studentProfile?.shift === "SECOND_SHIFT" ? "Shift 2 (Day)" : "Shift 1 (Morning)"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (activeTab === "stats") loadStats();
              else loadHistory(historyMeta.page);
            }}
            className="h-9 px-3 rounded-xl border-[#e2e8e4] text-xs font-semibold text-[#0a4b32]"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "stats" | "history")}
        className="space-y-6"
      >
        <TabsList className="bg-[#f0f4f1] p-1 rounded-2xl border border-[#e2e8e4] grid grid-cols-2 max-w-md">
          <TabsTrigger
            value="stats"
            className="rounded-xl text-xs font-bold data-[state=active]:bg-[#0a4b32] data-[state=active]:text-white data-[state=active]:shadow-xs flex items-center justify-center gap-2 py-2"
          >
            <BarChart3 className="w-4 h-4" /> Subject Breakdown
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-xl text-xs font-bold data-[state=active]:bg-[#0a4b32] data-[state=active]:text-white data-[state=active]:shadow-xs flex items-center justify-center gap-2 py-2"
          >
            <Clock className="w-4 h-4" /> Attendance Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stats">
          {statsData && <StudentAttendanceStatsCard stats={statsData} />}
        </TabsContent>

        <TabsContent value="history">
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
