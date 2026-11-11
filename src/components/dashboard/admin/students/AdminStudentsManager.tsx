"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AuthUser } from "@/types/auth";
import {
  AdminStudentItem,
  UserAccountStatus,
  UpdateStudentPayload,
} from "@/types/admin";
import { adminService } from "@/services/admin.service";
import AdminStudentsSkeleton from "@/components/dashboard/skeletons/AdminStudentsSkeleton";
import StudentDetailsModal from "./StudentDetailsModal";
import UserStatusModal from "../teachers/UserStatusModal";
import { appToast } from "@/store/useToastStore";
import { appConfirm } from "@/store/useConfirmStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Users,
  Eye,
  ShieldAlert,
  Loader2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Trash2,
} from "lucide-react";

interface AdminStudentsManagerProps {
  user: AuthUser;
}

export default function AdminStudentsManager({ user }: AdminStudentsManagerProps) {
  const [students, setStudents] = useState<AdminStudentItem[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<UserAccountStatus | "ALL">("ALL");
  const [semester, setSemester] = useState<string>("");
  const [shift, setShift] = useState<"ALL" | "FIRST" | "SECOND">("ALL");

  // Modals
  const [selectedStudent, setSelectedStudent] = useState<AdminStudentItem | null>(null);
  const [statusModalUser, setStatusModalUser] = useState<{
    id: string;
    name: string;
    currentStatus: UserAccountStatus;
  } | null>(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const loadStudents = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await adminService.getStudents({
        page,
        limit: 20,
        search: debouncedSearch || undefined,
        status: status !== "ALL" ? status : undefined,
        semester: semester ? Number(semester) : undefined,
        shift: shift !== "ALL" ? shift : undefined,
      });
      const items = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      setStudents(items);
      if (res?.meta) {
        setMeta(res.meta);
      }
    } catch (err: unknown) {
      console.error("Error loading students:", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, semester, shift]);

  useEffect(() => {
    loadStudents(1);
  }, [loadStudents]);

  const handleUpdateStatus = async (userId: string, newStatus: UserAccountStatus) => {
    await adminService.updateUserStatus(userId, newStatus);
    await loadStudents(meta.page);
  };

  const handleSaveStudent = async (id: string, payload: UpdateStudentPayload) => {
    await adminService.updateStudent(id, payload);
    await loadStudents(meta.page);
  };

  const handleDeleteStudent = async (student: AdminStudentItem) => {
    const confirmed = await appConfirm({
      title: "Soft Delete Student",
      message: `Are you sure you want to soft delete "${student.name}" (Roll: ${student.studentProfile?.rollNo || "N/A"})? Their account will be deactivated and hidden from the roster. Academic records remain safely preserved.`,
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });

    if (!confirmed) return;

    try {
      await adminService.deleteStudent(student.id);
      appToast.success(`Student "${student.name}" soft deleted successfully.`);
      await loadStudents(meta.page);
    } catch (err: unknown) {
      appToast.error(
        "Failed to delete student: " + (err instanceof Error ? err.message : "Error"),
        "Deletion Failed"
      );
    }
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

  const safeStudents = Array.isArray(students) ? students : [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e4] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0a4b32]" />
            <h1 className="text-xl sm:text-2xl font-black text-[#0f1f17]">
              Student Registry Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#5a6b62] mt-1">
            Browse enrolled student roster, update semester status, and manage security authorizations
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => loadStudents(meta.page)}
          className="h-9 px-3 rounded-xl border-[#e2e8e4] text-xs font-semibold text-[#0a4b32]"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="border-[#e2e8e4] shadow-xs">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student name, roll number, registration..."
                className="w-full h-9 pl-9 pr-3 text-xs rounded-xl border border-[#e2e8e4] bg-white text-[#0f1f17] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Semester Filter */}
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="h-9 px-3 text-xs font-semibold rounded-xl border border-[#e2e8e4] bg-white text-[#0f1f17] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
              >
                <option value="">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                  <option key={s} value={s.toString()}>Semester {s}</option>
                ))}
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="border-[#e2e8e4] shadow-xs overflow-hidden">
        <CardHeader className="p-4 sm:p-5 border-b border-[#e2e8e4]/80 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-[#0f1f17]">
              Enrolled Students Roster
            </CardTitle>
            <p className="text-xs text-[#5a6b62]">
              Showing {safeStudents.length} of {meta.total} registered students
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-[#5a6b62]">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0a4b32] mb-2" />
              <p className="text-xs">Loading student records...</p>
            </div>
          ) : safeStudents.length === 0 ? (
            <div className="p-12 text-center text-[#5a6b62]">
              <Users className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-semibold">No students found</p>
              <p className="text-xs mt-1">Try adjusting your search criteria or semester filter.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#fcfdfc] text-xs font-semibold text-[#5a6b62] border-b border-[#e2e8e4]">
                    <tr>
                      <th className="py-3 px-4">Student &amp; Credentials</th>
                      <th className="py-3 px-4">Academic Placement</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Account Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f4f1] text-[#0f1f17]">
                    {safeStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-[#fcfdfc] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#0f1f17] block">{s.name}</span>
                            {s.studentProfile?.institute?.code && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-black tracking-wide bg-[#0a4b32]/10 text-[#0a4b32] border border-[#0a4b32]/25">
                                {s.studentProfile.institute.code}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[#5a6b62] block">{s.email}</span>
                          <span className="text-[11px] font-mono text-[#0a4b32] font-semibold block">
                            Roll: {s.studentProfile?.rollNo || "N/A"} • Reg: {s.studentProfile?.registrationNo || "N/A"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs">
                          <span className="font-bold text-[#0f1f17] block">
                            Semester {s.studentProfile?.semester || 1}
                          </span>
                          <span className="text-[#5a6b62] block">
                            {s.studentProfile?.shift === "SECOND_SHIFT" || s.studentProfile?.shift === "SECOND" ? "Shift 2 (Day)" : "Shift 1 (Morning)"}
                          </span>
                          <span className="text-[11px] text-[#5a6b62] block">
                            Session: {s.studentProfile?.session || "N/A"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-medium text-[#0f1f17]">
                          {s.studentProfile?.department?.name || "Unassigned"}
                        </td>
                        <td className="py-3.5 px-4">
                          {getStatusBadge(s.status)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedStudent(s)}
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
                                  id: s.id,
                                  name: s.name,
                                  currentStatus: s.status,
                                })
                              }
                              className="h-8 px-2.5 rounded-xl border-[#e2e8e4] text-xs font-semibold hover:bg-amber-50 text-amber-800"
                            >
                              <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                              Status
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteStudent(s)}
                              className="h-8 px-2.5 rounded-xl border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 hover:border-red-300"
                              title="Soft Delete Student"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1" />
                              Delete
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
                {safeStudents.map((s) => (
                  <div key={s.id} className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-[#0f1f17]">{s.name}</h4>
                          {s.studentProfile?.institute?.code && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-[#0a4b32]/10 text-[#0a4b32] border border-[#0a4b32]/25">
                              {s.studentProfile.institute.code}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-mono font-bold text-[#0a4b32]">
                          Roll: {s.studentProfile?.rollNo}
                        </p>
                      </div>
                      {getStatusBadge(s.status)}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#0f1f17]">
                      <span className="font-semibold">Semester {s.studentProfile?.semester || 1}</span>
                      <span className="text-[#5a6b62]">•</span>
                      <span className="text-[#5a6b62]">
                        {s.studentProfile?.shift === "SECOND_SHIFT" || s.studentProfile?.shift === "SECOND" ? "Shift 2 (Day)" : "Shift 1 (Morning)"}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#5a6b62]">
                      {s.studentProfile?.department?.name || "General"} • Reg: {s.studentProfile?.registrationNo || "N/A"}
                    </p>

                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedStudent(s)}
                        className="flex-1 min-h-[44px] rounded-xl text-xs font-semibold cursor-pointer border-[#dce3df] hover:border-[#0a4b32]"
                      >
                        <Eye className="w-4 h-4 mr-1.5 text-[#0a4b32]" /> Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setStatusModalUser({
                            id: s.id,
                            name: s.name,
                            currentStatus: s.status,
                          })
                        }
                        className="flex-1 min-h-[44px] rounded-xl text-xs font-semibold text-amber-800 border-amber-200 hover:bg-amber-50 cursor-pointer"
                      >
                        <ShieldAlert className="w-4 h-4 mr-1.5" /> Status
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteStudent(s)}
                        className="min-h-[44px] px-3 rounded-xl text-xs font-semibold text-red-600 border-red-200 hover:bg-red-50 cursor-pointer"
                        title="Soft Delete Student"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
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
                  onClick={() => loadStudents(meta.page - 1)}
                  className="h-8 px-2.5 rounded-xl border-[#e2e8e4] text-xs"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => loadStudents(meta.page + 1)}
                  className="h-8 px-2.5 rounded-xl border-[#e2e8e4] text-xs"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details & Edit Modal */}
      <StudentDetailsModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onSave={handleSaveStudent}
      />

      {/* Status Modal */}
      <UserStatusModal
        user={statusModalUser}
        onClose={() => setStatusModalUser(null)}
        onSubmit={handleUpdateStatus}
      />
    </div>
  );
}
