"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  Edit2,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { teacherService } from "@/services/teacher.service";
import { AttendanceSessionDetailData } from "@/types/teacher";

interface AttendanceSessionDetailModalProps {
  sessionId: string | null;
  onClose: () => void;
  onSessionUpdated?: () => void;
}

export default function AttendanceSessionDetailModal({
  sessionId,
  onClose,
  onSessionUpdated,
}: AttendanceSessionDetailModalProps) {
  const [data, setData] = useState<AttendanceSessionDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Editable records map (studentId -> status)
  const [studentStatuses, setStudentStatuses] = useState<Record<string, "PRESENT" | "ABSENT">>({});
  const [studentRemarks, setStudentRemarks] = useState<Record<string, string>>({});
  const [sessionRemarks, setSessionRemarks] = useState<string>("");

  useEffect(() => {
    if (!sessionId) return;
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        setIsEditing(false);
        const detail = await teacherService.getSessionDetails(sessionId!);
        if (mounted) {
          setData(detail);
          setSessionRemarks(detail.session.remarks || "");

          const statuses: Record<string, "PRESENT" | "ABSENT"> = {};
          const remarks: Record<string, string> = {};
          detail.session.records?.forEach((r) => {
            statuses[r.student.id] = r.status as "PRESENT" | "ABSENT";
            remarks[r.student.id] = r.remarks || "";
          });
          setStudentStatuses(statuses);
          setStudentRemarks(remarks);
          setLoading(false);
        }
      } catch (err: unknown) {
        console.error("Failed to load session details", err);
        if (mounted) {
          setError("Failed to load session details.");
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [sessionId]);

  if (!sessionId) return null;

  const toggleStatus = (studentId: string) => {
    setStudentStatuses((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "PRESENT" ? "ABSENT" : "PRESENT",
    }));
  };

  const handleMarkAll = (status: "PRESENT" | "ABSENT") => {
    setStudentStatuses((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((id) => {
        next[id] = status;
      });
      return next;
    });
  };

  const handleSaveUpdates = async () => {
    if (!data || !sessionId) return;
    try {
      setSaving(true);
      setError(null);
      setSuccessMsg(null);

      const recordsPayload = data.session.records.map((r) => ({
        studentId: r.student.id,
        status: studentStatuses[r.student.id] || (r.status as "PRESENT" | "ABSENT"),
        remarks: studentRemarks[r.student.id] || undefined,
      }));

      await teacherService.updateAttendanceSession(sessionId, {
        remarks: sessionRemarks.trim() || undefined,
        records: recordsPayload,
      });

      setSuccessMsg("Attendance session updated successfully!");
      setIsEditing(false);
      onSessionUpdated?.();

      // Refresh local data
      const updated = await teacherService.getSessionDetails(sessionId);
      setData(updated);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setError(errObj.message || "Failed to update attendance session.");
    } finally {
      setSaving(false);
    }
  };

  const currentRecords = data?.session.records || [];
  const presentCount = currentRecords.filter(
    (r) => (isEditing ? studentStatuses[r.student.id] : r.status) === "PRESENT"
  ).length;
  const absentCount = currentRecords.length - presentCount;
  const attendanceRate =
    currentRecords.length > 0 ? Math.round((presentCount / currentRecords.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-[#dce3df] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eef2ef] bg-[#fafbf9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0a4b32] flex items-center justify-center">
              <Calendar className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0f1f17]">
                Attendance Session Breakdown
              </h2>
              <p className="text-xs text-[#5a6b62]">
                Date: {data ? new Date(data.session.date).toLocaleDateString() : "—"} • {data?.session.type}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading && (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#0a4b32]" />
              <p className="text-xs font-medium">Fetching session details...</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="font-semibold">{successMsg}</span>
            </div>
          )}

          {!loading && data && (
            <>
              {/* Summary Overview Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#fafbf9] border border-[#eef2ef]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#5a6b62] block">Subject</span>
                  <p className="text-xs font-extrabold text-[#0f1f17] truncate mt-0.5">
                    {data.session.subject?.code} - {data.session.subject?.name}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#5a6b62] block">Semester &amp; Type</span>
                  <p className="text-xs font-bold text-[#0f1f17] mt-0.5">
                    {data.session.semester}th Sem • {data.session.type}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#5a6b62] block">Students</span>
                  <p className="text-xs font-bold text-[#0f1f17] mt-0.5">
                    {currentRecords.length} Enrolled
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#5a6b62] block">Attendance Rate</span>
                  <p className="text-xs font-extrabold text-[#0a4b32] mt-0.5">
                    {attendanceRate}% ({presentCount} Present • {absentCount} Absent)
                  </p>
                </div>
              </div>

              {/* Edit Mode Toolbar */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-[#0f1f17] uppercase tracking-wider">
                    Roll Call Roster ({currentRecords.length})
                  </h3>
                  {isEditing && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      Edit Mode Active
                    </span>
                  )}
                </div>

                {!isEditing ? (
                  <Button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-bold text-[#0a4b32] border-[#0a4b32] hover:bg-[#f0f7f3] cursor-pointer rounded-xl flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit Attendance
                  </Button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleMarkAll("PRESENT")}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 cursor-pointer"
                    >
                      All Present
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMarkAll("ABSENT")}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-red-50 text-red-800 border border-red-200 hover:bg-red-100 cursor-pointer"
                    >
                      All Absent
                    </button>
                  </div>
                )}
              </div>

              {/* Attendance Records List */}
              <div className="divide-y divide-[#f0f4f1] border border-[#eef2ef] rounded-2xl overflow-hidden max-h-72 overflow-y-auto">
                {currentRecords.map((record) => {
                  const studentId = record.student.id;
                  const status = isEditing
                    ? studentStatuses[studentId] || record.status
                    : record.status;
                  const isPresent = status === "PRESENT";

                  return (
                    <div
                      key={record.id}
                      onClick={() => {
                        if (isEditing) toggleStatus(studentId);
                      }}
                      className={`flex items-center justify-between px-4 py-2.5 text-xs transition-colors ${
                        isEditing ? "cursor-pointer hover:bg-slate-50" : ""
                      } ${isPresent ? "bg-white" : "bg-red-50/30"}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-xs text-[#0a4b32] w-14">
                          #{record.student?.rollNo}
                        </span>
                        <div>
                          <p className="font-bold text-[#0f1f17] leading-tight">
                            {record.student?.user?.name || "Student"}
                          </p>
                          {record.remarks && (
                            <p className="text-[10px] text-amber-700 mt-0.5">
                              Note: {record.remarks}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={!isEditing}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isEditing) toggleStatus(studentId);
                        }}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold text-[10px] transition-all ${
                          isEditing ? "cursor-pointer ring-1 ring-offset-1" : ""
                        } ${
                          isPresent
                            ? "bg-emerald-100 text-emerald-800 ring-emerald-400"
                            : "bg-red-100 text-red-800 ring-red-400"
                        }`}
                      >
                        {isPresent ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            PRESENT
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            ABSENT
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#eef2ef] bg-[#fafbf9] flex items-center justify-between">
          <div>
            {isEditing && (
              <span className="text-[11px] text-[#5a6b62]">
                Click on student rows to toggle between Present &amp; Absent.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                disabled={saving}
                className="h-8 text-xs font-semibold cursor-pointer rounded-xl"
              >
                Cancel
              </Button>
            )}

            {isEditing ? (
              <Button
                type="button"
                size="sm"
                onClick={handleSaveUpdates}
                disabled={saving}
                className="h-8 px-4 text-xs font-bold bg-[#0a4b32] hover:bg-[#073825] text-white cursor-pointer rounded-xl flex items-center gap-1.5"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Save Attendance Changes
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={onClose}
                variant="outline"
                size="sm"
                className="h-8 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-[#5a6b62] cursor-pointer"
              >
                Close
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
