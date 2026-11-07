"use client";

import React, { useEffect, useState } from "react";
import { academicFeaturesService } from "@/services/academic-features.service";
import { ExamReminderItem } from "@/types/academic-features";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

interface UpcomingExamsWidgetProps {
  className?: string;
}

export default function UpcomingExamsWidget({ className = "" }: UpcomingExamsWidgetProps) {
  const [reminders, setReminders] = useState<ExamReminderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchReminders() {
      try {
        setLoading(true);
        const data = await academicFeaturesService.getUpcomingReminders();
        if (mounted) {
          setReminders(data?.reminders || []);
        }
      } catch (err) {
        console.warn("Could not load upcoming exam reminders:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchReminders();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Card className={`border-[#e2e8e4] shadow-xs ${className}`}>
        <CardHeader className="pb-3 border-b border-[#e2e8e4]/80">
          <div className="h-5 w-40 bg-gray-200 animate-pulse rounded" />
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div className="h-14 bg-gray-100 animate-pulse rounded-xl" />
          <div className="h-14 bg-gray-100 animate-pulse rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-[#e2e8e4] shadow-xs overflow-hidden ${className}`}>
      <CardHeader className="pb-3 border-b border-[#e2e8e4]/80 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-[#0f1f17] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#0a4b32]" />
            <span>Upcoming Exam Reminders</span>
          </CardTitle>
          <p className="text-xs text-[#5a6b62]">
            Smart countdown & test announcements
          </p>
        </div>
        {reminders.length > 0 && (
          <Badge
            variant="outline"
            className="text-xs font-bold bg-[#c48b28]/10 text-[#c48b28] border-[#c48b28]/30"
          >
            {reminders.length} Scheduled
          </Badge>
        )}
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        {reminders.length === 0 ? (
          <div className="text-center py-6 text-sm text-[#5a6b62]">
            <p className="font-semibold text-[#0f1f17]">No upcoming exams scheduled</p>
            <p className="text-xs mt-1 text-[#718077]">
              Check your class diary for lecture notes and class updates.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reminders.map((item) => {
              const isUrgent = item.isUrgent || item.daysRemaining <= 2;
              let countdownText = `${item.daysRemaining} days left`;
              if (item.daysRemaining === 0) countdownText = "Today!";
              else if (item.daysRemaining === 1) countdownText = "Tomorrow!";

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isUrgent
                      ? "border-amber-300 bg-amber-50/50 hover:bg-amber-50"
                      : "border-[#e2e8e4] bg-[#fcfdfc] hover:border-[#0a4b32]/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0a4b32] bg-[#0a4b32]/10 px-2 py-0.5 rounded">
                          {item.subjectCode}
                        </span>
                        <span className="text-xs font-semibold text-[#5a6b62]">
                          Sem {item.semester}
                        </span>
                        <span className="text-[10px] bg-gray-100 text-gray-700 font-bold px-1.5 py-0.5 rounded">
                          {item.examType.replace(/_/g, " ")}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#0f1f17]">
                        {item.examTitle || item.subjectName}
                      </h4>
                      <p className="text-xs text-[#5a6b62] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#718077]" />
                        <span>
                          {new Date(item.examDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold ${
                          isUrgent
                            ? "bg-rose-100 text-rose-800"
                            : "bg-[#0a4b32]/10 text-[#0a4b32]"
                        }`}
                      >
                        {isUrgent && (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600" />
                          </span>
                        )}
                        <span>{countdownText}</span>
                      </div>
                    </div>
                  </div>

                  {item.syllabus && (
                    <div className="mt-2.5 pt-2 border-t border-[#e2e8e4]/60 text-xs text-[#5a6b62]">
                      <span className="font-semibold text-[#0f1f17]">Syllabus:</span>{" "}
                      {item.syllabus}
                    </div>
                  )}

                  {item.notesUrl && (
                    <div className="mt-2 pt-2 border-t border-[#e2e8e4]/60 flex items-center justify-between text-xs">
                      <span className="text-[#5a6b62]">Study Resource:</span>
                      <a
                        href={item.notesUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[#0a4b32] font-bold hover:underline"
                      >
                        <span>Download Notes</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
