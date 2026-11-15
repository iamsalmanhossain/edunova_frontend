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

    </div>
  );
}
