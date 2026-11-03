"use client";

import React from "react";
import DashboardGuard from "@/components/dashboard/DashboardGuard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import TeacherStudentDirectory from "@/components/dashboard/teacher/students/TeacherStudentDirectory";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";

export default function TeacherStudentsPage() {
  const storeUser = useAuthStore((state) => state.user);
  const user = storeUser || (typeof window !== "undefined" ? authService.getCurrentUser() : null);

  return (
    <DashboardGuard allowedRoles={["TEACHER"]}>
      {user && (
        <DashboardLayout user={user} role="TEACHER">
          <div className="max-w-7xl mx-auto pb-12">
            <TeacherStudentDirectory />
          </div>
        </DashboardLayout>
      )}
    </DashboardGuard>
  );
}
