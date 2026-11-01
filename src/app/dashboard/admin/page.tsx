"use client";

import React from "react";
import DashboardGuard from "@/components/dashboard/DashboardGuard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminDashboard from "@/components/dashboard/admin/AdminDashboard";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";

export default function AdminDashboardPage() {
  const storeUser = useAuthStore((state) => state.user);
  const user = storeUser || (typeof window !== "undefined" ? authService.getCurrentUser() : null);

  return (
    <DashboardGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
      {user && (
        <DashboardLayout user={user} role="ADMIN">
          <AdminDashboard user={user} />
        </DashboardLayout>
      )}
    </DashboardGuard>
  );
}
