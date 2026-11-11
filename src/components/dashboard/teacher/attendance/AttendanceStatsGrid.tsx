"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Calendar,
  Layers,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { teacherService } from "@/services/teacher.service";
import { TeacherAttendanceStatsData } from "@/types/teacher";

interface AttendanceStatsGridProps {
  refreshTrigger?: number;
}

export default function AttendanceStatsGrid({
  refreshTrigger = 0,
}: AttendanceStatsGridProps) {
  const [stats, setStats] = useState<TeacherAttendanceStatsData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadStats() {
      try {
        setLoading(true);
        const data = await teacherService.getAttendanceStats();
        if (mounted) {
          setStats(data);
        }
      } catch (err: unknown) {
        console.warn("Could not load attendance stats", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadStats();
    return () => {
      mounted = false;
    };
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-3.5 sm:p-4 bg-white rounded-2xl border border-[#dce3df] space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-24 rounded-lg" />
              <Skeleton className="h-2.5 w-16" />
            </div>
          ))}
        </div>
        <div className="p-4 sm:p-5 bg-white rounded-2xl sm:rounded-3xl border border-[#dce3df] space-y-3">
          <Skeleton className="h-4 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-[#fafbf9] border border-[#eef2ef] space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-2.5 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const totalSessions =
    stats.subjects?.reduce((sum, s) => sum + (s.totalSessionsHeld || 0), 0) || 0;
  const theorySessions =
    stats.subjects?.reduce((sum, s) => sum + (s.theorySessionsHeld || 0), 0) || 0;
  const practicalSessions =
    stats.subjects?.reduce((sum, s) => sum + (s.practicalSessionsHeld || 0), 0) || 0;
  const averageAttendanceRate =
    stats.subjects && stats.subjects.length > 0
      ? Math.round(
          stats.subjects.reduce((sum, s) => sum + (s.averageAttendanceRate || 0), 0) /
            stats.subjects.length
        )
      : 0;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Total Sessions */}
        <div className="p-3.5 sm:p-4 bg-white rounded-2xl sm:rounded-3xl border border-[#dce3df] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-black text-[#5a6b62] uppercase tracking-wider truncate">
              Total Sessions
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 text-[#0a4b32] flex items-center justify-center shrink-0">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-800" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-[#0f1f17] mt-2">
            {totalSessions}
          </p>
          <p className="text-[10px] text-[#5a6b62] mt-0.5 font-medium">Classes Conducted</p>
        </div>

        {/* Overall Attendance Rate */}
        <div className="p-3.5 sm:p-4 bg-white rounded-2xl sm:rounded-3xl border border-[#dce3df] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-black text-[#5a6b62] uppercase tracking-wider truncate">
              Turnout Rate
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-2">
            {averageAttendanceRate}%
          </p>
          <p className="text-[10px] text-[#5a6b62] mt-0.5 font-medium">Average Student Turnout</p>
        </div>

        {/* Theory vs Practical */}
        <div className="p-3.5 sm:p-4 bg-white rounded-2xl sm:rounded-3xl border border-[#dce3df] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-black text-[#5a6b62] uppercase tracking-wider truncate">
              Classification
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-50 text-[#c48b28] flex items-center justify-center shrink-0">
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c48b28]" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-black text-[#0f1f17] mt-2">
            {theorySessions} <span className="text-xs text-[#5a6b62] font-semibold">Th</span> / {practicalSessions} <span className="text-xs text-[#5a6b62] font-semibold">Lab</span>
          </p>
          <p className="text-[10px] text-[#5a6b62] mt-0.5 font-medium">Theory &amp; Practical Classes</p>
        </div>

        {/* Total Assigned Subjects */}
        <div className="p-3.5 sm:p-4 bg-white rounded-2xl sm:rounded-3xl border border-[#dce3df] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-black text-[#5a6b62] uppercase tracking-wider truncate">
              Active Courses
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-700" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-[#0f1f17] mt-2">
            {stats.subjects?.length || 0}
          </p>
          <p className="text-[10px] text-[#5a6b62] mt-0.5 font-medium">Department Subjects</p>
        </div>
      </div>

      {/* Course-wise breakdown */}
      {stats.subjects && stats.subjects.length > 0 && (
        <div className="p-4 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-[#dce3df] shadow-xs space-y-3.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-100 text-[#0a4b32]">
              <BarChart3 className="w-4 h-4 text-emerald-800" />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-black text-[#0f1f17] tracking-tight">
                Course-wise Attendance Performance
              </h3>
              <p className="text-xs text-[#5a6b62]">
                Detailed breakdown of classes held and attendance rates per course
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
            {stats.subjects.map((item) => (
              <div
                key={item.subjectId}
                className="p-3.5 rounded-2xl bg-[#fafbf9] border border-[#eef2ef] hover:border-emerald-200 transition-all flex items-center justify-between gap-2"
              >
                <div className="min-w-0 pr-2 flex-1">
                  <span className="font-mono text-[10px] font-black text-[#0a4b32] block">
                    {item.subjectCode}
                  </span>
                  <p className="text-xs font-bold text-[#0f1f17] truncate">{item.subjectName}</p>
                  <p className="text-[10px] text-[#5a6b62] mt-0.5 font-medium">
                    Classes Conducted: {item.totalSessionsHeld}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm sm:text-base font-black text-emerald-700">
                    {item.averageAttendanceRate}%
                  </span>
                  <div className="w-16 h-1.5 bg-emerald-100 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: `${item.averageAttendanceRate}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
