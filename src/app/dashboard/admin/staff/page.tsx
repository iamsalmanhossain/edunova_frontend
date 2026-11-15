"use client";

import React from "react";
import AdminStaffManager from "@/components/dashboard/admin/staff/AdminStaffManager";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";

export default function AdminStaffPage() {
  const storeUser = useAuthStore((state) => state.user);
  const user = storeUser || (typeof window !== "undefined" ? authService.getCurrentUser() : null);

  if (!user) return null;

  return <AdminStaffManager user={user} />;
}
