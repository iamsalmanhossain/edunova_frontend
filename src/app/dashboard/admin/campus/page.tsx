"use client";

import React from "react";
import AdminCampusManager from "@/components/dashboard/admin/campus/AdminCampusManager";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";

export default function AdminCampusPage() {
  const storeUser = useAuthStore((state) => state.user);
  const user =
    storeUser || (typeof window !== "undefined" ? authService.getCurrentUser() : null);

  if (!user) return null;

  return <AdminCampusManager user={user} />;
}
