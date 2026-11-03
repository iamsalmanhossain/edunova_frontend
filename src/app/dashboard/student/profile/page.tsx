"use client";

import React from "react";
import DashboardGuard from "@/components/dashboard/DashboardGuard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentProfile from "@/components/dashboard/student/profile/Profile";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";

export default function StudentProfilePage() {
  const storeUser = useAuthStore((state) => state.user);
  const user = storeUser || (typeof window !== "undefined" ? authService.getCurrentUser() : null);

  return (
    <DashboardGuard allowedRoles={["STUDENT"]}>
      {user && (
        <DashboardLayout user={user} role="STUDENT">
          <StudentProfile initialUser={user} />
        </DashboardLayout>
      )}
    </DashboardGuard>
  );
}

