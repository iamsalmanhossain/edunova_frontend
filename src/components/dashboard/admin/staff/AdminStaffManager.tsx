"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  Users,
  UserPlus,
  RefreshCw,
  Search,
  Filter,
  Trash2,
  Edit,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Building2,
  Shield,
  Briefcase,
  GraduationCap,
  Award,
  Compass,
  BookOpen,
  Eye,
  EyeOff,
  Sparkles,
  Phone,
  Mail,
  X,
} from "lucide-react";
import {
  InstitutionStaff,
  InstitutionStaffRole,
  Shift,
  CreateStaffPayload,
  ROLE_LABELS,
} from "@/types/staff";
import { staffService } from "@/services/staff.service";
import { departmentService } from "@/services/department.service";
import { instituteService } from "@/services/institute.service";
import { Department } from "@/types/department";
import { Institute } from "@/types/institute";
import { AuthUser } from "@/types/auth";
import { useToastStore } from "@/store/useToastStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface AdminStaffManagerProps {
  user: AuthUser;
}

const ALL_ROLES: InstitutionStaffRole[] = [
  "PRINCIPAL",
  "CHIEF_INSTRUCTOR",
  "INSTRUCTOR",
  "JUNIOR_INSTRUCTOR",
  "ADMINISTRATIVE_SECTION",
  "ACCOUNTS_SECTION",
  "JOB_PLACEMENT_CELL",
  "ROVER_SCOUT_UNIT",
  "STORE_SECTION",
  "SECURITY_SECTION",
  "LIBRARY",
  "FOURTH_CLASS_EMPLOYEE_REVENUE",
  "OUTSOURCED_STAFF",
];

export default function AdminStaffManager({ user }: AdminStaffManagerProps) {
  const { success: toastSuccess, error: toastError } = useToastStore();

  const [staffList, setStaffList] = useState<InstitutionStaff[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Filters
  const [viewTab, setViewTab] = useState<"ACTIVE" | "DELETED">("ACTIVE");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterRole, setFilterRole] = useState<string>("ALL");
  const [filterShift, setFilterShift] = useState<string>("ALL");
  const [filterDept, setFilterDept] = useState<string>("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingStaff, setEditingStaff] = useState<InstitutionStaff | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState<{
    instituteId: string;
    name: string;
    email: string;
    phone: string;
    avatarUrl: string;
    designation: string;
    role: InstitutionStaffRole;
    shift: string;
    departmentId: string;
    displayOrder: number;
    isPublished: boolean;
  }>({
    instituteId: user.instituteId || "",
    name: "",
    email: "",
    phone: "",
    avatarUrl: "",
    designation: "",
    role: "INSTRUCTOR",
    shift: "",
    departmentId: "",
    displayOrder: 10,
    isPublished: true,
  });

  // Delete Confirmation Modal
  const [deleteTarget, setDeleteTarget] = useState<InstitutionStaff | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Target Institute
  const targetInstituteId = user.instituteId || (institutes[0]?.id ?? "");

  // Load institutes and departments
  useEffect(() => {
    async function loadMeta() {
      try {
        const [instList, deptList] = await Promise.all([
          instituteService.getInstitutes(),
          departmentService.getDepartments(user.instituteId || "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b"),
        ]);
        setInstitutes(instList);
        setDepartments(deptList);
      } catch {
        // Fallback
      }
    }
    loadMeta();
  }, [user.instituteId]);

  // Fetch staff list
  const fetchStaff = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await staffService.getAdminStaff({
        includeDeleted: viewTab === "DELETED",
        limit: 100,
      });

      // Filter by deleted status according to viewTab
      const filtered = (res.data || []).filter((s) =>
        viewTab === "DELETED" ? Boolean(s.deletedAt) : !s.deletedAt
      );
      setStaffList(filtered);
    } catch {
      toastError("Failed to fetch staff members. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [viewTab, toastError]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  // Filtered staff in view
  const displayStaff = useMemo(() => {
    return staffList.filter((s) => {
      if (filterRole !== "ALL" && s.role !== filterRole) return false;
      if (filterShift !== "ALL" && s.shift !== filterShift) return false;
      if (filterDept !== "ALL" && s.departmentId !== filterDept) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const name = (s.resolvedName || s.name || "").toLowerCase();
        const desig = (s.designation || "").toLowerCase();
        const dept = (s.department?.name || "").toLowerCase();
        const email = (s.resolvedEmail || s.email || "").toLowerCase();
        const phone = (s.resolvedPhone || s.phone || "").toLowerCase();

        return (
          name.includes(q) ||
          desig.includes(q) ||
          dept.includes(q) ||
          email.includes(q) ||
          phone.includes(q)
        );
      }

      return true;
    });
  }, [staffList, filterRole, filterShift, filterDept, searchQuery]);

  // Metrics
  const metrics = useMemo(() => {
    const total = staffList.length;
    const faculty = staffList.filter(
      (s) =>
        s.role === "PRINCIPAL" ||
        s.role === "CHIEF_INSTRUCTOR" ||
        s.role === "INSTRUCTOR" ||
        s.role === "JUNIOR_INSTRUCTOR"
    ).length;
    const admin = staffList.filter(
      (s) =>
        s.role === "ADMINISTRATIVE_SECTION" ||
        s.role === "ACCOUNTS_SECTION" ||
        s.role === "STORE_SECTION" ||
        s.role === "JOB_PLACEMENT_CELL" ||
        s.role === "ROVER_SCOUT_UNIT" ||
        s.role === "LIBRARY"
    ).length;
    const support = staffList.filter(
      (s) =>
        s.role === "SECURITY_SECTION" ||
        s.role === "FOURTH_CLASS_EMPLOYEE_REVENUE" ||
        s.role === "OUTSOURCED_STAFF"
    ).length;

    return { total, faculty, admin, support };
  }, [staffList]);

  // Handle open create modal
  const handleOpenCreate = () => {
    setEditingStaff(null);
    setFormData({
      instituteId: targetInstituteId || "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b",
      name: "",
      email: "",
      phone: "",
      avatarUrl: "",
      designation: "",
      role: "INSTRUCTOR",
      shift: "",
      departmentId: "",
      displayOrder: 10,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  // Handle open edit modal
  const handleOpenEdit = (staff: InstitutionStaff) => {
    setEditingStaff(staff);
    setFormData({
      instituteId: staff.instituteId,
      name: staff.name || staff.resolvedName || "",
      email: staff.email || staff.resolvedEmail || "",
      phone: staff.phone || staff.resolvedPhone || "",
      avatarUrl: staff.avatarUrl || staff.resolvedAvatarUrl || "",
      designation: staff.designation,
      role: staff.role,
      shift: staff.shift || "",
      departmentId: staff.departmentId || "",
      displayOrder: staff.displayOrder ?? 10,
      isPublished: staff.isPublished,
    });
    setIsModalOpen(true);
  };

  // Handle save (Create or Update)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.designation.trim()) {
      toastError("Designation is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateStaffPayload = {
        instituteId: formData.instituteId || targetInstituteId,
        name: formData.name.trim() || undefined,
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        avatarUrl: formData.avatarUrl.trim() || undefined,
        designation: formData.designation.trim(),
        role: formData.role,
        shift: formData.shift ? (formData.shift as Shift) : undefined,
        departmentId: formData.departmentId || undefined,
        displayOrder: Number(formData.displayOrder) || 0,
        isPublished: formData.isPublished,
      };

      if (editingStaff) {
        await staffService.updateStaff(editingStaff.id, payload);
        toastSuccess("Staff member updated successfully!");
      } else {
        await staffService.createStaff(payload);
        toastSuccess("Staff member created successfully!");
      }

      setIsModalOpen(false);
      fetchStaff();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save staff record";
      toastError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Soft Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await staffService.deleteStaff(deleteTarget.id);
      toastSuccess(`"${deleteTarget.resolvedName}" moved to trash (soft-deleted).`);
      setDeleteTarget(null);
      fetchStaff();
    } catch {
      toastError("Failed to soft-delete staff member");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Restore
  const handleRestore = async (staff: InstitutionStaff) => {
    try {
      await staffService.restoreStaff(staff.id);
      toastSuccess(`"${staff.resolvedName}" restored successfully!`);
      fetchStaff();
    } catch {
      toastError("Failed to restore staff member");
    }
  };

  // Handle Sync Registered Teachers
  const handleSyncTeachers = async () => {
    setIsSyncing(true);
    try {
      const res = await staffService.syncTeachers(targetInstituteId);
      toastSuccess(
        res.message || `Synchronized ${res.syncedCount} teachers into staff directory!`,
        "Teacher Sync Complete"
      );
      fetchStaff();
    } catch {
      toastError("Failed to sync registered teachers");
    } finally {
      setIsSyncing(false);
    }
  };

  const getRoleBadgeVariant = (role: InstitutionStaffRole) => {
    switch (role) {
      case "PRINCIPAL":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "CHIEF_INSTRUCTOR":
        return "bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold";
      case "INSTRUCTOR":
      case "JUNIOR_INSTRUCTOR":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "ADMINISTRATIVE_SECTION":
      case "ACCOUNTS_SECTION":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "JOB_PLACEMENT_CELL":
      case "ROVER_SCOUT_UNIT":
      case "LIBRARY":
        return "bg-purple-50 text-purple-800 border-purple-200";
      case "SECURITY_SECTION":
        return "bg-rose-50 text-rose-800 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#e2e8e4] shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0f1f17] flex items-center gap-2">
            <Users className="w-6 h-6 text-[#0a4b32]" />
            Institution Staff Management
          </h1>
          <p className="text-xs sm:text-sm text-[#5a6b62] mt-0.5">
            Administer leadership, instructors, accounts, security, and departmental staff records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncTeachers}
            disabled={isSyncing}
            className="border-[#0a4b32]/30 text-[#0a4b32] hover:bg-[#f0f7f3]"
          >
            <Sparkles className={`w-4 h-4 mr-1.5 ${isSyncing ? "animate-spin" : "text-amber-500"}`} />
            {isSyncing ? "Syncing..." : "Sync Teachers"}
          </Button>

          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="bg-[#0a4b32] hover:bg-[#073825] text-white shadow-xs"
          >
            <UserPlus className="w-4 h-4 mr-1.5" />
            Add Staff Member
          </Button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-[#e2e8e4]">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Staff</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{metrics.total}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#e6ede8] flex items-center justify-center text-[#0a4b32]">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#e2e8e4]">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty &amp; Labs</p>
              <h3 className="text-2xl font-bold text-emerald-700 mt-1">{metrics.faculty}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <GraduationCap className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#e2e8e4]">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Admin &amp; Accounts</p>
              <h3 className="text-2xl font-bold text-blue-700 mt-1">{metrics.admin}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Building2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#e2e8e4]">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Support &amp; Security</p>
              <h3 className="text-2xl font-bold text-purple-700 mt-1">{metrics.support}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Shield className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e2e8e4] shadow-xs space-y-4">
        {/* Tab Buttons (Active vs Trash) */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewTab("ACTIVE")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewTab === "ACTIVE"
                  ? "bg-[#0a4b32] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Active Directory ({viewTab === "ACTIVE" ? staffList.length : "..."})
            </button>
            <button
              onClick={() => setViewTab("DELETED")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                viewTab === "DELETED"
                  ? "bg-rose-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Trash / Soft-Deleted
            </button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={fetchStaff}
            className="text-xs text-gray-500 hover:text-gray-900"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search name, title, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full text-xs font-medium bg-[#f5f8f6] border border-[#e2e8e4] rounded-lg px-3 py-2 text-gray-700"
            >
              <option value="ALL">All Sections &amp; Roles</option>
              {ALL_ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
          </div>

          {/* Shift Filter */}
          <div>
            <select
              value={filterShift}
              onChange={(e) => setFilterShift(e.target.value)}
              className="w-full text-xs font-medium bg-[#f5f8f6] border border-[#e2e8e4] rounded-lg px-3 py-2 text-gray-700"
            >
              <option value="ALL">All Shifts</option>
              <option value="FIRST_SHIFT">1st Shift</option>
              <option value="SECOND_SHIFT">2nd Shift</option>
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="w-full text-xs font-medium bg-[#f5f8f6] border border-[#e2e8e4] rounded-lg px-3 py-2 text-gray-700"
            >
              <option value="ALL">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Staff Table / Cards */}
      <div className="bg-white rounded-2xl border border-[#e2e8e4] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500">
            <RefreshCw className="w-8 h-8 mx-auto animate-spin text-[#0a4b32] mb-3" />
            <p className="text-sm">Loading staff members...</p>
          </div>
        ) : displayStaff.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <h4 className="text-base font-semibold text-gray-800">
              {viewTab === "DELETED" ? "Trash is empty" : "No staff members found"}
            </h4>
            <p className="text-xs text-gray-400 mt-1">
              {viewTab === "DELETED"
                ? "There are no soft-deleted staff records."
                : "Try adjusting your search criteria or add a new staff member."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8faf8] border-b border-[#e2e8e4] text-[#47554f] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Staff Member</th>
                  <th className="py-3.5 px-4">Section / Role</th>
                  <th className="py-3.5 px-4">Designation &amp; Dept</th>
                  <th className="py-3.5 px-4">Shift</th>
                  <th className="py-3.5 px-4">Source</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf2ee]">
                {displayStaff.map((staff) => {
                  const name = staff.resolvedName || staff.name || "Unnamed";
                  const email = staff.resolvedEmail || staff.email;
                  const phone = staff.resolvedPhone || staff.phone;
                  const avatarUrl = staff.resolvedAvatarUrl || staff.avatarUrl;

                  return (
                    <tr key={staff.id} className="hover:bg-[#fbfdfb] transition-colors">
                      {/* Name & Photo */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-white ring-1 ring-gray-200 shrink-0">
                            <Image
                              src={avatarUrl || "/images/default-avatar.png"}
                              alt={name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-xs sm:text-sm">{name}</p>
                            <p className="text-[11px] text-gray-500">{email || phone || "No direct contact"}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] border ${getRoleBadgeVariant(
                            staff.role
                          )}`}
                        >
                          {ROLE_LABELS[staff.role] || staff.role}
                        </span>
                      </td>

                      {/* Designation & Dept */}
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{staff.designation}</p>
                        <p className="text-[11px] text-gray-500">
                          {staff.department?.name || "General Administration"}
                        </p>
                      </td>

                      {/* Shift */}
                      <td className="py-3 px-4">
                        {staff.shift ? (
                          <Badge variant="outline" className="text-[10px] font-medium bg-gray-50">
                            {staff.shift === "FIRST_SHIFT" ? "1st Shift" : "2nd Shift"}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-[11px]">Regular</span>
                        )}
                      </td>

                      {/* Source */}
                      <td className="py-3 px-4">
                        {staff.source === "AUTO_TEACHER" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium border border-emerald-200">
                            <Sparkles className="w-2.5 h-2.5" />
                            Auto Teacher
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md font-medium">
                            Manual
                          </span>
                        )}
                      </td>

                      {/* Visibility Status */}
                      <td className="py-3 px-4">
                        {staff.deletedAt ? (
                          <Badge variant="destructive" className="text-[10px]">
                            Soft-Deleted
                          </Badge>
                        ) : staff.isPublished ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 text-[11px] font-medium">
                            <Eye className="w-3.5 h-3.5" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-gray-400 text-[11px] font-medium">
                            <EyeOff className="w-3.5 h-3.5" />
                            Draft
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {staff.deletedAt ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRestore(staff)}
                              className="text-emerald-700 border-emerald-200 hover:bg-emerald-50 h-7 text-xs px-2.5"
                            >
                              <RotateCcw className="w-3 h-3 mr-1" />
                              Restore
                            </Button>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleOpenEdit(staff)}
                                className="h-7 w-7 p-0 text-gray-600 hover:text-gray-900"
                                title="Edit staff details"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setDeleteTarget(staff)}
                                className="h-7 w-7 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                                title="Soft-delete staff member"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL DIALOG */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                {editingStaff ? <Edit className="w-5 h-5 text-[#0a4b32]" /> : <UserPlus className="w-5 h-5 text-[#0a4b32]" />}
                {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              {/* Full Name */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  placeholder="e.g. Md. Anisur Rahman"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Designation & Role Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Designation / Title <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    required
                    placeholder="e.g. Head Clerk, Cashier, Librarian"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Section / Role <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as InstitutionStaffRole,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs font-medium focus:ring-1 focus:ring-[#0a4b32]"
                  >
                    {ALL_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {ROLE_LABELS[r]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Department & Shift */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Department (Optional)</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs font-medium focus:ring-1 focus:ring-[#0a4b32]"
                  >
                    <option value="">None / General Administration</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Shift</label>
                  <select
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs font-medium focus:ring-1 focus:ring-[#0a4b32]"
                  >
                    <option value="">General / Both Shifts</option>
                    <option value="FIRST_SHIFT">1st Shift</option>
                    <option value="SECOND_SHIFT">2nd Shift</option>
                  </select>
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Official Email</label>
                  <Input
                    type="email"
                    placeholder="staff@kipi.edu.bd"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Contact Phone</label>
                  <Input
                    placeholder="017XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              {/* Avatar URL */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Avatar / Photo URL</label>
                <Input
                  placeholder="https://example.com/photo.jpg"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                />
              </div>

              {/* Display Order & Public Visibility */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="w-1/3">
                  <label className="block font-semibold text-gray-700 mb-1">Display Order</label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, displayOrder: parseInt(e.target.value, 10) || 0 })
                    }
                  />
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 text-[#0a4b32] rounded-sm focus:ring-[#0a4b32]"
                  />
                  <label htmlFor="isPublished" className="font-semibold text-gray-700 select-none cursor-pointer">
                    Publish in Public Directory
                  </label>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex justify-end gap-2.5 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#0a4b32] hover:bg-[#073825] text-white"
                >
                  {isSubmitting ? "Saving..." : editingStaff ? "Update Staff" : "Add Staff Member"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SOFT DELETE CONFIRMATION DIALOG */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-gray-900">Soft-Delete Staff Member</h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                Are you sure you want to remove <strong>&ldquo;{deleteTarget.resolvedName}&rdquo;</strong>?
                This record will be moved to the Trash tab and hidden from the public directory. You can restore it anytime.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Confirm Soft-Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
