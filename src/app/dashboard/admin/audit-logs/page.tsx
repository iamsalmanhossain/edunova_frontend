"use client";

import React from "react";
import AdminAuditLogsManager from "@/components/dashboard/admin/audit/AdminAuditLogsManager";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";

export default function AdminAuditLogsPage() {
  const storeUser = useAuthStore((state) => state.user);
  const user = storeUser || (typeof window !== "undefined" ? authService.getCurrentUser() : null);

  if (!user) return null;

  return <AdminAuditLogsManager user={user} />;
}
