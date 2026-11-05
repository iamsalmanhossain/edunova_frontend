"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { AuthUser } from "@/types/auth";
import {
  AdminTeacherItem,
  UserAccountStatus,
  TeacherApprovalStatus,
  UpdateTeacherPayload,
  PendingTeacherQueueItem,
} from "@/types/admin";
import { adminService } from "@/services/admin.service";
import AdminTeachersSkeleton from "@/components/dashboard/skeletons/AdminTeachersSkeleton";
import TeacherDetailsModal from "./TeacherDetailsModal";
import UserStatusModal from "./UserStatusModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  UserCheck,
  CheckCircle2,
  XCircle,
  Filter,
  Eye,
  ShieldAlert,
  Loader2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Clock,
} from "lucide-react";

interface AdminTeachersManagerProps {
  user: AuthUser;
}

export default function AdminTeachersManager({ user }: AdminTeachersManagerProps) {
  const searchParams = useSearchParams();
  const initialApprovalStatus = (searchParams.get("approvalStatus") as TeacherApprovalStatus) || "ALL";

  const [activeTab, setActiveTab] = useState<"all" | "pending">(
    initialApprovalStatus === "PENDING" ? "pending" : "all"
  );

  // All Teachers State
  const [teachers, setTeachers] = useState<AdminTeacherItem[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<UserAccountStatus | "ALL">("ALL");
  const [approvalStatus, setApprovalStatus] = useState<TeacherApprovalStatus | "ALL">(initialApprovalStatus);
  const [shift, setShift] = useState<"ALL" | "FIRST" | "SECOND">("ALL");

  // Pending Teachers State
  const [pendingQueue, setPendingQueue] = useState<PendingTeacherQueueItem[]>([]);
  const [loadingPending, setLoadingPending] = useState(false);

  // Active Modals
  const [selectedTeacher, setSelectedTeacher] = useState<AdminTeacherItem | null>(null);
  const [statusModalUser, setStatusModalUser] = useState<{
    id: string;
    name: string;
    currentStatus: UserAccountStatus;
  } | null>(null);

  // Rejection Dialog inside pending flow
  const [rejectingTeacherId, setRejectingTeacherId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Debounce search by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Load All Teachers
  const loadTeachers = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await adminService.getTeachers({
        page,
        limit: 20,
        search: debouncedSearch || undefined,
        status: status !== "ALL" ? status : undefined,
        approvalStatus: approvalStatus !== "ALL" ? approvalStatus : undefined,
        shift: shift !== "ALL" ? shift : undefined,
      });
      const items = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      setTeachers(items);
      if (res?.meta) {
        setMeta(res.meta);
      }
    } catch (err: unknown) {
      console.error("Error loading teachers:", err);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, approvalStatus, shift]);

  // Load Pending Queue
  const loadPending = useCallback(async () => {
    try {
      setLoadingPending(true);
      const res = await adminService.getPendingTeachers();
      const list = Array.isArray(res?.teachers) ? res.teachers : (Array.isArray(res) ? res : []);
      setPendingQueue(list);
    } catch (err: unknown) {
      console.error("Error loading pending queue:", err);
      setPendingQueue([]);
    } finally {
      setLoadingPending(false);
    }
  }, []);

  useEffect(() => {
    loadTeachers(1);
  }, [loadTeachers]);

  useEffect(() => {
    if (activeTab === "pending") {
      loadPending();
    }
  }, [activeTab, loadPending]);

  // Actions
  const handleApprove = async (teacherId: string, name: string) => {
    if (!confirm(`Confirm registration approval for ${name}?`)) return;
    try {
      setProcessingId(teacherId);
      await adminService.approveTeacher(teacherId);
      await loadPending();
      await loadTeachers(meta.page);
    } catch (err: unknown) {
      alert("Failed to approve teacher: " + (err instanceof Error ? err.message : "Error"));
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectingTeacherId || !rejectionReason.trim()) {
      alert("Please enter a reason for rejection.");
      return;
    }
    try {
      setProcessingId(rejectingTeacherId);
      await adminService.rejectTeacher(rejectingTeacherId, rejectionReason.trim());
      setRejectingTeacherId(null);
      setRejectionReason("");
      await loadPending();
      await loadTeachers(meta.page);
    } catch (err: unknown) {
      alert("Failed to reject teacher: " + (err instanceof Error ? err.message : "Error"));
    } finally {
      setProcessingId(null);
    }
  };

  const handleUpdateStatus = async (userId: string, newStatus: UserAccountStatus) => {
    await adminService.updateUserStatus(userId, newStatus);
    await loadTeachers(meta.page);
  };

  const handleSaveProfile = async (id: string, payload: UpdateTeacherPayload) => {
    await adminService.updateTeacher(id, payload);
    await loadTeachers(meta.page);
  };

  const getStatusBadge = (userStatus: UserAccountStatus) => {
    switch (userStatus) {
      case "ACTIVE":
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200">Active</Badge>;
      case "PENDING":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">Pending</Badge>;
      case "SUSPENDED":
        return <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100 border-rose-200">Suspended</Badge>;
      case "DEACTIVATED":
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200">Deactivated</Badge>;
      default:
        return <Badge variant="outline">{userStatus}</Badge>;
    }
  };

  const getApprovalBadge = (appStatus?: TeacherApprovalStatus) => {
    switch (appStatus) {
      case "APPROVED":
        return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Approved</Badge>;
      case "REJECTED":
        return <Badge className="bg-rose-50 text-rose-700 border-rose-200">Rejected</Badge>;
      case "PENDING":
      default:
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200">Awaiting Clearance</Badge>;
    }
  };

  const safeTeachers = Array.isArray(teachers) ? teachers : [];
  const safePending = Array.isArray(pendingQueue) ? pendingQueue : [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e4] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0a4b32]" />
            <h1 className="text-xl sm:text-2xl font-black text-[#0f1f17]">
              Teacher Management &amp; Approvals
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#5a6b62] mt-1">
            Institutional faculty directory, credential verification, and account access control
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (activeTab === "all") loadTeachers(meta.page);
            else loadPending();
          }}
          className="h-9 px-3 rounded-xl border-[#e2e8e4] text-xs font-semibold text-[#0a4b32]"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "all" | "pending")}
        className="space-y-6"
      >
        <TabsList className="bg-[#f0f4f1] p-1 rounded-2xl border border-[#e2e8e4] grid grid-cols-2 max-w-md">
          <TabsTrigger
            value="all"
            className="rounded-xl text-xs font-bold data-[state=active]:bg-[#0a4b32] data-[state=active]:text-white data-[state=active]:shadow-xs flex items-center justify-center gap-2 py-2"
          >
            <UserCheck className="w-4 h-4" /> All Faculty Directory
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="rounded-xl text-xs font-bold data-[state=active]:bg-[#0a4b32] data-[state=active]:text-white data-[state=active]:shadow-xs flex items-center justify-center gap-2 py-2 relative"
          >
            <Clock className="w-4 h-4" /> Pending Approvals
            {safePending.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-black">
                {safePending.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: All Teachers */}
        <TabsContent value="all" className="space-y-4">
          {/* Filters Bar */}
          <Card className="border-[#e2e8e4] shadow-xs">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, email, phone, designation..."
                    className="w-full h-9 pl-9 pr-3 text-xs rounded-xl border border-[#e2e8e4] bg-white text-[#0f1f17] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Account Status Filter */}
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="h-9 px-3 text-xs font-semibold rounded-xl border border-[#e2e8e4] bg-white text-[#0f1f17] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                  >
                    <option value="ALL">All Account Status</option>
                    <option value="ACTIVE">Active Accounts</option>
                    <option value="PENDING">Pending Signups</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="DEACTIVATED">Deactivated</option>
                  </select>

                  {/* Approval Status Filter */}
                  <select
                    value={approvalStatus}
                    onChange={(e) => setApprovalStatus(e.target.value as any)}
                    className="h-9 px-3 text-xs font-semibold rounded-xl border border-[#e2e8e4] bg-white text-[#0f1f17] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                  >
                    <option value="ALL">All Approval Status</option>
                    <option value="APPROVED">Approved</option>
                    <option value="PENDING">Pending Clearance</option>
                    <option value="REJECTED">Rejected</option>
                  </select>

                  {/* Shift Filter */}
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as any)}
                    className="h-9 px-3 text-xs font-semibold rounded-xl border border-[#e2e8e4] bg-white text-[#0f1f17] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                  >
                    <option value="ALL">All Shifts</option>
                    <option value="FIRST_SHIFT">Shift 1 (Morning)</option>
                    <option value="SECOND_SHIFT">Shift 2 (Day)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Directory Table */}
          <Card className="border-[#e2e8e4] shadow-xs overflow-hidden">
            <CardHeader className="p-4 sm:p-5 border-b border-[#e2e8e4]/80 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-[#0f1f17]">
                  Faculty Directory Records
                </CardTitle>
                <p className="text-xs text-[#5a6b62]">
                  Showing {safeTeachers.length} of {meta.total} registered instructors
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center text-[#5a6b62]">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0a4b32] mb-2" />
                  <p className="text-xs">Loading faculty records...</p>
                </div>
              ) : safeTeachers.length === 0 ? (
                <div className="p-12 text-center text-[#5a6b62]">
                  <UserCheck className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm font-semibold">No teachers found</p>
                  <p className="text-xs mt-1">Try clearing your search query or status filters.</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#fcfdfc] text-xs font-semibold text-[#5a6b62] border-b border-[#e2e8e4]">
                        <tr>
                          <th className="py-3 px-4">Faculty Member</th>
                          <th className="py-3 px-4">Department &amp; Shift</th>
                          <th className="py-3 px-4">Account Status</th>
                          <th className="py-3 px-4">Approval Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f0f4f1] text-[#0f1f17]">
                        {safeTeachers.map((t) => (
                          <tr key={t.id} className="hover:bg-[#fcfdfc] transition-colors">
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-[#0f1f17] block">{t.name}</span>
                              <span className="text-xs text-[#5a6b62] block">{t.email}</span>
                              <span className="text-[11px] text-[#5a6b62] block">{t.phone || "No phone"}</span>
                            </td>
                            <td className="py-3.5 px-4 text-xs">
                              <span className="font-semibold text-[#0f1f17] block">
                                {t.teacherProfile?.department?.name || "Unassigned"}
                              </span>
                              <span className="text-[#5a6b62] block">
                                {t.teacherProfile?.designation || "Lecturer"} • {t.teacherProfile?.shift === "SECOND_SHIFT" || t.teacherProfile?.shift === "SECOND" ? "Shift 2" : "Shift 1"}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              {getStatusBadge(t.status)}
                            </td>
                            <td className="py-3.5 px-4">
                              {getApprovalBadge(t.teacherProfile?.approvalStatus)}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedTeacher(t)}
                                  className="h-8 px-2.5 rounded-xl border-[#e2e8e4] text-xs font-semibold hover:border-[#0a4b32]"
                                >
                                  <Eye className="w-3.5 h-3.5 mr-1 text-[#0a4b32]" />
                                  Details
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setStatusModalUser({
                                      id: t.id,
                                      name: t.name,
                                      currentStatus: t.status,
                                    })
                                  }
                                  className="h-8 px-2.5 rounded-xl border-[#e2e8e4] text-xs font-semibold hover:bg-amber-50 text-amber-800"
                                >
                                  <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                                  Status
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards View */}
                  <div className="md:hidden divide-y divide-[#f0f4f1]">
                    {safeTeachers.map((t) => (
                      <div key={t.id} className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-bold text-[#0f1f17]">{t.name}</h4>
                            <p className="text-xs text-[#5a6b62]">{t.email}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {getStatusBadge(t.status)}
                            {getApprovalBadge(t.teacherProfile?.approvalStatus)}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#0f1f17]">
                          <span className="font-semibold">{t.teacherProfile?.designation || "Lecturer"}</span>
                          <span className="text-[#5a6b62]">•</span>
                          <span className="text-[#5a6b62]">
                            {t.teacherProfile?.shift === "SECOND_SHIFT" || t.teacherProfile?.shift === "SECOND" ? "Shift 2 (Day)" : "Shift 1 (Morning)"}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5a6b62]">
                          {t.teacherProfile?.department?.name || "Unassigned"}
                        </p>

                        <div className="flex items-center gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedTeacher(t)}
                            className="flex-1 min-h-[44px] rounded-xl text-xs font-semibold border-[#dce3df] hover:border-[#0a4b32] cursor-pointer"
                          >
                            <Eye className="w-4 h-4 mr-1.5 text-[#0a4b32]" /> Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setStatusModalUser({
                                id: t.id,
                                name: t.name,
                                currentStatus: t.status,
                              })
                            }
                            className="flex-1 min-h-[44px] rounded-xl text-xs font-semibold text-amber-800 border-amber-200 hover:bg-amber-50 cursor-pointer"
                          >
                            <ShieldAlert className="w-4 h-4 mr-1.5" /> Access Status
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Pagination */}
              {meta.totalPages > 1 && (
                <div className="p-4 border-t border-[#e2e8e4] flex items-center justify-between">
                  <span className="text-xs text-[#5a6b62]">
                    Page {meta.page} of {meta.totalPages}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={meta.page <= 1}
                      onClick={() => loadTeachers(meta.page - 1)}
                      className="h-8 px-2.5 rounded-xl border-[#e2e8e4] text-xs"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={meta.page >= meta.totalPages}
                      onClick={() => loadTeachers(meta.page + 1)}
                      className="h-8 px-2.5 rounded-xl border-[#e2e8e4] text-xs"
                    >
                      Next <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Pending Approvals Queue */}
        <TabsContent value="pending" className="space-y-4">
          <Card className="border-[#e2e8e4] shadow-xs">
            <CardHeader className="pb-3 border-b border-[#e2e8e4]/80">
              <CardTitle className="text-base font-bold text-[#0f1f17]">
                Pending Teacher Approval Queue
              </CardTitle>
              <p className="text-xs text-[#5a6b62]">
                New teacher applicants awaiting credential verification and admission
              </p>
            </CardHeader>
            <CardContent className="p-4 sm:p-5">
              {loadingPending ? (
                <div className="p-8 text-center text-[#5a6b62]">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0a4b32] mb-2" />
                  <p className="text-xs">Fetching pending approval requests...</p>
                </div>
              ) : safePending.length === 0 ? (
                <div className="p-12 text-center text-[#5a6b62]">
                  <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
                  <p className="text-sm font-bold text-[#0f1f17]">No pending applications!</p>
                  <p className="text-xs mt-1">All submitted faculty registrations have been processed.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {safePending.map((t) => (
                    <Card key={t.id} className="border-[#e2e8e4] shadow-xs p-4 sm:p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-[#0f1f17]">{t.user.name}</h4>
                          <span className="text-xs text-[#0a4b32] font-semibold">{t.designation}</span>
                        </div>
                        <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[11px]">
                          Pending
                        </Badge>
                      </div>

                      <div className="text-xs space-y-1 text-[#5a6b62]">
                        <p>Department: <span className="font-semibold text-[#0f1f17]">{t.department?.name || "Unassigned"}</span></p>
                        <p>Shift: <span className="font-semibold text-[#0f1f17]">{t.shift === "SECOND_SHIFT" || t.shift === "SECOND" ? "Shift 2 (Day)" : "Shift 1 (Morning)"}</span></p>
                        <p>Email: <span className="text-[#0f1f17]">{t.user.email}</span></p>
                        <p>Phone: <span className="text-[#0f1f17]">{t.user.phone || "N/A"}</span></p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-[#f0f4f1]">
                        <Button
                          size="sm"
                          disabled={processingId === t.id}
                          onClick={() => handleApprove(t.id, t.user.name)}
                          className="flex-1 bg-[#0a4b32] hover:bg-[#073825] text-white rounded-xl text-xs h-8 font-bold"
                        >
                          {processingId === t.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          )}
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={processingId === t.id}
                          onClick={() => {
                            setRejectingTeacherId(t.id);
                            setRejectionReason("");
                          }}
                          className="flex-1 border-rose-200 text-rose-700 hover:bg-rose-50 rounded-xl text-xs h-8 font-bold"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Details & Edit Modal */}
      <TeacherDetailsModal
        teacher={selectedTeacher}
        onClose={() => setSelectedTeacher(null)}
        onSave={handleSaveProfile}
      />

      {/* Status Manage Modal */}
      <UserStatusModal
        user={statusModalUser}
        onClose={() => setStatusModalUser(null)}
        onSubmit={handleUpdateStatus}
      />

      {/* Rejection Modal */}
      {rejectingTeacherId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#dce3df] shadow-2xl overflow-hidden p-6 space-y-4">
            <h3 className="text-base font-bold text-rose-700 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600" /> Reject Teacher Registration
            </h3>
            <p className="text-xs text-[#5a6b62]">
              Provide an official rejection explanation. This note is permanently linked to the decision audit log.
            </p>
            <Textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Unverified academic credentials or unrecognized institution..."
              className="w-full text-xs p-3 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f0f4f1]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRejectingTeacherId(null)}
                className="rounded-xl text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={processingId === rejectingTeacherId || !rejectionReason.trim()}
                onClick={handleRejectSubmit}
                className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs h-9 px-4 font-bold"
              >
                {processingId === rejectingTeacherId ? (
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
