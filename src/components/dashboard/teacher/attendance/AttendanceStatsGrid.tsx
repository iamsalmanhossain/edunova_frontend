"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Calendar,
  Layers,
  TrendingUp,
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 bg-white rounded-2xl border border-[#dce3df] space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-24 rounded-lg" />
              <Skeleton className="h-2.5 w-16" />
            </div>
          ))}
        </div>
        <div className="p-5 bg-white rounded-3xl border border-[#dce3df] space-y-3">
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
    <div className="space-y-4">
      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Sessions */}
        <div className="p-4 bg-white rounded-2xl border border-[#dce3df] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5a6b62] uppercase tracking-wider">
              Total Sessions
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#0a4b32] flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-[#0f1f17] mt-2">
            {totalSessions}
          </p>
          <p className="text-[10px] text-[#5a6b62] mt-0.5">Classes Conducted</p>
        </div>

        {/* Overall Attendance Rate */}
        <div className="p-4 bg-white rounded-2xl border border-[#dce3df] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5a6b62] uppercase tracking-wider">
              Average Rate
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-700 mt-2">
            {averageAttendanceRate}%
          </p>
          <p className="text-[10px] text-[#5a6b62] mt-0.5">Overall Student Turnout</p>
        </div>

        {/* Theory vs Practical */}
        <div className="p-4 bg-white rounded-2xl border border-[#dce3df] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5a6b62] uppercase tracking-wider">
              Lecture Breakdown
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-[#c48b28] flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-[#0f1f17] mt-2">
            {theorySessions} <span className="text-xs text-[#5a6b62] font-medium">Theory</span> / {practicalSessions} <span className="text-xs text-[#5a6b62] font-medium">Lab</span>
          </p>
          <p className="text-[10px] text-[#5a6b62] mt-0.5">Session Classification</p>
        </div>

        {/* Total Assigned Subjects */}
        <div className="p-4 bg-white rounded-2xl border border-[#dce3df] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5a6b62] uppercase tracking-wider">
              Assigned Subjects
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-[#0f1f17] mt-2">
            {stats.subjects?.length || 0}
          </p>
          <p className="text-[10px] text-[#5a6b62] mt-0.5">Department Courses</p>
        </div>
      </div>

      {/* Subject-wise breakdown */}
      {stats.subjects && stats.subjects.length > 0 && (
        <div className="p-5 bg-white rounded-3xl border border-[#dce3df] shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#0a4b32]" />
            <h3 className="text-xs font-bold text-[#0f1f17] uppercase tracking-wider">
              Course-wise Attendance Performance
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.subjects.map((item) => (
              <div
                key={item.subjectId}
                className="p-3.5 rounded-2xl bg-[#fafbf9] border border-[#eef2ef] flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <span className="font-mono text-[10px] font-bold text-[#0a4b32] block">
                    {item.subjectCode}
                  </span>
                  <p className="text-xs font-bold text-[#0f1f17] truncate">{item.subjectName}</p>
                  <p className="text-[10px] text-[#5a6b62] mt-0.5">
                    Sessions Conducted: {item.totalSessionsHeld}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base font-extrabold text-emerald-700">
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
