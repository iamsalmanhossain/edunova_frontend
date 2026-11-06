"use client";

import React, { useState, useEffect } from "react";
import TeacherDiaryList from "@/components/dashboard/teacher/diary/TeacherDiaryList";
import { teacherService } from "@/services/teacher.service";
import { TeacherDashboardOverviewData, TeacherSubject } from "@/types/teacher";

export default function TeacherDiaryPage() {
  const [overview, setOverview] = useState<TeacherDashboardOverviewData | null>(null);
  const [subjects, setSubjects] = useState<TeacherSubject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;
    async function loadData() {
      try {
        setLoading(true);
        const [overviewRes, marksSubjectsRes] = await Promise.allSettled([
          teacherService.getOverview(),
          teacherService.getMarksSubjects(),
        ]);

        if (isSubscribed) {
          if (overviewRes.status === "fulfilled") {
            setOverview(overviewRes.value);
          }
          if (marksSubjectsRes.status === "fulfilled" && marksSubjectsRes.value?.data) {
            setSubjects(
              marksSubjectsRes.value.data.map((d) => ({
                id: d.id,
                code: d.code,
                name: d.name,
                semester: d.semester,
              }))
            );
          }
        }
      } catch (err) {
        console.error("Failed to load teacher diary prerequisites:", err);
      } finally {
        if (isSubscribed) setLoading(false);
      }
    }
    loadData();
    return () => {
      isSubscribed = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 max-w-7xl mx-auto p-4 animate-pulse">
        <div className="h-24 bg-gray-200 rounded-2xl" />
        <div className="h-16 bg-gray-100 rounded-xl" />
        <div className="h-48 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <TeacherDiaryList
        subjects={subjects}
        currentShift={overview?.scope?.shift || "FIRST_SHIFT"}
      />
    </div>
  );
}

