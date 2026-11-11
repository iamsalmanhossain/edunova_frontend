"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AuthUser } from "@/types/auth";
import {
  CheckCircle2,
  Users,
  ArrowRight,
  BookOpen,
  Calendar,
  Sparkles,
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
import MasterSubjectOverviewModal from "./results/MasterSubjectOverviewModal";
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
  const [isMasterOverviewOpen, setIsMasterOverviewOpen] = useState(false);

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
                teacherApprovalStatus: liveApprovalStatus,
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

  const shiftText =
    overview?.scope?.shift === "SECOND_SHIFT" || user.teacherProfile?.shift === "SECOND_SHIFT"
      ? "Shift 2 (Day)"
      : "Shift 1 (Morning)";

  const instituteName =
    overview?.scope?.instituteName ||
    user.teacherProfile?.institute?.name ||
    "Kishoreganj Polytechnic Institute";

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
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-12" suppressHydrationWarning>
      {/* 1. Approval Status Alert (Only renders when status is PENDING) */}
      <TeacherApprovalAlert
        status={
          overview?.profile?.approvalStatus ||
          user.teacherProfile?.approvalStatus ||
          user.teacherApprovalStatus ||
          "APPROVED"
        }
        instituteName={instituteName}
      />

      {/* 2. Welcome Banner with Dynamic Greeting & Quick Actions */}
      <TeacherWelcomeBanner
        userName={overview?.profile?.name || user.name}
        designation={designation}
        departmentName={departmentName}
        shift={shiftText}
        instituteName={instituteName}
        onOpenMasterOverview={() => setIsMasterOverviewOpen(true)}
      />

      {/* 3. Real KPI Metrics Grid (Mobile 2x2, Desktop 4-col) */}
      <TeacherMetricsGrid
        assignedCoursesCount={assignedClassesCount}
        studentsCount={totalStudents}
        attendanceSubmissionRate={avgAttendance}
        pendingEvaluationsCount={pendingEvaluations}
      />

      {/* 4. Live Attendance Hub Quick Launcher */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0a4b32] via-[#073825] to-[#042417] rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-md border border-[#0d593c] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Ambient glow decoration */}
        <div className="pointer-events-none absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-[#c48b28]/15 blur-2xl" />

        <div className="space-y-1.5 relative z-10 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-200 text-[10px] sm:text-xs font-semibold backdrop-blur-xs border border-white/10">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#c48b28]" />
            <span>Digital Attendance System Active</span>
          </div>
          <h2 className="text-sm sm:text-lg font-bold text-white tracking-tight">
            Daily Attendance &amp; Student Scope Management
          </h2>
          <p className="text-[11px] sm:text-xs text-white/70 max-w-xl leading-relaxed">
            Take subject attendance for your assigned semester, view historical roll call sessions, and manage your department student roster.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 shrink-0 relative z-10">
          <Link href="/dashboard/teacher/attendance" className="w-full sm:w-auto">
            <Button
              type="button"
              className="w-full sm:w-auto h-10 sm:h-9 bg-[#c48b28] hover:bg-[#b07b22] text-white font-bold text-xs rounded-xl shadow-xs gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Take Attendance</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 opacity-80" />
            </Button>
          </Link>

          <Link href="/dashboard/teacher/students" className="w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto h-10 sm:h-9 bg-white/10 hover:bg-white/20 text-white border-white/25 font-bold text-xs rounded-xl gap-1.5 cursor-pointer active:scale-[0.98] backdrop-blur-xs"
            >
              <Users className="w-4 h-4" />
              <span>Student Directory</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 5. Schedule & Faculty Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <TeacherScheduleList schedule={todaysClasses} />
          <TeacherGradebookOverview />
        </div>

        <div className="space-y-4 sm:space-y-6">
          <TeacherQuickTools onOpenMasterOverview={() => setIsMasterOverviewOpen(true)} />
          <UpcomingExamsWidget />
        </div>
      </div>

      {/* Master Subject Overview & Landscape PDF Modal */}
      <MasterSubjectOverviewModal
        isOpen={isMasterOverviewOpen}
        onClose={() => setIsMasterOverviewOpen(false)}
        currentShift={user.teacherProfile?.shift || "FIRST_SHIFT"}
      />
    </div>
  );
}
