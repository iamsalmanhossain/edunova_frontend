"use client";

import React, { useState, useEffect } from "react";
import DashboardGuard from "@/components/dashboard/DashboardGuard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";
import {
  CheckCircle2,
  Calendar,
  History,
  BarChart3,
  UserPlus,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { teacherService } from "@/services/teacher.service";
import { TeacherDashboardOverviewData } from "@/types/teacher";
import TakeAttendanceCard from "@/components/dashboard/teacher/attendance/TakeAttendanceCard";
import AttendanceHistoryList from "@/components/dashboard/teacher/attendance/AttendanceHistoryList";
import AttendanceStatsGrid from "@/components/dashboard/teacher/attendance/AttendanceStatsGrid";
import PreEnrollStudentModal from "@/components/dashboard/teacher/attendance/PreEnrollStudentModal";
import AttendancePageSkeleton from "@/components/dashboard/skeletons/AttendancePageSkeleton";

export default function TeacherAttendancePage() {
  const storeUser = useAuthStore((state) => state.user);
  const user = storeUser || (typeof window !== "undefined" ? authService.getCurrentUser() : null);

  const [overviewData, setOverviewData] = useState<TeacherDashboardOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"take" | "history" | "stats">("take");
  const [isPreEnrollOpen, setIsPreEnrollOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function loadScope() {
      try {
        setLoading(true);
        setError(null);
        const data = await teacherService.getOverview();
        if (mounted) {
          setOverviewData(data);
        }
      } catch (err: unknown) {
        console.error("Failed to load teacher overview scope", err);
        if (mounted) {
          setError("Failed to load faculty academic scope.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadScope();
    return () => {
      mounted = false;
    };
  }, []);

  const handleAttendanceSaved = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const departmentId =
    overviewData?.scope?.departmentId ||
    overviewData?.profile?.department?.id ||
    user?.teacherProfile?.department?.id ||
    "";

  return (
    <DashboardGuard allowedRoles={["TEACHER"]}>
      {user && (
        <DashboardLayout user={user} role="TEACHER">
          <div className="space-y-6 max-w-7xl mx-auto pb-12">
            {/* Page Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-emerald-100 text-[#0a4b32]">
                    <CheckCircle2 className="w-5 h-5 text-emerald-800" />
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-[#0f1f17] tracking-tight">
                    Attendance &amp; Roll Call Management
                  </h1>
                </div>
                <p className="text-xs text-[#5a6b62] mt-1">
                  Department:{" "}
                  <span className="font-bold text-[#0f1f17]">
                    {overviewData?.scope?.departmentName ||
                      overviewData?.profile?.department?.name ||
                      user.teacherProfile?.department?.name ||
                      "Loading..."}
                  </span>{" "}
                  • Shift:{" "}
                  <span className="font-bold text-[#0a4b32]">
                    {overviewData?.scope?.shift === "SECOND_SHIFT"
                      ? "2nd Shift (Day/Afternoon)"
                      : "1st Shift (Morning)"}
                  </span>
                </p>
              </div>

              {/* Quick Pre-enroll Trigger */}
              <Button
                type="button"
                onClick={() => setIsPreEnrollOpen(true)}
                className="bg-[#0a4b32] hover:bg-[#073825] text-white rounded-xl text-xs font-bold gap-1.5 shadow-sm cursor-pointer self-start sm:self-auto"
              >
                <UserPlus className="w-4 h-4" />
                Pre-Enroll Students
              </Button>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center gap-2 border-b border-[#dce3df] pb-px">
              <button
                type="button"
                onClick={() => setActiveTab("take")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === "take"
                    ? "border-[#0a4b32] text-[#0a4b32] bg-emerald-50/50 rounded-t-xl"
                    : "border-transparent text-[#5a6b62] hover:text-[#0f1f17]"
                }`}
              >
                <Calendar className="w-4 h-4" />
                Take Attendance
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === "history"
                    ? "border-[#0a4b32] text-[#0a4b32] bg-emerald-50/50 rounded-t-xl"
                    : "border-transparent text-[#5a6b62] hover:text-[#0f1f17]"
                }`}
              >
                <History className="w-4 h-4" />
                Session History
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("stats")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === "stats"
                    ? "border-[#0a4b32] text-[#0a4b32] bg-emerald-50/50 rounded-t-xl"
                    : "border-transparent text-[#5a6b62] hover:text-[#0f1f17]"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Analytics &amp; Stats
              </button>
            </div>

            {/* Loading / Error States */}
            {loading ? (
              <AttendancePageSkeleton />
            ) : error ? (
              <div className="flex items-center gap-2 p-4 text-xs text-red-700 bg-red-50 border border-red-200 rounded-2xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            ) : (
              <div>
                {activeTab === "take" && (
                  <TakeAttendanceCard
                    departmentId={departmentId}
                    onAttendanceSaved={handleAttendanceSaved}
                    onOpenPreEnrollModal={() => setIsPreEnrollOpen(true)}
                  />
                )}

                {activeTab === "history" && (
                  <AttendanceHistoryList refreshTrigger={refreshTrigger} />
                )}

                {activeTab === "stats" && (
                  <AttendanceStatsGrid refreshTrigger={refreshTrigger} />
                )}
              </div>
            )}

            {/* Pre-enroll modal */}
            <PreEnrollStudentModal
              isOpen={isPreEnrollOpen}
              onClose={() => setIsPreEnrollOpen(false)}
              onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
            />
          </div>
        </DashboardLayout>
      )}
    </DashboardGuard>
  );
}
