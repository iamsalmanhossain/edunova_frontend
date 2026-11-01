"use client";

import React, { useState } from "react";
import DashboardGuard from "@/components/dashboard/DashboardGuard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminDashboard from "@/components/dashboard/admin/AdminDashboard";
import { authService } from "@/services/auth.service";
import { AuthUser } from "@/types/auth";

export default function AdminDashboardPage() {
  const [user] = useState<AuthUser | null>(() => authService.getCurrentUser());

  return (
    <DashboardGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
      {user && (
        <DashboardLayout
          user={user}
          role={user.role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "ADMIN"}
        >
          <AdminDashboard user={user} />
        </DashboardLayout>
      )}
    </DashboardGuard>
  );
}
