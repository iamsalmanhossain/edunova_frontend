"use client";

import React from "react";
import AdminDepartmentsManager from "@/components/dashboard/admin/departments/AdminDepartmentsManager";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";

export default function AdminDepartmentsPage() {
  const storeUser = useAuthStore((state) => state.user);
  const user = storeUser || (typeof window !== "undefined" ? authService.getCurrentUser() : null);

  if (!user) return null;

  return <AdminDepartmentsManager user={user} />;
}
