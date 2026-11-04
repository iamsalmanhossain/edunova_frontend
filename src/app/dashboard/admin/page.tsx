"use client";

import React from "react";
import AdminDashboard from "@/components/dashboard/admin/AdminDashboard";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";

export default function AdminDashboardPage() {
  const storeUser = useAuthStore((state) => state.user);
  const user = storeUser || (typeof window !== "undefined" ? authService.getCurrentUser() : null);

  if (!user) return null;

  return <AdminDashboard user={user} />;
}
