"use client";

import React from "react";
import DashboardGuard from "@/components/dashboard/DashboardGuard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentDashboard from "@/components/dashboard/student/StudentDashboard";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";

export default function StudentDashboardPage() {
  const storeUser = useAuthStore((state) => state.user);
  const user = storeUser || (typeof window !== "undefined" ? authService.getCurrentUser() : null);

  return (
    <DashboardGuard allowedRoles={["STUDENT"]}>
      {user && (
        <DashboardLayout user={user} role="STUDENT">
          <StudentDashboard user={user} />
        </DashboardLayout>
      )}
    </DashboardGuard>
  );
}
