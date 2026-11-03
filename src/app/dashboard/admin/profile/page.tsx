"use client";

import React from "react";
import DashboardGuard from "@/components/dashboard/DashboardGuard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminProfile from "@/components/dashboard/admin/profile/Profile";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";

export default function AdminProfilePage() {
  const storeUser = useAuthStore((state) => state.user);
  const user = storeUser || (typeof window !== "undefined" ? authService.getCurrentUser() : null);

  return (
    <DashboardGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
      {user && (
        <DashboardLayout user={user} role={user.role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "ADMIN"}>
          <AdminProfile initialUser={user} />
        </DashboardLayout>
      )}
    </DashboardGuard>
  );
}

