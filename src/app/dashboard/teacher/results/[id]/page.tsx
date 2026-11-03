"use client";

import React from "react";
import { useParams } from "next/navigation";
import DashboardGuard from "@/components/dashboard/DashboardGuard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";
import ResultMarksheetView from "@/components/dashboard/teacher/results/ResultMarksheetView";

export default function TeacherResultDetailsPage() {
  const params = useParams();
  const resultId = (params?.id as string) || "";
  const storeUser = useAuthStore((state) => state.user);
  const user = storeUser || (typeof window !== "undefined" ? authService.getCurrentUser() : null);

  return (
    <DashboardGuard allowedRoles={["TEACHER"]}>
      {user && (
        <DashboardLayout user={user} role="TEACHER">
          <ResultMarksheetView resultId={resultId} />
        </DashboardLayout>
      )}
    </DashboardGuard>
  );
}

