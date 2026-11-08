"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AuthUser } from "@/types/auth";
import { AdminOverviewData, PendingTeacherRegistration } from "@/types/admin";
import { adminService } from "@/services/admin.service";
import { appToast } from "@/store/useToastStore";
import AdminWelcomeBanner from "./AdminWelcomeBanner";
import AdminMetricsGrid from "./AdminMetricsGrid";
import AdminDashboardSkeleton from "../skeletons/AdminDashboardSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building2,
  BookOpen,
  Loader2,
  Clock,
  RefreshCw,
} from "lucide-react";

interface AdminDashboardProps {
  user: AuthUser;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [data, setData] = useState<AdminOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quick Action States
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectingTeacher, setRejectingTeacher] = useState<PendingTeacherRegistration | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const loadOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getOverview();
      setData(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load admin overview metrics";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const handleApprove = async (teacher: PendingTeacherRegistration) => {
    if (!confirm(`Are you sure you want to approve registration for ${teacher.name}?`)) return;
    try {
      setProcessingId(teacher.teacherId);
      await adminService.approveTeacher(teacher.teacherId);
      await loadOverview();
      appToast.success(`Registration approved for ${teacher.name}!`, "Teacher Approved");
    } catch (err: unknown) {
      appToast.error("Failed to approve teacher: " + (err instanceof Error ? err.message : "Error"), "Approval Failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectingTeacher) return;
    if (!rejectionReason.trim()) {
      appToast.warning("Please provide a rejection reason.", "Validation Required");
      return;
    }
    try {
      setProcessingId(rejectingTeacher.teacherId);
      await adminService.rejectTeacher(rejectingTeacher.teacherId, rejectionReason.trim());
      setRejectingTeacher(null);
      setRejectionReason("");
      await loadOverview();
      appToast.info("Teacher application rejected.", "Application Rejected");
    } catch (err: unknown) {
      appToast.error("Failed to reject teacher: " + (err instanceof Error ? err.message : "Error"), "Rejection Failed");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading && !data) {
    return <AdminDashboardSkeleton />;
  }

  const pendingCount = data?.metrics?.teachers?.pending ?? data?.pendingApprovals?.length ?? 0;
  const totalStudents = data?.metrics?.students?.total ?? 0;
  const totalFaculty = data?.metrics?.teachers?.total ?? 0;
  const deptCount = data?.metrics?.academics?.departmentsCount ?? 0;
  const subjectsCount = data?.metrics?.academics?.subjectsCount ?? 0;
  const pendingApprovals = data?.pendingApprovals ?? [];
  const recentActivity = data?.recentActivity ?? [];

  return (
    <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* 1. Welcome Banner */}
      <AdminWelcomeBanner adminName={user.name} />

      {/* 2. Pending Approvals Alert Banner */}
      {pendingCount > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-transparent border border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-amber-950">
                Action Required: {pendingCount} Teacher {pendingCount === 1 ? "Registration" : "Registrations"} Awaiting Approval
              </h3>
              <p className="text-xs text-amber-800 mt-0.5">
                Verify faculty credentials and assign departmental permissions to authorize attendance and grading.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/admin/teachers?approvalStatus=PENDING"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
          >
            Review Queue <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* 3. KPI Metrics Grid */}
      <AdminMetricsGrid
        totalStudents={totalStudents.toLocaleString()}
        totalFaculty={totalFaculty.toString()}
        departmentCount={deptCount}
        pendingApprovalsCount={pendingCount}
      />

      {/* 4. Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Left Column: Pending Faculty Queue */}
        <div className="lg:col-span-2 space-y-5">
          <Card className="border-[#e2e8e4] shadow-xs">
            <CardHeader className="pb-3 border-b border-[#e2e8e4]/80 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-[#0f1f17] flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#0a4b32]" />
                  Pending Faculty Registrations
                </CardTitle>
                <p className="text-xs text-[#5a6b62]">
                  New instructors requiring institutional clearance
                </p>
              </div>
              <Link
                href="/dashboard/admin/teachers"
                className="text-xs font-semibold text-[#0a4b32] hover:underline flex items-center gap-1"
              >
                All Teachers <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-4 sm:p-5">
              {pendingApprovals.length === 0 ? (
                <div className="text-center py-8 text-[#5a6b62]">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-[#0f1f17]">Queue is all caught up!</p>
                  <p className="text-xs mt-0.5">No faculty members are currently pending registration review.</p>
                </div>
              ) : (
                <div className="divide-y divide-[#f0f4f1]">
                  {pendingApprovals.map((teacher) => (
                    <div
                      key={teacher.teacherId}
                      className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#0f1f17] truncate">
                            {teacher.name}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0a4b32]/10 text-[#0a4b32] font-semibold">
                            {teacher.designation}
                          </span>
                        </div>
                        <p className="text-xs text-[#5a6b62]">
                          {teacher.department} • {teacher.shift === "SECOND" ? "Shift 2 (Day)" : "Shift 1 (Morning)"}
                        </p>
                        <p className="text-[11px] text-[#5a6b62]">
                          {teacher.email} • {teacher.phone}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          disabled={processingId === teacher.teacherId}
                          onClick={() => handleApprove(teacher)}
                          className="bg-[#0a4b32] hover:bg-[#073825] text-white rounded-xl text-xs h-8 px-3 font-semibold"
                        >
                          {processingId === teacher.teacherId ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          )}
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={processingId === teacher.teacherId}
                          onClick={() => {
                            setRejectingTeacher(teacher);
                            setRejectionReason("");
                          }}
                          className="border-rose-200 text-rose-700 hover:bg-rose-50 rounded-xl text-xs h-8 px-3 font-semibold"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Security & Action Audit Logs */}
        <div className="space-y-5">
          <Card className="border-[#e2e8e4] shadow-xs">
            <CardHeader className="pb-3 border-b border-[#e2e8e4]/80 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-[#0f1f17] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#0a4b32]" />
                  System Audit Logs
                </CardTitle>
                <p className="text-xs text-[#5a6b62]">
                  Recent administrative security actions
                </p>
              </div>
              <Link
                href="/dashboard/admin/audit-logs"
                className="text-xs font-semibold text-[#0a4b32] hover:underline flex items-center gap-1"
              >
                All Logs <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-4 sm:p-5">
              {recentActivity.length === 0 ? (
                <div className="text-center py-6 text-sm text-[#5a6b62]">
                  No recent audit logs recorded.
                </div>
              ) : (
                <div className="divide-y divide-[#f0f4f1]">
                  {recentActivity.map((log) => (
                    <div key={log.id} className="py-2.5 first:pt-0 last:pb-0 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <Badge variant="outline" className="text-[10px] bg-gray-50 font-mono text-[#0f1f17]">
                          {log.action}
                        </Badge>
                        <span className="text-[11px] text-[#5a6b62]">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-[#0f1f17] font-medium">
                        By {log.performedBy} ({log.role})
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Shortcuts */}
          <Card className="border-[#e2e8e4] shadow-xs bg-gradient-to-br from-[#0a4b32]/5 to-transparent">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-[#0a4b32]">
                Admin Master Navigation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <Link
                href="/dashboard/admin/teachers"
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#e2e8e4] hover:border-[#0a4b32]/40 transition-all text-xs font-semibold text-[#0f1f17]"
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#0a4b32]" />
                  <span>Teacher Registry &amp; Approvals</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#5a6b62]" />
              </Link>

              <Link
                href="/dashboard/admin/students"
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#e2e8e4] hover:border-[#0a4b32]/40 transition-all text-xs font-semibold text-[#0f1f17]"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#0a4b32]" />
                  <span>Student Registry &amp; Semesters</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#5a6b62]" />
              </Link>

              <Link
                href="/dashboard/admin/departments"
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#e2e8e4] hover:border-[#0a4b32]/40 transition-all text-xs font-semibold text-[#0f1f17]"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#0a4b32]" />
                  <span>Academic Departments ({deptCount}) &amp; Subjects ({subjectsCount})</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#5a6b62]" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rejection Modal Dialog */}
      {rejectingTeacher && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#dce3df] shadow-2xl overflow-hidden p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#0f1f17] flex items-center gap-2 text-rose-700">
                <XCircle className="w-5 h-5 text-rose-600" />
                Reject Teacher Registration
              </h3>
              <p className="text-xs text-[#5a6b62] mt-1">
                State the reason for rejecting <span className="font-semibold text-[#0f1f17]">{rejectingTeacher.name}</span>. This will be recorded and notified to the applicant.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#0f1f17]">Rejection Reason *</label>
              <Textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Invalid educational credentials or unauthorized faculty profile..."
                className="w-full text-xs p-3 rounded-xl border border-[#dce3df] focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f0f4f1]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRejectingTeacher(null)}
                className="rounded-xl text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={processingId === rejectingTeacher.teacherId || !rejectionReason.trim()}
                onClick={handleRejectSubmit}
                className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs h-9 px-4 font-bold"
              >
                {processingId === rejectingTeacher.teacherId ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                ) : null}
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
