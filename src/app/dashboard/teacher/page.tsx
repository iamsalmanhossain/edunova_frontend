"use client";

import React from "react";
import DashboardGuard from "@/components/dashboard/DashboardGuard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import TeacherDashboard from "@/components/dashboard/teacher/TeacherDashboard";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";

export default function TeacherDashboardPage() {
  const storeUser = useAuthStore((state) => state.user);
  const user = storeUser || (typeof window !== "undefined" ? authService.getCurrentUser() : null);

  return (
    <DashboardGuard allowedRoles={["TEACHER"]}>
      {user && (
        <DashboardLayout user={user} role="TEACHER">
          <TeacherDashboard user={user} />
        </DashboardLayout>
      )}
    </DashboardGuard>
  );
}
