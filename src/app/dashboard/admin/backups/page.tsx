"use client";

import React from "react";
import AdminBackupManager from "@/components/dashboard/admin/backup/AdminBackupManager";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";

export default function AdminBackupsPage() {
  const storeUser = useAuthStore((state) => state.user);
  const user =
    storeUser || (typeof window !== "undefined" ? authService.getCurrentUser() : null);

  if (!user) return null;

  return <AdminBackupManager user={user} />;
}

