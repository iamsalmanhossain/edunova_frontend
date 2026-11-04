"use client";

import React, { useState, useEffect } from "react";
import ResultsList from "@/components/dashboard/teacher/results/ResultsList";
import ResultsSkeleton from "@/components/dashboard/teacher/results/ResultsSkeleton";
import { teacherService } from "@/services/teacher.service";
import { TeacherDashboardOverviewData } from "@/types/teacher";

export default function TeacherResultsPage() {
  const [overview, setOverview] = useState<TeacherDashboardOverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;
    async function loadTeacherScope() {
      try {
        setLoading(true);
        const data = await teacherService.getOverview();
        if (isSubscribed) {
          setOverview(data);
        }
      } catch (err) {
        console.error("Failed to load teacher scope for results:", err);
      } finally {
        if (isSubscribed) setLoading(false);
      }
    }
    loadTeacherScope();
    return () => {
      isSubscribed = false;
    };
  }, []);

  if (loading) {
    return <ResultsSkeleton />;
  }

  return (
    <ResultsList
      currentShift={overview?.scope?.shift || "FIRST_SHIFT"}
    />
  );
}
