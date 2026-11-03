"use client";

import React, { useState, useEffect } from "react";
import DashboardGuard from "@/components/dashboard/DashboardGuard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";
import ResultsList from "@/components/dashboard/teacher/results/ResultsList";
import ResultsSkeleton from "@/components/dashboard/teacher/results/ResultsSkeleton";
import { teacherService } from "@/services/teacher.service";
import { TeacherDashboardOverviewData } from "@/types/teacher";

export default function TeacherResultsPage() {
  const storeUser = useAuthStore((state) => state.user);
  const user = storeUser || (typeof window !== "undefined" ? authService.getCurrentUser() : null);

  const [overview, setOverview] = useState<TeacherDashboardOverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadTeacherScope() {
      try {
        setLoading(true);
        const data = await teacherService.getOverview();
        if (mounted) {
          setOverview(data);
        }
      } catch (err) {
        console.error("Failed to load teacher scope for results:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadTeacherScope();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <DashboardGuard allowedRoles={["TEACHER"]}>
      {user && (
        <DashboardLayout user={user} role="TEACHER">
          {loading ? (
            <ResultsSkeleton />
          ) : (
            <ResultsList
              currentShift={overview?.scope?.shift || "FIRST_SHIFT"}
            />
          )}
        </DashboardLayout>
      )}
    </DashboardGuard>
  );
}

