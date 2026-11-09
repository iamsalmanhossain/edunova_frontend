"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AuthUser } from "@/types/auth";
import {
  CheckCircle2,
  Users,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TeacherApprovalAlert from "./TeacherApprovalAlert";
import TeacherWelcomeBanner from "./TeacherWelcomeBanner";
import TeacherMetricsGrid from "./TeacherMetricsGrid";
import TeacherScheduleList, { TeacherLectureItem } from "./TeacherScheduleList";
import TeacherQuickTools from "./TeacherQuickTools";
import TeacherGradebookOverview from "./TeacherGradebookOverview";
import TeacherDashboardSkeleton from "../skeletons/TeacherDashboardSkeleton";
import UpcomingExamsWidget from "../shared/UpcomingExamsWidget";
import { teacherService } from "@/services/teacher.service";
import { useAuthStore } from "@/store/useAuthStore";
import {
  TeacherDashboardOverviewData,
  TeacherAttendanceStatsData,
} from "@/types/teacher";

interface TeacherDashboardProps {
  user: AuthUser;
}

export default function TeacherDashboard({ user }: TeacherDashboardProps) {
  const [overview, setOverview] = useState<TeacherDashboardOverviewData | null>(null);
  const [stats, setStats] = useState<TeacherAttendanceStatsData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadDashboardData() {
      try {
        setLoading(true);
        const [overviewRes, statsRes] = await Promise.allSettled([
          teacherService.getOverview(),
          teacherService.getAttendanceStats(),
        ]);

        if (mounted) {
          if (overviewRes.status === "fulfilled") {
            setOverview(overviewRes.value);
            const liveApprovalStatus = overviewRes.value?.profile?.approvalStatus;
            if (liveApprovalStatus && liveApprovalStatus !== user.teacherApprovalStatus) {
              useAuthStore.getState().updateUser({
                // teacherApprovalStatus sync pending
              });
            }
          }
          if (statsRes.status === "fulfilled") {
            setStats(statsRes.value);
          }
        }
      } catch (err: unknown) {
        console.warn("Could not load real teacher dashboard overview", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDashboardData();
    return () => {
      mounted = false;
    };
  }, []);

  // Compute live metric values
  const departmentName =
    overview?.scope?.departmentName ||
    overview?.profile?.department?.name ||
    user.teacherProfile?.department?.name ||
    "Academic Department";

  const designation =
    overview?.profile?.designation ||
    user.teacherProfile?.designation ||
    "Faculty Member";

  const totalStudents =
    overview?.overview?.totalStudents ?? 0;

  const assignedClassesCount =
    overview?.overview?.assignedClasses ?? 0;

  const avgAttendance =
    stats?.subjects && stats.subjects.length > 0
      ? `${Math.round(
          stats.subjects.reduce((sum, s) => sum + (s.averageAttendanceRate || 0), 0) /
            stats.subjects.length
        )}%`
      : "0%";

  const pendingEvaluations =
    overview?.overview?.pendingTasks?.pendingEvaluations ?? 0;

  const todaysClasses: TeacherLectureItem[] =
    overview?.overview?.todaysClasses && overview.overview.todaysClasses.length > 0
      ? overview.overview.todaysClasses.map((c) => ({
          time: c.time || "09:00 AM – 10:30 AM",
          subject: c.subject,
          semester: c.semester,
          department: c.department || departmentName,
          room: c.room || "Room 201",
          studentsCount: c.studentsCount || 0,
        }))
      : [];

  if (loading) {
    return <TeacherDashboardSkeleton />;
  }

  return (
    <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto pb-12" suppressHydrationWarning>
      {/* 1. Approval Status Alert */}
      <TeacherApprovalAlert
        status={
          overview?.profile?.approvalStatus ||
          user.teacherProfile?.approvalStatus ||
          user.teacherApprovalStatus ||
          "APPROVED"
        }
        instituteName={overview?.scope?.instituteName}
      />

      {/* 2. Welcome Banner */}
      <TeacherWelcomeBanner
        userName={overview?.profile?.name || user.name}
        designation={designation}
        departmentName={departmentName}
      />

      {/* 3. Real KPI Metrics Grid */}
      <TeacherMetricsGrid
        assignedCoursesCount={assignedClassesCount}
        studentsCount={totalStudents}
        attendanceSubmissionRate={avgAttendance}
        pendingEvaluationsCount={pendingEvaluations}
      />

      {/* 4. Live Attendance Hub Quick Launcher */}
      <div className="bg-gradient-to-br from-[#0a4b32] to-[#063020] rounded-3xl p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#c48b28]" />
            <span>Digital Attendance System Active</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white">
            Daily Attendance & Student Scope Management
          </h2>
          <p className="text-xs text-white/70 max-w-xl">
            Take subject attendance for your assigned semester, view historical roll call sessions, and manage your department student roster.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link href="/dashboard/teacher/attendance">
            <Button
              type="button"
              className="bg-[#c48b28] hover:bg-[#b07b22] text-white font-bold text-xs rounded-xl shadow-xs gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Take Attendance
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>

          <Link href="/dashboard/teacher/students">
            <Button
              type="button"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold text-xs rounded-xl gap-1.5 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              Student Directory
            </Button>
          </Link>
        </div>
      </div>

      {/* 5. Schedule & Faculty Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <div className="lg:col-span-2 space-y-5 sm:space-y-6">
          <TeacherScheduleList schedule={todaysClasses} />
          <TeacherGradebookOverview />
        </div>

        <div className="space-y-5 sm:space-y-6">
          <UpcomingExamsWidget />
          <TeacherQuickTools />
        </div>
      </div>
    </div>
  );
}
